
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, BookOpen, Video, Download, Share, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { downloadCourseMaterials, shareCourse } from "@/utils/courseActions";
import { featuredCourses } from "@/utils/courseActions";

const lessons = [
  { id: 1, title: "Introduction to the Course", type: "video", length: "10:23", completed: true },
  { id: 2, title: "Setting Up Your Environment", type: "video", length: "15:45", completed: true },
  { id: 3, title: "Core Concepts - Part 1", type: "video", length: "18:30", completed: true },
  { id: 4, title: "Core Concepts - Part 2", type: "video", length: "21:15", completed: true },
  { id: 5, title: "Building Your First Component", type: "practice", length: "Assignment", completed: false },
  { id: 6, title: "Advanced Techniques", type: "video", length: "25:10", completed: false },
  { id: 7, title: "Real-world Examples", type: "video", length: "22:40", completed: false },
  { id: 8, title: "Course Project", type: "practice", length: "Assignment", completed: false },
  { id: 9, title: "Best Practices and Tips", type: "video", length: "17:55", completed: false },
  { id: 10, title: "Final Assessment", type: "quiz", length: "20 Questions", completed: false }
];

const CourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentLessonId, setCurrentLessonId] = useState(5);
  
  // Get course data
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      // In a real app, fetch from API/supabase
      // For now using our mock data
      const id = parseInt(courseId || "0");
      const foundCourse = featuredCourses.find(c => c.id === id);
      
      if (!foundCourse) {
        throw new Error("Course not found");
      }
      
      return foundCourse;
    },
  });
  
  // Get current lesson
  const currentLesson = lessons.find(l => l.id === currentLessonId) || lessons[0];
  
  // Calculate course progress
  const completedCount = lessons.filter(lesson => lesson.completed).length;
  const progressPercentage = Math.round((completedCount / lessons.length) * 100);
  
  const handlePreviousLesson = () => {
    const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
    if (currentIndex > 0) {
      setCurrentLessonId(lessons[currentIndex - 1].id);
    }
  };
  
  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
    if (currentIndex < lessons.length - 1) {
      setCurrentLessonId(lessons[currentIndex + 1].id);
    }
  };
  
  const handleLessonClick = (lessonId: number) => {
    setCurrentLessonId(lessonId);
  };
  
  const handleDownload = () => {
    if (course) {
      downloadCourseMaterials(course.id, `${currentLesson.title} - Materials`);
    }
  };
  
  const handleShare = () => {
    if (course) {
      shareCourse(course.id, course.title);
    }
  };
  
  const handleBackToCourse = () => {
    navigate(`/courses/${courseId}`);
  };

  if (courseLoading || !course) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Top navigation */}
      <div className="border-b border-white/10 backdrop-blur-md bg-black/50 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Button 
            variant="ghost" 
            className="text-gray-300 hover:text-white hover:bg-white/10"
            onClick={handleBackToCourse}
          >
            <ChevronLeft size={18} className="mr-2" />
            Back to Course
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-300">
              <span className="font-medium">{progressPercentage}%</span> complete
            </div>
            <Progress value={progressPercentage} className="w-32 h-2 bg-white/10" />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-white/10 hover:bg-white/5"
              onClick={handleDownload}
            >
              <Download size={16} className="mr-1" /> Materials
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-white/10 hover:bg-white/5"
              onClick={handleShare}
            >
              <Share size={16} className="mr-1" /> Share
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-57px)]">
        {/* Sidebar - Lessons list */}
        <div className="lg:w-72 bg-black/70 border-r border-white/10 flex-shrink-0 overflow-auto">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold text-lg">{course.title}</h2>
            <p className="text-gray-400 text-sm mt-1">{lessons.length} lessons</p>
          </div>
          
          <div className="divide-y divide-white/5">
            {lessons.map(lesson => (
              <button
                key={lesson.id}
                className={`w-full text-left p-4 flex items-start gap-3 hover:bg-white/5 transition-colors ${
                  currentLessonId === lesson.id ? 'bg-white/10' : ''
                }`}
                onClick={() => handleLessonClick(lesson.id)}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {lesson.completed ? (
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle size={14} className="text-green-400" />
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-full border border-white/20 flex items-center justify-center text-xs">
                      {lesson.id}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium">{lesson.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {lesson.type === 'video' && <Video size={12} className="text-gray-400" />}
                    {lesson.type === 'practice' && <BookOpen size={12} className="text-gray-400" />}
                    {lesson.type === 'quiz' && <CheckCircle size={12} className="text-gray-400" />}
                    <span className="text-xs text-gray-400">{lesson.length}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-grow p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
              <div className="flex items-center gap-3">
                {currentLesson.type === 'video' && <Video size={16} className="text-gray-400" />}
                {currentLesson.type === 'practice' && <BookOpen size={16} className="text-gray-400" />}
                {currentLesson.type === 'quiz' && <CheckCircle size={16} className="text-gray-400" />}
                <span className="text-sm text-gray-400">{currentLesson.length}</span>
              </div>
            </div>
            
            {/* Video player placeholder */}
            <Card className="bg-black/40 border border-white/10 shadow-lg mb-8">
              <div className="aspect-video bg-black/80 flex items-center justify-center">
                {currentLesson.type === 'video' ? (
                  <div className="text-center">
                    <Video size={48} className="mx-auto mb-2 text-gray-500" />
                    <p className="text-gray-400">Video player would appear here</p>
                  </div>
                ) : currentLesson.type === 'practice' ? (
                  <div className="text-center">
                    <BookOpen size={48} className="mx-auto mb-2 text-gray-500" />
                    <p className="text-gray-400">Assignment instructions would appear here</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <CheckCircle size={48} className="mx-auto mb-2 text-gray-500" />
                    <p className="text-gray-400">Quiz questions would appear here</p>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-3">Lesson Content</h2>
                <p className="text-gray-300 mb-4">
                  This is where the lesson content would appear. In a real implementation, 
                  this would contain text explanations, code examples, and other learning materials 
                  related to the "{currentLesson.title}" lesson.
                </p>
                <p className="text-gray-300">
                  Additional resources, references, and learning materials would also be available 
                  here to supplement the video content and help students master the concepts.
                </p>
              </CardContent>
            </Card>
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                className="border-white/10 hover:bg-white/5"
                disabled={currentLessonId === lessons[0].id}
                onClick={handlePreviousLesson}
              >
                <ChevronLeft size={16} className="mr-1" /> Previous Lesson
              </Button>
              <Button
                variant="outline"
                className="border-white/10 hover:bg-white/5"
                disabled={currentLessonId === lessons[lessons.length - 1].id}
                onClick={handleNextLesson}
              >
                Next Lesson <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;
