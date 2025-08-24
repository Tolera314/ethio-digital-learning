export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_category: string
          event_name: string
          id: string
          ip_address: unknown | null
          properties: Json | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_category: string
          event_name: string
          id?: string
          ip_address?: unknown | null
          properties?: Json | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_category?: string
          event_name?: string
          id?: string
          ip_address?: unknown | null
          properties?: Json | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      books: {
        Row: {
          author: string
          available: boolean | null
          category: string
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          publication_year: number | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          available?: boolean | null
          category: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          publication_year?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          available?: boolean | null
          category?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          publication_year?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_type: string
          certificate_url: string | null
          course_id: string | null
          created_at: string
          description: string | null
          id: string
          is_verified: boolean
          issued_date: string
          metadata: Json | null
          title: string
          user_id: string | null
          verification_code: string
        }
        Insert: {
          certificate_type?: string
          certificate_url?: string | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_verified?: boolean
          issued_date?: string
          metadata?: Json | null
          title: string
          user_id?: string | null
          verification_code: string
        }
        Update: {
          certificate_type?: string
          certificate_url?: string | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_verified?: boolean
          issued_date?: string
          metadata?: Json | null
          title?: string
          user_id?: string | null
          verification_code?: string
        }
        Relationships: []
      }
      content_comments: {
        Row: {
          comment_text: string
          content_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment_text: string
          content_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment_text?: string
          content_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_comments_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      content_interactions: {
        Row: {
          content_id: string
          created_at: string
          id: string
          interaction_type: string
          user_id: string
        }
        Insert: {
          content_id: string
          created_at?: string
          id?: string
          interaction_type: string
          user_id: string
        }
        Update: {
          content_id?: string
          created_at?: string
          id?: string
          interaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_interactions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      content_ratings: {
        Row: {
          content_id: string
          created_at: string
          id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          content_id: string
          created_at?: string
          id?: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          content_id?: string
          created_at?: string
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_ratings_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      content_uploads: {
        Row: {
          channel_id: string
          created_at: string
          description: string | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          instructor_id: string
          is_published: boolean
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          description?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          instructor_id: string
          is_published?: boolean
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          instructor_id?: string
          is_published?: boolean
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_uploads_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "instructor_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      instructor_channels: {
        Row: {
          channel_name: string
          created_at: string
          description: string | null
          id: string
          instructor_id: string
          updated_at: string
        }
        Insert: {
          channel_name: string
          created_at?: string
          description?: string | null
          id?: string
          instructor_id: string
          updated_at?: string
        }
        Update: {
          channel_name?: string
          created_at?: string
          description?: string | null
          id?: string
          instructor_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      live_session_participants: {
        Row: {
          email: string
          id: string
          is_active: boolean
          joined_at: string
          left_at: string | null
          session_id: string | null
          user_id: string | null
          username: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          joined_at?: string
          left_at?: string | null
          session_id?: string | null
          user_id?: string | null
          username: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          joined_at?: string
          left_at?: string | null
          session_id?: string | null
          user_id?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      live_sessions: {
        Row: {
          created_at: string
          description: string | null
          end_time: string | null
          host_id: string | null
          id: string
          max_participants: number | null
          recording_url: string | null
          start_time: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          host_id?: string | null
          id?: string
          max_participants?: number | null
          recording_url?: string | null
          start_time?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          host_id?: string | null
          id?: string
          max_participants?: number | null
          recording_url?: string | null
          start_time?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          payment_type: string
          product_id: string | null
          product_type: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_type?: string
          product_id?: string | null
          product_type?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_type?: string
          product_id?: string | null
          product_type?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          department: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          identifier: string
          requests_count: number | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          identifier: string
          requests_count?: number | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          identifier?: string
          requests_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      reading_sessions: {
        Row: {
          book_id: string
          created_at: string
          created_by: string
          description: string | null
          end_time: string | null
          id: string
          is_active: boolean
          meeting_link: string | null
          start_time: string
          title: string
        }
        Insert: {
          book_id: string
          created_at?: string
          created_by: string
          description?: string | null
          end_time?: string | null
          id?: string
          is_active?: boolean
          meeting_link?: string | null
          start_time?: string
          title: string
        }
        Update: {
          book_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          id?: string
          is_active?: boolean
          meeting_link?: string | null
          start_time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_sessions_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          created_at: string | null
          details: Json | null
          endpoint: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          endpoint?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          endpoint?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      session_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          page_number: number | null
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          page_number?: number | null
          session_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          page_number?: number | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_comments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "reading_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_participants: {
        Row: {
          current_page: number
          id: string
          joined_at: string
          last_active_at: string
          session_id: string
          user_id: string
        }
        Insert: {
          current_page?: number
          id?: string
          joined_at?: string
          last_active_at?: string
          session_id: string
          user_id: string
        }
        Update: {
          current_page?: number
          id?: string
          joined_at?: string
          last_active_at?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "reading_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_books: {
        Row: {
          book_id: string
          created_at: string
          id: string
          last_read_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          last_read_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          last_read_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          display_recent_activity: boolean | null
          id: string
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_recent_activity?: boolean | null
          id?: string
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_recent_activity?: boolean | null
          id?: string
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      session_participants_safe: {
        Row: {
          email: string | null
          id: string | null
          is_active: boolean | null
          joined_at: string | null
          left_at: string | null
          session_id: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          email?: never
          id?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          left_at?: string | null
          session_id?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          email?: never
          id?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          left_at?: string | null
          session_id?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_rate_limit: {
        Args: {
          _endpoint: string
          _identifier: string
          _max_requests?: number
          _window_minutes?: number
        }
        Returns: boolean
      }
      generate_verification_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_session_participants: {
        Args: { session_uuid: string }
        Returns: {
          email: string
          id: string
          is_active: boolean
          joined_at: string
          left_at: string
          session_id: string
          user_id: string
          username: string
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          _details?: Json
          _endpoint?: string
          _event_type: string
          _ip_address?: unknown
          _success?: boolean
          _user_agent?: string
          _user_id?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "instructor" | "student" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "instructor", "student", "super_admin"],
    },
  },
} as const
