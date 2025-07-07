import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Award, TrendingUp, Play, Clock, Star, ArrowRight, Zap, CheckCircle, Globe, Target, Lightbulb, GraduationCap, Video, FileText, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { useUserActivities } from "@/hooks/useUserActivities";
import { useState, useEffect } from "react";
import { getUserActivitySummary } from "@/utils/activityLogger";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { recentActivities, courseProgress, loading } = useUserActivities();
  const [activitySummary, setActivitySummary] = useState({
    totalLearningTime: 0,
    enrolledCourses: 0,
    totalCertificates: 0,
    totalBooks: 0
  });
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        const summary = await getUserActivitySummary();
        setActivitySummary(summary);
        
        const recommendations = generateRecommendations(summary, recentActivities);
        setPersonalizedRecommendations(recommendations);
      }
    };
    
    if (!loading) {
      loadUserData();
    }
  }, [user, recentActivities, loading]);

  const generateRecommendations = (summary, activities) => {
    const recommendations = [];
    
    if (summary.enrolledCourses === 0) {
      recommendations.push({
        type: 'course',
        title: 'Start Your Learning Journey',
        description: 'Begin with our foundational courses designed for beginners',
        action: 'Browse Courses',
        link: '/courses',
        priority: 'high'
      });
    }
    
    const hasReadingActivity = activities.some(a => a.activity_type === 'book_view');
    if (hasReadingActivity) {
      recommendations.push({
        type: 'book',
        title: 'Continue Reading',
        description: 'Discover new books in your favorite categories',
        action: 'Visit Library',
        link: '/library',
        priority: 'medium'
      });
    }
    
    if (summary.enrolledCourses > 0) {
      recommendations.push({
        type: 'session',
        title: 'Join Live Sessions',
        description: 'Connect with instructors and peers in real-time',
        action: 'View Sessions',
        link: '/live-sessions',
        priority: 'medium'
      });
    }
    
    return recommendations.slice(0, 3);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserStreak = () => {
    const today = new Date();
    const recentDays = recentActivities.filter(activity => {
      const activityDate = new Date(activity.created_at);
      const diffTime = Math.abs(today.getTime() - activityDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    });
    
    return Math.min(recentDays.length, 7);
  };

  return (
    <PageLayout 
      title={user ? `${getGreeting()}, ${user.user_metadata?.name || user.email?.split('@')[0] || 'Learner'}!` : "Transform Your Future with Digital Skills"}
      subtitle={user ? "Ready to continue your learning journey?" : "Join thousands of Ethiopians mastering technology and advancing their careers through our comprehensive digital academy"}
      backgroundImage="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80"
    >
      {user ? (
        <div className="space-responsive">
          {/* Personal Stats Row */}
          <div className="responsive-grid">
            <Card className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/30 glass-morphism animate-scale-in">
              <CardContent className="p-4 text-center">
                <Clock className="mx-auto mb-2 text-purple-400" size={24} />
                <div className="text-2xl font-bold text-white">{formatTime(activitySummary.totalLearningTime)}</div>
                <p className="text-sm text-gray-300">Learning Time</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30 glass-morphism animate-scale-in delay-100">
              <CardContent className="p-4 text-center">
                <BookOpen className="mx-auto mb-2 text-green-400" size={24} />
                <div className="text-2xl font-bold text-white">{activitySummary.enrolledCourses}</div>
                <p className="text-sm text-gray-300">Active Courses</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30 glass-morphism animate-scale-in delay-200">
              <CardContent className="p-4 text-center">
                <Award className="mx-auto mb-2 text-yellow-400" size={24} />
                <div className="text-2xl font-bold text-white">{activitySummary.totalCertificates}</div>
                <p className="text-sm text-gray-300">Certificates</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-600/20 to-pink-600/20 border-red-500/30 glass-morphism animate-scale-in delay-300">
              <CardContent className="p-4 text-center">
                <Zap className="mx-auto mb-2 text-red-400" size={24} />
                <div className="text-2xl font-bold text-white">{getUserStreak()}</div>
                <p className="text-sm text-gray-300">Day Streak</p>
              </CardContent>
            </Card>
          </div>

          {/* Personalized Recommendations */}
          {personalizedRecommendations.length > 0 && (
            <div className="animate-fade-in delay-500">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Star className="text-yellow-400" size={24} />
                Recommended for You
              </h2>
              <div className="responsive-grid">
                {personalizedRecommendations.map((rec, index) => (
                  <Card key={index} className={`glass-morphism hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in ${
                    rec.priority === 'high' ? 'border-yellow-500/50 shadow-yellow-500/20' : 'border-white/10'
                  }`} style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader>
                      <CardTitle className="text-lg text-white flex items-center justify-between">
                        {rec.title}
                        {rec.priority === 'high' && <Badge className="bg-yellow-600">Priority</Badge>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{rec.description}</p>
                      <Link to={rec.link}>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 btn-hover">
                          {rec.action}
                          <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="responsive-grid animate-fade-in delay-600">
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="h-16 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold btn-hover"
            >
              <TrendingUp className="mr-2" size={20} />
              View Dashboard
            </Button>
            
            <Button 
              onClick={() => navigate('/courses')} 
              variant="outline" 
              className="h-16 border-white/20 hover:bg-white/10 text-white font-semibold btn-hover"
            >
              <BookOpen className="mr-2" size={20} />
              Browse Courses
            </Button>
            
            <Button 
              onClick={() => navigate('/live-sessions')} 
              variant="outline" 
              className="h-16 border-white/20 hover:bg-white/10 text-white font-semibold btn-hover"
            >
              <Play className="mr-2" size={20} />
              Live Sessions
            </Button>
            
            <Button 
              onClick={() => navigate('/library')} 
              variant="outline" 
              className="h-16 border-white/20 hover:bg-white/10 text-white font-semibold btn-hover"
            >
              <BookOpen className="mr-2" size={20} />
              Digital Library
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Hero CTA */}
          <div className="text-center space-y-6">
            <Button 
              onClick={() => navigate('/auth')} 
              size="lg" 
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-lg shadow-2xl hover:scale-105 transition-all btn-hover"
            >
              Start Learning Today - It's Free!
            </Button>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <Users size={16} className="text-purple-400" />
                <span>10,000+ Active Students</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <BookOpen size={16} className="text-blue-400" />
                <span>50+ Expert-Led Courses</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Award size={16} className="text-yellow-400" />
                <span>Industry-Recognized Certificates</span>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="animate-fade-in delay-200">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Why Choose Our Digital Academy?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Target className="text-blue-400" size={40} />,
                  title: "Industry-Focused Learning",
                  description: "Our curriculum is designed with input from Ethiopian tech companies to ensure you learn the most relevant skills for today's job market."
                },
                {
                  icon: <Users className="text-green-400" size={40} />,
                  title: "Expert Ethiopian Instructors",
                  description: "Learn from experienced professionals who understand the local tech ecosystem and can guide your career development."
                },
                {
                  icon: <Globe className="text-purple-400" size={40} />,
                  title: "Real-World Projects",
                  description: "Build a portfolio with projects that solve actual problems faced by Ethiopian businesses and communities."
                },
                {
                  icon: <Award className="text-yellow-400" size={40} />,
                  title: "Recognized Certifications",
                  description: "Earn certificates that are valued by employers across Ethiopia and beyond, boosting your career prospects."
                },
                {
                  icon: <Lightbulb className="text-orange-400" size={40} />,
                  title: "Innovation Hub",
                  description: "Access to entrepreneurship resources and mentorship to help you start your own tech venture in Ethiopia."
                },
                {
                  icon: <CheckCircle className="text-teal-400" size={40} />,
                  title: "Job Placement Support",
                  description: "With our 89% job placement rate, we connect you with opportunities at leading companies in Ethiopia."
                }
              ].map((feature, index) => (
                <Card key={index} className="bg-black/40 border border-white/10 backdrop-blur-lg hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* For Students Section */}
          <div className="animate-fade-in delay-400">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              For Students: Your Path to Success
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30 glass-morphism">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <GraduationCap className="text-blue-400" size={32} />
                    Learn at Your Own Pace
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Access courses 24/7 from anywhere in Ethiopia</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Interactive coding exercises and real projects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Progress tracking and personalized learning paths</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Certificate of completion for each course</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={() => navigate('/auth')} 
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 btn-hover"
                  >
                    Start Learning Now
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-600/20 to-teal-600/20 border-green-500/30 glass-morphism">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <Users className="text-green-400" size={32} />
                    Join Our Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Connect with fellow Ethiopian tech enthusiasts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Participate in live coding sessions and workshops</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Get mentorship from experienced developers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Access to job opportunities and career guidance</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={() => navigate('/auth')} 
                    variant="outline"
                    className="w-full mt-6 border-green-500/50 hover:bg-green-500/10 text-white btn-hover"
                  >
                    Join Community
                    <Users size={16} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* For Instructors Section */}
          <div className="animate-fade-in delay-500">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              For Instructors: Share Your Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/30 glass-morphism">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Video className="text-orange-400" size={24} />
                    Create & Share
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">Upload video courses, create interactive content, and share your knowledge with thousands of eager learners across Ethiopia.</p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Easy-to-use content creation tools</li>
                    <li>• Video hosting and streaming</li>
                    <li>• Interactive assignments and quizzes</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30 glass-morphism">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <MessageSquare className="text-purple-400" size={24} />
                    Engage Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">Host live sessions, answer questions, and build meaningful connections with your students through our interactive platform.</p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Live video streaming capabilities</li>
                    <li>• Real-time Q&A and discussions</li>
                    <li>• Student progress tracking</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-teal-600/20 to-cyan-600/20 border-teal-500/30 glass-morphism">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Award className="text-teal-400" size={24} />
                    Earn & Grow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">Monetize your expertise while making a positive impact on Ethiopia's tech education landscape and building your professional reputation.</p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Competitive revenue sharing</li>
                    <li>• Performance analytics and insights</li>
                    <li>• Professional development opportunities</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-8">
              <Button 
                onClick={() => navigate('/auth')} 
                size="lg"
                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-pink-500 hover:from-orange-700 hover:to-pink-600 text-white font-semibold btn-hover"
              >
                Become an Instructor
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in delay-600">
            <div className="text-center p-6 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="text-3xl font-bold text-purple-400 mb-2">5,247</div>
              <div className="text-sm text-gray-300">Hours of Content</div>
            </div>
            <div className="text-center p-6 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="text-3xl font-bold text-blue-400 mb-2">127</div>
              <div className="text-sm text-gray-300">Live Sessions This Week</div>
            </div>
            <div className="text-center p-6 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="text-3xl font-bold text-green-400 mb-2">89%</div>
              <div className="text-sm text-gray-300">Job Placement Rate</div>
            </div>
            <div className="text-center p-6 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="text-3xl font-bold text-yellow-400 mb-2">4.9</div>
              <div className="text-sm text-gray-300">Average Rating</div>
            </div>
          </div>

          {/* Featured Courses Preview */}
          <div className="animate-fade-in delay-700">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Most Popular Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Full Stack Web Development",
                  description: "Master React, Node.js, and modern web technologies",
                  students: "2,340 students",
                  rating: 4.8,
                  image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80"
                },
                {
                  title: "UI/UX Design Fundamentals",
                  description: "Create beautiful and user-friendly digital experiences",
                  students: "1,890 students",
                  rating: 4.9,
                  image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80"
                },
                {
                  title: "Data Science with Python",
                  description: "Analyze data and build machine learning models",
                  students: "1,567 students",
                  rating: 4.7,
                  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                }
              ].map((course, index) => (
                <Card key={index} className="bg-black/40 border border-white/10 backdrop-blur-lg hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg text-white">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{course.students}</span>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">{course.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button 
                onClick={() => navigate('/courses')} 
                variant="outline" 
                className="border-white/20 hover:bg-white/10 text-white font-semibold px-8 py-3 btn-hover"
              >
                View All Courses
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Index;
