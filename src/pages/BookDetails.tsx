
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users } from "lucide-react";
import type { Book as BookType } from "@/types/library";
import ReadingSessions from "@/components/library/ReadingSessions";
import CreateSessionModal from "@/components/library/CreateSessionModal";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/utils/activityLogger";
import { toast } from "sonner";

const BookDetails = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { user } = useAuth();
  const [isCreateSessionModalOpen, setIsCreateSessionModalOpen] = useState(false);

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      if (!bookId) throw new Error("Book ID is required");
      
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", bookId)
        .single();
        
      if (error) throw error;
      
      // Log this activity
      if (user) {
        await logActivity(
          'book_view',
          bookId,
          'book',
          { 
            title: data.title,
            author: data.author,
            category: data.category
          }
        );
      }
      
      return data as BookType;
    },
    enabled: !!bookId,
  });
  
  const handleStartReading = async () => {
    if (!user) {
      toast.error("You must be logged in to read this book");
      return;
    }
    
    if (!book) return;
    
    try {
      const { error } = await supabase
        .from("user_books")
        .upsert({
          book_id: book.id,
          user_id: user.id,
          status: "reading",
          last_read_at: new Date().toISOString(),
        });
        
      if (error) throw error;
      
      toast.success(`You're now reading "${book.title}"`);
    } catch (error: any) {
      toast.error(`Failed to start reading: ${error.message}`);
    }
  };

  if (isLoading || !book) {
    return (
      <PageLayout
        title="Loading Book Details"
        subtitle="Please wait..."
        backgroundImage="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80"
      >
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={book.title}
      subtitle={`By ${book.author}`}
      backgroundImage="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80"
    >
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Info */}
          <div className="md:col-span-1">
            <Card className="bg-black/40 border border-white/10 overflow-hidden">
              <div className="h-80 overflow-hidden">
                <img 
                  src={book.cover_image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80"}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-purple-900/50 text-purple-200 border-purple-400/30">
                    {book.category}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-900/50 text-blue-200 border-blue-400/30">
                    {book.publication_year}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                    onClick={handleStartReading}
                  >
                    <BookOpen className="mr-2 h-4 w-4" /> Start Reading
                  </Button>
                  
                  {user && (
                    <Button
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/5"
                      onClick={() => setIsCreateSessionModalOpen(true)}
                    >
                      <Users className="mr-2 h-4 w-4" /> Create Reading Group
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Book Details and Sessions */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <Card className="bg-black/40 border border-white/10">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">About this Book</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{book.description}</p>
              </CardContent>
            </Card>
            
            {/* Reading Sessions */}
            <ReadingSessions 
              book={book} 
              onCreateSession={() => setIsCreateSessionModalOpen(true)} 
            />
          </div>
        </div>
      </div>
      
      {/* Create Session Modal */}
      <CreateSessionModal 
        book={book}
        isOpen={isCreateSessionModalOpen}
        onClose={() => setIsCreateSessionModalOpen(false)}
        onSessionCreated={() => {
          setIsCreateSessionModalOpen(false);
        }}
      />
    </PageLayout>
  );
};

export default BookDetails;
