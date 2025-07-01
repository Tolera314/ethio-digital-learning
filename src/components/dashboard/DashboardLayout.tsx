
import React from 'react';
import ProfessionalNavbar from '@/components/layout/ProfessionalNavbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <ProfessionalNavbar />
      
      <div className="max-w-7xl mx-auto responsive-padding py-8 space-responsive">
        {(title || subtitle) && (
          <div className="mb-8 animate-fade-in">
            {title && (
              <h1 className="responsive-heading font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-gray-300 mt-2 responsive-text">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
}
