import { toast } from "@/components/ui/use-toast";

/**
 * Content Security Policy utilities
 */
export const CSP = {
  // Sanitize HTML content to prevent XSS
  sanitizeHtml: (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  // Validate URL to prevent malicious redirects
  validateUrl: (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  },

  // Sanitize file names
  sanitizeFileName: (fileName: string): string => {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 255);
  },

  // Check file type safety
  validateFileType: (file: File, allowedTypes: string[]): boolean => {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    
    return allowedTypes.some(type => {
      if (type.includes('/')) {
        return fileType === type;
      } else {
        return fileName.endsWith(`.${type}`);
      }
    });
  }
};

/**
 * Input validation utilities
 */
export const Validator = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Session management utilities
 */
export const SessionManager = {
  // Check if session is expired
  isSessionExpired: (expiresAt: string): boolean => {
    return new Date() > new Date(expiresAt);
  },

  // Generate secure session ID
  generateSessionId: (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  // Secure logout
  secureLogout: (): void => {
    // Clear all local storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies (if any)
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    
    // Redirect to login
    window.location.href = '/auth';
  }
};

/**
 * Rate limiting (client-side)
 */
export class ClientRateLimit {
  private requests: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      toast({
        title: "Rate Limited",
        description: "Too many requests. Please wait before trying again.",
        variant: "destructive"
      });
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
  
  reset(key: string): void {
    this.requests.delete(key);
  }
  
  clear(): void {
    this.requests.clear();
  }
}

export const clientRateLimit = new ClientRateLimit();

/**
 * CSRF Protection
 */
export const CSRFProtection = {
  // Generate CSRF token
  generateToken: (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  },

  // Store CSRF token
  storeToken: (token: string): void => {
    sessionStorage.setItem('csrf_token', token);
  },

  // Get CSRF token
  getToken: (): string | null => {
    return sessionStorage.getItem('csrf_token');
  },

  // Validate CSRF token
  validateToken: (token: string): boolean => {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === token;
  }
};

/**
 * Audit logging for security events
 */
export const SecurityAudit = {
  logSecurityEvent: (event: string, details?: any): void => {
    const timestamp = new Date().toISOString();
    const userAgent = navigator.userAgent;
    const url = window.location.href;
    
    console.warn(`[SECURITY] ${timestamp}: ${event}`, {
      details,
      userAgent,
      url
    });
    
    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToSecurityMonitoring({ event, details, timestamp, userAgent, url });
    }
  },

  logFailedLogin: (email?: string): void => {
    SecurityAudit.logSecurityEvent('FAILED_LOGIN_ATTEMPT', { email });
  },

  logSuspiciousActivity: (activity: string, details?: any): void => {
    SecurityAudit.logSecurityEvent('SUSPICIOUS_ACTIVITY', { activity, ...details });
  },

  logDataAccess: (resource: string, action: string): void => {
    SecurityAudit.logSecurityEvent('DATA_ACCESS', { resource, action });
  }
};