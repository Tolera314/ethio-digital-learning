
-- Create instructor channels table
CREATE TABLE public.instructor_channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(instructor_id)
);

-- Create content uploads table
CREATE TABLE public.content_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES public.instructor_channels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'video', 'document', 'presentation', 'other'
  file_name TEXT NOT NULL,
  file_size BIGINT,
  tags TEXT[],
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content interactions table (likes, reports)
CREATE TABLE public.content_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.content_uploads(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'report')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_id, interaction_type)
);

-- Create content comments table
CREATE TABLE public.content_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.content_uploads(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content ratings table
CREATE TABLE public.content_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.content_uploads(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Enable RLS on all tables
ALTER TABLE public.instructor_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for instructor_channels
CREATE POLICY "Instructors can manage their own channels" ON public.instructor_channels
  FOR ALL USING (auth.uid() = instructor_id);

CREATE POLICY "Everyone can view channels" ON public.instructor_channels
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage all channels" ON public.instructor_channels
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for content_uploads
CREATE POLICY "Instructors can manage their own content" ON public.content_uploads
  FOR ALL USING (auth.uid() = instructor_id);

CREATE POLICY "Students can view published content" ON public.content_uploads
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all content" ON public.content_uploads
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for content_interactions
CREATE POLICY "Users can manage their own interactions" ON public.content_interactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view interactions" ON public.content_interactions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage all interactions" ON public.content_interactions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for content_comments
CREATE POLICY "Users can manage their own comments" ON public.content_comments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view comments" ON public.content_comments
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage all comments" ON public.content_comments
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for content_ratings
CREATE POLICY "Users can manage their own ratings" ON public.content_ratings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view ratings" ON public.content_ratings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage all ratings" ON public.content_ratings
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for content uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('content-uploads', 'content-uploads', true);

-- Storage policies for content uploads
CREATE POLICY "Instructors can upload content" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'content-uploads' AND 
    has_role(auth.uid(), 'instructor'::app_role)
  );

CREATE POLICY "Instructors can update their own content" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'content-uploads' AND 
    has_role(auth.uid(), 'instructor'::app_role)
  );

CREATE POLICY "Everyone can view content" ON storage.objects
  FOR SELECT USING (bucket_id = 'content-uploads');

CREATE POLICY "Admins can manage all content files" ON storage.objects
  FOR ALL USING (
    bucket_id = 'content-uploads' AND 
    has_role(auth.uid(), 'admin'::app_role)
  );
