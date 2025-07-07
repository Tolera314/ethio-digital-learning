
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfessionalNavbar from '@/components/layout/ProfessionalNavbar';
import InformationCollectionModal from '@/components/auth/InformationCollectionModal';
import { VideoUpload } from '@/components/instructor/VideoUpload';
import { MaterialUpload } from '@/components/instructor/MaterialUpload';
import { BookOpen, Users, Calendar, BarChart3, Video, FileText, Radio } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'materials' | 'sessions'>('overview');

  useEffect(() => {
    if (user && !user.user_metadata?.profile_completed) {
      setShowInfoModal(true);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <ProfessionalNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Instructor Dashboard</h1>
          <p className="text-gray-300 mt-2">Manage your courses, students, and teaching materials</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-morphism border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">My Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">8</div>
              <p className="text-xs text-gray-300">Active courses</p>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Students</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">156</div>
              <p className="text-xs text-gray-300">Total enrolled</p>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Live Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3</div>
              <p className="text-xs text-gray-300">This week</p>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Avg. Rating</CardTitle>
              <BarChart3 className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">4.8</div>
              <p className="text-xs text-gray-300">Course rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-4 flex-wrap">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'videos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Video className="h-4 w-4 mr-2 inline" />
              Upload Videos
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'materials'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <FileText className="h-4 w-4 mr-2 inline" />
              Course Materials
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'sessions'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Radio className="h-4 w-4 mr-2 inline" />
              Live Sessions
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="glass-morphism border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Activities</CardTitle>
                <CardDescription className="text-gray-300">
                  Latest student interactions and course updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <p className="text-sm text-gray-300">New student enrolled in React Fundamentals</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="text-sm text-gray-300">Video uploaded: "Advanced React Hooks"</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <p className="text-sm text-gray-300">New comment on JavaScript Tutorial</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <p className="text-sm text-gray-300">Course material downloaded 15 times</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-300">
                  Common instructor tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('videos')}
                    className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors text-white"
                  >
                    Upload New Video
                  </button>
                  <button 
                    onClick={() => setActiveTab('materials')}
                    className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors text-white"
                  >
                    Upload Course Material
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors text-white">
                    Schedule Live Session
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors text-white">
                    View Student Interactions
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="max-w-2xl">
            <VideoUpload />
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="max-w-2xl">
            <MaterialUpload />
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="max-w-4xl">
            <Card className="glass-morphism border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Live Session Management</CardTitle>
                <CardDescription className="text-gray-300">
                  Create and manage live sessions for your students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-center py-8">
                  Live session management features coming soon...
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <InformationCollectionModal 
        isOpen={showInfoModal} 
        onClose={() => setShowInfoModal(false)} 
      />
    </div>
  );
};

export default InstructorDashboard;
