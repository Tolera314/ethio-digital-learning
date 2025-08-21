-- Fix SECURITY DEFINER view issue
DROP VIEW IF EXISTS public.session_participants_public;

-- Instead of a view, create a secure function that filters emails properly
CREATE OR REPLACE FUNCTION public.get_session_participants(session_uuid uuid)
RETURNS TABLE (
  id uuid,
  session_id uuid,
  user_id uuid,
  joined_at timestamptz,
  left_at timestamptz,
  is_active boolean,
  username text,
  email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_host boolean := false;
BEGIN
  -- Check if current user is the session host
  SELECT EXISTS (
    SELECT 1 
    FROM live_sessions ls 
    WHERE ls.id = session_uuid 
    AND ls.host_id = auth.uid()
  ) INTO is_host;
  
  -- Return participant data with conditional email visibility
  RETURN QUERY
  SELECT 
    lsp.id,
    lsp.session_id,
    lsp.user_id,
    lsp.joined_at,
    lsp.left_at,
    lsp.is_active,
    lsp.username,
    CASE 
      WHEN is_host THEN lsp.email
      ELSE NULL
    END as email
  FROM live_session_participants lsp
  WHERE lsp.session_id = session_uuid
  AND EXISTS (
    SELECT 1 
    FROM live_session_participants check_participant
    WHERE check_participant.session_id = session_uuid 
    AND check_participant.user_id = auth.uid()
  );
END;
$$;