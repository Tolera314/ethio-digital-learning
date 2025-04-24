
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Award, Calendar, CheckCircle2, Clock, LineChart, TrendingUp } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const courses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    progress: 75,
    modules: 12,
    modulesCompleted: 9,
    lastActivity: "2 days ago",
    timeSpent: "24h 30m",
    estimatedCompletion: "May 15, 2025"
  },
  {
    id: 2,
    title: "UX/UI Design Principles",
    progress: 45,
    modules: 8,
    modulesCompleted: 4,
    lastActivity: "Yesterday",
    timeSpent: "12h 15m",
    estimatedCompletion: "June 10, 2025"
  },
  {
    id: 3,
    title: "Introduction to Digital Marketing",
    progress: 100,
    modules: 10,
    modulesCompleted: 10,
    lastActivity: "3 weeks ago",
    timeSpent: "18h 45m",
    estimatedCompletion: "Completed"
  }
];

const achievements = [
  { 
    id: 1, 
    title: "Fast Learner", 
    description: "Completed 3 modules in one day", 
    date: "April 15, 2025", 
    icon: <TrendingUp className="text-blue-400" size={24} />
  },
  { 
    id: 2, 
    title: "Perfect Score", 
    description: "Achieved 100% in a quiz", 
    date: "April 8, 2025", 
    icon: <Award className="text-yellow-400" size={24} />
  },
  { 
    id: 3, 
    title: "Consistent Learner", 
    description: "Studied for 7 consecutive days", 
    date: "March 28, 2025", 
    icon: <Calendar className="text-green-400" size={24} />
  }
];

const CourseProgressCard = ({ course }: { course: typeof courses[0] }) => (
  <Card className="overflow-hidden bg-black/40 border border-white/10 backdrop-blur-lg shadow-lg transition-all duration-300 hover:shadow-purple-500/20">
    <CardHeader className="pb-2">
      <CardTitle className="text-xl text-gray-100 flex items-center justify-between">
        {course.title}
        {course.progress === 100 && (
          <CheckCircle2 size={20} className="text-green-500" />
        )}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">{course.progress}% complete</span>
          <span className="text-gray-300">{course.modulesCompleted}/{course.modules} modules</span>
        </div>
        <Progress 
          value={course.progress} 
          className="h-3 bg-gray-800"
          style={{ 
            background: 'rgba(30, 30, 40, 0.5)',
            backgroundImage: course.progress === 100 
              ? 'linear-gradient(to right, #10B981, #059669)' 
              : 'linear-gradient(to right, #8B5CF6, #6366F1)'
          }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-blue-400" />
          <span className="text-gray-300">Time: {course.timeSpent}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-purple-400" />
          <span className="text-gray-300">
            {course.progress === 100 ? "Completed" : `Est: ${course.estimatedCompletion}`}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" className="border-white/20 hover:bg-white/10 text-sm">
          View Details
        </Button>
        <Button 
          className={`text-white text-sm ${
            course.progress === 100
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          }`}
        >
          {course.progress === 100 ? "Review Course" : "Continue Learning"}
        </Button>
      </div>
    </CardContent>
  </Card>
);

const AchievementCard = ({ achievement }: { achievement: typeof achievements[0] }) => (
  <div className="flex items-start gap-3 p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 hover:border-purple-500/30 transition-all">
    <div className="p-3 bg-black/60 rounded-lg border border-white/5">
      {achievement.icon}
    </div>
    <div>
      <h4 className="font-medium text-white">{achievement.title}</h4>
      <p className="text-sm text-gray-400">{achievement.description}</p>
      <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
    </div>
  </div>
);

const ProgressTracking = () => {
  return (
    <PageLayout 
      title="Your Learning Progress" 
      subtitle="Track your journey and celebrate achievements"
      backgroundImage="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80"
    >
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid grid-cols-2 bg-black/30 border border-white/10 mb-8">
          <TabsTrigger value="progress" className="data-[state=active]:bg-purple-800/50">
            Course Progress
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-800/50">
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="mt-0">
          {/* Summary Card */}
          <Card className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-white/10 shadow-lg mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                  <LineChart size={28} className="mx-auto mb-2 text-green-400" />
                  <h4 className="text-xl font-semibold text-white">67%</h4>
                  <p className="text-sm text-gray-400">Average Progress</p>
                </div>
                <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                  <Clock size={28} className="mx-auto mb-2 text-blue-400" />
                  <h4 className="text-xl font-semibold text-white">55h 30m</h4>
                  <p className="text-sm text-gray-400">Total Learning Time</p>
                </div>
                <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                  <CheckCircle2 size={28} className="mx-auto mb-2 text-purple-400" />
                  <h4 className="text-xl font-semibold text-white">23/30</h4>
                  <p className="text-sm text-gray-400">Modules Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {courses.map(course => (
              <CourseProgressCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-0">
          <div className="glass-morphism p-6 rounded-xl mb-8 max-w-xl mx-auto">
            <div className="flex items-center justify-center">
              <Award size={40} className="text-yellow-400 mr-4" />
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white">3/10 Achievements Unlocked</h2>
                <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {achievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>

          <div className="mt-8 p-4 bg-black/30 border border-white/10 rounded-lg text-center">
            <p className="text-gray-300 mb-2">Keep learning to unlock more achievements!</p>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
              View All Possible Achievements
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default ProgressTracking;
