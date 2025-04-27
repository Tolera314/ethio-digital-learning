
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Book, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import BookCard from "@/components/library/BookCard";
import type { Book as BookType } from "@/types/library";

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: books, isLoading } = useQuery({
    queryKey: ["books", searchQuery],
    queryFn: async () => {
      let query = supabase.from("books").select("*");
      
      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }
      
      const { data, error } = await query.order("title");
      if (error) throw error;
      return data as BookType[];
    },
  });

  return (
    <PageLayout
      title="Digital Library"
      subtitle="Discover and read from our collection of books"
      backgroundImage="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80"
    >
      <div className="w-full max-w-6xl mx-auto px-4">
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

        {isLoading ? (
          <div className="text-center text-gray-400">Loading books...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books?.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Library;
