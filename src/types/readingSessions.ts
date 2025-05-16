
export interface ReadingSession {
  id: string;
  book_id: string;
  created_by: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  is_active: boolean;
  created_at: string;
  meeting_link: string | null;
}

export interface SessionParticipant {
  id: string;
  session_id: string;
  user_id: string;
  joined_at: string;
  last_active_at: string;
  current_page: number;
}

export interface SessionComment {
  id: string;
  session_id: string;
  user_id: string;
  content: string;
  page_number: number | null;
  created_at: string;
  user_name?: string; // For display purposes
}
