import { useCallback, useEffect, useRef, useState } from 'react';

export const usePerformance = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      setMetrics({
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        renderTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
      });
    }
  }, []);

  const measureRender = useCallback((componentName: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${componentName} render time: ${end - start}ms`);
  }, []);

  return { metrics, measureRender };
};

export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useThrottle = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): T => {
  const lastCall = useRef<number>(0);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        fn(...args);
      } else {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
        
        timeoutId.current = setTimeout(() => {
          lastCall.current = Date.now();
          fn(...args);
        }, delay - (now - lastCall.current));
      }
    }) as T,
    [fn, delay]
  );
};

export const useImagePreloader = (urls: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const preloadImages = useCallback(() => {
    setIsLoading(true);
    const promises = urls.map(url => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = reject;
        img.src = url;
      });
    });

    Promise.allSettled(promises).then(results => {
      const loaded = new Set<string>();
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          loaded.add(urls[index]);
        }
      });
      setLoadedImages(loaded);
      setIsLoading(false);
    });
  }, [urls]);

  useEffect(() => {
    if (urls.length > 0) {
      preloadImages();
    }
  }, [urls, preloadImages]);

  return { loadedImages, isLoading, preloadImages };
};