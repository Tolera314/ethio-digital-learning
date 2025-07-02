
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export type ActivityType = 
  | 'course_view'
  | 'course_progress'
  | 'course_complete'
  | 'lesson_complete'
  | 'book_view'
  | 'certificate_earned'
  | 'session_join'
  | 'login'
  | 'dashboard_visit'
  | 'page_visit'
  | 'video_upload'
  | 'material_upload'
  | 'live_session_create'
  | 'certificate_approve'
  | 'instructor_rate'
  | 'video_like'
  | 'video_comment'
  | 'video_share';

export interface ActivityMetadata {
  title?: string;
  author?: string;
  book_title?: string;
  book_id?: string;
  progress?: number;
  duration?: number;
  category?: string;
  completed?: boolean;
  page?: string;
  section?: string;
  video_id?: string;
  rating?: number;
  comment?: string;
  instructor_id?: string;
  session_id?: string;
  certificate_id?: string;
  material_type?: string;
  file_name?: string;
  tags?: string[];
  description?: string;
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
 * Get user activity summary with enhanced data
 */
export const getUserActivitySummary = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return getDefaultSummary();
    }

    // Get all user activities
    const { data: activities, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate comprehensive stats
    const totalActivities = activities?.length || 0;
    
    // Learning time calculation
    const learningActivities = activities?.filter(a => 
      a.activity_type === 'lesson_complete'
    ) || [];
    
    const totalLearningTime = learningActivities.reduce((total, activity) => {
      const metadata = activity.metadata as any;
      return total + (Number(metadata?.duration) || 15); // Default 15 minutes per lesson
    }, 0);

    // Course progress tracking
    const courseActivities = activities?.filter(a => 
      a.activity_type === 'course_progress' || a.activity_type === 'course_view'
    ) || [];
    
    const uniqueCourses = new Set(courseActivities.map(a => a.resource_id));
    const enrolledCourses = uniqueCourses.size;
    
    // Completed courses
    const completedCourses = activities?.filter(a => 
      a.activity_type === 'course_complete'
    ).length || 0;
    
    // Certificates
    const totalCertificates = activities?.filter(a => 
      a.activity_type === 'certificate_earned'
    ).length || 0;
    
    // Books interaction
    const bookActivities = activities?.filter(a => 
      a.activity_type === 'book_view'
    ) || [];
    const totalBooks = new Set(bookActivities.map(a => a.resource_id)).size;
    
    // Sessions
    const sessionActivities = activities?.filter(a => 
      a.activity_type === 'session_join'
    ) || [];
    const totalReadingSessions = sessionActivities.length;
    
    // Recent activity level (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivities = activities?.filter(a => 
      new Date(a.created_at) > sevenDaysAgo
    ).length || 0;

    return {
      totalLearningTime,
      coursesInProgress: enrolledCourses - completedCourses,
      completedCourses,
      totalCertificates,
      enrolledCourses,
      totalBooks,
      totalReadingSessions,
      totalActivities,
      recentActivities,
      engagementLevel: calculateEngagementLevel(recentActivities, totalActivities)
    };
  } catch (error) {
    console.error('Error getting activity summary:', error);
    return getDefaultSummary();
  }
};

/**
 * Calculate user engagement level
 */
const calculateEngagementLevel = (recentActivities: number, totalActivities: number): 'low' | 'medium' | 'high' => {
  if (totalActivities === 0) return 'low';
  
  const engagementRatio = recentActivities / Math.max(totalActivities, 1);
  
  if (engagementRatio > 0.3) return 'high';
  if (engagementRatio > 0.1) return 'medium';
  return 'low';
};

/**
 * Default summary for new users or error cases
 */
const getDefaultSummary = () => ({
  totalLearningTime: 0,
  coursesInProgress: 0,
  completedCourses: 0,
  totalCertificates: 0,
  enrolledCourses: 0,
  totalBooks: 0,
  totalReadingSessions: 0,
  totalActivities: 0,
  recentActivities: 0,
  engagementLevel: 'low' as const
});

/**
 * Log dashboard visit for analytics
 */
export const logDashboardVisit = async () => {
  await logActivity('dashboard_visit', undefined, 'dashboard', {
    page: 'student_dashboard',
    section: 'main'
  });
};

/**
 * Log page visit for analytics
 */
export const logPageVisit = async (pageName: string, section?: string) => {
  await logActivity('page_visit', undefined, 'page', {
    page: pageName,
    section: section || 'main'
  });
};
