
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_image: string | null;
  category: string;
  publication_year: number;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserBook {
  id: string;
  user_id: string;
  book_id: string;
  status: 'bookmarked' | 'reading' | 'completed';
  last_read_at: string;
  created_at: string;
}
