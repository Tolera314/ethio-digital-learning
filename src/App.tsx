import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Certificates from "./pages/Certificates";
import ProgressTracking from "./pages/ProgressTracking";
import LiveSessions from "./pages/LiveSessions";
import StudentDashboard from "./pages/StudentDashboard";
import Payment from "./pages/Payment";
import Library from "./pages/Library";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/progress" element={<ProgressTracking />} />
          <Route path="/live-sessions" element={<LiveSessions />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/library" element={<Library />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
