
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export type ActivityType = 
  | 'course_view'
  | 'course_progress'
  | 'lesson_complete'
  | 'book_view'
  | 'certificate_earned'
  | 'session_join'
  | 'login';

export interface ActivityMetadata {
  title?: string;
  progress?: number;
  duration?: number;
  category?: string;
  [key: string]: any;
}

/**
 * Logs a user activity to the database
 */
export const logActivity = async (
  activityType: ActivityType,
  resourceId?: string,
  resourceType?: string,
  metadata: ActivityMetadata = {}
) => {
  try {
    const { error } = await supabase.from('user_activities').insert({
      activity_type: activityType,
      resource_id: resourceId,
      resource_type: resourceType,
      metadata
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
    // Get total learning time
    const { data: timeData, error: timeError } = await supabase
      .from('user_activities')
      .select('metadata')
      .eq('activity_type', 'lesson_complete');
    
    if (timeError) throw timeError;
    
    // Calculate total learning time in minutes
    const totalMinutes = timeData?.reduce((total, activity) => {
      return total + (activity.metadata?.duration || 0);
    }, 0) || 0;
    
    // Get total courses in progress
    const { data: courseData, error: courseError } = await supabase
      .from('user_activities')
      .select('resource_id')
      .eq('activity_type', 'course_progress')
      .is('metadata->>completed', null);
    
    if (courseError) throw courseError;
    
    const coursesInProgress = new Set(courseData?.map(c => c.resource_id)).size;
    
    // Get completed courses
    const { data: completedData, error: completedError } = await supabase
      .from('user_activities')
      .select('resource_id')
      .eq('activity_type', 'course_progress')
      .eq('metadata->>completed', true);
    
    if (completedError) throw completedError;
    
    const completedCourses = new Set(completedData?.map(c => c.resource_id)).size;
    
    // Get total certificates
    const { data: certData, error: certError } = await supabase
      .from('user_activities')
      .select('resource_id')
      .eq('activity_type', 'certificate_earned');
    
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
