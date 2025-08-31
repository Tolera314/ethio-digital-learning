import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Send, Users, MessageCircle, ExternalLink } from "lucide-react";
import { ReadingSession, SessionParticipant, SessionComment } from "@/types/readingSessions";
import { Book as BookType } from "@/types/library";
import { formatDistance } from "date-fns";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

const ReadingSessionPage = () => {
  const { bookId, sessionId } = useParams<{ bookId: string; sessionId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasJoined, setHasJoined] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  
  const { register, handleSubmit, reset } = useForm<{ comment: string }>();
  
  // Get session details
  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ["reading-session", sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error("Session ID is required");
      
      const { data, error } = await supabase
        .from("reading_sessions" as any)
        .select("*")
        .eq("id", sessionId)
        .single();
        
      if (error) throw error;
      return data as unknown as ReadingSession;
    },
    enabled: !!sessionId,
  });
  
  // Get book details
  const { data: book, isLoading: isLoadingBook } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      if (!bookId) throw new Error("Book ID is required");
      
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", bookId)
        .single();
        
      if (error) throw error;
      return data as BookType;
    },
    enabled: !!bookId,
  });
  
  // Get participants
  const { data: participants, refetch: refetchParticipants } = useQuery({
    queryKey: ["session-participants", sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error("Session ID is required");
      
      const { data, error } = await supabase
        .from("session_participants" as any)
        .select("*")
        .eq("session_id", sessionId);
        
      if (error) throw error;
      
      const typedData = data as unknown as SessionParticipant[];
      setParticipantCount(typedData.length);
      
      // Check if current user has joined
      if (user) {
        const joined = typedData.some(p => p.user_id === user.id);
        setHasJoined(joined);
        
        // If joined, set current page
        if (joined) {
          const userParticipant = typedData.find(p => p.user_id === user.id);
          if (userParticipant) {
            setCurrentPage(userParticipant.current_page);
          }
        }
      }
      
      return typedData;
    },
    enabled: !!sessionId && !!user,
  });
  
  // Get comments
  const { data: comments, refetch: refetchComments } = useQuery({
    queryKey: ["session-comments", sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error("Session ID is required");
      
      const { data, error } = await supabase
        .from("session_comments" as any)
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
        
      if (error) throw error;
      return data as unknown as SessionComment[];
    },
    enabled: !!sessionId,
  });
  
  // Set up optimized realtime subscription for comments and participants
  useEffect(() => {
    if (!sessionId) return;
    
    console.log('ReadingSession: Setting up realtime subscriptions for session:', sessionId);
    
    const channel = supabase
      .channel(`reading-session-changes-${sessionId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'session_comments',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        console.log('ReadingSession: Comment change detected:', payload.eventType);
        refetchComments();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'session_participants',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        console.log('ReadingSession: Participant change detected:', payload.eventType);
        refetchParticipants();
      })
      .subscribe((status) => {
        console.log('ReadingSession: Subscription status:', status);
      });
      
    return () => {
      console.log('ReadingSession: Cleaning up realtime subscriptions');
      supabase.removeChannel(channel);
    };
  }, [sessionId, refetchComments, refetchParticipants]);
  
  // Update participant status
  useEffect(() => {
    const updateParticipantStatus = async () => {
      if (!user || !sessionId || !hasJoined) return;
      
      try {
        await supabase
          .from("session_participants" as any)
          .update({
            last_active_at: new Date().toISOString(),
            current_page: currentPage,
          })
          .eq("session_id", sessionId)
          .eq("user_id", user.id);
      } catch (error) {
        console.error("Failed to update participant status:", error);
      }
    };
    
    updateParticipantStatus();
    const interval = setInterval(updateParticipantStatus, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [user, sessionId, hasJoined, currentPage]);
  
  const handleJoinSession = async () => {
    if (!user) {
      toast.error("You must be logged in to join this session");
      navigate("/auth");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("session_participants" as any)
        .insert({
          session_id: sessionId,
          user_id: user.id,
        });
        
      if (error) throw error;
      
      toast.success("You have joined the reading session!");
      setHasJoined(true);
      refetchParticipants();
    } catch (error: any) {
      toast.error(`Failed to join reading session: ${error.message}`);
    }
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setCurrentPage(newPage);
  };
  
  const handleAddComment = async (data: { comment: string }) => {
    if (!user || !sessionId) {
      toast.error("You must be logged in to comment");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("session_comments" as any)
        .insert({
          session_id: sessionId,
          user_id: user.id,
          content: data.comment,
          page_number: currentPage,
        });
        
      if (error) throw error;
      
      toast.success("Comment added!");
      reset();
      refetchComments();
    } catch (error: any) {
      toast.error(`Failed to add comment: ${error.message}`);
    }
  };
  
  if (isLoadingSession || isLoadingBook) {
    return (
      <PageLayout
        title="Loading Reading Session"
        subtitle="Please wait..."
        backgroundImage="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80"
      >
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    );
  }
  
  if (!session || !book) {
    return (
      <PageLayout
        title="Session Not Found"
        subtitle="The reading session you're looking for doesn't exist"
        backgroundImage="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80"
      >
        <div className="max-w-xl mx-auto text-center py-10">
          <p className="text-gray-300 mb-6">
            The reading session you're trying to access may have been deleted or is no longer active.
          </p>
          <Button onClick={() => navigate(`/books/${bookId}`)}>
            Back to Book
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout
      title={session.title}
      subtitle={`Reading "${book.title}" by ${book.author}`}
      backgroundImage="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80"
    >
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Book content */}
          <div className="lg:col-span-2">
            <Card className="bg-black/40 border border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2" /> Page {currentPage}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="h-8 px-2 border-white/20"
                      disabled={currentPage <= 1}
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="h-8 px-2 border-white/20"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4">
                <div className="bg-black/40 border border-white/10 rounded-md p-8 min-h-[400px]">
                  <p className="text-gray-300">
                    This is a placeholder for the book content. In a real application, this would display the actual 
                    content of "{book.title}" on page {currentPage}.
                  </p>
                  <div className="my-6 border-l-4 border-purple-500 pl-4">
                    <p className="text-gray-300 italic">
                      "The best books are those that tell you what you already know."
                    </p>
                    <p className="text-gray-400 mt-2">- George Orwell</p>
                  </div>
                  <p className="text-gray-300">
                    As you read, you can discuss with others in the reading group using the chat 
                    panel. You can also see who else is currently reading along with you.
                  </p>
                </div>
              </CardContent>
              
              {!hasJoined && user && (
                <CardFooter className="border-t border-white/10 pt-4">
                  <Button 
                    onClick={handleJoinSession}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                  >
                    Join This Reading Session
                  </Button>
                </CardFooter>
              )}
              
              {!user && (
                <CardFooter className="border-t border-white/10 pt-4">
                  <Button 
                    onClick={() => navigate("/auth")}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                  >
                    Sign In to Join
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
          
          {/* Session info and chat */}
          <div>
            <div className="space-y-4">
              {/* Session info */}
              <Card className="bg-black/40 border border-white/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      <Users className="inline mr-2" size={18} /> 
                      Participants ({participantCount})
                    </CardTitle>
                    {session.meeting_link && (
                      <a
                        href={session.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
                      >
                        <ExternalLink size={14} className="mr-1" /> Video Call
                      </a>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="text-sm text-gray-400">
                    <p className="mb-2">
                      Created {formatDistance(new Date(session.created_at), new Date(), { addSuffix: true })}
                    </p>
                    {session.description && (
                      <p className="text-gray-300 mb-2">{session.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Comments */}
              <Card className="bg-black/40 border border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    <MessageCircle className="inline mr-2" size={18} /> Discussion
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    {comments && comments.length > 0 ? (
                      <div className="space-y-4">
                        {comments.map((comment) => (
                          <div key={comment.id} className="space-y-1">
                            <div className="flex items-start gap-2">
                              <div className="bg-purple-600 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                {comment.user_id === user?.id ? 'You' : 'U'}
                              </div>
                              <div className="bg-black/20 p-3 rounded-lg flex-1">
                                <div className="flex justify-between items-start">
                                  <div className="text-xs text-gray-400 mb-1">
                                    {comment.user_id === user?.id ? 'You' : 'User'} 
                                    {comment.page_number && ` • Page ${comment.page_number}`}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatDistance(new Date(comment.created_at), new Date(), { addSuffix: true })}
                                  </div>
                                </div>
                                <p className="text-gray-200">{comment.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <MessageCircle className="mx-auto mb-2 opacity-20" size={32} />
                        <p>No comments yet</p>
                        <p className="text-sm">Start the conversation!</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
                
                {hasJoined && (
                  <CardFooter className="border-t border-white/10 pt-4">
                    <form onSubmit={handleSubmit(handleAddComment)} className="w-full">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add a comment..." 
                          className="flex-1 bg-black/20 border-white/20" 
                          {...register("comment", { required: true })}
                        />
                        <Button type="submit">
                          <Send size={18} />
                        </Button>
                      </div>
                    </form>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ReadingSessionPage;
