
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Star, Clock, Users, Download, Share, BookOpen, CheckCircle, Play } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { enrollInCourse, downloadCourseMaterials, shareCourse } from "@/utils/courseActions";
import { featuredCourses } from "@/utils/courseActions";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  // Get course data
  const { data: course, isLoading } = useQuery({
    queryKey: ["course-details", courseId],
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
  
  // Check if user is enrolled in this course
  useEffect(() => {
    const checkEnrollment = async () => {
      if (user && courseId) {
        // In a real app, check enrollment status from database
        // For demo, randomly set some courses as enrolled
        setIsEnrolled(Math.random() > 0.5);
      }
    };
    
    checkEnrollment();
  }, [user, courseId]);
  
  const handleEnroll = async () => {
    if (course) {
      const success = await enrollInCourse(course.id, user?.id);
      if (success) {
        setIsEnrolled(true);
      }
    }
  };
  
  const handleDownload = () => {
    if (course) {
      downloadCourseMaterials(course.id, `${course.title} - Syllabus`);
    }
  };
  
  const handleShare = () => {
    if (course) {
      shareCourse(course.id, course.title);
    }
  };
  
  const handleStartLearning = () => {
    navigate(`/courses/${courseId}/learn`);
  };
  
  if (isLoading || !course) {
    return (
      <PageLayout
        title="Loading Course"
        subtitle="Please wait..."
        backgroundImage="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80"
      >
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-pulse">Loading course details...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={course.title}
      subtitle={course.description}
      backgroundImage="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80"
    >
      <div className="max-w-6xl mx-auto w-full mb-16">
        {/* Course Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card className="glass-morphism border-0 shadow-lg overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">{course.level}</span>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-sm text-gray-300">{course.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-2xl text-white">{course.title}</CardTitle>
                <CardDescription className="text-gray-300">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm text-gray-400">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    <span>{course.students} students</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {["React", "JavaScript", "HTML/CSS", "Web Development", "Frontend"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-black/30 text-gray-300 text-xs rounded-full border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-4 justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="border-white/10 hover:bg-white/5"
                    onClick={handleDownload}
                  >
                    <Download size={16} className="mr-1" /> Download Syllabus
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/10 hover:bg-white/5"
                    onClick={handleShare}
                  >
                    <Share size={16} className="mr-1" /> Share
                  </Button>
                </div>
                <div className="font-semibold text-xl text-purple-300">{course.price}</div>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card className="glass-morphism border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-white">Enrollment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-gray-300 mb-2">Course Progress</p>
                  {isEnrolled ? (
                    <div className="space-y-2">
                      <Progress value={33} className="h-2 bg-white/10" />
                      <p className="text-xs text-gray-400">33% complete</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Progress value={0} className="h-2 bg-white/10" />
                      <p className="text-xs text-gray-400">Not started</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Lectures</span>
                    <span>24</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Duration</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Level</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Certificate</span>
                    <span>Yes</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {isEnrolled ? (
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600"
                    onClick={handleStartLearning}
                  >
                    <Play size={16} className="mr-1" /> Continue Learning
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                    onClick={handleEnroll}
                  >
                    Enroll Now
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <Card className="glass-morphism border-0 shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">Course Instructor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src="https://i.pravatar.cc/100?img=3" alt="Instructor" />
                    <AvatarFallback>IN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-white">Daniel Abebe</h3>
                    <p className="text-sm text-gray-400">Senior Developer & Educator</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  10+ years of industry experience in web development and teaching programming skills to beginners and professionals alike.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Course Content Tabs */}
        <Tabs defaultValue="curriculum" className="w-full">
          <TabsList className="w-full flex mb-8 bg-black/20 p-0 h-auto">
            {["curriculum", "overview", "reviews", "faq"].map((tab) => (
              <TabsTrigger 
                key={tab}
                value={tab}
                className="flex-1 py-4 rounded-none data-[state=active]:bg-black/40 data-[state=active]:shadow-none capitalize"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="curriculum">
            <Card className="glass-morphism border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-white">Course Curriculum</CardTitle>
                <CardDescription className="text-gray-300">
                  This course includes 8 modules with a total of 24 lessons.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    title: "Getting Started",
                    lessons: [
                      "Introduction to the course",
                      "Setting up your development environment",
                      "Course project overview"
                    ]
                  },
                  {
                    title: "Core Concepts",
                    lessons: [
                      "Understanding the basics",
                      "Working with key principles",
                      "Best practices and patterns"
                    ]
                  },
                  {
                    title: "Advanced Topics",
                    lessons: [
                      "Building complex applications",
                      "Performance optimization",
                      "Deployment strategies"
                    ]
                  }
                ].map((module, index) => (
                  <div key={index} className="border border-white/10 rounded-lg overflow-hidden">
                    <div className="bg-black/30 px-4 py-3 flex justify-between items-center">
                      <h3 className="font-medium text-white">Module {index + 1}: {module.title}</h3>
                      <span className="text-sm text-gray-400">{module.lessons.length} lessons</span>
                    </div>
                    <div className="divide-y divide-white/5">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="px-4 py-3 flex items-center justify-between hover:bg-white/5">
                          <div className="flex items-center gap-3">
                            <span className="bg-white/10 text-xs rounded-full h-6 w-6 flex items-center justify-center text-gray-300">
                              {lessonIndex + 1}
                            </span>
                            <span className="text-gray-300">{lesson}</span>
                          </div>
                          {isEnrolled ? (
                            <Button size="sm" variant="ghost" className="text-xs opacity-70">
                              <Play size={12} className="mr-1" /> Preview
                            </Button>
                          ) : (
                            <span className="text-xs text-gray-500">Preview locked</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="overview">
            <Card className="glass-morphism border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-white">Course Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">What you'll learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Build professional web applications",
                      "Create responsive user interfaces",
                      "Implement complex features",
                      "Test and debug efficiently",
                      "Deploy applications to production",
                      "Work with industry standard tools",
                      "Collaborate using version control",
                      "Apply best practices"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Prerequisites</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
                    <li>Basic understanding of HTML and CSS</li>
                    <li>Familiarity with JavaScript fundamentals</li>
                    <li>A computer with internet connection</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Description</h3>
                  <div className="text-gray-300 space-y-3 text-sm">
                    <p>
                      This comprehensive course is designed to take you from beginner to professional. 
                      Whether you're starting from scratch or looking to enhance your skills, 
                      you'll find valuable content tailored to your learning journey.
                    </p>
                    <p>
                      Through hands-on projects and practical exercises, you'll build a strong 
                      foundation in the core concepts while also learning advanced techniques 
                      used by industry professionals.
                    </p>
                    <p>
                      By the end of this course, you'll have the confidence and skills to build 
                      your own applications and tackle real-world challenges in the field.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews">
            <Card className="glass-morphism border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-white">Student Reviews</CardTitle>
                <CardDescription className="text-gray-300">
                  See what our students are saying about this course.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{course.rating}</div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          size={16}
                          className={i < Math.floor(course.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Course Rating</div>
                  </div>
                  <div className="flex-grow">
                    {[5, 4, 3, 2, 1].map(rating => {
                      // Calculate percentage based on rating
                      const percentage = rating === 5 ? 70 : 
                                        rating === 4 ? 20 : 
                                        rating === 3 ? 7 : 
                                        rating === 2 ? 2 : 1;
                      return (
                        <div key={rating} className="flex items-center gap-2 mb-1">
                          <div className="flex min-w-[60px]">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={10}
                                className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}
                              />
                            ))}
                          </div>
                          <Progress value={percentage} className="h-2 bg-white/10" />
                          <span className="text-xs text-gray-400 min-w-[40px]">{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[
                    {
                      name: "Abebe Kebede",
                      rating: 5,
                      date: "2 months ago",
                      comment: "This course exceeded my expectations. The instructor explains complex topics in a way that's easy to understand, and the projects are very practical."
                    },
                    {
                      name: "Tigist Haile",
                      rating: 4,
                      date: "3 months ago",
                      comment: "Great course with lots of useful information. I would have liked more exercises, but overall I'm very satisfied with what I learned."
                    },
                    {
                      name: "Yonas Tesfaye",
                      rating: 5,
                      date: "1 month ago",
                      comment: "The best course I've taken so far! The instructor is very knowledgeable and responds quickly to questions. Highly recommended for anyone serious about learning."
                    }
                  ].map((review, index) => (
                    <div key={index} className="border-t border-white/10 pt-4">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://i.pravatar.cc/100?img=${index + 1}`} alt={review.name} />
                            <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-white font-medium">{review.name}</h4>
                            <span className="text-xs text-gray-400">{review.date}</span>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              size={14}
                              className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="faq">
            <Card className="glass-morphism border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-white">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    question: "How long do I have access to the course?",
                    answer: "Once enrolled, you have lifetime access to the course materials. You can learn at your own pace and revisit the content as often as you need."
                  },
                  {
                    question: "Is there a certificate upon completion?",
                    answer: "Yes, you will receive a certificate of completion once you finish all the course modules and pass the final assessment."
                  },
                  {
                    question: "What if I'm not satisfied with the course?",
                    answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied, you can request a full refund within the first 30 days of enrollment."
                  },
                  {
                    question: "How do I get help if I'm stuck on a lesson?",
                    answer: "You can post your questions in the course discussion forum where the instructor and other students can help. For enrolled students, there's also direct messaging support."
                  },
                  {
                    question: "Are there any prerequisites for this course?",
                    answer: "Basic knowledge of HTML, CSS, and JavaScript is recommended. However, we include refresher modules for those who need to brush up on these skills."
                  }
                ].map((faq, index) => (
                  <div key={index} className="border border-white/10 rounded-lg overflow-hidden">
                    <div className="bg-black/30 px-4 py-3">
                      <h3 className="font-medium text-white">{faq.question}</h3>
                    </div>
                    <div className="px-4 py-3 text-gray-300 text-sm">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default CourseDetails;
