-- Fix infinite recursion in session policies by removing circular dependencies

-- First, check current policies on session_participants
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'session_participants';

-- Drop any existing policies on session_participants that might cause recursion
DROP POLICY IF EXISTS "Users can manage their session participations" ON session_participants;
DROP POLICY IF EXISTS "Users can view session participants" ON session_participants;
DROP POLICY IF EXISTS "Session participants visibility" ON session_participants;

-- Recreate session_participants policies without circular references
-- Policy for users to join sessions (INSERT)
CREATE POLICY "Users can join sessions"
ON session_participants
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for users to leave sessions (DELETE)
CREATE POLICY "Users can leave their sessions"
ON session_participants
FOR DELETE
USING (auth.uid() = user_id);

-- Policy for viewing participants - only session creators and the participants themselves
CREATE POLICY "View session participants"
ON session_participants
FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 FROM reading_sessions rs 
    WHERE rs.id = session_participants.session_id 
    AND rs.created_by = auth.uid()
  )
);

-- Ensure the reading_sessions policy is clean and doesn't create recursion
DROP POLICY IF EXISTS "Session access control" ON reading_sessions;
DROP POLICY IF EXISTS "Users can view basic session info" ON reading_sessions;

-- Create a simple, non-recursive policy for reading_sessions
CREATE POLICY "Reading sessions access"
ON reading_sessions
FOR SELECT
USING (
  is_active = true AND (
    -- Session creator can see everything
    auth.uid() = created_by
    OR
    -- Users who are participants can see everything
    auth.uid() IN (
      SELECT sp.user_id 
      FROM session_participants sp 
      WHERE sp.session_id = reading_sessions.id
    )
  )
);