import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className,
  fullScreen = false
}) => {
  const spinner = (
    <div className={cn('flex items-center justify-center', fullScreen && 'min-h-screen')}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={cn('animate-spin text-purple-400', sizeClasses[size], className)} />
        {text && (
          <p className="text-sm text-gray-400 animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Skeleton loader component
export const LoadingSkeleton: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className }) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className={cn(
            'h-4 bg-gray-700 rounded',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )} />
        </div>
      ))}
    </div>
  );
};

// Card skeleton
export const LoadingCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('glass-morphism p-6 rounded-xl animate-pulse', className)}>
      <div className="space-y-4">
        <div className="h-32 bg-gray-700 rounded-lg" />
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-700 rounded flex-1" />
          <div className="h-8 bg-gray-700 rounded w-16" />
        </div>
      </div>
    </div>
  );
};