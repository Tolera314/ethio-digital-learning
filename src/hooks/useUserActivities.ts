
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Json } from '@/integrations/supabase/types';

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
        
        // Get all user activities
        const { data, error: activitiesError } = await supabase
          .from('user_activities')
          .select('*')
          .order('created_at', { ascending: false });

        if (activitiesError) throw activitiesError;
        
        setActivities(data || []);
        
        // Get recent activities (last 10)
        setRecentActivities(data?.slice(0, 10) || []);
        
        // Get course progress for each unique course
        const courseIds = [...new Set(
          data
            ?.filter(a => a.activity_type === 'course_progress')
            .map(a => a.resource_id) || []
        )];
        
        const coursesProgress: CourseProgress[] = [];
        
        // For each course, get the latest progress activity
        for (const courseId of courseIds) {
          if (!courseId) continue;
          
          const latestActivity = data
            ?.filter(a => 
              a.activity_type === 'course_progress' && 
              a.resource_id === courseId
            )
            .sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0];
            
          if (latestActivity) {
            // Safely extract metadata properties with proper type checking
            const metadata = latestActivity.metadata;
            const title = typeof metadata === 'object' && metadata !== null ? 
              String((metadata as Record<string, unknown>).title || 'Untitled Course') : 
              'Untitled Course';
              
            const progress = typeof metadata === 'object' && metadata !== null ? 
              Number((metadata as Record<string, unknown>).progress || 0) : 
              0;
              
            coursesProgress.push({
              courseId,
              title,
              progress
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
      .channel('schema-db-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_activities'
      }, () => {
        fetchActivities();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const refreshActivities = async () => {
    setLoading(true);
    try {
      const { data, error: activitiesError } = await supabase
        .from('user_activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (activitiesError) throw activitiesError;
      
      setActivities(data || []);
      setRecentActivities(data?.slice(0, 10) || []);
    } catch (err: any) {
      setError(err.message || 'Error refreshing activities');
    } finally {
      setLoading(false);
    }
  };

  return {
    activities,
    recentActivities,
    courseProgress,
    loading,
    error,
    refreshActivities
  };
};
