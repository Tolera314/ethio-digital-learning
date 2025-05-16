
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logActivity } from "@/utils/activityLogger";
import type { Book as BookType } from "@/types/library";

interface BookCardProps {
  book: BookType;
}

const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate();
  const [showCollaborative, setShowCollaborative] = useState(false);

  const handleReadBook = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      // Redirect to auth page if not logged in
      navigate("/auth");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_books")
        .upsert({
          book_id: book.id,
          user_id: session.session.user.id,
          status: "reading",
          last_read_at: new Date().toISOString(),
        })
        .select("*");

      if (error) throw error;
      
      // Log the activity
      await logActivity(
        'book_view',
        book.id,
        'book',
        { 
          title: book.title,
          author: book.author,
          category: book.category
        }
      );

      navigate(`/books/${book.id}`);
    } catch (error: any) {
      toast.error(`Failed to start reading: ${error.message}`);
    }
  };

  const handleToggleCollaborative = () => {
    setShowCollaborative(!showCollaborative);
  };

  return (
    <Card className="overflow-hidden bg-black/40 border border-white/10 backdrop-blur-lg hover:shadow-purple-500/20 transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={book.cover_image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80"}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-purple-900/50 text-purple-200 border-purple-400/30">
            {book.category}
          </Badge>
          <Badge variant="outline" className="bg-blue-900/50 text-blue-200 border-blue-400/30">
            {book.publication_year}
          </Badge>
        </div>
        <CardTitle className="text-xl text-white line-clamp-2">{book.title}</CardTitle>
        <p className="text-sm text-gray-400">By {book.author}</p>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-300 line-clamp-3">{book.description}</p>
      </CardContent>

      <CardFooter className="border-t border-white/5 pt-4 flex flex-col gap-2">
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          onClick={handleReadBook}
        >
          <BookOpen className="mr-2 h-4 w-4" /> Read Book
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full border-white/10 text-white hover:bg-white/5"
          onClick={handleToggleCollaborative}
        >
          <Users className="mr-2 h-4 w-4" /> Reading Groups
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
