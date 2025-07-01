
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Award, Clock, TrendingUp, Target, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserActivitySummary } from "@/utils/activityLogger";

interface DashboardStatsProps {
  isLoading?: boolean;
}

export function DashboardStats({ isLoading = false }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    coursesInProgress: 0,
    completedCourses: 0,
    totalCertificates: 0,
    learningTime: 0,
    weeklyTime: 0,
    engagementLevel: 'low' as 'low' | 'medium' | 'high',
    totalBooks: 0,
    totalReadingSessions: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const summary = await getUserActivitySummary();
      
      setStats({
        enrolledCourses: summary.enrolledCourses,
        coursesInProgress: summary.coursesInProgress,
        completedCourses: summary.completedCourses,
        totalCertificates: summary.totalCertificates,
        learningTime: summary.totalLearningTime,
        weeklyTime: Math.round(summary.totalLearningTime * 0.15),
        engagementLevel: summary.engagementLevel,
        totalBooks: summary.totalBooks,
        totalReadingSessions: summary.totalReadingSessions
      });
    };
    
    if (!isLoading) {
      loadStats();
    }
  }, [isLoading]);

  function formatTime(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  const statsData = [
    {
      title: "Enrolled Courses",
      value: stats.enrolledCourses,
      subtitle: `${stats.coursesInProgress} in progress`,
      icon: Book,
      color: "text-purple-400",
      bgGradient: "from-purple-500/20 to-blue-500/20"
    },
    {
      title: "Learning Time",
      value: formatTime(stats.learningTime),
      subtitle: `${formatTime(stats.weeklyTime)} this week`,
      icon: Clock,
      color: "text-blue-400",
      bgGradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Certificates",
      value: stats.totalCertificates,
      subtitle: `${stats.completedCourses} courses completed`,
      icon: Award,
      color: "text-yellow-400",
      bgGradient: "from-yellow-500/20 to-orange-500/20"
    },
    {
      title: "Engagement",
      value: stats.engagementLevel.charAt(0).toUpperCase() + stats.engagementLevel.slice(1),
      subtitle: "Activity level",
      icon: TrendingUp,
      color: getEngagementColor(stats.engagementLevel),
      bgGradient: "from-green-500/20 to-teal-500/20"
    },
    {
      title: "Books Read",
      value: stats.totalBooks,
      subtitle: "Library interactions",
      icon: Target,
      color: "text-green-400",
      bgGradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      title: "Live Sessions",
      value: stats.totalReadingSessions,
      subtitle: "Joined sessions",
      icon: Users,
      color: "text-pink-400",
      bgGradient: "from-pink-500/20 to-rose-500/20"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="bg-black/40 border border-white/10 backdrop-blur-lg animate-pulse">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-20"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-700 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {statsData.map((stat, index) => (
        <Card 
          key={stat.title} 
          className={`bg-black/40 border border-white/10 backdrop-blur-lg hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in bg-gradient-to-br ${stat.bgGradient}`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
              <stat.icon className={stat.color} size={18} />
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <p className="text-xs text-gray-400">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
