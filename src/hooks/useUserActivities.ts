
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Json } from '@/integrations/supabase/types';
import { logDashboardVisit } from '@/utils/activityLogger';

export interface UserActivity {
  id: string;
  activity_type: string;
  resource_id: string | null;
  resource_type: string | null;
  created_at: string;
  metadata: Json;
}

export interface CourseProgress {
  courseId: string;
  title: string;
  progress: number;
  lastAccessed?: string;
}

export const useUserActivities = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Log dashboard visit
        await logDashboardVisit();
        
        // Get all user activities
        const { data, error: activitiesError } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (activitiesError) throw activitiesError;
        
        setActivities(data || []);
        setRecentActivities(data?.slice(0, 10) || []);
        
        // Process course progress
        const courseIds = [...new Set(
          data
            ?.filter(a => a.activity_type === 'course_progress')
            .map(a => a.resource_id) || []
        )];
        
        const coursesProgress: CourseProgress[] = [];
        
        for (const courseId of courseIds) {
          if (!courseId) continue;
          
          const courseActivities = data
            ?.filter(a => 
              a.activity_type === 'course_progress' && 
              a.resource_id === courseId
            )
            .sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            ) || [];
            
          if (courseActivities.length > 0) {
            const latestActivity = courseActivities[0];
            const metadata = latestActivity.metadata as any;
            
            coursesProgress.push({
              courseId,
              title: metadata?.title || 'Untitled Course',
              progress: metadata?.progress || 0,
              lastAccessed: latestActivity.created_at
            });
          }
        }
        
        setCourseProgress(coursesProgress);
      } catch (err: any) {
        console.error('Error fetching user activities:', err);
        setError(err.message || 'Error fetching activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('user-activities-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_activities',
        filter: `user_id=eq.${user?.id}`
      }, () => {
        fetchActivities();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    activities,
    recentActivities,
    courseProgress,
    loading,
    error
  };
};
