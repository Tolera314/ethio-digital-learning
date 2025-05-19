
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReadingSession } from "@/types/readingSessions";
import { Book } from "@/types/library";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Users, Calendar, Clock, ExternalLink } from "lucide-react";
import { formatDistance } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { logActivity } from "@/utils/activityLogger";

interface ReadingSessionsProps {
  book: Book;
  onCreateSession: () => void;
}

const ReadingSessions = ({ book, onCreateSession }: ReadingSessionsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: sessions, isLoading, refetch } = useQuery({
    queryKey: ["reading-sessions", book.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reading_sessions" as any)
        .select("*")
        .eq("book_id", book.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data as ReadingSession[];
    },
  });

  const { data: participantCounts } = useQuery({
    queryKey: ["session-participants-count", sessions?.map(s => s.id).join("-")],
    enabled: !!sessions && sessions.length > 0,
    queryFn: async () => {
      if (!sessions || sessions.length === 0) return {};
      
      const { data, error } = await supabase
        .from("session_participants" as any)
        .select("session_id, id")
        .in("session_id", sessions.map(s => s.id));
        
      if (error) throw error;
      
      // Count participants per session
      return (data as any[]).reduce((acc, curr) => {
        if (!acc[curr.session_id]) {
          acc[curr.session_id] = 0;
        }
        acc[curr.session_id]++;
        return acc;
      }, {} as Record<string, number>);
    },
  });
  
  const { data: myParticipations } = useQuery({
    queryKey: ["my-participations", sessions?.map(s => s.id).join("-")],
    enabled: !!user && !!sessions && sessions.length > 0,
    queryFn: async () => {
      if (!user || !sessions || sessions.length === 0) return [];
      
      const { data, error } = await supabase
        .from("session_participants" as any)
        .select("session_id")
        .eq("user_id", user.id)
        .in("session_id", sessions.map(s => s.id));
        
      if (error) throw error;
      return (data as any[]).map(p => p.session_id);
    },
  });
  
  const handleJoinSession = async (session: ReadingSession) => {
    if (!user) {
      toast.error("You must be logged in to join a reading session");
      navigate("/auth");
      return;
    }
    
    try {
      const isAlreadyJoined = myParticipations?.includes(session.id);
      
      if (!isAlreadyJoined) {
        const { error } = await supabase
          .from("session_participants" as any)
          .insert({
            session_id: session.id,
            user_id: user.id,
          });
          
        if (error) throw error;
      }
      
      // Log activity
      await logActivity(
        'session_join',
        session.id,
        'reading_session',
        { 
          title: session.title,
          book_title: book.title,
          book_id: book.id
        }
      );
      
      // Redirect to reading session
      navigate(`/books/${book.id}/sessions/${session.id}`);
    } catch (error: any) {
      toast.error(`Failed to join reading session: ${error.message}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-10 h-10 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!sessions || sessions.length === 0) {
    return (
      <Card className="bg-black/30 border border-white/10 text-center p-6">
        <p className="text-gray-300 mb-4">No active reading sessions for this book.</p>
        {user && (
          <Button 
            onClick={onCreateSession}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            Start a Reading Session
          </Button>
        )}
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Active Reading Sessions</h3>
        {user && (
          <Button 
            onClick={onCreateSession}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            Start New Session
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {sessions.map((session) => {
          const isCreator = user?.id === session.created_by;
          const isParticipant = myParticipations?.includes(session.id);
          const participantCount = participantCounts?.[session.id] || 0;
          
          return (
            <Card key={session.id} className="bg-black/40 border border-white/10 hover:border-purple-500/30">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-white">{session.title}</CardTitle>
                  <Badge variant="outline" className="bg-purple-900/50 text-purple-200 border-purple-400/30">
                    {isCreator ? "Your Session" : isParticipant ? "Joined" : "Open"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                {session.description && (
                  <p className="text-gray-300 mb-3 text-sm">{session.description}</p>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Started {formatDistance(new Date(session.start_time), new Date(), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t border-white/5 pt-4">
                <Button 
                  onClick={() => handleJoinSession(session)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                >
                  {isParticipant ? "Continue Reading" : "Join Session"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ReadingSessions;
