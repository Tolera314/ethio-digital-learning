
import { Link } from "react-router-dom";
import { LogIn, BookOpen, Home, GalleryHorizontal, Image as ImageIcon, Award, TrendingUp, Video, Users, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Home", icon: <Home size={18} /> },
  { to: "/courses", label: "Courses", icon: <BookOpen size={18} /> },
  { to: "/about", label: "About", icon: <GalleryHorizontal size={18} /> },
  { to: "/contact", label: "Contact", icon: <ImageIcon size={18} /> }
];

const featureLinks = [
  { to: "/courses", label: "Structured Courses", icon: <BookOpen size={20} className="text-purple-400" />, description: "Learn from our curated courses" },
  { to: "/certificates", label: "Certificates", icon: <Award size={20} className="text-yellow-400" />, description: "Earn industry-recognized certificates" },
  { to: "/progress", label: "Progress Tracking", icon: <TrendingUp size={20} className="text-green-400" />, description: "Track your learning journey" },
  { to: "/live-sessions", label: "Live Sessions", icon: <Video size={20} className="text-blue-400" />, description: "Join interactive learning events" },
  { to: "/dashboard", label: "Student Dashboard", icon: <Users size={20} className="text-pink-400" />, description: "Your personal learning hub" },
  { to: "/payment", label: "Payment Plans", icon: <CreditCard size={20} className="text-cyan-400" />, description: "Flexible subscription options" },
];

const Index = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-black">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Background image - great for learning theme */}
        <img
          src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80"
          alt="Learning background"
          className="w-full h-full object-cover object-center brightness-50 saturate-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-violet-900/80" />
      </div>
      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-glow hover:drop-shadow-xl transition">Ethio Digital Academy</Link>
        <nav className="flex gap-2 md:gap-6">
          {navLinks.map(link => (
            <Link
              key={link.label}
              to={link.to}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-gray-200 hover:bg-purple-600/30 hover:text-white transition font-semibold text-sm story-link"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <Link
            to="/auth"
            className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold ml-2 shadow-lg hover:scale-105 transition hover:bg-pink-600 focus:ring-2 focus:ring-pink-400/70"
          >
            <LogIn className="mr-2" size={20} /> Login / Signup
          </Link>
        </nav>
      </header>
      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center relative z-10 px-4">
        <div className="glass-morphism p-10 pt-8 rounded-3xl shadow-2xl max-w-2xl w-full text-center animate-fade-in bg-gradient-to-br from-black/95 via-black/90 to-violet-900/80">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white leading-[1.15] drop-shadow-glow">
            Welcome to <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Ethio Digital Academy</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-medium mb-7">
            The magic of online learning! <span className="block text-pink-400">Interactive Courses, Smart Progress Tracking, and Live Sessions</span>
          </p>
          <Link
            to="/courses"
            className="inline-block mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg shadow-md hover:scale-105 transition-all hover:bg-pink-700 duration-200 animate-scale-in"
          >
            Explore Courses
          </Link>
          <p className="mt-8 text-base text-gray-400 animate-fade-in">
            Start your journey toward mastery <span className="text-purple-300 font-bold">&#9733;</span>
          </p>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-6xl mx-auto mt-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-white drop-shadow-glow">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Discover Our Features</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureLinks.map((feature) => (
              <Link
                key={feature.label}
                to={feature.to}
                className="glass-morphism p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-purple-500/20 hover:scale-105 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-black/60 rounded-full mb-4 group-hover:bg-purple-900/40 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.label}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-4xl mx-auto mt-20 mb-10">
          <div className="glass-morphism p-8 rounded-3xl text-center bg-gradient-to-br from-purple-900/40 via-black/80 to-blue-900/40">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Begin Your Learning Journey?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of students who are already advancing their careers with our courses and expert-led sessions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                as={Link}
                to="/auth"
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold shadow-lg hover:shadow-purple-500/20"
                size="lg"
              >
                <LogIn className="mr-2" size={20} /> Sign Up Now
              </Button>
              <Button
                as={Link}
                to="/courses"
                className="px-8 py-3 border border-white/20 hover:bg-white/10"
                variant="outline"
                size="lg"
              >
                Browse Courses
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="z-10 relative text-center text-gray-600 py-3 bg-black/60 mt-auto">
        © Ethio Digital Academy {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Index;
