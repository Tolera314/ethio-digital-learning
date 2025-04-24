
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, Users, Clock, Star, Award } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const courses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Learn HTML, CSS, and JavaScript basics to build responsive websites.",
    category: "beginner",
    duration: "8 weeks",
    students: 857,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "React.js Advanced Concepts",
    description: "Master React hooks, context API, and performance optimization techniques.",
    category: "advanced",
    duration: "10 weeks",
    students: 642,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Full Stack Development with MERN",
    description: "Build complete web applications with MongoDB, Express, React, and Node.js.",
    category: "intermediate",
    duration: "12 weeks",
    students: 724,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1534665482403-a909d0d97c67?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "UX/UI Design Principles",
    description: "Learn modern design techniques and create beautiful, user-friendly interfaces.",
    category: "beginner",
    duration: "6 weeks",
    students: 516,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Mobile App Development",
    description: "Create native apps for iOS and Android using React Native.",
    category: "intermediate",
    duration: "10 weeks",
    students: 589,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "AI and Machine Learning",
    description: "Dive into artificial intelligence and machine learning concepts and applications.",
    category: "advanced",
    duration: "14 weeks",
    students: 412,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&q=80"
  },
];

const CourseCard = ({ course }: { course: typeof courses[0] }) => (
  <Card className="overflow-hidden bg-black/40 border border-white/10 backdrop-blur-md shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1">
    <div className="h-36 sm:h-48 overflow-hidden">
      <img src={course.image} alt={course.title} className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110" />
    </div>
    <CardHeader>
      <div className="flex flex-wrap gap-2 justify-between items-center mb-2">
        <Badge variant="outline" className="bg-purple-900/50 text-purple-200 border-purple-400/30">
          {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
        </Badge>
        <div className="flex items-center gap-1 text-yellow-400">
          <Star size={16} fill="currentColor" />
          <span className="text-sm">{course.rating}</span>
        </div>
      </div>
      <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-100">{course.title}</CardTitle>
      <CardDescription className="text-sm sm:text-base text-gray-300">{course.description}</CardDescription>
    </CardHeader>
    <CardContent className="text-xs sm:text-sm text-gray-400">
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <Clock size={14} sm:size={16} className="text-blue-400" />
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={14} sm:size={16} className="text-green-400" />
          <span>{course.students.toLocaleString()} students</span>
        </div>
      </div>
    </CardContent>
    <CardFooter className="border-t border-white/5 pt-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
      <Button variant="outline" className="w-full sm:w-auto border-purple-500/50 text-purple-200 hover:bg-purple-900/30">
        Preview
      </Button>
      <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
        Enroll Now
      </Button>
    </CardFooter>
  </Card>
);

const Courses = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredCourses = activeTab === "all" 
    ? courses 
    : courses.filter(course => course.category === activeTab);

  return (
    <PageLayout 
      title="Our Courses" 
      subtitle="Unlock your potential with our interactive online courses"
      backgroundImage="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80"
    >
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-black/30 border border-white/10 w-full flex flex-wrap justify-center">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-800/50 flex-1">All Courses</TabsTrigger>
              <TabsTrigger value="beginner" className="data-[state=active]:bg-purple-800/50 flex-1">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate" className="data-[state=active]:bg-purple-800/50 flex-1">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-purple-800/50 flex-1">Advanced</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Courses;
