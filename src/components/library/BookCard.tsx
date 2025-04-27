
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, BookOpen, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Book as BookType } from "@/types/library";

interface BookCardProps {
  book: BookType;
}

const BookCard = ({ book }: BookCardProps) => {
  const handleReadBook = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      // Redirect to auth page if not logged in
      window.location.href = "/auth";
      return;
    }

    const { data, error } = await supabase
      .from("user_books")
      .upsert({
        book_id: book.id,
        user_id: session.session.user.id,
        status: "reading",
        last_read_at: new Date().toISOString(),
      })
      .select("*");

    if (!error) {
      window.location.href = `/books/${book.id}`;
    }
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

      <CardFooter className="border-t border-white/5 pt-4">
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          onClick={handleReadBook}
        >
          <BookOpen className="mr-2 h-4 w-4" /> Read Book
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
