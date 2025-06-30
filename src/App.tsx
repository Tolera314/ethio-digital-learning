
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import CourseLearning from "./pages/CourseLearning";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Certificates from "./pages/Certificates";
import ProgressTracking from "./pages/ProgressTracking";
import LiveSessions from "./pages/LiveSessions";
import StudentDashboard from "./pages/StudentDashboard";
import Payment from "./pages/Payment";
import Library from "./pages/Library";
import BookDetails from "./pages/BookDetails";
import ReadingSession from "./pages/ReadingSession";
import AdminDashboard from "./pages/AdminDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Student Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute requiredRole="student">
                <Courses />
              </ProtectedRoute>
            } />
            <Route path="/courses/:courseId" element={
              <ProtectedRoute requiredRole="student">
                <CourseDetails />
              </ProtectedRoute>
            } />
            <Route path="/courses/:courseId/learn" element={
              <ProtectedRoute requiredRole="student">
                <CourseLearning />
              </ProtectedRoute>
            } />
            <Route path="/certificates" element={
              <ProtectedRoute requiredRole="student">
                <Certificates />
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute requiredRole="student">
                <ProgressTracking />
              </ProtectedRoute>
            } />
            <Route path="/live-sessions" element={
              <ProtectedRoute requiredRole="student">
                <LiveSessions />
              </ProtectedRoute>
            } />
            <Route path="/payment" element={
              <ProtectedRoute requiredRole="student">
                <Payment />
              </ProtectedRoute>
            } />
            <Route path="/library" element={
              <ProtectedRoute requiredRole="student">
                <Library />
              </ProtectedRoute>
            } />
            <Route path="/books/:bookId" element={
              <ProtectedRoute requiredRole="student">
                <BookDetails />
              </ProtectedRoute>
            } />
            <Route path="/books/:bookId/sessions/:sessionId" element={
              <ProtectedRoute requiredRole="student">
                <ReadingSession />
              </ProtectedRoute>
            } />

            {/* Protected Instructor Routes */}
            <Route path="/instructor" element={
              <ProtectedRoute requiredRole="instructor">
                <InstructorDashboard />
              </ProtectedRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
