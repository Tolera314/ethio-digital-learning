
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Video, Calendar as CalendarIcon, Bell, Plus } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateSessionModal from "@/components/CreateSessionModal";
import JoinSessionModal from "@/components/JoinSessionModal";
import VideoCall from "@/components/VideoCall";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const initialUpcomingSessions = [
  {
    id: 1,
    title: "Advanced React Hooks",
    instructor: "Dr. Abebe Bekele",
    date: "May 5, 2025",
    time: "14:00 - 16:00 EAT",
    participants: 76,
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    status: "upcoming"
  },
  {
    id: 2,
    title: "UX Research Methods",
    instructor: "Sara Tadesse",
    date: "May 8, 2025",
    time: "10:00 - 12:00 EAT",
    participants: 42,
    category: "Design",
    image: "https://images.unsplash.com/photo-1551810080-c5b50aa657d9?auto=format&fit=crop&w=800&q=80",
    status: "upcoming"
  },
  {
    id: 3,
    title: "Intro to AI Development",
    instructor: "Michael Hailu",
    date: "May 12, 2025",
    time: "15:00 - 17:00 EAT",
    participants: 104,
    category: "Artificial Intelligence",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    status: "upcoming"
  }
];

const pastSessions = [
  {
    id: 4,
    title: "Building REST APIs",
    instructor: "Dr. Abebe Bekele",
    date: "April 28, 2025",
    time: "14:00 - 16:00 EAT",
    participants: 89,
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    status: "recorded",
    recordingUrl: "https://example.com/recording/123"
  },
  {
    id: 5,
    title: "Modern CSS Techniques",
    instructor: "Sara Tadesse",
    date: "April 20, 2025",
    time: "10:00 - 12:00 EAT",
    participants: 65,
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&q=80",
    status: "recorded",
    recordingUrl: "https://example.com/recording/124"
  }
];

const SessionCard = ({ 
  session, 
  isPast = false, 
  onJoin,
  onRemind
}: { 
  session: any; 
  isPast?: boolean; 
  onJoin?: (session: any) => void;
  onRemind?: (session: any) => void;
}) => (
  <Card className="overflow-hidden bg-black/40 border border-white/10 backdrop-blur-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1">
    <div className="relative h-32 sm:h-40">
      <img 
        src={session.image} 
        alt={session.title} 
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      <Badge 
        className={`absolute top-3 right-3 ${
          isPast ? "bg-gray-700 text-gray-200" : "bg-red-600 text-white animate-pulse"
        }`}
      >
        {isPast ? "Recorded" : "Upcoming"}
      </Badge>
    </div>
    <CardHeader className="pb-2">
      <CardTitle className="text-base sm:text-xl text-gray-100">{session.title}</CardTitle>
      <p className="text-xs sm:text-sm text-gray-300">Instructor: {session.instructor}</p>
    </CardHeader>
    <CardContent className="pb-4">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-blue-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-gray-300">{session.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="text-purple-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-gray-300">{session.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="text-green-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-gray-300">{session.participants} participants</span>
        </div>
        <div className="flex items-center gap-2">
          <Video className="text-red-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-gray-300">{session.category}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter className="border-t border-white/5 pt-4">
      {isPast ? (
        <Button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-sm">
          <Video className="mr-2 w-4 h-4" /> Watch Recording
        </Button>
      ) : (
        <div className="flex w-full flex-col sm:flex-row gap-2">
          <Button 
            className="w-full sm:flex-1 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white text-sm"
            onClick={() => onJoin && onJoin(session)}
          >
            Join Session
          </Button>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto border-white/20 hover:bg-white/10 text-sm"
            onClick={() => onRemind && onRemind(session)}
          >
            <Bell className="w-4 h-4 mr-1" /> Remind
          </Button>
        </div>
      )}
    </CardFooter>
  </Card>
);

const LiveSessions = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [activeVideoCall, setActiveVideoCall] = useState<boolean>(false);
  const [upcomingSessions, setUpcomingSessions] = useState(initialUpcomingSessions);
  const [userData, setUserData] = useState<{ username: string, email: string } | null>(null);
  const [isHost, setIsHost] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get user data from session on page load
  useEffect(() => {
    async function getUserData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const email = session.user.email || "";
          const username = session.user.user_metadata?.name || 
                          session.user.user_metadata?.full_name || 
                          session.user.email?.split('@')[0] || "";
          
          setUserData({ username, email });
        }
      } catch (error) {
        console.error("Error getting user data:", error);
      }
    }

    getUserData();
  }, [user]);

  const handleCreateSession = (newSession: any) => {
    setUpcomingSessions([newSession, ...upcomingSessions]);
    setSelectedSession(newSession);
    setIsHost(true);
    setActiveVideoCall(true);
    toast({
      title: "Session Created",
      description: "Your live session has been successfully created and started"
    });
  };

  const handleJoinSessionClick = (session: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join the session",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    setSelectedSession(session);
    setIsJoinModalOpen(true);
  };

  const handleJoinSession = (username: string, email: string) => {
    setIsHost(false);
    setActiveVideoCall(true);
    setIsJoinModalOpen(false);
    toast({
      title: "Session Joined",
      description: "You have successfully joined the live session"
    });
  };

  const handleRemindSession = (session: any) => {
    toast({
      title: "Reminder Set",
      description: `You will be notified about "${session.title}" session`,
    });
  };

  const handleExitVideoCall = () => {
    setActiveVideoCall(false);
    setSelectedSession(null);
    setIsHost(false);
    toast({
      title: "Session Left",
      description: "You have left the live session"
    });
  };

  const handleHostNewSession = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to host a session",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    setIsCreateModalOpen(true);
  };

  if (activeVideoCall && selectedSession && userData) {
    return (
      <PageLayout
        title={`Live Session: ${selectedSession.title}`}
        subtitle="Video Call in Progress"
        backgroundImage="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80"
      >
        <div className="w-full max-w-7xl mx-auto">
          <VideoCall
            sessionId={selectedSession.id.toString()}
            username={userData.username}
            email={userData.email}
            isHost={isHost}
            onExit={handleExitVideoCall}
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Live Learning Sessions" 
      subtitle="Interactive classes with industry experts"
      backgroundImage="https://images.unsplash.com/photo-1476357471311-43c0db9fb2b4?auto=format&fit=crop&w=1200&q=80"
    >
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-end mb-6">
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
            onClick={handleHostNewSession}
          >
            <Plus className="mr-2 h-4 w-4" /> Host New Session
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid grid-cols-2 bg-black/30 border border-white/10 mb-8 w-full">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-purple-800/50">
              Upcoming Sessions
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-purple-800/50">
              Past Recordings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-0">
            <div className="glass-morphism p-4 sm:p-6 rounded-xl mb-8 max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <CalendarIcon className="text-blue-400 w-8 h-8 sm:w-10 sm:h-10" />
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Join Our Next Session</h2>
                  <p className="text-sm sm:text-base text-gray-300">Advanced React Hooks - May 5, 2025</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
              {upcomingSessions.map(session => (
                <SessionCard 
                  key={session.id} 
                  session={session} 
                  onJoin={handleJoinSessionClick}
                  onRemind={handleRemindSession}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {pastSessions.map(session => (
                <SessionCard key={session.id} session={session} isPast={true} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <CreateSessionModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSessionCreated={handleCreateSession}
      />

      <JoinSessionModal
        open={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        session={selectedSession}
        onJoin={handleJoinSession}
      />
    </PageLayout>
  );
};

export default LiveSessions;
