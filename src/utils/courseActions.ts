
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  image: string;
  price: string;
  rating: number;
  students: number;
}

export interface LearningPath {
  title: string;
  description: string;
  duration: string;
  courses: number;
  icon: React.ReactNode;
}

// Sample courses data for reuse across components
export const featuredCourses: Course[] = [
  {
    id: 1,
    title: "Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript and React to become a full-stack web developer",
    duration: "12 weeks",
    level: "Beginner to Intermediate",
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=600&q=80",
    price: "19,999 ETB",
    rating: 4.8,
    students: 1245
  },
  {
    id: 2,
    title: "UI/UX Design Masterclass",
    description: "Master user experience design and create beautiful interfaces that users love",
    duration: "8 weeks",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80",
    price: "15,999 ETB",
    rating: 4.9,
    students: 987
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    description: "Learn Python, data analysis, visualization and machine learning basics",
    duration: "10 weeks",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    price: "17,999 ETB",
    rating: 4.7,
    students: 823
  },
  {
    id: 4,
    title: "Mobile App Development with Flutter",
    description: "Build cross-platform mobile apps for Android and iOS with Flutter",
    duration: "10 weeks",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=600&q=80",
    price: "18,999 ETB",
    rating: 4.6,
    students: 756
  },
  {
    id: 5,
    title: "Digital Marketing Strategy",
    description: "Learn digital marketing fundamentals, social media, SEO and content marketing",
    duration: "6 weeks",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1533750516659-7d29bda71f97?auto=format&fit=crop&w=600&q=80",
    price: "12,999 ETB",
    rating: 4.5,
    students: 689
  },
  {
    id: 6,
    title: "Cloud Computing with AWS",
    description: "Master AWS services and deploy scalable cloud applications",
    duration: "8 weeks",
    level: "Intermediate to Advanced",
    image: "https://images.unsplash.com/photo-1560732488-7b5f5a03e6b3?auto=format&fit=crop&w=600&q=80",
    price: "21,999 ETB",
    rating: 4.8,
    students: 542
  }
];

// Enroll in a course
export const enrollInCourse = async (courseId: number, userId?: string) => {
  if (!userId) {
    toast({
      title: "Authentication required",
      description: "Please login to enroll in courses",
      variant: "destructive"
    });
    return false;
  }

  try {
    // Simulate an API call 
    // In a real app, this would be a call to supabase
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "Enrollment successful",
      description: "You have successfully enrolled in this course",
      variant: "default"
    });
    return true;
  } catch (error) {
    console.error("Error enrolling in course:", error);
    toast({
      title: "Enrollment failed",
      description: "There was an error enrolling in this course",
      variant: "destructive"
    });
    return false;
  }
};

// View learning path
export const viewLearningPath = (pathTitle: string, navigate: any) => {
  // For now we just navigate to courses with a query param
  navigate(`/courses?path=${encodeURIComponent(pathTitle)}`);
  
  toast({
    title: "Learning Path",
    description: `Viewing details for ${pathTitle}`,
  });
};

// Filter courses by popularity
export const filterByPopularity = (courses: Course[]): Course[] => {
  return [...courses].sort((a, b) => b.rating - a.rating);
};

// Continue learning for a course
export const continueLearning = (courseId: number, navigate: any) => {
  navigate(`/courses/${courseId}/learn`);
  
  toast({
    title: "Continue Learning",
    description: "Resuming your progress",
  });
};

// View course details
export const viewCourseDetails = (courseId: number, navigate: any) => {
  navigate(`/courses/${courseId}`);
};

// Submit a review for a course
export const reviewCourse = (courseId: number, rating: number, comment: string, userId?: string) => {
  if (!userId) {
    toast({
      title: "Authentication required",
      description: "Please login to leave a review",
      variant: "destructive"
    });
    return false;
  }
  
  // In a real app, this would save to the database
  toast({
    title: "Review submitted",
    description: "Thank you for your feedback!",
  });
  
  return true;
};

// Download course materials
export const downloadCourseMaterials = (courseId: number, materialName: string) => {
  // In a real app, this would initiate a download
  toast({
    title: "Download started",
    description: `Downloading ${materialName}...`,
  });
};

// Share a course
export const shareCourse = async (courseId: number, courseTitle: string) => {
  // Check if Web Share API is available
  if (navigator.share) {
    try {
      await navigator.share({
        title: courseTitle,
        text: `Check out this course: ${courseTitle}`,
        url: `${window.location.origin}/courses/${courseId}`,
      });
      
      toast({
        title: "Shared successfully",
        description: "Course shared successfully",
      });
    } catch (error) {
      console.error("Error sharing course:", error);
      fallbackShare(courseId, courseTitle);
    }
  } else {
    fallbackShare(courseId, courseTitle);
  }
};

// Fallback sharing method when Web Share API is not available
const fallbackShare = (courseId: number, courseTitle: string) => {
  // Create a temporary input to copy the URL to clipboard
  const url = `${window.location.origin}/courses/${courseId}`;
  const input = document.createElement('input');
  input.value = url;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  
  toast({
    title: "Link copied",
    description: "Course link copied to clipboard",
  });
};

// Browse all available courses
export const browseAllCourses = (navigate: any) => {
  navigate('/courses');
};

// Set a reminder for a course
export const remindAboutCourse = (courseId: number, courseTitle: string, userId?: string) => {
  if (!userId) {
    toast({
      title: "Authentication required",
      description: "Please login to set reminders",
      variant: "destructive"
    });
    return false;
  }

  // In a real app, this would save to the database
  toast({
    title: "Reminder set",
    description: `We'll remind you about "${courseTitle}" soon`,
  });
  
  return true;
};

// Open review dialog for a course
export const openReviewDialog = (courseId: number, courseTitle: string, userId?: string) => {
  if (!userId) {
    toast({
      title: "Authentication required",
      description: "Please login to review courses",
      variant: "destructive"
    });
    return false;
  }
  
  // This would normally open a dialog component
  // For now, we just show a toast
  toast({
    title: "Review",
    description: `Add your review for "${courseTitle}"`,
  });
  
  return true;
};
