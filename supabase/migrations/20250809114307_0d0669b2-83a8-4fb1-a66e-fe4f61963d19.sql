-- Create rate limiting table for API security
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP address or user ID
  endpoint TEXT NOT NULL,
  requests_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient rate limit lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_endpoint 
ON public.rate_limits(identifier, endpoint, window_start);

-- Enable RLS on rate_limits table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only allow system to manage rate limits
CREATE POLICY "System can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (true);

-- Function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _identifier TEXT,
  _endpoint TEXT,
  _max_requests INTEGER DEFAULT 100,
  _window_minutes INTEGER DEFAULT 60
) RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate window start time
  window_start := NOW() - (_window_minutes || ' minutes')::INTERVAL;
  
  -- Clean up old entries
  DELETE FROM public.rate_limits 
  WHERE window_start < (NOW() - (_window_minutes || ' minutes')::INTERVAL);
  
  -- Get current count for this identifier/endpoint in the window
  SELECT COALESCE(SUM(requests_count), 0) 
  INTO current_count
  FROM public.rate_limits 
  WHERE identifier = _identifier 
    AND endpoint = _endpoint 
    AND window_start >= (NOW() - (_window_minutes || ' minutes')::INTERVAL);
  
  -- Check if limit exceeded
  IF current_count >= _max_requests THEN
    RETURN FALSE;
  END IF;
  
  -- Insert or update rate limit record
  INSERT INTO public.rate_limits (identifier, endpoint, requests_count, window_start)
  VALUES (_identifier, _endpoint, 1, NOW())
  ON CONFLICT (id) DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add security audit log table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  endpoint TEXT,
  success BOOLEAN DEFAULT TRUE,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on security audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view security logs
CREATE POLICY "Admins can view security logs" 
ON public.security_audit_log 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert security logs
CREATE POLICY "System can insert security logs" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (true);

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  _event_type TEXT,
  _user_id UUID DEFAULT NULL,
  _ip_address INET DEFAULT NULL,
  _user_agent TEXT DEFAULT NULL,
  _endpoint TEXT DEFAULT NULL,
  _success BOOLEAN DEFAULT TRUE,
  _details JSONB DEFAULT '{}'
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    event_type, user_id, ip_address, user_agent, endpoint, success, details
  ) VALUES (
    _event_type, _user_id, _ip_address, _user_agent, _endpoint, _success, _details
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;