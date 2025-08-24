-- Fix email exposure vulnerability in live_session_participants table
-- Drop the current permissive policy that allows access to all data including emails
DROP POLICY IF EXISTS "Users can view session participants basic info" ON live_session_participants;

-- Create a restrictive policy that completely blocks direct SELECT access to the table
-- This forces all access to go through the secure get_session_participants function
CREATE POLICY "Block direct table access" 
ON live_session_participants 
FOR SELECT 
USING (false);

-- Keep the existing host-only policy for full access (this was already correctly restrictive)
-- "Session hosts can view all participant details including emails" - this one is fine

-- The INSERT and UPDATE policies are fine as they don't expose email data

-- Note: All legitimate access should go through the get_session_participants() function
-- which properly handles email visibility based on whether the user is a session host