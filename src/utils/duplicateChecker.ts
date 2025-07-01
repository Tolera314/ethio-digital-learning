
import { useEffect } from 'react';

// Utility to detect and warn about potential duplicate components
export const useDuplicateDetection = (componentName: string, identifier?: string) => {
  useEffect(() => {
    const key = `${componentName}-${identifier || 'default'}`;
    
    if (window.__COMPONENT_REGISTRY) {
      if (window.__COMPONENT_REGISTRY[key]) {
        console.warn(`Potential duplicate component detected: ${componentName}`, {
          identifier,
          existing: window.__COMPONENT_REGISTRY[key],
          current: Date.now()
        });
      }
      window.__COMPONENT_REGISTRY[key] = Date.now();
    } else {
      window.__COMPONENT_REGISTRY = { [key]: Date.now() };
    }
    
    return () => {
      if (window.__COMPONENT_REGISTRY) {
        delete window.__COMPONENT_REGISTRY[key];
      }
    };
  }, [componentName, identifier]);
};

// Global type augmentation
declare global {
  interface Window {
    __COMPONENT_REGISTRY?: Record<string, number>;
  }
}
