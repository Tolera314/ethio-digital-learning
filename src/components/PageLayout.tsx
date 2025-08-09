import { ReactNode, Suspense } from "react";
import MobileOptimizedNavbar from "./layout/MobileOptimizedNavbar";
import { Link } from "react-router-dom";
import { LogIn, BookOpen, Home, GalleryHorizontal, Award, TrendingUp, Video, Users, Book, MapPin, Phone, Mail } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { LazyImage } from "./layout/LazyImage";
import { SEOHead } from "./layout/SEOHead";

const navLinks = [
  { to: "/", label: "Home", icon: <Home size={18} /> },
  { to: "/courses", label: "Courses", icon: <BookOpen size={18} /> },
  { to: "/library", label: "Library", icon: <Book size={18} /> },
  { to: "/live-sessions", label: "Live Sessions", icon: <Video size={18} /> },
  { to: "/certificates", label: "Certificates", icon: <Award size={18} /> },
  { to: "/progress", label: "Progress", icon: <TrendingUp size={18} /> },
  { to: "/about", label: "About", icon: <Users size={18} /> },
  { to: "/contact", label: "Contact", icon: <GalleryHorizontal size={18} /> }
];

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  seoTitle?: string;
  seoDescription?: string;
}

const PageLayout = ({ 
  children, 
  title, 
  subtitle, 
  backgroundImage,
  seoTitle,
  seoDescription
}: PageLayoutProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <SEOHead
        title={seoTitle || title}
        description={seoDescription || subtitle}
        image={backgroundImage}
      />
      
      {/* Background image with dark overlay */}
      <div className="fixed inset-0 w-full h-full z-0">
        {backgroundImage ? (
          <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />}>
            <LazyImage
              src={backgroundImage}
              alt="Background"
              className="w-full h-full object-cover object-center brightness-50 saturate-110"
              placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDgwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBmaWxsPSIjMTExODI3Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzRGNDY1MiIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIsIGZvbnQtc2l6ZT0iMjRweCI+TG9hZGluZy4uLjwvdGV4dD4KPHN2Zz4="
            />
          </Suspense>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-violet-900/80" />
      </div>
      
      {/* Mobile Optimized Navbar */}
      <MobileOptimizedNavbar />

      {/* Page Content with ScrollArea */}
      <ScrollArea className="flex-1 relative z-10">
        <main className="flex-1 flex flex-col relative z-10 responsive-padding py-6 sm:py-10">
          <div className="glass-morphism p-6 sm:p-8 rounded-3xl shadow-2xl max-w-7xl mx-auto w-full text-center animate-fade-in mb-8 mt-4 sm:mt-10">
            <h1 className="responsive-heading font-extrabold mb-3 sm:mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-glow">
              {title}
            </h1>
            {subtitle && (
              <p className="responsive-text text-gray-200 font-medium mb-4 sm:mb-6">
                {subtitle}
              </p>
            )}
            <Suspense fallback={<div className="w-full h-20 bg-muted animate-pulse rounded" />}>
              {children}
            </Suspense>
          </div>
        </main>
      
        <footer className="z-10 relative text-center text-gray-400 py-6 bg-black/60 mt-auto text-xs sm:text-sm border-t border-white/10">
          <div className="max-w-6xl mx-auto responsive-padding">
            <div className="responsive-grid gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Ethio Digital Academy</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Empowering Ethiopians with digital skills for a brighter future in the global tech ecosystem.
                </p>
                <div className="flex space-x-4 justify-center sm:justify-start">
                  {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                    <a 
                      key={social} 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label={`Follow us on ${social}`}
                    >
                      <div className="p-2 rounded-full bg-white/5 hover:bg-white/10">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                          <rect width="24" height="24" fill="none" rx="0" ry="0"/>
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  {[
                    { label: "Home", to: "/" },
                    { label: "About Us", to: "/about" },
                    { label: "Courses", to: "/courses" },
                    { label: "Library", to: "/library" },
                    { label: "Contact", to: "/contact" }
                  ].map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Programs</h3>
                <ul className="space-y-2">
                  {[
                    "Web Development",
                    "UI/UX Design", 
                    "Data Science",
                    "Mobile Development",
                    "Cloud Computing",
                    "Digital Marketing"
                  ].map((program) => (
                    <li key={program}>
                      <Link to="/courses" className="text-sm text-gray-400 hover:text-white transition-colors">
                        {program}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm justify-center sm:justify-start">
                    <MapPin className="text-purple-400 mt-0.5" size={18} />
                    <span>Addis Ababa, Ethiopia<br />Bole Road, Friendship Building</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm justify-center sm:justify-start">
                    <Phone className="text-purple-400" size={18} />
                    <a href="tel:+251911234567" className="hover:text-white">+251 911 234 567</a>
                  </li>
                  <li className="flex items-center gap-2 text-sm justify-center sm:justify-start">
                    <Mail className="text-purple-400" size={18} />
                    <a href="mailto:info@ethiodigitalacademy.com" className="hover:text-white">info@ethiodigitalacademy.com</a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-800 text-center">
              <p className="text-sm text-gray-500">
                &copy; Ethio Digital Academy {new Date().getFullYear()}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </ScrollArea>
    </div>
  );
};

export default PageLayout;