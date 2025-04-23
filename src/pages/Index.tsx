
// Updated Index page for Ethio Digital Academy

import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vivid-purple via-primary-purple to-dark-purple px-4">
      <div className="glass-morphism shadow-2xl max-w-xl mx-auto w-full p-10 rounded-3xl border-0 text-center relative z-10 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-vivid-purple via-magenta-pink to-ocean-blue bg-clip-text text-transparent drop-shadow-glow">
          Ethio Digital Academy
        </h1>
        <p className="text-lg md:text-xl text-gray-700 font-medium mb-8 dark:text-gray-200">
          The magic of online learning – Structured Courses | Certificates | Progress Tracking | Live Sessions
        </p>
        <Link
          to="/auth"
          className="inline-flex items-center px-7 py-3 rounded-full bg-vivid-purple text-white font-semibold text-lg shadow-lg hover:scale-105 transition hover:bg-magenta-pink focus:ring-2 focus:ring-vivid-purple/20 animate-scale-in"
        >
          <LogIn className="mr-2" size={22} /> Get Started
        </Link>
        <div className="mt-8 text-sm text-gray-500">
          Start your journey toward mastery &#9733;
        </div>
      </div>
    </div>
  );
};

export default Index;
