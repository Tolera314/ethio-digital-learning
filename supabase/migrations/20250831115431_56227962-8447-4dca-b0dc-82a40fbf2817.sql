-- Fix infinite recursion in reading_sessions RLS policies
-- The issue is caused by having two similar SELECT policies that may create circular dependencies

-- Drop the duplicate/conflicting policies
DROP POLICY IF EXISTS "Reading sessions access" ON reading_sessions;
DROP POLICY IF EXISTS "Reading sessions visibility" ON reading_sessions;

-- Create a single, clear SELECT policy that avoids recursion
CREATE POLICY "Users can view reading sessions they have access to" 
ON reading_sessions 
FOR SELECT 
USING (
  is_active = true AND (
    auth.uid() = created_by OR 
    EXISTS (
      SELECT 1 FROM session_participants sp 
      WHERE sp.session_id = reading_sessions.id 
      AND sp.user_id = auth.uid()
    )
  )
);

-- Enable real-time for reading sessions and related tables
ALTER publication supabase_realtime ADD TABLE reading_sessions;
ALTER publication supabase_realtime ADD TABLE session_participants;
ALTER publication supabase_realtime ADD TABLE session_comments;

-- Set replica identity for real-time updates
ALTER TABLE reading_sessions REPLICA IDENTITY FULL;
ALTER TABLE session_participants REPLICA IDENTITY FULL;
ALTER TABLE session_comments REPLICA IDENTITY FULL;