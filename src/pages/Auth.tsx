
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, UserPlus, LogIn, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import AuthHeroImage from "@/components/auth/AuthHeroImage";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, remember: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted:", formData);
  };

  const transitionClass = "transition-all duration-500 ease-in-out";

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

      {/* Auth Card Section - Enhanced */}
      <div className="w-full md:w-[480px] z-10 flex justify-center items-center px-4 py-10 md:p-12 animate-scale-in">
        <Card
          className={cn(
            "glass-morphism w-full shadow-2xl px-8 py-10 md:px-12 border-0 bg-black/60 backdrop-blur-3xl relative animate-fade-in",
            "rounded-3xl border border-white/10"
          )}
        >
          {/* Tab Toggle - Enhanced */}
          <div className="flex justify-center mb-8 bg-black/30 rounded-full p-1.5">
            <button
              className={cn(
                "w-1/2 py-2.5 text-base font-semibold rounded-full focus:outline-none transition-all flex items-center justify-center gap-2",
                !isSignUp
                  ? "bg-gradient-to-r from-vivid-purple to-magenta-pink text-white shadow-lg"
                  : "bg-transparent text-gray-400 hover:text-gray-200"
              )}
              onClick={() => setIsSignUp(false)}
              aria-label="Sign In"
            >
              <LogIn size={18} className="inline" />
              Sign In
            </button>
            <button
              className={cn(
                "w-1/2 py-2.5 text-base font-semibold rounded-full focus:outline-none transition-all flex items-center justify-center gap-2",
                isSignUp
                  ? "bg-gradient-to-r from-magenta-pink to-vivid-purple text-white shadow-lg"
                  : "bg-transparent text-gray-400 hover:text-gray-200"
              )}
              onClick={() => setIsSignUp(true)}
              aria-label="Sign Up"
            >
              <UserPlus size={18} className="inline" />
              Sign Up
            </button>
          </div>

          <div className="overflow-hidden min-h-[350px]">
            {/* Sign In Form */}
            <form
              className={cn(
                "flex flex-col justify-center gap-5",
                transitionClass,
                !isSignUp
                  ? "opacity-100 scale-100 pointer-events-auto translate-x-0"
                  : "absolute opacity-0 scale-90 pointer-events-none -translate-x-36"
              )}
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-white">Welcome Back!</h2>
                <p className="text-gray-400 text-sm mt-1">Sign in to access your account</p>
              </div>
              
              <label className="relative group">
                <span className="sr-only">Email</span>
                <Mail className="absolute left-3 top-3.5 text-vivid-purple group-focus-within:text-magenta-pink transition-colors" size={18} />
                <Input
                  autoFocus={!isSignUp}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="pl-10 bg-black/30 border-white/10 text-white placeholder-gray-400 h-12 focus:border-magenta-pink"
                  required
                />
              </label>
              
              <label className="relative group">
                <span className="sr-only">Password</span>
                <Lock className="absolute left-3 top-3.5 text-vivid-purple group-focus-within:text-magenta-pink transition-colors" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="pl-10 pr-10 bg-black/30 border-white/10 text-white placeholder-gray-400 h-12 focus:border-magenta-pink"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-200 transition-colors"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </label>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={formData.remember}
                    onCheckedChange={handleCheckboxChange}
                    className="data-[state=checked]:bg-magenta-pink data-[state=checked]:border-magenta-pink"
                  />
                  <Label htmlFor="remember" className="text-gray-300 text-sm">Remember me</Label>
                </div>
                <button
                  type="button"
                  className="text-magenta-pink hover:text-vivid-purple hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              
              <Button
                type="submit"
                className={cn(
                  "bg-gradient-to-r from-vivid-purple via-magenta-pink to-vivid-purple bg-size-200 hover:bg-right-bottom text-white py-2.5 px-6 mt-2 rounded-xl text-base font-semibold shadow-lg transition-all drop-shadow-glow hover:scale-[1.02]",
                  "focus:ring focus:ring-magenta-pink/40 h-12"
                )}
              >
                <LogIn size={18} className="mr-2" />
                Sign In
              </Button>
              
              <div className="relative flex items-center justify-center mt-2 mb-2">
                <hr className="w-full border-white/10" />
                <span className="absolute bg-black/60 px-2 text-gray-400 text-sm">or continue with</span>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button variant="outline" className="flex-1 bg-black/20 border-white/10 hover:bg-black/40 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="flex-1 bg-black/20 border-white/10 hover:bg-black/40 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                  </svg>
                  Facebook
                </Button>
              </div>
              
              <div className="mt-4 text-sm text-center text-gray-400">
                New here?{" "}
                <button
                  type="button"
                  className="text-magenta-pink font-bold hover:underline transition-colors"
                  onClick={() => setIsSignUp(true)}
                >
                  Create an account
                </button>
              </div>
            </form>
            
            {/* Sign Up Form */}
            <form
              className={cn(
                "flex flex-col justify-center gap-5 absolute top-0 left-0 w-full",
                transitionClass,
                isSignUp
                  ? "opacity-100 scale-100 pointer-events-auto translate-x-0"
                  : "opacity-0 scale-90 pointer-events-none translate-x-36"
              )}
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-white">Join Us Today!</h2>
                <p className="text-gray-400 text-sm mt-1">Create your account to get started</p>
              </div>
              
              <label className="relative group">
                <span className="sr-only">Name</span>
                <User className="absolute left-3 top-3.5 text-vivid-purple group-focus-within:text-magenta-pink transition-colors" size={18} />
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="pl-10 bg-black/30 border-white/10 text-white placeholder-gray-400 h-12 focus:border-magenta-pink"
                  required
                  autoFocus={isSignUp}
                />
              </label>
              
              <label className="relative group">
                <span className="sr-only">Email</span>
                <Mail className="absolute left-3 top-3.5 text-vivid-purple group-focus-within:text-magenta-pink transition-colors" size={18} />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="pl-10 bg-black/30 border-white/10 text-white placeholder-gray-400 h-12 focus:border-magenta-pink"
                  required
                />
              </label>
              
              <label className="relative group">
                <span className="sr-only">Password</span>
                <Lock className="absolute left-3 top-3.5 text-vivid-purple group-focus-within:text-magenta-pink transition-colors" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="pl-10 pr-10 bg-black/30 border-white/10 text-white placeholder-gray-400 h-12 focus:border-magenta-pink"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-200 transition-colors"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </label>
              
              <label className="relative group">
                <span className="sr-only">Confirm Password</span>
                <Lock className="absolute left-3 top-3.5 text-vivid-purple group-focus-within:text-magenta-pink transition-colors" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="pl-10 pr-10 bg-black/30 border-white/10 text-white placeholder-gray-400 h-12 focus:border-magenta-pink"
                  required
                />
              </label>
              
              <Button
                type="submit"
                className={cn(
                  "bg-gradient-to-r from-magenta-pink via-vivid-purple to-magenta-pink bg-size-200 hover:bg-right-bottom text-white py-2.5 px-6 mt-2 rounded-xl text-base font-semibold shadow-lg transition-all drop-shadow-glow hover:scale-[1.02]",
                  "focus:ring focus:ring-vivid-purple/30 h-12"
                )}
              >
                <UserPlus size={18} className="mr-2" />
                Sign Up
              </Button>
              
              <div className="relative flex items-center justify-center mt-2 mb-2">
                <hr className="w-full border-white/10" />
                <span className="absolute bg-black/60 px-2 text-gray-400 text-sm">or sign up with</span>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button variant="outline" className="flex-1 bg-black/20 border-white/10 hover:bg-black/40 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="flex-1 bg-black/20 border-white/10 hover:bg-black/40 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                  </svg>
                  Facebook
                </Button>
              </div>
              
              <div className="mt-4 text-sm text-center text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-magenta-pink font-bold hover:underline transition-colors"
                  onClick={() => setIsSignUp(false)}
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
          
          {/* Inspirational Quote */}
          <div className="mt-10 text-center text-md italic font-semibold text-white/90 animate-fade-in delay-150">
            <span className="block bg-gradient-to-r from-magenta-pink via-vivid-purple to-blue-400 bg-clip-text text-transparent">
              "Unlock a world of knowledge. Dream. Learn. Achieve."
            </span>
          </div>
          
          {/* Back to Home */}
          <Link
            to="/"
            className="block mt-5 text-xs text-gray-400 hover:text-vivid-purple hover:underline transition-colors text-center"
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
