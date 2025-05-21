
import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Star, Users, Clock, ChevronRight, BookOpen, TrendingUp, Award, CheckCircle, SearchIcon, Download, Share, Eye, Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageLayout from "@/components/PageLayout";
import CallToAction from "@/components/CallToAction";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { 
  enrollInCourse, 
  filterByPopularity, 
  viewLearningPath, 
  continueLearning,
  viewCourseDetails,
  reviewCourse,
  downloadCourseMaterials,
  shareCourse,
  browseAllCourses,
  remindAboutCourse,
  openReviewDialog,
  Course
} from "@/utils/courseActions";

const categories = [
  "All Courses",
  "Web Development",
  "Data Science",
  "UI/UX Design",
  "Mobile Development",
  "Digital Marketing",
  "Cloud Computing"
];

const featuredCourses = [
  {
    id: 1,
    title: "Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript and React to become a full-stack web developer",
    duration: "12 weeks",
    level: "Beginner to Intermediate",
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=600&q=80",
    price: "19,999 ETB",
    rating: 4.8,
    students: 1245
  },
  {
    id: 2,
    title: "UI/UX Design Masterclass",
    description: "Master user experience design and create beautiful interfaces that users love",
    duration: "8 weeks",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80",
    price: "15,999 ETB",
    rating: 4.9,
    students: 987
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    description: "Learn Python, data analysis, visualization and machine learning basics",
    duration: "10 weeks",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    price: "17,999 ETB",
    rating: 4.7,
    students: 823
  },
  {
    id: 4,
    title: "Mobile App Development with Flutter",
    description: "Build cross-platform mobile apps for Android and iOS with Flutter",
    duration: "10 weeks",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=600&q=80",
    price: "18,999 ETB",
    rating: 4.6,
    students: 756
  },
  {
    id: 5,
    title: "Digital Marketing Strategy",
    description: "Learn digital marketing fundamentals, social media, SEO and content marketing",
    duration: "6 weeks",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1533750516659-7d29bda71f97?auto=format&fit=crop&w=600&q=80",
    price: "12,999 ETB",
    rating: 4.5,
    students: 689
  },
  {
    id: 6,
    title: "Cloud Computing with AWS",
    description: "Master AWS services and deploy scalable cloud applications",
    duration: "8 weeks",
    level: "Intermediate to Advanced",
    image: "https://images.unsplash.com/photo-1560732488-7b5f5a03e6b3?auto=format&fit=crop&w=600&q=80",
    price: "21,999 ETB",
    rating: 4.8,
    students: 542
  }
];

// Animation helper function for scroll reveal
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.add('opacity-100');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}

