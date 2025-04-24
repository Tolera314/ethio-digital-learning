
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Book, Award, Clock, Bell, TrendingUp, Users, Video } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const StudentDashboard = () => {
  return (
    <PageLayout 
      title="Student Dashboard" 
      subtitle="Your personal learning hub"
      backgroundImage="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-black/40 border border-white/10 backdrop-blur-lg hover:shadow-purple-500/20 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-400 flex items-center gap-2">
              <Book className="text-purple-400" size={18} /> Enrolled Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">5</div>
            <p className="text-sm text-gray-300">2 in progress</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border border-white/10 backdrop-blur-lg hover:shadow-purple-500/20 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-400 flex items-center gap-2">
              <Award className="text-yellow-400" size={18} /> Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">3</div>
            <p className="text-sm text-gray-300">1 this month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border border-white/10 backdrop-blur-lg hover:shadow-purple-500/20 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-400 flex items-center gap-2">
              <Clock className="text-blue-400" size={18} /> Learning Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">55h 30m</div>
            <p className="text-sm text-gray-300">12h this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="bg-black/40 border border-white/10 backdrop-blur-lg h-full">
            <CardHeader>
              <CardTitle className="text-xl text-white">Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Web Development Fundamentals</span>
                    <span className="text-gray-300">75%</span>
                  </div>
                  <Progress value={75} className="h-2" style={{ backgroundImage: 'linear-gradient(to right, #8B5CF6, #6366F1)' }} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">UX/UI Design Principles</span>
                    <span className="text-gray-300">45%</span>
                  </div>
                  <Progress value={45} className="h-2" style={{ backgroundImage: 'linear-gradient(to right, #8B5CF6, #6366F1)' }} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Introduction to Digital Marketing</span>
                    <span className="text-green-400">100%</span>
                  </div>
                  <Progress value={100} className="h-2" style={{ backgroundImage: 'linear-gradient(to right, #10B981, #059669)' }} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Mobile App Development</span>
                    <span className="text-gray-300">30%</span>
                  </div>
                  <Progress value={30} className="h-2" style={{ backgroundImage: 'linear-gradient(to right, #8B5CF6, #6366F1)' }} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">AI and Machine Learning</span>
                    <span className="text-gray-300">15%</span>
                  </div>
                  <Progress value={15} className="h-2" style={{ backgroundImage: 'linear-gradient(to right, #8B5CF6, #6366F1)' }} />
                </div>
              </div>

              <div className="mt-6">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white w-full">
                  <TrendingUp size={16} className="mr-2" /> View Detailed Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-black/40 border border-white/10 backdrop-blur-lg h-full">
            <CardHeader>
              <CardTitle className="text-xl text-white flex justify-between items-center">
                <span>Upcoming Sessions</span>
                <Bell size={18} className="text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-white">Advanced React Hooks</h4>
                    <span className="text-xs bg-red-900/50 text-red-200 px-2 py-0.5 rounded">Today</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">14:00 - 16:00 EAT</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Users size={12} /> <span>76 participants</span>
                  </div>
                </div>

                <div className="p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-white">UX Research Methods</h4>
                    <span className="text-xs bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded">3 days</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">10:00 - 12:00 EAT</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Users size={12} /> <span>42 participants</span>
                  </div>
                </div>

                <div className="p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-white">Intro to AI</h4>
                    <span className="text-xs bg-blue-900/50 text-blue-200 px-2 py-0.5 rounded">Next week</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">15:00 - 17:00 EAT</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Users size={12} /> <span>104 participants</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
                  <Video size={16} className="mr-2" /> View All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/40 border border-white/10 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-xl text-white">Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all">
                <div className="p-2.5 bg-yellow-900/30 rounded-lg border border-yellow-500/20">
                  <Award size={20} className="text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Perfect Score</h4>
                  <p className="text-sm text-gray-400">Achieved 100% in a quiz</p>
                </div>
                <div className="ml-auto text-xs text-gray-500">
                  2 days ago
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all">
                <div className="p-2.5 bg-blue-900/30 rounded-lg border border-blue-500/20">
                  <TrendingUp size={20} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Fast Learner</h4>
                  <p className="text-sm text-gray-400">Completed 3 modules in one day</p>
                </div>
                <div className="ml-auto text-xs text-gray-500">
                  1 week ago
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all">
                <div className="p-2.5 bg-green-900/30 rounded-lg border border-green-500/20">
                  <Calendar size={20} className="text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Consistent Learner</h4>
                  <p className="text-sm text-gray-400">Studied for 7 consecutive days</p>
                </div>
                <div className="ml-auto text-xs text-gray-500">
                  2 weeks ago
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
                <Award size={16} className="mr-2" /> View All Achievements
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border border-white/10 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-xl text-white">Recommended For You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" 
                  alt="AI and Machine Learning" 
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium text-white">AI and Machine Learning</h4>
                  <p className="text-sm text-gray-400">Advance your tech skills</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded">Advanced</div>
                    <span className="text-xs text-gray-500">14 weeks</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80" 
                  alt="Data Science Fundamentals" 
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium text-white">Data Science Fundamentals</h4>
                  <p className="text-sm text-gray-400">Learn Python and data analysis</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs bg-blue-900/50 text-blue-200 px-2 py-0.5 rounded">Beginner</div>
                    <span className="text-xs text-gray-500">10 weeks</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80" 
                  alt="DevOps Engineering" 
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium text-white">DevOps Engineering</h4>
                  <p className="text-sm text-gray-400">Master CI/CD pipelines</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs bg-green-900/50 text-green-200 px-2 py-0.5 rounded">Intermediate</div>
                    <span className="text-xs text-gray-500">12 weeks</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
                Explore More Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default StudentDashboard;
