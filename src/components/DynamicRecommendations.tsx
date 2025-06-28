
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Star, Users, BookOpen, Video, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { UserActivity } from "@/hooks/useUserActivities";

interface DynamicRecommendationsProps {
  activities: UserActivity[];
  activitySummary: any;
  isLoading?: boolean;
}

export function DynamicRecommendations({ 
  activities, 
  activitySummary, 
  isLoading = false 
}: DynamicRecommendationsProps) {
  
  const generateSmartRecommendations = () => {
    const recommendations = [];
    
    // Analyze user behavior patterns
    const recentCourseViews = activities.filter(a => 
      a.activity_type === 'course_view' && 
      isRecentActivity(a.created_at)
    ).length;
    
    const recentBookViews = activities.filter(a => 
      a.activity_type === 'book_view' && 
      isRecentActivity(a.created_at)
    ).length;
    
    const hasSessionActivity = activities.some(a => a.activity_type === 'session_join');
    
    // Recommendation logic based on activity patterns
    if (recentCourseViews > 2 && activitySummary.enrolledCourses === 0) {
      recommendations.push({
        type: 'course_enrollment',
        title: 'Ready to Enroll?',
        description: "You've been exploring courses. Take the next step!",
        action: 'Enroll in Course',
        link: '/courses',
        priority: 'high',
        icon: <BookOpen className="text-blue-400" size={20} />
      });
    }
    
    if (recentBookViews > 1 && !hasSessionActivity) {
      recommendations.push({
        type: 'reading_session',
        title: 'Join Reading Groups',
        description: 'Connect with other readers in live sessions',
        action: 'Find Sessions',
        link: '/library',
        priority: 'medium',
        icon: <Users className="text-purple-400" size={20} />
      });
    }
    
    if (activitySummary.enrolledCourses > 0 && activitySummary.totalCertificates === 0) {
      recommendations.push({
        type: 'complete_course',
        title: 'Earn Your First Certificate',
        description: 'Complete your course to get certified',
        action: 'Continue Learning',
        link: '/dashboard',
        priority: 'high',
        icon: <Award className="text-yellow-400" size={20} />
      });
    }
    
    if (activities.length > 5 && !hasSessionActivity) {
      recommendations.push({
        type: 'live_session',
        title: 'Try Live Sessions',
        description: 'Learn with instructors and peers in real-time',
        action: 'Join Session',
        link: '/live-sessions',
        priority: 'medium',
        icon: <Video className="text-green-400" size={20} />
      });
    }
    
    // Default recommendations if no specific patterns
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'explore',
        title: 'Explore New Courses',
        description: 'Discover courses tailored to your interests',
        action: 'Browse Courses',
        link: '/courses',
        priority: 'low',
        icon: <TrendingUp className="text-gray-400" size={20} />
      });
    }
    
    return recommendations.slice(0, 3);
  };
  
  const isRecentActivity = (dateString: string) => {
    const activityDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - activityDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };
  
  const getMotivationalMessage = () => {
    const totalActivities = activities.length;
    const learningTime = activitySummary.totalLearningTime;
    
    if (totalActivities === 0) {
      return "Welcome! Start your learning journey today.";
    } else if (totalActivities < 5) {
      return "Great start! Keep exploring and learning.";
    } else if (learningTime > 60) {
      return "You're making excellent progress! Keep it up!";
    } else {
      return "You're on the right track! Every step counts.";
    }
  };
  
  if (isLoading) {
    return (
      <Card className="bg-black/40 border border-white/10 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white">Smart Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const recommendations = generateSmartRecommendations();
  
  return (
    <Card className="bg-black/40 border border-white/10 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <Star className="text-yellow-400" size={20} />
          Smart Recommendations
        </CardTitle>
        <p className="text-sm text-gray-400">{getMotivationalMessage()}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div 
              key={index} 
              className={`p-4 bg-black/30 rounded-lg border transition-all hover:scale-105 cursor-pointer ${
                rec.priority === 'high' ? 'border-yellow-500/50 bg-gradient-to-r from-yellow-900/20 to-orange-900/20' :
                rec.priority === 'medium' ? 'border-purple-500/50 bg-gradient-to-r from-purple-900/20 to-blue-900/20' :
                'border-white/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-black/40 rounded-lg">
                  {rec.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-white">{rec.title}</h4>
                    {rec.priority === 'high' && (
                      <Badge className="bg-yellow-600 text-yellow-100 text-xs">Priority</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{rec.description}</p>
                  <Link to={rec.link}>
                    <Button 
                      size="sm" 
                      className={
                        rec.priority === 'high' 
                          ? "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                          : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                      }
                    >
                      {rec.action}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
