
import { formatDistanceToNow } from 'date-fns';
import { Award, BookOpen, Clock, Video, TrendingUp } from 'lucide-react';
import { UserActivity } from '@/hooks/useUserActivities';
import { Json } from '@/integrations/supabase/types';

const getActivityIcon = (activityType: string) => {
  switch (activityType) {
    case 'course_view':
    case 'course_progress':
      return <BookOpen className="text-blue-400" size={20} />;
    case 'lesson_complete':
      return <Clock className="text-green-400" size={20} />;
    case 'certificate_earned':
      return <Award className="text-yellow-400" size={20} />;
    case 'session_join':
      return <Video className="text-purple-400" size={20} />;
    default:
      return <TrendingUp className="text-gray-400" size={20} />;
  }
};

const getActivityTitle = (activity: UserActivity) => {
  // Safely access metadata properties
  const metadata = activity.metadata as any;
  
  switch (activity.activity_type) {
    case 'course_view':
      return `Viewed ${metadata?.title || 'a course'}`;
    case 'course_progress':
      return `Made progress in ${metadata?.title || 'a course'}`;
    case 'lesson_complete':
      return `Completed ${metadata?.title || 'a lesson'}`;
    case 'certificate_earned':
      return `Earned ${metadata?.title || 'a certificate'}`;
    case 'session_join':
      return `Joined ${metadata?.title || 'a live session'}`;
    case 'login':
      return 'Logged in';
    default:
      return 'Performed an activity';
  }
};

const getActivityDescription = (activity: UserActivity) => {
  // Safely access metadata properties
  const metadata = activity.metadata as any;
  
  switch (activity.activity_type) {
    case 'course_progress':
      return metadata?.progress !== undefined 
        ? `${Math.round(metadata.progress)}% complete` 
        : '';
    case 'lesson_complete':
      return metadata?.duration !== undefined 
        ? `${metadata.duration} minutes` 
        : '';
    case 'certificate_earned':
      return `In ${metadata?.category || 'technology'}`;
    default:
      return '';
  }
};

interface ActivityItemProps {
  activity: UserActivity;
}

const ActivityItem = ({ activity }: ActivityItemProps) => {
  const timeAgo = formatDistanceToNow(new Date(activity.created_at), { addSuffix: true });
  const activityIcon = getActivityIcon(activity.activity_type);
  const title = getActivityTitle(activity);
  const description = getActivityDescription(activity);

  return (
    <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all">
      <div className="p-2.5 bg-black/30 rounded-lg border border-white/10">
        {activityIcon}
      </div>
      <div>
        <h4 className="font-medium text-white">{title}</h4>
        {description && <p className="text-sm text-gray-400">{description}</p>}
      </div>
      <div className="ml-auto text-xs text-gray-500">
        {timeAgo}
      </div>
    </div>
  );
};

export default ActivityItem;
