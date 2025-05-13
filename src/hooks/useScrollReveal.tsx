
import { useEffect } from 'react';

/**
 * Hook to add scroll reveal animations to elements with the 'reveal-on-scroll' class
 * @param threshold - Intersection threshold (0-1), default 0.1
 * @param rootMargin - Root margin, default "0px"
 */
export function useScrollReveal(threshold = 0.1, rootMargin = "0px") {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.add('opacity-100');
          }
        });
      },
      { threshold, rootMargin }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [threshold, rootMargin]);
}

export default useScrollReveal;
