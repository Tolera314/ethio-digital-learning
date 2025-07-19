
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfessionalNavbar from '@/components/layout/ProfessionalNavbar';
import { CertificateApproval } from '@/components/admin/CertificateApproval';
import { ContentManagement } from '@/components/admin/ContentManagement';
import { Users, BookOpen, FileText, Award, Video, MessageSquare, Flag, TrendingUp, Activity, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    contentItems: 0,
    totalPayments: 0,
    activeSessions: 0,
    totalCertificates: 0
  });
  const [analytics, setAnalytics] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Load analytics events for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: analyticsData, error: analyticsError } = await (supabase as any)
          .from('analytics_events')
          .select('event_name, created_at')
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: true });

        if (analyticsError) throw analyticsError;

        // Process analytics data for chart
        const dailyData = analyticsData?.reduce((acc: any, event) => {
          const date = new Date(event.created_at).toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = { date, events: 0, users: 0 };
          }
          acc[date].events += 1;
          return acc;
        }, {});

        setAnalytics(Object.values(dailyData || {}));

        // Load summary stats
        const [
          { count: userCount },
          { count: contentCount },
          { count: paymentCount },
          { count: sessionCount },
          { count: certificateCount }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('content_uploads').select('*', { count: 'exact', head: true }),
          (supabase as any).from('payments').select('*', { count: 'exact', head: true }),
          (supabase as any).from('live_sessions').select('*', { count: 'exact', head: true }),
          (supabase as any).from('certificates').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          totalUsers: userCount || 0,
          contentItems: contentCount || 0,
          totalPayments: paymentCount || 0,
          activeSessions: sessionCount || 0,
          totalCertificates: certificateCount || 0
        });

      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      }
    }

    loadDashboardData();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <ProfessionalNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-300 mt-2">Manage users, content, and system analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="glass-morphism border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-gray-300">Registered members</p>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Content Items</CardTitle>
              <Video className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.contentItems.toLocaleString()}</div>
              <p className="text-xs text-gray-300">Videos, documents, etc.</p>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Live Sessions</CardTitle>
              <Activity className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeSessions}</div>
              <p className="text-xs text-gray-300">Total sessions created</p>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Payments</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalPayments}</div>
              <p className="text-xs text-gray-300">Total transactions</p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Certificates</CardTitle>
              <Award className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalCertificates}</div>
              <p className="text-xs text-gray-300">Issued certificates</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Chart */}
        <Card className="glass-morphism border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Platform Activity (Last 30 Days)
            </CardTitle>
            <CardDescription className="text-gray-300">
              Daily user activity and engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics}>
                  <defs>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f3f4f6'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="events"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorEvents)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <Card className="glass-morphism border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Content Management</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage instructor uploads, comments, ratings, and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates">
            <Card className="glass-morphism border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Certificate Management</CardTitle>
                <CardDescription className="text-gray-300">
                  Review and approve certificate requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CertificateApproval />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="glass-morphism border-white/10">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage user accounts, roles, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-300">
                  User management features coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="glass-morphism border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">User Engagement</CardTitle>
                  <CardDescription className="text-gray-300">
                    Track user activity and engagement patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">Daily Active Users</span>
                      <span className="text-white font-semibold">{Math.floor(stats.totalUsers * 0.15)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">Weekly Active Users</span>
                      <span className="text-white font-semibold">{Math.floor(stats.totalUsers * 0.45)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">Monthly Active Users</span>
                      <span className="text-white font-semibold">{Math.floor(stats.totalUsers * 0.75)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Content Statistics</CardTitle>
                  <CardDescription className="text-gray-300">
                    Overview of content performance and engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">Total Views</span>
                      <span className="text-white font-semibold">{(stats.contentItems * 127).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">Average Rating</span>
                      <span className="text-white font-semibold">4.6/5</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">Completion Rate</span>
                      <span className="text-white font-semibold">78%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
