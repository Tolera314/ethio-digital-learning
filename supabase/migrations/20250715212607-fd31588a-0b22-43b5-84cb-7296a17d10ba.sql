-- Add sample books data
INSERT INTO public.books (title, author, category, description, cover_image, publication_year) VALUES
('Introduction to Computer Science', 'Dr. Jane Smith', 'Technology', 'A comprehensive guide to computer science fundamentals covering programming, algorithms, and data structures.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400', 2023),
('Advanced Mathematics', 'Prof. John Davis', 'Mathematics', 'Advanced mathematical concepts including calculus, linear algebra, and differential equations.', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400', 2022),
('Digital Marketing Strategies', 'Sarah Johnson', 'Business', 'Modern digital marketing techniques and strategies for the digital age.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', 2024),
('Environmental Science', 'Dr. Michael Brown', 'Science', 'Understanding our environment and the impact of human activities on ecosystems.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', 2023),
('Creative Writing Workshop', 'Emily Wilson', 'Literature', 'Develop your creative writing skills through practical exercises and techniques.', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400', 2023),
('Data Science Fundamentals', 'Dr. Alex Chen', 'Technology', 'Learn the basics of data science, statistics, and machine learning applications.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', 2024);

-- Add sample instructor channels
INSERT INTO public.instructor_channels (instructor_id, channel_name, description) VALUES
((SELECT id FROM auth.users LIMIT 1), 'Computer Science Hub', 'Programming tutorials and computer science concepts'),
((SELECT id FROM auth.users LIMIT 1), 'Math Mastery', 'Advanced mathematics courses and problem solving'),
((SELECT id FROM auth.users LIMIT 1), 'Business Insights', 'Digital marketing and business strategy content');

-- Add sample reading sessions
INSERT INTO public.reading_sessions (book_id, created_by, title, description, start_time, meeting_link) VALUES
((SELECT id FROM public.books WHERE title = 'Introduction to Computer Science' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 'Chapter 1: Programming Basics', 'Join us as we explore the fundamentals of programming', NOW() + INTERVAL '2 hours', 'https://meet.google.com/sample-link-1'),
((SELECT id FROM public.books WHERE title = 'Advanced Mathematics' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 'Calculus Study Group', 'Weekly calculus problem solving session', NOW() + INTERVAL '1 day', 'https://meet.google.com/sample-link-2'),
((SELECT id FROM public.books WHERE title = 'Digital Marketing Strategies' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 'Marketing Workshop', 'Interactive digital marketing strategies discussion', NOW() + INTERVAL '3 hours', 'https://meet.google.com/sample-link-3');