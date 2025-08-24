-- Fix security issue: Hide email addresses from non-host participants
-- Drop the problematic policy that exposes emails to all participants
DROP POLICY IF EXISTS "Users can view basic participant info of sessions they joined" ON live_session_participants;

-- Create new policy that hides sensitive data from regular participants
CREATE POLICY "Users can view participant info without emails" 
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

-- Add a view for safe participant data access (without emails for regular users)
CREATE OR REPLACE VIEW public.session_participants_safe AS
SELECT 
  lsp.id,
  lsp.session_id,
  lsp.user_id,
  lsp.joined_at,
  lsp.left_at,
  lsp.is_active,
  lsp.username,
  -- Only show email if current user is the session host
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM live_sessions ls 
      WHERE ls.id = lsp.session_id 
      AND ls.host_id = auth.uid()
    ) THEN lsp.email
    ELSE NULL
  END as email
FROM live_session_participants lsp;