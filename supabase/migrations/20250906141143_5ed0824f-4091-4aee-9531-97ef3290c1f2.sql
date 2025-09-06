-- Fix infinite recursion and policy naming conflicts

-- First, drop ALL existing conflicting policies on reading_sessions
DROP POLICY IF EXISTS "Users can view reading sessions they have access to" ON reading_sessions;
DROP POLICY IF EXISTS "Allow session access" ON reading_sessions;
DROP POLICY IF EXISTS "Session access via function" ON reading_sessions;

-- Fix database functions security issues by setting proper search paths
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path = 'public';
ALTER FUNCTION public.get_user_role(uuid) SET search_path = 'public';
ALTER FUNCTION public.generate_verification_code() SET search_path = 'public';
ALTER FUNCTION public.set_certificate_verification_code() SET search_path = 'public';
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.handle_new_user_preferences() SET search_path = 'public';
ALTER FUNCTION public.check_rate_limit(text, text, integer, integer) SET search_path = 'public';
ALTER FUNCTION public.log_security_event(text, uuid, inet, text, text, boolean, jsonb) SET search_path = 'public';

-- Create optimized function to check session access without recursion
CREATE OR REPLACE FUNCTION public.can_access_reading_session(session_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_uuid uuid;
BEGIN
  user_uuid := auth.uid();
  
  -- Return false if no user
  IF user_uuid IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user is creator or participant
  RETURN EXISTS (
    SELECT 1 FROM reading_sessions 
    WHERE id = session_uuid 
    AND is_active = true 
    AND created_by = user_uuid
  ) OR EXISTS (
    SELECT 1 FROM session_participants 
    WHERE session_id = session_uuid 
    AND user_id = user_uuid
  );
END;
$$;

-- Create simple, non-recursive policy
CREATE POLICY "reading_sessions_access_policy" 
ON reading_sessions 
FOR SELECT 
USING (public.can_access_reading_session(id));

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_session_participants_session_user ON session_participants(session_id, user_id);
CREATE INDEX IF NOT EXISTS idx_session_comments_session_created ON session_comments(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_active_created ON reading_sessions(is_active, created_by);
CREATE INDEX IF NOT EXISTS idx_live_sessions_host_start ON live_sessions(host_id, start_time);

-- Fix live_session_participants policy  
DROP POLICY IF EXISTS "Block direct table access" ON live_session_participants;
DROP POLICY IF EXISTS "Participants can view session data" ON live_session_participants;

CREATE POLICY "live_session_participants_access" 
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