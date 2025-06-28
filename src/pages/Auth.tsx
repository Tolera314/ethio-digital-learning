
import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, UserPlus, LogIn, User, Github, Apple } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthHeroImage from "@/components/auth/AuthHeroImage";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const bgImage = 
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    remember: false,
    name: ""
  });
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if there's a confirmation token in the URL
  useEffect(() => {
    const handleConfirmation = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (type === 'email' && token) {
        setLoading(true);
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email',
          });
          
          if (error) throw error;
          
          toast({
            title: "Email verified successfully!",
            description: "You can now sign in with your email and password.",
            variant: "default"
          });
          
          setIsSignUp(false);
        } catch (error: any) {
          toast({
            title: "Verification failed",
            description: error.message || "There was an error verifying your email",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    handleConfirmation();
  }, [searchParams, toast]);

  // Check if user is already signed in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, remember: checked }));
  };

  const handleToggleForm = (newIsSignUp: boolean) => {
    if (newIsSignUp !== isSignUp) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsSignUp(newIsSignUp);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const validateForm = () => {
    if (!formData.email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.password) {
      toast({
        title: "Password required",
        description: "Please enter your password",
        variant: "destructive"
      });
      return false;
    }
    
    if (isSignUp) {
      if (formData.password.length < 6) {
        toast({
          title: "Password too short",
          description: "Password must be at least 6 characters",
          variant: "destructive"
        });
        return false;
      }
      
      if (!formData.name) {
        toast({
          title: "Name required",
          description: "Please enter your full name",
          variant: "destructive"
        });
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please ensure both passwords match",
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSocialAuth = async (provider: 'google' | 'github' | 'apple') => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Redirecting...",
        description: `Signing in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || `There was an error signing in with ${provider}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "There was an error signing in",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const redirectUrl = window.location.origin + "/auth";
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
          emailRedirectTo: redirectUrl,
        },
      });
      
      if (error) throw error;
      
      if (data.user?.identities?.length === 0) {
        toast({
          title: "Account already exists",
          description: "Please sign in instead",
          variant: "destructive"
        });
        setIsSignUp(false);
        setLoading(false);
        return;
      }
      
      setVerificationSent(true);
      
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account",
        variant: "default"
      });
      
    } catch (error: any) {
      if (error.message?.includes('already registered')) {
        toast({
          title: "Account already exists",
          description: "Please sign in instead",
          variant: "destructive"
        });
        setIsSignUp(false);
      } else {
        toast({
          title: "Sign up failed",
          description: error.message || "There was an error creating your account",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center relative overflow-hidden">
      {/* Full-Page Background Image */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <img
          src={bgImage}
          alt="Students learning together"
          className="w-full h-full object-cover object-center brightness-60 saturate-115"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-vivid-purple/70"></div>
      </div>

      {/* Animated Accent Elements */}
      <div className="absolute top-8 left-[-80px] w-[260px] h-[260px] rounded-full bg-magenta-pink/20 blur-3xl pointer-events-none animate-[pulse_4s_infinite] z-0"></div>
      <div className="absolute bottom-[-70px] right-[-60px] w-[300px] h-[300px] rounded-full bg-vivid-purple/30 blur-3xl pointer-events-none animate-[pulse_6s_infinite] z-0"></div>

      {/* Auth Card Section */}
      <div className="w-full md:w-[480px] z-10 flex justify-center items-center px-4 py-10 md:p-12 animate-scale-in">
        <Card
          className={cn(
            "glass-morphism w-full shadow-2xl px-8 py-10 md:px-12 border-0 bg-black/60 backdrop-blur-3xl relative animate-fade-in",
            "rounded-3xl border border-white/10 transform transition-all duration-500 ease-out"
          )}
        >
          {verificationSent ? (
            <div className="text-center animate-fade-in">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center animate-scale-in">
                  <Mail className="text-green-400" size={32} />
                </div>
              </div>
              <div className="space-y-4 animate-fade-in delay-200">
                <h2 className="text-xl font-bold text-white">Verification Email Sent!</h2>
                <p className="text-gray-300">
                  We've sent a verification link to <span className="font-semibold text-purple-300">{formData.email}</span>. 
                  Please check your inbox and click the link to complete your registration.
                </p>
                <p className="text-gray-400 text-sm">
                  If you don't see the email, check your spam folder or try again in a few minutes.
                </p>
                <Button
                  onClick={() => setVerificationSent(false)}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                >
                  Return to Login
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Toggle with Enhanced Animation */}
              <div className="flex justify-center mb-8 bg-black/30 rounded-full p-1.5 backdrop-blur-sm">
                <button
                  className={cn(
                    "w-1/2 py-3 text-base font-semibold rounded-full focus:outline-none transition-all duration-500 ease-out flex items-center justify-center gap-2 transform relative overflow-hidden",
                    !isSignUp
                      ? "bg-gradient-to-r from-vivid-purple to-magenta-pink text-white shadow-lg scale-105 shadow-purple-500/25"
                      : "bg-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  )}
                  onClick={() => handleToggleForm(false)}
                  aria-label="Sign In"
                >
                  <LogIn size={18} className={cn("transition-all duration-300", !isSignUp ? "animate-pulse" : "")} />
                  Sign In
                </button>
                <button
                  className={cn(
                    "w-1/2 py-3 text-base font-semibold rounded-full focus:outline-none transition-all duration-500 ease-out flex items-center justify-center gap-2 transform relative overflow-hidden",
                    isSignUp
                      ? "bg-gradient-to-r from-magenta-pink to-vivid-purple text-white shadow-lg scale-105 shadow-pink-500/25"
                      : "bg-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  )}
                  onClick={() => handleToggleForm(true)}
                  aria-label="Sign Up"
                >
                  <UserPlus size={18} className={cn("transition-all duration-300", isSignUp ? "animate-pulse" : "")} />
                  Sign Up
                </button>
              </div>

              <div className="relative overflow-hidden min-h-[450px]">
                {/* Sign In Form */}
                <form
                  className={cn(
                    "flex flex-col justify-center gap-5 absolute inset-0 transition-all duration-700 ease-in-out transform",
                    !isSignUp && !isTransitioning
                      ? "opacity-100 translate-x-0 pointer-events-auto"
                      : "opacity-0 -translate-x-full pointer-events-none"
                  )}
                  onSubmit={handleSignIn}
                  autoComplete="off"
                >
                  <div className="text-center mb-4 animate-fade-in">
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
                    <p className="text-gray-400 text-sm">Sign in to access your account</p>
                  </div>
                  
                  <div className="space-y-5">
                    <label className="relative group">
                      <span className="sr-only">Email</span>
                      <Mail className="absolute left-3 top-3.5 text-vivid-purple group-focus-within:text-magenta-pink transition-all duration-300 group-focus-within:scale-110" size={18} />
                      <Input
                        autoFocus={!isSignUp}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="pl-10 bg-black/30 border-white/10 text-white placeholder-gray-400 h-12 focus:border-magenta-pink focus:shadow-lg focus:shadow-magenta-pink/20 transition-all duration-300 hover:bg-black/40"
                        required
                      />
                    </label>
                    
                    <label className="relative group">
                      <span className="sr-only">Password</span>
                      <Lock className="absolute left-3 top-3.5 text-vivid-purple group-focus-within:text-magenta-pink transition-all duration-300 group-focus-within:scale-110" size={18} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="pl-10 pr-10 bg-black/30 border-white/10 text-white placeholder-gray-400 h-12 focus:border-magenta-pink focus:shadow-lg focus:shadow-magenta-pink/20 transition-all duration-300 hover:bg-black/40"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-200 transition-all duration-300 hover:scale-110"
                        tabIndex={-1}
                        onClick={() => setShowPassword(v => !v)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </label>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={formData.remember}
                        onCheckedChange={handleCheckboxChange}
                        className="data-[state=checked]:bg-magenta-pink data-[state=checked]:border-magenta-pink transition-all duration-300"
                      />
                      <Label htmlFor="remember" className="text-gray-300 text-sm">Remember me</Label>
                    </div>
                    <button
                      type="button"
                      className="text-magenta-pink hover:text-vivid-purple hover:underline transition-all duration-300 transform hover:scale-105"
                    >
                      Forgot password?
                    </button>
                  </div>
                  
                  <Button
                    type="submit"
                    className={cn(
                      "bg-gradient-to-r from-vivid-purple via-magenta-pink to-vivid-purple bg-size-200 hover:bg-right-bottom text-white py-3 px-6 mt-4 rounded-xl text-base font-semibold shadow-lg transition-all duration-500 drop-shadow-glow hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25",
                      "focus:ring focus:ring-magenta-pink/40 h-12 transform active:scale-95"
                    )}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Signing In...
                      </div>
                    ) : (
                      <>
                        <LogIn size={18} className="mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                  
                  <div className="relative flex items-center justify-center mt-6 mb-6">
                    <hr className="w-full border-white/10" />
                    <span className="absolute bg-black/60 px-3 text-gray-400 text-sm backdrop-blur-sm">or continue with</span>
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <Button 
                      type="button"
                      onClick={() => handleSocialAuth('google')}
                      disabled={loading}
                      variant="outline" 
                      className="flex-1 bg-black/20 border-white/10 hover:bg-black/40 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Google
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => handleSocialAuth('github')}
                      disabled={loading}
                      variant="outline" 
                      className="flex-1 bg-black/20 border-white/10 hover:bg-black/40 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <Github className="h-5 w-5 mr-2" />
                      GitHub
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => handleSocialAuth('apple')}
                      disabled={loading}
                      variant="outline" 
                      className="flex-1 bg-black/20 border-white/10 hover:bg-black/40 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <Apple className="h-5 w-5 mr-2" />
                      Apple
                    </Button>
                  </div>
                  
                  <div className="mt-6 text-sm text-center text-gray-400">
                    New here?{" "}
                    <button
                      type="button"
                      className="text-magenta-pink font-bold hover:underline transition-all duration-300 transform hover:scale-105"
                      onClick={() => handleToggleForm(true)}
                    >
                      Create an account
                    </button>
                  </div>
                </form>
                
                {/* Sign Up Form */}
                <form
                  className={cn(
                    "flex flex-col justify-center gap-5 absolute inset-0 transition-all duration-700 ease-in-out transform",
                    isSignUp && !isTransitioning
                      ? "opacity-100 translate-x-0 pointer-events-auto"
                      : "opacity-0 translate-x-full pointer-events-none"
                  )}
                  onSubmit={handleSignUp}
                  autoComplete="off"
                >
                  <div className="text-center mb-4 animate-fade-in">
                    <h2 className="text-2xl font-bold text-white mb-2">Join Us Today!</h2>
                    <p className="text-gray-400 text-sm">Create your account to get started</p>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="relative group">
                      <span className="sr-only">Name</span>
                      <User className="absolute left-3 top-3.5 text-vivid-purple group-focus-within:text-magenta-pink transition-all duration-300 group-focus-within:scale-110" size={18} />
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="pl-10 bg-black/30 border-white/10 text-white placeholder-gray-400 h-12 focus:border-magenta-pink focus:shadow-lg focus:shadow-magenta-pink/20 transition-all duration-300 hover:bg-black/40"
                        required
                        autoFocus={isSignUp}
                      />
                    </label>
                    
                    <label className="relative group">
                      <span className="sr-only">Email</span>
                      <Mail className="absolute left-3 top-3.5 text-vivid-purple group-focus-within:text-magenta-pink transition-all duration-300 group-focus-within:scale-110" size={18} />
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="pl-10 bg-black/30 border-white/10 text-white placeholder-gray-400 h-12 focus:border-magenta-pink focus:shadow-lg focus:shadow-magenta-pink/20 transition-all duration-300 hover:bg-black/40"
                        required
                      />
                    </label>
                    
                    <label className="relative group">
                      <span className="sr-only">Password</span>
                      <Lock className="absolute left-3 top-3.5 text-vivid-purple group-focus-within:text-magenta-pink transition-all duration-300 group-focus-within:scale-110" size={18} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="pl-10 pr-10 bg-black/30 border-white/10 text-white placeholder-gray-400 h-12 focus:border-magenta-pink focus:shadow-lg focus:shadow-magenta-pink/20 transition-all duration-300 hover:bg-black/40"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-200 transition-all duration-300 hover:scale-110"
                        tabIndex={-1}
                        onClick={() => setShowPassword(v => !v)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </label>
                    
                    <label className="relative group">
                      <span className="sr-only">Confirm Password</span>
                      <Lock className="absolute left-3 top-3.5 text-vivid-purple group-focus-within:text-magenta-pink transition-all duration-300 group-focus-within:scale-110" size={18} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        className="pl-10 pr-10 bg-black/30 border-white/10 text-white placeholder-gray-400 h-12 focus:border-magenta-pink focus:shadow-lg focus:shadow-magenta-pink/20 transition-all duration-300 hover:bg-black/40"
                        required
                      />
                    </label>
                  </div>
                  
                  <Button
                    type="submit"
                    className={cn(
                      "bg-gradient-to-r from-magenta-pink via-vivid-purple to-magenta-pink bg-size-200 hover:bg-right-bottom text-white py-3 px-6 mt-4 rounded-xl text-base font-semibold shadow-lg transition-all duration-500 drop-shadow-glow hover:scale-105 hover:shadow-xl hover:shadow-pink-500/25",
                      "focus:ring focus:ring-vivid-purple/30 h-12 transform active:scale-95"
                    )}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      <>
                        <UserPlus size={18} className="mr-2" />
                        Sign Up
                      </>
                    )}
                  </Button>
                  
                  <div className="relative flex items-center justify-center mt-6 mb-6">
                    <hr className="w-full border-white/10" />
                    <span className="absolute bg-black/60 px-3 text-gray-400 text-sm backdrop-blur-sm">or sign up with</span>
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <Button 
                      type="button"
                      onClick={() => handleSocialAuth('google')}
                      disabled={loading}
                      variant="outline" 
                      className="flex-1 bg-black/20 border-white/10 hover:bg-black/40 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Google
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => handleSocialAuth('github')}
                      disabled={loading}
                      variant="outline" 
                      className="flex-1 bg-black/20 border-white/10 hover:bg-black/40 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <Github className="h-5 w-5 mr-2" />
                      GitHub
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => handleSocialAuth('apple')}
                      disabled={loading}
                      variant="outline" 
                      className="flex-1 bg-black/20 border-white/10 hover:bg-black/40 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <Apple className="h-5 w-5 mr-2" />
                      Apple
                    </Button>
                  </div>
                  
                  <div className="mt-6 text-sm text-center text-gray-400">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-magenta-pink font-bold hover:underline transition-all duration-300 transform hover:scale-105"
                      onClick={() => handleToggleForm(false)}
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
          
          {/* Inspirational Quote */}
          <div className="mt-8 text-center text-md italic font-semibold text-white/90 animate-fade-in delay-300">
            <span className="block bg-gradient-to-r from-magenta-pink via-vivid-purple to-blue-400 bg-clip-text text-transparent">
              "Unlock a world of knowledge. Dream. Learn. Achieve."
            </span>
          </div>
          
          {/* Back to Home */}
          <Link
            to="/"
            className="block mt-5 text-xs text-gray-400 hover:text-vivid-purple hover:underline transition-all duration-300 text-center transform hover:scale-105"
          >
            &larr; Back to Home
          </Link>
        </Card>
      </div>

      {/* AuthHeroImage only for md+ screens */}
      <AuthHeroImage />
    </div>
  );
};

export default Auth;
