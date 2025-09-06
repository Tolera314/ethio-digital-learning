import { toast } from "@/components/ui/use-toast";

export interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delay: 1000,
  backoffMultiplier: 1.5,
};

/**
 * Enhanced error handler with retry logic and user-friendly messages
 */
export const handleError = (error: unknown, context?: string): void => {
  console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  
  let message = 'An unexpected error occurred. Please try again.';
  
  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch')) {
      message = 'Network connection issue. Please check your internet and try again.';
    } else if (error.message.includes('Unauthorized')) {
      message = 'Please sign in to continue.';
    } else if (error.message.includes('Forbidden')) {
      message = 'You don\'t have permission to perform this action.';
    } else if (error.message.includes('Not Found')) {
      message = 'The requested resource was not found.';
    } else {
      message = error.message;
    }
  }
  
  toast({
    title: "Error",
    description: message,
    variant: "destructive"
  });
};

/**
 * Retry function with exponential backoff
 */
export const retryAsync = async <T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> => {
  const { maxAttempts, delay, backoffMultiplier } = { ...DEFAULT_RETRY_CONFIG, ...config };
  
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      // Don't retry on authentication errors
      if (lastError.message.includes('Unauthorized') || lastError.message.includes('Forbidden')) {
        throw lastError;
      }
      
      const currentDelay = delay * Math.pow(backoffMultiplier, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, currentDelay));
    }
  }
  
  throw lastError!;
};

/**
 * Safe async function wrapper with error handling
 */
export const safeAsync = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      throw error;
    }
  }) as T;
};

/**
 * Network status checker
 */
export const checkNetworkStatus = (): boolean => {
  return navigator.onLine;
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Rate limiting helper (client-side)
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Filter out old requests
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();