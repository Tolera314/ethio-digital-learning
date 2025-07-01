
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Award, TrendingUp, Play, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import ProfessionalNavbar from "@/components/layout/ProfessionalNavbar";
import InformationCollectionModal from "@/components/auth/InformationCollectionModal";
import { useAuth } from "@/context/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    // Check if user has completed their profile
    if (user && !user.user_metadata?.profile_completed) {
      setShowInfoModal(true);
    }
  }, [user]);

  const recentCourses = [
    { id: 1, title: "React Fundamentals", progress: 75, lastAccessed: "2 hours ago" },
    { id: 2, title: "JavaScript Essentials", progress: 45, lastAccessed: "1 day ago" },
    { id: 3, title: "CSS Mastery", progress: 90, lastAccessed: "3 days ago" },
  ];

  const upcomingSessions = [
    { id: 1, title: "React Hooks Deep Dive", date: "Today, 3:00 PM", instructor: "Dr. Smith" },
    { id: 2, title: "JavaScript Debugging", date: "Tomorrow, 10:00 AM", instructor: "Prof. Johnson" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 in progress</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Continue Learning */}
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>
                Pick up where you left off
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{course.title}</h4>
                      <Badge variant="outline">{course.progress}%</Badge>
                    </div>
                    <Progress value={course.progress} className="mb-2" />
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Last accessed: {course.lastAccessed}</span>
                      <Button size="sm" asChild>
                        <Link to={`/courses/${course.id}/learn`}>
                          <Play className="h-4 w-4 mr-1" />
                          Continue
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Live Sessions</CardTitle>
              <CardDescription>
                Don't miss these scheduled sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-1">{session.title}</h4>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      {session.date}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Instructor: {session.instructor}
                    </p>
                    <Button size="sm" className="w-full">
                      Join Session
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/live-sessions">View All Sessions</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <InformationCollectionModal 
        isOpen={showInfoModal} 
        onClose={() => setShowInfoModal(false)} 
      />
    </div>
  );
};

export default StudentDashboard;
