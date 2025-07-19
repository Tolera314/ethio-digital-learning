import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface AnalyticsEvent {
  event_name: string;
  event_category: string;
  properties?: Record<string, any>;
  user_agent?: string;
  session_id?: string;
}

export const useAnalytics = () => {
  const { user } = useAuth();

  const trackEvent = async (event: AnalyticsEvent) => {
    try {
      const { error } = await (supabase as any)
        .from('analytics_events')
        .insert({
          user_id: user?.id || null,
          event_name: event.event_name,
          event_category: event.event_category,
          properties: event.properties || {},
          user_agent: navigator.userAgent,
          session_id: event.session_id || generateSessionId(),
          ip_address: null // Will be handled by RLS if needed
        });

      if (error) {
        console.error('Analytics tracking error:', error);
      }
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  };

  const trackPageView = (page: string) => {
    trackEvent({
      event_name: 'page_view',
      event_category: 'navigation',
      properties: { page }
    });
  };

  const trackUserAction = (action: string, category: string, properties?: Record<string, any>) => {
    trackEvent({
      event_name: action,
      event_category: category,
      properties
    });
  };

  const trackCourseInteraction = (courseId: string, action: string) => {
    trackEvent({
      event_name: 'course_interaction',
      event_category: 'learning',
      properties: { courseId, action }
    });
  };

  const trackVideoInteraction = (videoId: string, action: string, timestamp?: number) => {
    trackEvent({
      event_name: 'video_interaction',
      event_category: 'content',
      properties: { videoId, action, timestamp }
    });
  };

  const trackSessionJoin = (sessionId: string, sessionType: string) => {
    trackEvent({
      event_name: 'session_join',
      event_category: 'engagement',
      properties: { sessionId, sessionType }
    });
  };

  const trackCertificateEarn = (certificateId: string, courseId?: string) => {
    trackEvent({
      event_name: 'certificate_earned',
      event_category: 'achievement',
      properties: { certificateId, courseId }
    });
  };

  const trackPayment = (amount: number, currency: string, planId?: string) => {
    trackEvent({
      event_name: 'payment_completed',
      event_category: 'revenue',
      properties: { amount, currency, planId }
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackUserAction,
    trackCourseInteraction,
    trackVideoInteraction,
    trackSessionJoin,
    trackCertificateEarn,
    trackPayment
  };
};

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}