const Courses = () => {
  useScrollReveal();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All Courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterPopular, setShowFilterPopular] = useState(false);
  
  // Get the learning path from URL if any
  const queryParams = new URLSearchParams(location.search);
  const pathFromUrl = queryParams.get('path');
  
  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses", selectedCategory, searchQuery, showFilterPopular],
    queryFn: async () => {
      // You would implement real filtering logic here with supabase
      // This is a mock implementation using the featuredCourses array
      let filteredCourses = [...featuredCourses];
      
      if (selectedCategory !== "All Courses") {
        // Mock implementation - in real app would filter from database
      }
      
      if (searchQuery) {
        filteredCourses = filteredCourses.filter(course => 
          course.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (showFilterPopular) {
        filteredCourses = filterByPopularity(filteredCourses);
      }
      
      return filteredCourses;
    },
  });

  // Track enrolled courses state for UI purposes
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  
  const handleEnroll = async (courseId: number) => {
    const success = await enrollInCourse(courseId, user?.id);
    if (success) {
      setEnrolledCourses(prev => [...prev, courseId]);
    }
  };
  
  const handleViewPath = (pathTitle: string) => {
    viewLearningPath(pathTitle, navigate);
  };
  
  const handleContinueLearning = (courseId: number) => {
    continueLearning(courseId, navigate);
  };
  
  const handleViewDetails = (courseId: number) => {
    viewCourseDetails(courseId, navigate);
  };
  
  const handleDownload = (courseId: number, title: string) => {
    downloadCourseMaterials(courseId, `${title} - Materials`);
  };
  
  const handleShare = (courseId: number, title: string) => {
    shareCourse(courseId, title);
  };

  const handleRemind = (courseId: number, title: string) => {
    remindAboutCourse(courseId, title, user?.id);
  };
  
  const handleReviewCourse = (courseId: number, title: string) => {
    openReviewDialog(courseId, title, user?.id);
  };
  
  const handleToggleFilterPopular = () => {
    setShowFilterPopular(prev => !prev);
  };
  
  const handleBrowseAllCourses = () => {
    browseAllCourses(navigate);
  };

  return (
    <PageLayout
      title="Explore Our Courses"
      subtitle="Discover courses designed to elevate your skills and advance your career"
      backgroundImage="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80"
    >
      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto w-full mb-10 reveal-on-scroll">
        <div className="flex flex-col md:flex-row gap-4 items-stretch mb-6">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-10 bg-black/30 border-white/10 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-white/10 bg-black/30 text-white hover:bg-white/10"
              onClick={() => browseAllCourses(navigate)}
            >
              <Filter size={16} className="mr-2" /> Filter
            </Button>
            <Button 
              className={`${showFilterPopular ? 'bg-pink-600' : 'bg-gradient-to-r from-purple-600 to-blue-600'} text-white`}
              onClick={handleToggleFilterPopular}
            >
              <Star size={16} className="mr-2" /> Popular
            </Button>
          </div>
        </div>

        <ScrollArea className="w-full" orientation="horizontal">
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "border-white/10 bg-black/30 text-white hover:bg-white/10"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Featured Courses Section */}
      <div className="max-w-6xl mx-auto w-full mb-16 reveal-on-scroll">
        <PageHeader 
          title="Featured Courses" 
          subtitle="Our most popular and highly-rated learning pathways"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <Card key={course.id} className="glass-morphism border-0 shadow-lg overflow-hidden hover:shadow-purple-500/20 transition-all duration-300 hover:translate-y-[-5px]">
              <div className="h-48 overflow-hidden relative group">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-black/50 border-white/30 text-white hover:bg-white/20"
                      onClick={() => handleViewDetails(course.id)}
                    >
                      <Eye size={14} className="mr-1" /> View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-black/50 border-white/30 text-white hover:bg-white/20"
                      onClick={() => handleShare(course.id, course.title)}
                    >
                      <Share size={14} className="mr-1" /> Share
                    </Button>
                  </div>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">{course.level}</span>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-sm text-gray-300">{course.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-xl text-white">{course.title}</CardTitle>
                <CardDescription className="text-gray-300">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    <span>{course.students} students</span>
                  </div>
                </div>
                <div className="font-semibold text-purple-300 text-right">{course.price}</div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                {enrolledCourses.includes(course.id) ? (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleContinueLearning(course.id)}
                  >
                    Continue Learning
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                    onClick={() => handleEnroll(course.id)}
                  >
                    Enroll Now
                  </Button>
                )}
                <div className="flex w-full justify-between gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-white/10 hover:bg-white/5"
                    onClick={() => handleDownload(course.id, course.title)}
                  >
                    <Download size={14} className="mr-1" /> Syllabus
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-white/10 hover:bg-white/5"
                    onClick={() => handleReviewCourse(course.id, course.title)}
                  >
                    <Star size={14} className="mr-1" /> Review
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs text-gray-400 hover:text-white"
                  onClick={() => handleRemind(course.id, course.title)}
                >
                  <Bell size={14} className="mr-1" /> Remind me later
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Paths Section */}
      <div className="max-w-6xl mx-auto w-full mb-16 reveal-on-scroll">
        <PageHeader 
          title="Learning Paths" 
          subtitle="Structured programs designed to take you from beginner to professional"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Frontend Developer Path",
              description: "Master HTML, CSS, JavaScript, and modern frontend frameworks",
              duration: "6 months",
              courses: 5,
              icon: <BookOpen className="text-purple-400" size={24} />
            },
            {
              title: "Data Scientist Path",
              description: "Learn statistics, Python, machine learning, and data visualization",
              duration: "8 months",
              courses: 6,
              icon: <TrendingUp className="text-blue-400" size={24} />
            },
            {
              title: "UX Design Professional",
              description: "From user research to high-fidelity prototypes and usability testing",
              duration: "5 months",
              courses: 4,
              icon: <Award className="text-pink-400" size={24} />
            },
            {
              title: "Digital Marketing Specialist",
              description: "SEO, content marketing, social media, and digital advertising",
              duration: "4 months",
              courses: 4,
              icon: <TrendingUp className="text-green-400" size={24} />
            }
          ].map((path, index) => (
            <Card key={index} className="glass-morphism border-0 hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-start space-x-4">
                <div className="p-3 rounded-xl bg-white/5">
                  {path.icon}
                </div>
                <div>
                  <CardTitle className="text-xl text-white">{path.title}</CardTitle>
                  <CardDescription className="text-gray-300">{path.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-gray-400">
                  <div>Duration: {path.duration}</div>
                  <div>{path.courses} courses</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full border-white/10 hover:bg-white/5"
                  onClick={() => handleViewPath(path.title)}
                >
                  View Path <ChevronRight size={16} className="ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Learn With Us Section */}
      <div className="max-w-6xl mx-auto w-full mb-16 py-10 reveal-on-scroll">
        <PageHeader 
          title="Why Learn With Us" 
          subtitle="Benefits that set our learning experience apart"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Expert Instructors",
              description: "Learn from industry professionals with years of real-world experience",
              icon: <Users className="text-purple-400" size={32} />
            },
            {
              title: "Practical Projects",
              description: "Apply your knowledge with hands-on projects that build your portfolio",
              icon: <BookOpen className="text-blue-400" size={32} />
            },
            {
              title: "Flexible Learning",
              description: "Study at your own pace with 24/7 access to course materials",
              icon: <Clock className="text-green-400" size={32} />
            },
            {
              title: "Career Support",
              description: "Get help with resume reviews, interview preparation and job placement",
              icon: <Award className="text-pink-400" size={32} />
            },
            {
              title: "Completion Certificates",
              description: "Earn industry-recognized certificates upon completion",
              icon: <CheckCircle className="text-yellow-400" size={32} />
            },
            {
              title: "Community Access",
              description: "Join our community of learners for networking and collaboration",
              icon: <Users className="text-cyan-400" size={32} />
            }
          ].map((feature, index) => (
            <Card key={index} className="glass-morphism border-0 text-center p-6 hover:shadow-purple-500/20 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-white/5">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <CallToAction 
        title="Ready to Upgrade Your Skills?"
        description="Enroll in our courses today and start your journey towards mastery."
        primaryButtonText="Browse All Courses"
        primaryButtonLink="/courses"
        secondaryButtonText="Learn More"
        secondaryButtonLink="/about"
      />
    </PageLayout>
  );
};

export default Courses;
