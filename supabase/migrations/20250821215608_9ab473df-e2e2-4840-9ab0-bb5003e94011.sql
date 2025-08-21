-- Fix security vulnerability: Restrict meeting link visibility to session participants only

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view all active reading sessions" ON reading_sessions;

-- Create more secure policies with proper access control

-- Policy 1: Users can view basic session info (title, description) for active sessions
-- but NOT the meeting link unless they are participants or creators
CREATE POLICY "Users can view basic session info" 
ON reading_sessions 
FOR SELECT 
USING (
  is_active = true AND (
    -- Session creator can see everything
    auth.uid() = created_by 
    OR 
    -- Participants can see everything
    EXISTS (
      SELECT 1 FROM session_participants sp 
      WHERE sp.session_id = reading_sessions.id 
      AND sp.user_id = auth.uid()
    )
  )
);

-- Policy 2: Allow users to see limited session info for discovery (without meeting links)
-- This creates a view-like behavior where non-participants can see sessions exist but not join them
CREATE POLICY "Public can view session discovery info"
ON reading_sessions
FOR SELECT
USING (
  is_active = true AND 
  -- Only allow viewing basic fields, meeting_link will be filtered in application layer
  auth.uid() IS NOT NULL
);

-- Update the policy to be more specific - only participants and creators can access full details
DROP POLICY IF EXISTS "Public can view session discovery info" ON reading_sessions;

-- Create the final secure policy
CREATE POLICY "Session access control"
ON reading_sessions
FOR SELECT
USING (
  is_active = true AND (
    -- Session creator has full access
    auth.uid() = created_by
    OR
    -- Session participants have full access  
    EXISTS (
      SELECT 1 FROM session_participants sp
      WHERE sp.session_id = reading_sessions.id 
      AND sp.user_id = auth.uid()
    )
  )
);