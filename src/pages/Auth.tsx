
// Modern Auth Page with Magic UI and Hero Image

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, UserPlus, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import AuthHeroImage from "@/components/auth/AuthHeroImage";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation transition class
  const transitionClass =
    "transition-all duration-500 ease-in-out";

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-vivid-purple via-primary-purple to-dark-purple relative overflow-hidden">
      {/* Glowing Animated Circles */}
      <div className="absolute top-10 left-[-80px] w-[320px] h-[320px] rounded-full bg-magenta-pink/30 blur-3xl pointer-events-none animate-[pulse_4s_infinite] z-0"></div>
      <div className="absolute bottom-[-90px] right-[-60px] w-[370px] h-[370px] rounded-full bg-ocean-blue/20 blur-3xl pointer-events-none animate-[pulse_6s_infinite] z-0"></div>

      <div className="w-full md:w-[480px] z-10 flex justify-center items-center p-0 md:p-10 animate-scale-in">
        <Card
          className={cn(
            "glass-morphism w-full shadow-2xl px-8 py-8 md:px-10 border-0 bg-white/80 dark:bg-dark-purple/80 backdrop-blur-3xl relative animate-fade-in",
            "rounded-3xl"
          )}
        >
          {/* Tab Toggle */}
          <div className="flex justify-center mb-8">
            <button
              className={cn(
                "w-1/2 py-2 text-xl font-semibold rounded-t-lg focus:outline-none transition-all",
                !isSignUp
                  ? "bg-vivid-purple text-white shadow-lg"
                  : "bg-transparent text-mid-gray"
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
                  : "bg-transparent text-mid-gray"
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
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <Input
                  autoFocus={!isSignUp}
                  type="email"
                  placeholder="Email"
                  className="pl-10"
                  required
                />
              </label>
              <label className="relative">
                <span className="sr-only">Password</span>
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </label>
              <div className="flex justify-between text-xs mt-[-0.5rem]">
                <span></span>
                <button
                  type="button"
                  className="hover:underline text-mid-gray"
                  disabled
                  tabIndex={-1}
                >
                  Forgot password?
                </button>
              </div>
              <Button
                type="submit"
                className={cn(
                  "bg-vivid-purple hover:bg-magenta-pink text-white py-2 px-6 mt-2 rounded-xl text-lg font-semibold shadow-lg transition-all drop-shadow-glow hover:scale-105",
                  "focus:ring focus:ring-magenta-pink/40"
                )}
              >
                Sign In
              </Button>
              <div className="mt-4 text-sm text-center text-gray-500">
                New here?{" "}
                <button
                  type="button"
                  className="text-vivid-purple font-bold hover:underline"
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
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <Input
                  autoFocus={isSignUp}
                  type="email"
                  placeholder="Email"
                  className="pl-10"
                  required
                />
              </label>
              <label className="relative">
                <span className="sr-only">Password</span>
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </label>
              <label className="relative">
                <span className="sr-only">Confirm Password</span>
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="pl-10 pr-10"
                  required
                />
              </label>
              <Button
                type="submit"
                className={cn(
                  "bg-vivid-purple hover:bg-magenta-pink text-white py-2 px-6 mt-2 rounded-xl text-lg font-semibold shadow-lg transition-all drop-shadow-glow hover:scale-105",
                  "focus:ring focus:ring-vivid-purple/30"
                )}
              >
                Sign Up
              </Button>
              <div className="mt-4 text-sm text-center text-gray-500">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-vivid-purple font-bold hover:underline"
                  onClick={() => setIsSignUp(false)}
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
          {/* Inspirational Quote or Brand */}
          <div className="mt-8 text-center text-md italic font-semibold text-gray-600 animate-fade-in delay-150">
            “Unlock a world of knowledge. Dream. Learn. Achieve.”
          </div>
          {/* Back to Home */}
          <Link
            to="/"
            className="block mt-4 text-xs text-gray-400 hover:text-vivid-purple hover:underline transition-colors"
          >
            &larr; Back to Home
          </Link>
        </Card>
      </div>

      <AuthHeroImage />

    </div>
  );
};

export default Auth;
