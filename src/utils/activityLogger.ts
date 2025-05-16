
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Json } from "@/integrations/supabase/types";

export type ActivityType = 
  | 'course_view'
  | 'course_progress'
  | 'lesson_complete'
  | 'book_view'
  | 'certificate_earned'
  | 'session_join'
  | 'login';

// Simplify ActivityMetadata to avoid circular references
export interface ActivityMetadata {
  title?: string;
  progress?: number;
  duration?: number;
  category?: string;
  completed?: boolean;
}

/**
 * Logs a user activity to the database
 */
export const logActivity = async (
  activityType: ActivityType,
  resourceId?: string,
  resourceType?: string,
  metadata: Record<string, unknown> = {}
) => {
  try {
    // Get the current user ID from auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error('No authenticated user found when logging activity');
      return;
    }

    const { error } = await supabase.from('user_activities').insert({
      user_id: session.user.id,
      activity_type: activityType,
      resource_id: resourceId,
      resource_type: resourceType,
      metadata: metadata as Json
    });

    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

/**
 * Get user activity summary
 */
export const getUserActivitySummary = async () => {
  try {
    // Get current user ID
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error('No authenticated user found when getting activity summary');
      return {
        totalLearningTime: 0,
        coursesInProgress: 0,
        completedCourses: 0,
        totalCertificates: 0,
        enrolledCourses: 0
      };
    }

    // Get total learning time
    const { data: timeData, error: timeError } = await supabase
      .from('user_activities')
      .select('metadata')
      .eq('activity_type', 'lesson_complete')
      .eq('user_id', session.user.id);
    
    if (timeError) throw timeError;
    
    // Calculate total learning time in minutes
    const totalMinutes = timeData?.reduce((total, activity) => {
      // Safe access to metadata properties by using simple type assertion
      const metadata = activity.metadata as any;
      return total + (Number(metadata?.duration) || 0);
    }, 0) || 0;
    
    // Get total courses in progress
    const { data: courseData, error: courseError } = await supabase
      .from('user_activities')
      .select('resource_id')
      .eq('activity_type', 'course_progress')
      .eq('user_id', session.user.id);
    
    if (courseError) throw courseError;
    
    const coursesInProgress = new Set(courseData?.map(c => c.resource_id)).size;
    
    // Get completed courses - use is for null checking instead of eq for boolean
    const { data: completedData, error: completedError } = await supabase
      .from('user_activities')
      .select('resource_id')
      .eq('activity_type', 'course_progress')
      .eq('user_id', session.user.id)
      .not('metadata->completed', 'is', null);
    
    if (completedError) throw completedError;
    
    const completedCourses = new Set(completedData?.map(c => c.resource_id)).size;
    
    // Get total certificates
    const { data: certData, error: certError } = await supabase
      .from('user_activities')
      .select('resource_id')
      .eq('activity_type', 'certificate_earned')
      .eq('user_id', session.user.id);
    
    if (certError) throw certError;
    
    const totalCertificates = new Set(certData?.map(c => c.resource_id)).size;
    
    return {
      totalLearningTime: totalMinutes,
      coursesInProgress,
      completedCourses,
      totalCertificates,
      enrolledCourses: coursesInProgress + completedCourses
    };
  } catch (error) {
    console.error('Error getting activity summary:', error);
    return {
      totalLearningTime: 0,
      coursesInProgress: 0,
      completedCourses: 0,
      totalCertificates: 0,
      enrolledCourses: 0
    };
  }
};
