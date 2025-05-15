
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Book, Award, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserActivitySummary } from "@/utils/activityLogger";

interface DashboardStatsProps {
  isLoading?: boolean;
}

export function DashboardStats({ isLoading = false }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    coursesInProgress: 0,
    certificates: 0,
    learningTime: 0,
    weeklyTime: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const summary = await getUserActivitySummary();
      
      setStats({
        enrolledCourses: summary.enrolledCourses,
        coursesInProgress: summary.coursesInProgress,
        certificates: summary.totalCertificates,
        learningTime: summary.totalLearningTime,
        // Estimate weekly time as 10-20% of total time
        weeklyTime: Math.round(summary.totalLearningTime * 0.15)
      });
    };
    
    if (!isLoading) {
      loadStats();
    }
  }, [isLoading]);

  function formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-black/40 border border-white/10 backdrop-blur-lg hover:shadow-purple-500/20 transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-gray-400 flex items-center gap-2">
            <Book className="text-purple-400" size={18} /> Enrolled Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{stats.enrolledCourses}</div>
          <p className="text-sm text-gray-300">{stats.coursesInProgress} in progress</p>
        </CardContent>
      </Card>
      
      <Card className="bg-black/40 border border-white/10 backdrop-blur-lg hover:shadow-purple-500/20 transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-gray-400 flex items-center gap-2">
            <Award className="text-yellow-400" size={18} /> Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{stats.certificates}</div>
          <p className="text-sm text-gray-300">Keep going!</p>
        </CardContent>
      </Card>
      
      <Card className="bg-black/40 border border-white/10 backdrop-blur-lg hover:shadow-purple-500/20 transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-gray-400 flex items-center gap-2">
            <Clock className="text-blue-400" size={18} /> Learning Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{formatTime(stats.learningTime)}</div>
          <p className="text-sm text-gray-300">{formatTime(stats.weeklyTime)} this week</p>
        </CardContent>
      </Card>
    </div>
  );
}
