import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, UserPlus, LogIn, User, Github, Apple, Sparkles, Shield, Heart } from "lucide-react";
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
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Enhanced Background */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.2),transparent_50%)]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-[10%] w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-1/3 right-[15%] w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40 delay-1000"></div>
      <div className="absolute bottom-1/4 left-[20%] w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-50 delay-500"></div>

      {/* Auth Card Section */}
      <div className="w-full md:w-[500px] z-10 flex justify-center items-center px-4 py-8 md:p-12">
        <Card className="glass-morphism w-full shadow-2xl px-8 py-10 md:px-12 border-0 bg-white/5 backdrop-blur-3xl relative rounded-3xl border border-white/10">
          {verificationSent ? (
            <div className="text-center animate-fade-in">
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-scale-in shadow-lg shadow-green-500/25">
                  <Mail className="text-white" size={32} />
                </div>
              </div>
              <div className="space-y-6 animate-fade-in delay-200">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">Check Your Email!</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  We've sent a verification link to <br/>
                  <span className="font-semibold text-purple-300 bg-purple-500/10 px-2 py-1 rounded-md">{formData.email}</span>
                </p>
                <p className="text-gray-400 text-sm">
                  Please check your inbox and click the link to complete your registration.
                </p>
                <Button
                  onClick={() => setVerificationSent(false)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 h-12"
                >
                  <LogIn size={18} className="mr-2" />
                  Return to Login
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Enhanced Header */}
              <div className="text-center mb-8 animate-fade-in">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <Sparkles className="text-white" size={24} />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {isSignUp ? "Join Us Today" : "Welcome Back"}
                </h1>
                <p className="text-gray-400">
                  {isSignUp ? "Create your account to get started" : "Sign in to continue your journey"}
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mt-3"></div>
              </div>

              {/* Enhanced Tab Toggle */}
              <div className="flex justify-center mb-8 bg-black/20 rounded-2xl p-1.5 backdrop-blur-sm border border-white/5">
                <button
                  className={cn(
                    "w-1/2 py-3.5 text-sm font-semibold rounded-xl focus:outline-none transition-all duration-500 ease-out flex items-center justify-center gap-2 transform relative overflow-hidden group",
                    !isSignUp
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105 shadow-purple-500/25"
                      : "bg-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  )}
                  onClick={() => handleToggleForm(false)}
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300", !isSignUp && "opacity-0")}></div>
                  <LogIn size={18} className={cn("transition-all duration-300 relative z-10", !isSignUp ? "animate-pulse" : "")} />
                  <span className="relative z-10">Sign In</span>
                </button>
                <button
                  className={cn(
                    "w-1/2 py-3.5 text-sm font-semibold rounded-xl focus:outline-none transition-all duration-500 ease-out flex items-center justify-center gap-2 transform relative overflow-hidden group",
                    isSignUp
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105 shadow-pink-500/25"
                      : "bg-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  )}
                  onClick={() => handleToggleForm(true)}
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300", isSignUp && "opacity-0")}></div>
                  <UserPlus size={18} className={cn("transition-all duration-300 relative z-10", isSignUp ? "animate-pulse" : "")} />
                  <span className="relative z-10">Sign Up</span>
                </button>
              </div>

              <div className="relative overflow-hidden min-h-[500px]">
                {/* Sign In Form */}
                <form
                  className={cn(
                    "flex flex-col justify-center gap-6 absolute inset-0 transition-all duration-700 ease-in-out transform",
                    !isSignUp && !isTransitioning
                      ? "opacity-100 translate-x-0 pointer-events-auto"
                      : "opacity-0 -translate-x-full pointer-events-none"
                  )}
                  onSubmit={handleSignIn}
                >
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-gray-300 font-medium flex items-center gap-2">
                        <Mail size={16} className="text-purple-400" />
                        Email Address
                      </Label>
                      <div className="relative group">
                        <Input
                          autoFocus={!isSignUp}
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          className="bg-black/20 border-white/10 text-white placeholder-gray-500 h-12 rounded-xl focus:border-purple-400 focus:shadow-lg focus:shadow-purple-400/20 transition-all duration-300 hover:bg-black/30 group-hover:border-white/20"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-300 font-medium flex items-center gap-2">
                        <Lock size={16} className="text-purple-400" />
                        Password
                      </Label>
                      <div className="relative group">
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          className="bg-black/20 border-white/10 text-white placeholder-gray-500 h-12 rounded-xl pr-12 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-400/20 transition-all duration-300 hover:bg-black/30 group-hover:border-white/20"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-200 transition-all duration-300 hover:scale-110 p-1 rounded-lg hover:bg-white/5"
                          onClick={() => setShowPassword(v => !v)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="remember" 
                        checked={formData.remember}
                        onCheckedChange={handleCheckboxChange}
                        className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 border-white/20 rounded-md"
                      />
                      <Label htmlFor="remember" className="text-gray-300 text-sm cursor-pointer">Remember me</Label>
                    </div>
                    <button
                      type="button"
                      className="text-purple-400 hover:text-purple-300 hover:underline transition-all duration-300 text-sm font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-size-200 hover:bg-right-bottom text-white py-3.5 px-6 rounded-xl text-base font-semibold shadow-lg transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 h-12"
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
                  
                  <div className="relative flex items-center justify-center my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative bg-slate-950 px-4">
                      <span className="text-gray-400 text-sm font-medium">or continue with</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <Button 
                      type="button"
                      onClick={() => handleSocialAuth('google')}
                      disabled={loading}
                      variant="outline" 
                      className="bg-black/20 border-white/10 hover:bg-black/40 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-white/20 h-12 rounded-xl group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => handleSocialAuth('github')}
                      disabled={loading}
                      variant="outline" 
                      className="bg-black/20 border-white/10 hover:bg-black/40 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-white/20 h-12 rounded-xl group"
                    >
                      <Github className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => handleSocialAuth('apple')}
                      disabled={loading}
                      variant="outline" 
                      className="bg-black/20 border-white/10 hover:bg-black/40 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-white/20 h-12 rounded-xl group"
                    >
                      <Apple className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm text-gray-400">
                    New to our platform?{" "}
                    <button
                      type="button"
                      className="text-purple-400 font-semibold hover:text-purple-300 hover:underline transition-all duration-300"
                      onClick={() => handleToggleForm(true)}
                    >
                      Create an account
                    </button>
                  </div>
                </form>
                
                {/* Sign Up Form */}
                <form
                  className={cn(
                    "flex flex-col justify-center gap-6 absolute inset-0 transition-all duration-700 ease-in-out transform",
                    isSignUp && !isTransitioning
                      ? "opacity-100 translate-x-0 pointer-events-auto"
                      : "opacity-0 translate-x-full pointer-events-none"
                  )}
                  onSubmit={handleSignUp}
                >
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-gray-300 font-medium flex items-center gap-2">
                        <User size={16} className="text-pink-400" />
                        Full Name
                      </Label>
                      <div className="relative group">
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className="bg-black/20 border-white/10 text-white placeholder-gray-500 h-12 rounded-xl focus:border-pink-400 focus:shadow-lg focus:shadow-pink-400/20 transition-all duration-300 hover:bg-black/30 group-hover:border-white/20"
                          required
                          autoFocus={isSignUp}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-300 font-medium flex items-center gap-2">
                        <Mail size={16} className="text-pink-400" />
                        Email Address
                      </Label>
                      <div className="relative group">
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          className="bg-black/20 border-white/10 text-white placeholder-gray-500 h-12 rounded-xl focus:border-pink-400 focus:shadow-lg focus:shadow-pink-400/20 transition-all duration-300 hover:bg-black/30 group-hover:border-white/20"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-300 font-medium flex items-center gap-2">
                        <Lock size={16} className="text-pink-400" />
                        Password
                      </Label>
                      <div className="relative group">
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a strong password"
                          className="bg-black/20 border-white/10 text-white placeholder-gray-500 h-12 rounded-xl pr-12 focus:border-pink-400 focus:shadow-lg focus:shadow-pink-400/20 transition-all duration-300 hover:bg-black/30 group-hover:border-white/20"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-200 transition-all duration-300 hover:scale-110 p-1 rounded-lg hover:bg-white/5"
                          onClick={() => setShowPassword(v => !v)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-300 font-medium flex items-center gap-2">
                        <Shield size={16} className="text-pink-400" />
                        Confirm Password
                      </Label>
                      <div className="relative group">
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          className="bg-black/20 border-white/10 text-white placeholder-gray-500 h-12 rounded-xl focus:border-pink-400 focus:shadow-lg focus:shadow-pink-400/20 transition-all duration-300 hover:bg-black/30 group-hover:border-white/20"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-size-200 hover:bg-right-bottom text-white py-3.5 px-6 rounded-xl text-base font-semibold shadow-lg transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-pink-500/25 h-12"
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
                        Create Account
                      </>
                    )}
                  </Button>
                  
                  <div className="relative flex items-center justify-center my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative bg-slate-950 px-4">
                      <span className="text-gray-400 text-sm font-medium">or sign up with</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <Button 
                      type="button"
                      onClick={() => handleSocialAuth('google')}
                      disabled={loading}
                      variant="outline" 
                      className="bg-black/20 border-white/10 hover:bg-black/40 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-white/20 h-12 rounded-xl group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => handleSocialAuth('github')}
                      disabled={loading}
                      variant="outline" 
                      className="bg-black/20 border-white/10 hover:bg-black/40 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-white/20 h-12 rounded-xl group"
                    >
                      <Github className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => handleSocialAuth('apple')}
                      disabled={loading}
                      variant="outline" 
                      className="bg-black/20 border-white/10 hover:bg-black/40 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-white/20 h-12 rounded-xl group"
                    >
                      <Apple className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-pink-400 font-semibold hover:text-pink-300 hover:underline transition-all duration-300"
                      onClick={() => handleToggleForm(false)}
                    >
                      Sign in here
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
          
          {/* Enhanced Inspirational Quote */}
          <div className="mt-8 text-center animate-fade-in delay-300">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="text-pink-400" size={16} />
              <span className="text-sm font-medium bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                "Unlock a world of knowledge. Dream. Learn. Achieve."
              </span>
              <Heart className="text-pink-400" size={16} />
            </div>
          </div>
          
          {/* Back to Home */}
          <Link
            to="/"
            className="block mt-6 text-sm text-gray-400 hover:text-purple-400 hover:underline transition-all duration-300 text-center transform hover:scale-105 font-medium"
          >
            ← Back to Home
          </Link>
        </Card>
      </div>

      {/* AuthHeroImage only for md+ screens */}
      <AuthHeroImage />
    </div>
  );
};

export default Auth;
