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
import { logActivity } from "@/utils/activityLogger";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    recentActivities, 
    courseProgress, 
    loading 
  } = useUserActivities();
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!user && !loading) {
      navigate("/auth");
      return;
    }
    
    // Log this dashboard view as an activity
    if (user) {
      // Use setTimeout to prevent potential auth deadlock
      setTimeout(() => {
        logActivity('login');
      }, 0);
    }
  }, [user, loading, navigate]);

  return (
    <PageLayout 
      title="Student Dashboard" 
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
                <div className="p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-white">Advanced React Hooks</h4>
                    <span className="text-xs bg-red-900/50 text-red-200 px-2 py-0.5 rounded">Today</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">14:00 - 16:00 EAT</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Users size={12} /> <span>76 participants</span>
                  </div>
                </div>

                <div className="p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-white">UX Research Methods</h4>
                    <span className="text-xs bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded">3 days</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">10:00 - 12:00 EAT</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Users size={12} /> <span>42 participants</span>
                  </div>
                </div>

                <div className="p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-white">Intro to AI</h4>
                    <span className="text-xs bg-blue-900/50 text-blue-200 px-2 py-0.5 rounded">Next week</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">15:00 - 17:00 EAT</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Users size={12} /> <span>104 participants</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
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
        
        <Card className="bg-black/40 border border-white/10 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-xl text-white">Recommended For You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" 
                  alt="AI and Machine Learning" 
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium text-white">AI and Machine Learning</h4>
                  <p className="text-sm text-gray-400">Advance your tech skills</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded">Advanced</div>
                    <span className="text-xs text-gray-500">14 weeks</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80" 
                  alt="Data Science Fundamentals" 
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium text-white">Data Science Fundamentals</h4>
                  <p className="text-sm text-gray-400">Learn Python and data analysis</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs bg-blue-900/50 text-blue-200 px-2 py-0.5 rounded">Beginner</div>
                    <span className="text-xs text-gray-500">10 weeks</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80" 
                  alt="DevOps Engineering" 
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium text-white">DevOps Engineering</h4>
                  <p className="text-sm text-gray-400">Master CI/CD pipelines</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs bg-green-900/50 text-green-200 px-2 py-0.5 rounded">Intermediate</div>
                    <span className="text-xs text-gray-500">12 weeks</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
                Explore More Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default StudentDashboard;
