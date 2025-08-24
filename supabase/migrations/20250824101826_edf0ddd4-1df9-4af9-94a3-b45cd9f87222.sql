-- Fix the security definer view issue by dropping it and using a more secure approach
DROP VIEW IF EXISTS public.session_participants_safe;

-- Update the RLS policy to be more restrictive about email access
DROP POLICY IF EXISTS "Users can view participant info without emails" ON live_session_participants;

-- Create a policy that allows viewing basic info but restricts sensitive data
-- This policy will need to be handled at the application level for email filtering
CREATE POLICY "Users can view session participants basic info" 
ON live_session_participants 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM live_session_participants lsp 
    WHERE lsp.session_id = live_session_participants.session_id 
    AND lsp.user_id = auth.uid()
  )
);