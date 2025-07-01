
import React from "react";

const AuthHeroImage = () => (
  <div className="flex flex-1 flex-col items-center justify-center px-6 space-y-8 animate-fade-in">
    <div className="relative">
      <img
        src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80"
        alt="Monitor showing code - Learning"
        className="rounded-3xl shadow-2xl object-cover max-h-96 hover-scale glass-morphism border border-white/20"
        style={{
          filter: "brightness(0.8) contrast(1.2)",
          backdropFilter: "blur(10px)"
        }}
      />
      <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl -z-10"></div>
    </div>
    
    <div className="text-center space-y-4 animate-fade-in delay-300">
      <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
        Transform Your Future
      </h2>
      <p className="text-lg text-gray-200 leading-relaxed max-w-md">
        "Unlock your tech skills with immersive online courses and join thousands of successful learners."
      </p>
      <div className="flex items-center justify-center space-x-2 text-purple-300">
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-purple-400"></div>
        <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Ethio Digital Academy
        </span>
        <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-purple-400"></div>
      </div>
    </div>
  </div>
);

export default AuthHeroImage;
