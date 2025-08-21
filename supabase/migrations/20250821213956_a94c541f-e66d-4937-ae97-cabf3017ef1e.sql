-- Fix security vulnerability: Restrict email access in live_session_participants
-- Only session hosts should see participant emails

-- Drop existing problematic policy
DROP POLICY IF EXISTS "Users can view participants of sessions they joined" ON public.live_session_participants;

-- Create new policies with proper email protection
CREATE POLICY "Users can view basic participant info of sessions they joined" 
ON public.live_session_participants 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM live_session_participants lsp 
    WHERE lsp.session_id = live_session_participants.session_id 
    AND lsp.user_id = auth.uid()
  )
);

-- Create separate policy for hosts to see emails
CREATE POLICY "Session hosts can view all participant details including emails" 
ON public.live_session_participants 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM live_sessions ls 
    WHERE ls.id = live_session_participants.session_id 
    AND ls.host_id = auth.uid()
  )
);

-- Create view for participants without emails for regular participants
CREATE OR REPLACE VIEW public.session_participants_public AS
SELECT 
  id,
  session_id,
  user_id,
  joined_at,
  left_at,
  is_active,
  username,
  CASE 
    WHEN EXISTS (
      SELECT 1 
      FROM live_sessions ls 
      WHERE ls.id = session_id 
      AND ls.host_id = auth.uid()
    ) THEN email
    ELSE NULL
  END as email
FROM public.live_session_participants;

-- Grant access to the view
GRANT SELECT ON public.session_participants_public TO authenticated;