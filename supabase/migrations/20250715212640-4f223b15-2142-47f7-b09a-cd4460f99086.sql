-- Add sample books data
INSERT INTO public.books (title, author, category, description, cover_image, publication_year) VALUES
('Introduction to Computer Science', 'Dr. Jane Smith', 'Technology', 'A comprehensive guide to computer science fundamentals covering programming, algorithms, and data structures.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400', 2023),
('Advanced Mathematics', 'Prof. John Davis', 'Mathematics', 'Advanced mathematical concepts including calculus, linear algebra, and differential equations.', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400', 2022),
('Digital Marketing Strategies', 'Sarah Johnson', 'Business', 'Modern digital marketing techniques and strategies for the digital age.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', 2024),
('Environmental Science', 'Dr. Michael Brown', 'Science', 'Understanding our environment and the impact of human activities on ecosystems.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', 2023),
('Creative Writing Workshop', 'Emily Wilson', 'Literature', 'Develop your creative writing skills through practical exercises and techniques.', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400', 2023),
('Data Science Fundamentals', 'Dr. Alex Chen', 'Technology', 'Learn the basics of data science, statistics, and machine learning applications.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', 2024)
ON CONFLICT DO NOTHING;

-- Add sample reading sessions if books exist
INSERT INTO public.reading_sessions (book_id, created_by, title, description, start_time, meeting_link)
SELECT 
    b.id,
    (SELECT id FROM auth.users LIMIT 1),
    CASE 
        WHEN b.title = 'Introduction to Computer Science' THEN 'Chapter 1: Programming Basics'
        WHEN b.title = 'Advanced Mathematics' THEN 'Calculus Study Group'
        ELSE 'Marketing Workshop'
    END,
    CASE 
        WHEN b.title = 'Introduction to Computer Science' THEN 'Join us as we explore the fundamentals of programming'
        WHEN b.title = 'Advanced Mathematics' THEN 'Weekly calculus problem solving session'
        ELSE 'Interactive digital marketing strategies discussion'
    END,
    NOW() + INTERVAL '2 hours',
    'https://meet.google.com/sample-link-' || ROW_NUMBER() OVER()
FROM public.books b
WHERE b.title IN ('Introduction to Computer Science', 'Advanced Mathematics', 'Digital Marketing Strategies')
ON CONFLICT DO NOTHING;