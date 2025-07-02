
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Calendar, ExternalLink } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import InformationCollectionModal from "@/components/auth/InformationCollectionModal";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentActivitiesCard } from "@/components/dashboard/RecentActivities";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressList";
import { CertificateActions } from "@/components/student/CertificateActions";
import { DynamicRecommendations } from "@/components/DynamicRecommendations";
import { useAuth } from "@/context/AuthContext";
import { useUserActivities } from "@/hooks/useUserActivities";
import { getUserActivitySummary, logDashboardVisit } from "@/utils/activityLogger";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [activitySummary, setActivitySummary] = useState(null);
  const { 
    activities, 
    recentActivities, 
    courseProgress, 
    loading: activitiesLoading 
  } = useUserActivities();

  // Mock certificates data - replace with actual data from Supabase
  const [certificates] = useState([
    {
      id: '1',
      title: 'Web Development Fundamentals',
      date: '2025-01-15',
      instructor: 'Dr. Abebe Bekele',
      status: 'approved' as const,
      paymentCompleted: true
    },
    {
      id: '2',
      title: 'UX/UI Design Principles',
      date: '2025-01-10',
      instructor: 'Sara Tadesse',
      status: 'pending' as const,
      paymentCompleted: false
    }
  ]);

  useEffect(() => {
    if (user && !user.user_metadata?.profile_completed) {
      setShowInfoModal(true);
    }
  }, [user]);

  useEffect(() => {
    const loadActivitySummary = async () => {
      const summary = await getUserActivitySummary();
      setActivitySummary(summary);
      await logDashboardVisit();
    };
    
    if (user) {
      loadActivitySummary();
    }
  }, [user]);

  const upcomingSessions = [
    { 
      id: 1, 
      title: "React Hooks Deep Dive", 
      date: "Today, 3:00 PM", 
      instructor: "Dr. Smith",
      link: "/live-sessions"
    },
    { 
      id: 2, 
      title: "JavaScript Debugging", 
      date: "Tomorrow, 10:00 AM", 
      instructor: "Prof. Johnson",
      link: "/live-sessions"
    },
  ];

  return (
    <DashboardLayout
      title={`Welcome Back, ${user?.user_metadata?.full_name?.split(' ')[0] || 'Student'}!`}
      subtitle="Continue your learning journey and track your progress"
    >
      {/* Stats Cards */}
      <DashboardStats isLoading={activitiesLoading} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Course Progress & Activities */}
        <div className="xl:col-span-2 space-y-8">
          {/* Course Progress */}
          <div className="animate-fade-in delay-200">
            <CourseProgressCard 
              courseProgress={courseProgress} 
              isLoading={activitiesLoading} 
            />
          </div>

          {/* Certificates Section */}
          <div className="animate-fade-in delay-250">
            <CertificateActions certificates={certificates} />
          </div>

          {/* Upcoming Sessions */}
          <Card className="glass-morphism animate-fade-in delay-300">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Calendar className="text-blue-400" size={20} />
                Upcoming Live Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="p-4 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all"
                  >
                    <h4 className="font-medium text-white mb-2">{session.title}</h4>
                    <div className="flex items-center text-sm text-gray-300 mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                      {session.date}
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      Instructor: {session.instructor}
                    </p>
                    <Link to={session.link}>
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 btn-hover"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Join Session
                      </Button>
                    </Link>
                  </div>
                ))}
                <Link to="/live-sessions">
                  <Button 
                    variant="outline" 
                    className="w-full border-white/20 text-white hover:bg-white/10 btn-hover"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View All Sessions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activities & Recommendations */}
        <div className="space-y-8">
          {/* Recent Activities */}
          <div className="animate-fade-in delay-400">
            <RecentActivitiesCard 
              activities={recentActivities} 
              isLoading={activitiesLoading} 
            />
          </div>

          {/* Smart Recommendations */}
          <div className="animate-fade-in delay-500">
            <DynamicRecommendations 
              activities={activities}
              activitySummary={activitySummary}
              isLoading={activitiesLoading}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-12 animate-fade-in delay-600">
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="responsive-grid">
              <Link to="/courses">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 btn-hover">
                  Browse Courses
                </Button>
              </Link>
              <Link to="/library">
                <Button className="w-full bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 btn-hover">
                  Visit Library
                </Button>
              </Link>
              <Link to="/certificates">
                <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-yellow-700 hover:to-orange-600 btn-hover">
                  My Certificates
                </Button>
              </Link>
              <Link to="/progress">
                <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-700 hover:to-purple-600 btn-hover">
                  Track Progress
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <InformationCollectionModal 
        isOpen={showInfoModal} 
        onClose={() => setShowInfoModal(false)} 
      />
    </DashboardLayout>
  );
};

export default StudentDashboard;
