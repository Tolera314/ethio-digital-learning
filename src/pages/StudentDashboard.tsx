
import { Button } from "@/components/ui/button";
import { Bell, Users, Video } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserActivities } from "@/hooks/useUserActivities";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressList";
import { RecentActivitiesCard } from "@/components/dashboard/RecentActivities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logActivity, getUserActivitySummary } from "@/utils/activityLogger";
import { useNavigate } from "react-router-dom";
import { DynamicRecommendations } from "@/components/DynamicRecommendations";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    recentActivities, 
    courseProgress, 
    loading 
  } = useUserActivities();
  
  const [activitySummary, setActivitySummary] = useState({
    totalLearningTime: 0,
    enrolledCourses: 0,
    totalCertificates: 0,
    totalBooks: 0
  });

  const [upcomingSessions, setUpcomingSessions] = useState([
    {
      id: 1,
      title: "Advanced React Hooks",
      time: "14:00 - 16:00 EAT",
      participants: 76,
      status: "today",
      isLive: false
    },
    {
      id: 2,
      title: "UX Research Methods",
      time: "10:00 - 12:00 EAT",
      participants: 42,
      status: "3 days",
      isLive: false
    },
    {
      id: 3,
      title: "Intro to AI - LIVE NOW",
      time: "15:00 - 17:00 EAT",
      participants: 104,
      status: "live",
      isLive: true
    }
  ]);
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!user && !loading) {
      navigate("/auth");
      return;
    }
    
    // Log this dashboard view as an activity
    if (user) {
      setTimeout(() => {
        logActivity('login');
      }, 0);
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const loadActivitySummary = async () => {
      if (user && !loading) {
        const summary = await getUserActivitySummary();
        setActivitySummary(summary);
      }
    };
    
    loadActivitySummary();
  }, [user, loading]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Student';
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 18) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };

  const getSessionStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-red-900/50 text-red-200 animate-pulse';
      case 'today': return 'bg-orange-900/50 text-orange-200';
      default: return 'bg-purple-900/50 text-purple-200';
    }
  };

  return (
    <PageLayout 
      title={user ? getGreeting() : "Student Dashboard"}
      subtitle="Your personal learning hub"
      backgroundImage="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80"
    >
      {/* Stats cards based on user activity */}
      <DashboardStats isLoading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          {/* Course progress based on user's actual courses */}
          <CourseProgressCard courseProgress={courseProgress} isLoading={loading} />
        </div>
        
        <div>
          <Card className="bg-black/40 border border-white/10 backdrop-blur-lg h-full">
            <CardHeader>
              <CardTitle className="text-xl text-white flex justify-between items-center">
                <span>Upcoming Sessions</span>
                <Bell size={18} className="text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div 
                    key={session.id}
                    className={`p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer ${
                      session.isLive ? 'ring-2 ring-red-500/50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-white">{session.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded ${getSessionStatusColor(session.status)}`}>
                        {session.status === 'live' ? 'LIVE' : session.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{session.time}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Users size={12} /> 
                      <span>{session.participants} participants</span>
                      {session.isLive && (
                        <span className="text-red-400 font-medium">• Join Now!</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 hover:bg-white/10"
                  onClick={() => navigate('/live-sessions')}
                >
                  <Video size={16} className="mr-2" /> View All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivitiesCard 
          activities={recentActivities}
          isLoading={loading}
          limit={3}
        />
        
        <DynamicRecommendations 
          activities={recentActivities}
          activitySummary={activitySummary}
          isLoading={loading}
        />
      </div>
    </PageLayout>
  );
};

export default StudentDashboard;
