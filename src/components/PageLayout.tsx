
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LogIn, BookOpen, Home, GalleryHorizontal, Image as ImageIcon } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home", icon: <Home size={18} /> },
  { to: "/courses", label: "Courses", icon: <BookOpen size={18} /> },
  { to: "/about", label: "About", icon: <GalleryHorizontal size={18} /> },
  { to: "/contact", label: "Contact", icon: <ImageIcon size={18} /> }
];

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const PageLayout = ({ children, title, subtitle, backgroundImage }: PageLayoutProps) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-black">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        {backgroundImage ? (
          <img
            src={backgroundImage}
            alt="Background"
            className="w-full h-full object-cover object-center brightness-50 saturate-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-violet-900/80" />
      </div>
      
      {/* Navbar */}
      <header className="relative z-10 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 bg-black/40 backdrop-blur-md">
        <Link to="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-glow hover:drop-shadow-xl transition mb-4 sm:mb-0">
          Ethio Digital Academy
        </Link>
        <nav className="flex flex-wrap justify-center gap-2 md:gap-4 overflow-x-auto pb-1">
          {navLinks.map(link => (
            <Link
              key={link.label}
              to={link.to}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-gray-200 hover:bg-purple-600/30 hover:text-white transition font-semibold text-xs sm:text-sm story-link whitespace-nowrap"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <Link
            to="/auth"
            className="inline-flex items-center px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition hover:bg-pink-600 focus:ring-2 focus:ring-pink-400/70 whitespace-nowrap text-xs sm:text-sm"
          >
            <LogIn className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Login
          </Link>
        </nav>
      </header>

      {/* Page Content */}
      <main className="flex-1 flex flex-col relative z-10 px-4 py-6 sm:py-10">
        <div className="glass-morphism p-6 sm:p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto w-full text-center animate-fade-in mb-8 mt-4 sm:mt-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-glow">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base sm:text-lg text-gray-200 font-medium mb-4 sm:mb-6">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </main>

      <footer className="z-10 relative text-center text-gray-400 py-3 bg-black/60 mt-auto text-xs sm:text-sm">
        © Ethio Digital Academy {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default PageLayout;
