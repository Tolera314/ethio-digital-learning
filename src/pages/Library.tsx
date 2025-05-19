
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Book, BookOpen, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import BookCard from "@/components/library/BookCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import type { Book as BookType } from "@/types/library";
import type { ReadingSession } from "@/types/readingSessions";

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("all");
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: books, isLoading } = useQuery({
    queryKey: ["books", searchQuery, tab],
    queryFn: async () => {
      let query = supabase.from("books").select("*");
      
      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }
      
      const { data, error } = await query.order("title");
      if (error) throw error;
      
      if (tab === "all" || !user) {
        return data as BookType[];
      } else {
        // Filter for my books if tab is "my-books"
        const { data: userBooks, error: userBooksError } = await supabase
          .from("user_books")
          .select("book_id")
          .eq("user_id", user.id);
          
        if (userBooksError) throw userBooksError;
        
        const bookIds = userBooks.map(item => item.book_id);
        return data.filter(book => bookIds.includes(book.id)) as BookType[];
      }
    },
  });
  
  const { data: activeSessions } = useQuery({
    queryKey: ["active-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reading_sessions" as any)
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(5);
        
      if (error) throw error;
      return data as ReadingSession[];
    },
  });
  
  const { data: activeBooks } = useQuery({
    queryKey: ["active-session-books", activeSessions?.map(s => s.book_id).join("-")],
    enabled: !!activeSessions && activeSessions.length > 0,
    queryFn: async () => {
      if (!activeSessions || activeSessions.length === 0) return [];
      
      const bookIds = [...new Set(activeSessions.map(s => s.book_id))];
      
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .in("id", bookIds);
        
      if (error) throw error;
      return data as BookType[];
    },
  });
  
  const handleJoinSession = (sessionId: string, bookId: string) => {
    if (!user) {
      toast.error("You must be logged in to join a reading session");
      navigate("/auth");
      return;
    }
    
    navigate(`/books/${bookId}/sessions/${sessionId}`);
  };

  return (
    <PageLayout
      title="Digital Library"
      subtitle="Discover and read from our collection of books"
      backgroundImage="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80"
    >
      <div className="w-full max-w-6xl mx-auto px-4 pb-12">
        {/* Active Reading Sessions */}
        {activeSessions && activeSessions.length > 0 && activeBooks && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Active Reading Groups</h2>
                <p className="text-gray-400">Join others currently reading and discussing these books</p>
              </div>
              {activeSessions.length > 5 && (
                <Button 
                  variant="link" 
                  className="text-purple-400 hover:text-purple-300"
                  onClick={() => navigate("/reading-sessions")}
                >
                  View all groups
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSessions.slice(0, 3).map((session) => {
                const book = activeBooks.find(b => b.id === session.book_id);
                if (!book) return null;
                
                return (
                  <Card key={session.id} className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 overflow-hidden">
                    <div className="flex h-full">
                      <div className="w-1/3">
                        <img 
                          src={book.cover_image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80"}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-4">
                        <h3 className="font-bold text-white mb-1 line-clamp-1">{session.title}</h3>
                        <p className="text-sm text-gray-300 mb-2 line-clamp-1">{book.title} by {book.author}</p>
                        <Button 
                          size="sm"
                          className="w-full mt-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                          onClick={() => handleJoinSession(session.id, book.id)}
                        >
                          <Users className="mr-2 h-4 w-4" /> Join Group
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="mb-8 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="search"
              placeholder="Search books by title..."
              className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {user && (
          <Tabs defaultValue="all" className="mb-8" value={tab} onValueChange={setTab}>
            <div className="flex justify-center">
              <TabsList className="bg-black/40">
                <TabsTrigger value="all" className="text-white data-[state=active]:text-white data-[state=active]:bg-purple-600">All Books</TabsTrigger>
                <TabsTrigger value="my-books" className="text-white data-[state=active]:text-white data-[state=active]:bg-purple-600">My Books</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        )}

        {isLoading ? (
          <div className="text-center text-gray-400 py-12">
            <div className="w-12 h-12 border-t-2 border-purple-500 border-opacity-50 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading books...</p>
          </div>
        ) : books && books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Book size={48} className="text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No books found</h3>
            <p className="text-gray-400">
              {tab === "my-books" 
                ? "You haven't added any books to your collection yet." 
                : "Try adjusting your search query."}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Library;
