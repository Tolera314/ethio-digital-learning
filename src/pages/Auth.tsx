
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, UserPlus, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import AuthHeroImage from "@/components/auth/AuthHeroImage";

const bgImage =
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const transitionClass =
    "transition-all duration-500 ease-in-out";

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

      {/* Glowing Animated Circles - subtle for learning vibe */}
      <div className="absolute top-8 left-[-80px] w-[260px] h-[260px] rounded-full bg-magenta-pink/20 blur-3xl pointer-events-none animate-[pulse_4s_infinite] z-0"></div>
      <div className="absolute bottom-[-70px] right-[-60px] w-[300px] h-[300px] rounded-full bg-vivid-purple/30 blur-3xl pointer-events-none animate-[pulse_6s_infinite] z-0"></div>

      {/* Auth Card Section */}
      <div className="w-full md:w-[430px] z-10 flex justify-center items-center px-2 py-10 md:p-12 animate-scale-in">
        <Card
          className={cn(
            "glass-morphism w-full shadow-2xl px-7 py-8 md:px-10 border-0 bg-black/60 backdrop-blur-3xl relative animate-fade-in",
            "rounded-3xl"
          )}
        >
          {/* Tab Toggle */}
          <div className="flex justify-center mb-8 gap-2">
            <button
              className={cn(
                "w-1/2 py-2 text-xl font-semibold rounded-t-lg focus:outline-none transition-all",
                !isSignUp
                  ? "bg-vivid-purple text-white shadow-lg"
                  : "bg-transparent text-gray-300"
              )}
              onClick={() => setIsSignUp(false)}
              aria-label="Sign In"
            >
              <LogIn size={22} className="inline mr-2" />
              Sign In
            </button>
            <button
              className={cn(
                "w-1/2 py-2 text-xl font-semibold rounded-t-lg focus:outline-none transition-all",
                isSignUp
                  ? "bg-vivid-purple text-white shadow-lg"
                  : "bg-transparent text-gray-300"
              )}
              onClick={() => setIsSignUp(true)}
              aria-label="Sign Up"
            >
              <UserPlus size={22} className="inline mr-2" />
              Sign Up
            </button>
          </div>
          {/* Animated Forms */}
          <div className="overflow-hidden min-h-[330px]">
            {/* Sign In */}
            <form
              className={cn(
                "flex flex-col justify-center gap-5",
                transitionClass,
                !isSignUp
                  ? "opacity-100 scale-100 pointer-events-auto translate-x-0"
                  : "absolute opacity-0 scale-90 pointer-events-none -translate-x-36"
              )}
              autoComplete="off"
            >
              <label className="relative">
                <span className="sr-only">Email</span>
                <Mail className="absolute left-3 top-3.5 text-vivid-purple" size={18} />
                <Input
                  autoFocus={!isSignUp}
                  type="email"
                  placeholder="Email"
                  className="pl-10 bg-black/30 border-white/10 text-white placeholder-gray-400"
                  required
                />
              </label>
              <label className="relative">
                <span className="sr-only">Password</span>
                <Lock className="absolute left-3 top-3.5 text-vivid-purple" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pl-10 pr-10 bg-black/30 border-white/10 text-white placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-300"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </label>
              <div className="flex justify-between text-xs mt-[-0.5rem]">
                <span />
                <button
                  type="button"
                  className="hover:underline text-gray-400"
                  disabled
                  tabIndex={-1}
                >
                  Forgot password?
                </button>
              </div>
              <Button
                type="submit"
                className={cn(
                  "bg-gradient-to-r from-vivid-purple via-magenta-pink to-vivid-purple hover:from-magenta-pink hover:to-vivid-purple text-white py-2 px-6 mt-2 rounded-xl text-lg font-semibold shadow-lg transition-all drop-shadow-glow hover-scale",
                  "focus:ring focus:ring-magenta-pink/40"
                )}
              >
                Sign In
              </Button>
              <div className="mt-4 text-sm text-center text-gray-400">
                New here?{" "}
                <button
                  type="button"
                  className="text-magenta-pink font-bold hover:underline"
                  onClick={() => setIsSignUp(true)}
                >
                  Create an account
                </button>
              </div>
            </form>
            {/* Sign Up */}
            <form
              className={cn(
                "flex flex-col justify-center gap-5 absolute top-0 left-0 w-full",
                transitionClass,
                isSignUp
                  ? "opacity-100 scale-100 pointer-events-auto translate-x-0"
                  : "opacity-0 scale-90 pointer-events-none translate-x-36"
              )}
              autoComplete="off"
            >
              <label className="relative">
                <span className="sr-only">Email</span>
                <Mail className="absolute left-3 top-3.5 text-vivid-purple" size={18} />
                <Input
                  autoFocus={isSignUp}
                  type="email"
                  placeholder="Email"
                  className="pl-10 bg-black/30 border-white/10 text-white placeholder-gray-400"
                  required
                />
              </label>
              <label className="relative">
                <span className="sr-only">Password</span>
                <Lock className="absolute left-3 top-3.5 text-vivid-purple" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pl-10 pr-10 bg-black/30 border-white/10 text-white placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-300"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </label>
              <label className="relative">
                <span className="sr-only">Confirm Password</span>
                <Lock className="absolute left-3 top-3.5 text-vivid-purple" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="pl-10 pr-10 bg-black/30 border-white/10 text-white placeholder-gray-400"
                  required
                />
              </label>
              <Button
                type="submit"
                className={cn(
                  "bg-gradient-to-r from-magenta-pink via-vivid-purple to-magenta-pink hover:from-vivid-purple hover:to-magenta-pink text-white py-2 px-6 mt-2 rounded-xl text-lg font-semibold shadow-lg transition-all drop-shadow-glow hover-scale",
                  "focus:ring focus:ring-vivid-purple/30"
                )}
              >
                Sign Up
              </Button>
              <div className="mt-4 text-sm text-center text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-magenta-pink font-bold hover:underline"
                  onClick={() => setIsSignUp(false)}
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
          {/* Inspirational Quote or Brand */}
          <div className="mt-10 text-center text-md italic font-semibold text-white/90 animate-fade-in delay-150">
            <span className="block bg-gradient-to-r from-magenta-pink via-vivid-purple to-blue-400 bg-clip-text text-transparent">
              "Unlock a world of knowledge. Dream. Learn. Achieve."
            </span>
          </div>
          {/* Back to Home */}
          <Link
            to="/"
            className="block mt-5 text-xs text-gray-400 hover:text-vivid-purple hover:underline transition-colors"
          >
            &larr; Back to Home
          </Link>
        </Card>
      </div>

      {/* AuthHeroImage only for md+ screens - looks good alongside glass card */}
      <AuthHeroImage />
    </div>
  );
};

export default Auth;

