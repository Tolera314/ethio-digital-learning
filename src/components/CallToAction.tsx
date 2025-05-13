
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, LogIn } from 'lucide-react';

interface CallToActionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  className?: string;
}

const CallToAction = ({
  title = "Ready to Begin Your Learning Journey?",
  description = "Join thousands of students who are already advancing their careers with our courses and expert-led sessions.",
  primaryButtonText = "Sign Up Now",
  primaryButtonLink = "/auth",
  secondaryButtonText = "Contact Us",
  secondaryButtonLink = "/contact",
  className = ""
}: CallToActionProps) => {
  return (
    <section className={`w-full max-w-4xl mx-auto my-16 ${className}`}>
      <div className="glass-morphism p-8 rounded-3xl text-center bg-gradient-to-br from-purple-900/40 via-black/80 to-blue-900/40">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to={primaryButtonLink} className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold shadow-lg hover:shadow-purple-500/20 rounded-full flex items-center justify-center">
            <LogIn className="mr-2" size={20} /> {primaryButtonText}
          </Link>
          <Link to={secondaryButtonLink} className="px-8 py-3 border border-white/20 hover:bg-white/10 text-white rounded-full flex items-center justify-center">
            <Mail className="mr-2" size={20} /> {secondaryButtonText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
