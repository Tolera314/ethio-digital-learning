import { supabase } from "@/integrations/supabase/client";
import { retryAsync, rateLimiter, checkNetworkStatus } from "./errorHandler";

/**
 * Enhanced API client with error handling, retry logic, and rate limiting
 */
export class ApiClient {
  private static instance: ApiClient;
  
  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }
  
  /**
   * Safe authentication operations
   */
  async auth<T>(operation: 'signIn' | 'signUp' | 'signOut' | 'getSession', data?: any): Promise<T> {
    if (!checkNetworkStatus()) {
      throw new Error('No internet connection available');
    }
    
    return retryAsync(async () => {
      let result;
      
      switch (operation) {
        case 'signIn':
          result = await supabase.auth.signInWithPassword(data);
          break;
        case 'signUp':
          result = await supabase.auth.signUp(data);
          break;
        case 'signOut':
          result = await supabase.auth.signOut();
          break;
        case 'getSession':
          result = await supabase.auth.getSession();
          break;
      }
      
      if (result.error) {
        throw new Error(`Authentication ${operation} failed: ${result.error.message}`);
      }
      
      return result as T;
    }, {
      maxAttempts: 2,
      delay: 500,
      backoffMultiplier: 2
    });
  }
}

export const apiClient = ApiClient.getInstance();