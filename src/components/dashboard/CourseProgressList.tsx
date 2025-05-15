
import { CourseProgress } from "@/hooks/useUserActivities";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseProgressListProps {
  courseProgress: CourseProgress[];
  isLoading?: boolean;
}

export function CourseProgressList({ courseProgress, isLoading = false }: CourseProgressListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex justify-between text-sm mb-1">
              <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-700 rounded w-12"></div>
            </div>
            <div className="h-2 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // If no courses, show placeholder
  if (courseProgress.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 mb-4">No courses in progress yet.</p>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
          Explore Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courseProgress.map((course) => (
        <div key={course.courseId}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">{course.title}</span>
            <span className={course.progress === 100 ? "text-green-400" : "text-gray-300"}>
              {course.progress}%
            </span>
          </div>
          <Progress 
            value={course.progress} 
            className="h-2" 
            style={{ 
              backgroundImage: course.progress === 100 
                ? 'linear-gradient(to right, #10B981, #059669)' 
                : 'linear-gradient(to right, #8B5CF6, #6366F1)' 
            }} 
          />
        </div>
      ))}

      <div className="mt-6">
        <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white w-full">
          <TrendingUp size={16} className="mr-2" /> View Detailed Progress
        </Button>
      </div>
    </div>
  );
}

export function CourseProgressCard({ courseProgress, isLoading = false }: CourseProgressListProps) {
  return (
    <Card className="bg-black/40 border border-white/10 backdrop-blur-lg h-full">
      <CardHeader>
        <CardTitle className="text-xl text-white">Course Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <CourseProgressList courseProgress={courseProgress} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}
