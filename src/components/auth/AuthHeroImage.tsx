
import React from "react";

// Example Unsplash learning image
const AuthHeroImage = () => (
  <div className="hidden md:flex flex-1 flex-col items-center justify-center px-6">
    <img
      src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80"
      alt="Monitor showing code - Learning"
      className="rounded-2xl shadow-2xl object-cover max-h-96 animate-scale-in"
      style={{
        border: "4px solid rgba(155, 135, 245, 0.2)",
        boxShadow: "0 10px 50px 0 #9b87f520",
      }}
    />
    <p className="mt-8 text-lg italic text-gray-600 dark:text-gray-200 text-center px-2 font-medium">
      "Unlock your tech skills with immersive online courses." <br />
      <span className="text-vivid-purple font-bold">Ethio Digital Academy</span>
    </p>
  </div>
);

export default AuthHeroImage;
