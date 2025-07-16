-- First, let's add proper sample data and fix authentication issues
-- Add sample user roles for testing (using a test user ID)
INSERT INTO public.user_roles (user_id, role) 
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'instructor'), 
  ('00000000-0000-0000-0000-000000000003', 'student')
ON CONFLICT (user_id, role) DO NOTHING;

-- Add more comprehensive book data
INSERT INTO public.books (id, title, author, category, description, cover_image, publication_year) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-123456789012', 'The Psychology of Learning', 'Dr. Sarah Johnson', 'Psychology', 'An comprehensive guide to understanding how the mind learns and retains information.', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 2023),
  ('b2c3d4e5-f6g7-8901-bcde-234567890123', 'Modern Web Development', 'Alex Chen', 'Technology', 'Master the latest techniques in web development including React, TypeScript, and cloud technologies.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400', 2024),
  ('c3d4e5f6-g7h8-9012-cdef-345678901234', 'Business Strategy Fundamentals', 'Maria Rodriguez', 'Business', 'Essential principles for developing and executing successful business strategies.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 2023),
  ('d4e5f6g7-h8i9-0123-defa-456789012345', 'Creative Writing Workshop', 'James Mitchell', 'Literature', 'Develop your creative writing skills through practical exercises and proven techniques.', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400', 2022)
ON CONFLICT (id) DO NOTHING;

-- Add instructor channels
INSERT INTO public.instructor_channels (id, instructor_id, channel_name, description) VALUES
  ('ch1-1234-5678-9012-123456789012', '00000000-0000-0000-0000-000000000002', 'Psychology Mastery', 'Deep dives into psychological concepts and learning methodologies'),
  ('ch2-2345-6789-0123-234567890123', '00000000-0000-0000-0000-000000000002', 'Web Dev Academy', 'Complete courses on modern web development practices'),
  ('ch3-3456-7890-1234-345678901234', '00000000-0000-0000-0000-000000000002', 'Business Leadership', 'Strategic thinking and leadership development content')
ON CONFLICT (id) DO NOTHING;

-- Add sample content uploads
INSERT INTO public.content_uploads (id, instructor_id, channel_id, title, description, file_name, file_type, file_url, is_published, tags) VALUES
  ('cu1-1234-5678-9012-123456789012', '00000000-0000-0000-0000-000000000002', 'ch1-1234-5678-9012-123456789012', 'Introduction to Cognitive Psychology', 'Learn the fundamentals of how the mind processes information', 'intro-cognitive-psych.mp4', 'video/mp4', 'https://example.com/videos/intro-cognitive-psych.mp4', true, ARRAY['psychology', 'cognitive', 'introduction']),
  ('cu2-2345-6789-0123-234567890123', '00000000-0000-0000-0000-000000000002', 'ch2-2345-6789-0123-234567890123', 'React Hooks Deep Dive', 'Master React hooks with practical examples', 'react-hooks-deep-dive.mp4', 'video/mp4', 'https://example.com/videos/react-hooks.mp4', true, ARRAY['react', 'javascript', 'hooks']),
  ('cu3-3456-7890-1234-345678901234', '00000000-0000-0000-0000-000000000002', 'ch3-3456-7890-1234-345678901234', 'Strategic Planning Worksheet', 'A comprehensive template for strategic business planning', 'strategic-planning.pdf', 'application/pdf', 'https://example.com/docs/strategic-planning.pdf', true, ARRAY['business', 'strategy', 'planning'])
ON CONFLICT (id) DO NOTHING;

-- Add more reading sessions with proper relationships
INSERT INTO public.reading_sessions (id, book_id, created_by, title, description, start_time, end_time, meeting_link) VALUES
  ('rs4-4567-8901-2345-456789012345', 'a1b2c3d4-e5f6-7890-abcd-123456789012', '00000000-0000-0000-0000-000000000002', 'Psychology Study Group', 'Weekly discussion on learning psychology principles', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 2 hours', 'https://meet.google.com/psychology-study'),
  ('rs5-5678-9012-3456-567890123456', 'b2c3d4e5-f6g7-8901-bcde-234567890123', '00000000-0000-0000-0000-000000000002', 'Web Dev Bootcamp', 'Intensive web development learning session', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 3 hours', 'https://meet.google.com/webdev-bootcamp'),
  ('rs6-6789-0123-4567-678901234567', 'c3d4e5f6-g7h8-9012-cdef-345678901234', '00000000-0000-0000-0000-000000000002', 'Business Strategy Workshop', 'Interactive session on business strategy development', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 4 hours', 'https://meet.google.com/business-strategy')
ON CONFLICT (id) DO NOTHING;

-- Add user preferences for the sample users
INSERT INTO public.user_preferences (user_id, theme, display_recent_activity) VALUES
  ('00000000-0000-0000-0000-000000000001', 'dark', true),
  ('00000000-0000-0000-0000-000000000002', 'light', true),
  ('00000000-0000-0000-0000-000000000003', 'system', true)
ON CONFLICT (user_id) DO NOTHING;

-- Add profiles for sample users
INSERT INTO public.profiles (id, full_name, bio, department, avatar_url) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Admin User', 'System administrator with full access', 'Administration', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'),
  ('00000000-0000-0000-0000-000000000002', 'Dr. Sarah Johnson', 'Expert instructor in psychology and web development', 'Education', 'https://images.unsplash.com/photo-1494790108755-2616b9c2c233?w=400'),
  ('00000000-0000-0000-0000-000000000003', 'Student User', 'Eager learner exploring various subjects', 'Student Body', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400')
ON CONFLICT (id) DO NOTHING;