
import { Link } from "react-router-dom";
import { LogIn, BookOpen, Home, GalleryHorizontal, Image as ImageIcon } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home", icon: <Home size={18} /> },
  { to: "/courses", label: "Courses", icon: <BookOpen size={18} /> },
  { to: "/about", label: "About", icon: <GalleryHorizontal size={18} /> },
  { to: "/contact", label: "Contact", icon: <ImageIcon size={18} /> }
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
      </main>
      <footer className="z-10 relative text-center text-gray-600 py-3 bg-black/60 mt-auto">
        © Ethio Digital Academy {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Index;
