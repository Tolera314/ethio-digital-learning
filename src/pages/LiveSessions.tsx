
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Video, Calendar as CalendarIcon, Bell } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const upcomingSessions = [
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

const SessionCard = ({ session, isPast = false }: { session: any; isPast?: boolean }) => (
  <Card className="overflow-hidden bg-black/40 border border-white/10 backdrop-blur-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1">
    <div className="relative h-40">
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
      <CardTitle className="text-xl text-gray-100">{session.title}</CardTitle>
      <p className="text-sm text-gray-300">Instructor: {session.instructor}</p>
    </CardHeader>
    <CardContent className="pb-4">
      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-blue-400" />
          <span className="text-gray-300">{session.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-purple-400" />
          <span className="text-gray-300">{session.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-green-400" />
          <span className="text-gray-300">{session.participants} participants</span>
        </div>
        <div className="flex items-center gap-2">
          <Video size={16} className="text-red-400" />
          <span className="text-gray-300">{session.category}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter className="border-t border-white/5 pt-4">
      {isPast ? (
        <Button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white">
          <Video size={16} className="mr-2" /> Watch Recording
        </Button>
      ) : (
        <div className="flex w-full gap-3">
          <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
            Join Session
          </Button>
          <Button variant="outline" className="border-white/20 hover:bg-white/10">
            <Bell size={16} /> Remind
          </Button>
        </div>
      )}
    </CardFooter>
  </Card>
);

const LiveSessions = () => {
  return (
    <PageLayout 
      title="Live Learning Sessions" 
      subtitle="Interactive classes with industry experts"
      backgroundImage="https://images.unsplash.com/photo-1476357471311-43c0db9fb2b4?auto=format&fit=crop&w=1200&q=80"
    >
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-2 bg-black/30 border border-white/10 mb-8">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-purple-800/50">
            Upcoming Sessions
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-purple-800/50">
            Past Recordings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-0">
          <div className="glass-morphism p-6 rounded-xl mb-8 max-w-xl mx-auto">
            <div className="flex items-center justify-center">
              <CalendarIcon size={40} className="text-blue-400 mr-4" />
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white">Join Our Next Session</h2>
                <p className="text-gray-300">Advanced React Hooks - May 5, 2025</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {upcomingSessions.map(session => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastSessions.map(session => (
              <SessionCard key={session.id} session={session} isPast={true} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-400 mb-4">Looking for more past sessions?</p>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
              Browse Full Archive
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default LiveSessions;
