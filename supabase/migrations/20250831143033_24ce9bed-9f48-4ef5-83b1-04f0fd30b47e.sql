-- Comprehensive fix for live session functionality and real-time communication

-- First, fix the infinite recursion in reading_sessions by completely recreating the RLS policies
DROP POLICY IF EXISTS "Users can view reading sessions they have access to" ON reading_sessions;

-- Create a simple, clear policy that avoids any recursion
CREATE POLICY "Allow session access" 
ON reading_sessions 
FOR SELECT 
USING (
  -- Session is active and user is either creator or participant
  is_active = true AND (
    created_by = auth.uid() OR 
    id IN (
      SELECT session_id FROM session_participants 
      WHERE user_id = auth.uid()
    )
  )
);

-- Fix database functions security issues by setting proper search paths
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path = 'public';
ALTER FUNCTION public.get_user_role(uuid) SET search_path = 'public';
ALTER FUNCTION public.generate_verification_code() SET search_path = 'public';
ALTER FUNCTION public.set_certificate_verification_code() SET search_path = 'public';
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.handle_new_user_preferences() SET search_path = 'public';
ALTER FUNCTION public.check_rate_limit(text, text, integer, integer) SET search_path = 'public';
ALTER FUNCTION public.log_security_event(text, uuid, inet, text, text, boolean, jsonb) SET search_path = 'public';

-- Enable real-time for all session-related tables
DO $$
BEGIN
  -- Add all session tables to realtime publication
  BEGIN
    ALTER publication supabase_realtime ADD TABLE reading_sessions;
  EXCEPTION 
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER publication supabase_realtime ADD TABLE session_participants;
  EXCEPTION 
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER publication supabase_realtime ADD TABLE session_comments;
  EXCEPTION 
    WHEN duplicate_object THEN NULL;
  END;
END $$;

-- Set replica identity for proper real-time updates
ALTER TABLE reading_sessions REPLICA IDENTITY FULL;
ALTER TABLE session_participants REPLICA IDENTITY FULL;
ALTER TABLE session_comments REPLICA IDENTITY FULL;

-- Create optimized function for session participants to avoid recursive queries
CREATE OR REPLACE FUNCTION public.get_session_access(session_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM reading_sessions rs 
    WHERE rs.id = session_uuid 
    AND rs.is_active = true 
    AND (
      rs.created_by = auth.uid() OR 
      EXISTS (
        SELECT 1 FROM session_participants sp 
        WHERE sp.session_id = session_uuid 
        AND sp.user_id = auth.uid()
      )
    )
  );
END;
$$;

-- Update reading_sessions policy to use the function
DROP POLICY IF EXISTS "Allow session access" ON reading_sessions;
CREATE POLICY "Session access via function" 
ON reading_sessions 
FOR SELECT 
USING (public.get_session_access(id));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_session_participants_session_user ON session_participants(session_id, user_id);
CREATE INDEX IF NOT EXISTS idx_session_comments_session_created ON session_comments(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_active_created ON reading_sessions(is_active, created_by);
CREATE INDEX IF NOT EXISTS idx_live_sessions_host_start ON live_sessions(host_id, start_time);

-- Add better RLS policy for live_session_participants to avoid the "false" policy
DROP POLICY IF EXISTS "Block direct table access" ON live_session_participants;
CREATE POLICY "Participants can view session data" 
ON live_session_participants 
FOR SELECT 
USING (
  -- User can see their own participation
  user_id = auth.uid() OR 
  -- Session host can see all participants
  EXISTS (
    SELECT 1 FROM live_sessions ls 
    WHERE ls.id = live_session_participants.session_id 
    AND ls.host_id = auth.uid()
  )
);