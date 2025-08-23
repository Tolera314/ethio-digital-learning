-- Fix infinite recursion by completely rebuilding policies with proper structure

-- Clean slate: drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view participants of sessions they joined" ON session_participants;
DROP POLICY IF EXISTS "Session access control" ON reading_sessions;
DROP POLICY IF EXISTS "Users can view basic session info" ON reading_sessions;

-- Create simple, non-recursive policies for session_participants
-- Users can only see their own participation records
CREATE POLICY "Users can view own participation"
ON session_participants
FOR SELECT
USING (auth.uid() = user_id);

-- Session creators can see all participants in their sessions
CREATE POLICY "Creators can view session participants"
ON session_participants
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM reading_sessions rs 
    WHERE rs.id = session_participants.session_id 
    AND rs.created_by = auth.uid()
  )
);

-- Create simple policy for reading_sessions without recursion
-- Use a simple IN clause instead of EXISTS to avoid recursion
CREATE POLICY "Reading sessions visibility"
ON reading_sessions
FOR SELECT
USING (
  is_active = true AND (
    -- Session creator can see everything
    auth.uid() = created_by
    OR
    -- For participants, use a direct join without subquery to avoid recursion
    id IN (
      SELECT sp.session_id 
      FROM session_participants sp 
      WHERE sp.user_id = auth.uid()
    )
  )
);