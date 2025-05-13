
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const PageHeader = ({ title, subtitle, className = "" }: PageHeaderProps) => {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-glow mb-4">
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      {subtitle && (
        <p className="text-gray-300 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
};

export default PageHeader;
