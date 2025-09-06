import React, { forwardRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string; // Required for accessibility
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ 
    id,
    label,
    error,
    helperText,
    required = false,
    showPasswordToggle = false,
    type = 'text',
    className,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const inputType = showPasswordToggle && showPassword ? 'text' : type;
    const hasError = !!error;
    const helperId = helperText ? `${id}-helper` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const ariaDescribedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;
    
    return (
      <div className="space-y-2">
        <Label 
          htmlFor={id} 
          className={cn(
            "text-sm font-medium",
            hasError && "text-red-400",
            required && "after:content-['*'] after:ml-1 after:text-red-400"
          )}
        >
          {label}
        </Label>
        
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            type={inputType}
            required={required}
            aria-invalid={hasError}
            aria-describedby={ariaDescribedBy}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'input-focus',
              hasError && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
              isFocused && !hasError && 'ring-2 ring-purple-400/20',
              showPasswordToggle && 'pr-10',
              className
            )}
            {...props}
          />
          
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none focus:text-purple-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        
        {helperText && !error && (
          <p id={helperId} className="text-sm text-gray-400">
            {helperText}
          </p>
        )}
        
        {error && (
          <p id={errorId} role="alert" className="flex items-center gap-1 text-sm text-red-400">
            <AlertCircle size={16} />
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';