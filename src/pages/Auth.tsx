
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AuthHeroImage from '@/components/auth/AuthHeroImage';
import SignupForm from '@/components/auth/SignupForm';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const handleModeSwitch = (newMode: boolean) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsSignUp(newMode);
      setIsTransitioning(false);
    }, 300);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSuccess = () => {
    handleModeSwitch(false);
    toast({
      title: "Account created!",
      description: "Please check your email to verify your account before signing in.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-bounce-in">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced background with parallax effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-4rem)]">
          {/* Left side - Hero Section */}
          <div className="hidden lg:block animate-fade-in">
            <AuthHeroImage />
          </div>

          {/* Right side - Auth Forms */}
          <div className="flex justify-center items-center">
            <div className={`w-full max-w-sm transition-all duration-500 transform ${
              isTransitioning ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}>
              {isSignUp ? (
                <div className="animate-scale-in">
                  <SignupForm
                    onSuccess={handleSignupSuccess}
                    onSwitchToLogin={() => handleModeSwitch(false)}
                  />
                </div>
              ) : (
                <div className="animate-scale-in">
                  <Card className="w-full glass-morphism border-white/20 shadow-2xl">
                    <CardHeader className="text-center space-y-4 pb-8">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4 animate-bounce-in">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl lg:text-3xl font-bold text-white">Welcome Back</CardTitle>
                      <CardDescription className="text-gray-300 text-base lg:text-lg">
                        Sign in to continue your learning journey
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-purple-400 transition-all duration-300 input-focus"
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-white font-medium">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              className="pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-purple-400 transition-all duration-300 input-focus"
                              placeholder="Enter your password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-hover" 
                          disabled={loading}
                        >
                          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                          {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                      </form>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-transparent text-gray-400">Don't have an account?</span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleModeSwitch(true)}
                        className="w-full h-12 border-white/20 text-white hover:bg-white/10 hover:border-white/30 font-semibold rounded-xl transition-all duration-300 btn-hover"
                      >
                        Create New Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
