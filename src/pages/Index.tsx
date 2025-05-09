
import { Link } from "react-router-dom";
import { LogIn, BookOpen, Home, GalleryHorizontal, Image as ImageIcon, Award, TrendingUp, Video, Users, CreditCard, Book, Library, Mail, ChevronRight, Star, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { to: "/", label: "Home", icon: <Home size={18} /> },
  { to: "/courses", label: "Courses", icon: <BookOpen size={18} /> },
  { to: "/about", label: "About", icon: <GalleryHorizontal size={18} /> },
  { to: "/contact", label: "Contact", icon: <ImageIcon size={18} /> }
];

const featureLinks = [
  { to: "/courses", label: "Structured Courses", icon: <BookOpen size={20} className="text-purple-400" />, description: "Learn from our curated courses" },
  { to: "/library", label: "Digital Library", icon: <Book size={20} className="text-blue-400" />, description: "Access our collection of e-books" },
  { to: "/certificates", label: "Certificates", icon: <Award size={20} className="text-yellow-400" />, description: "Earn industry-recognized certificates" },
  { to: "/progress", label: "Progress Tracking", icon: <TrendingUp size={20} className="text-green-400" />, description: "Track your learning journey" },
  { to: "/live-sessions", label: "Live Sessions", icon: <Video size={20} className="text-blue-400" />, description: "Join interactive learning events" },
  { to: "/dashboard", label: "Student Dashboard", icon: <Users size={20} className="text-pink-400" />, description: "Your personal learning hub" },
  { to: "/payment", label: "Payment Plans", icon: <CreditCard size={20} className="text-cyan-400" />, description: "Flexible subscription options" },
];

// Animation helper function for scroll reveal
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.add('opacity-100');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}

const testimonials = [
  {
    name: "Abebe Kebede",
    role: "Web Developer",
    content: "The courses at Ethio Digital Academy transformed my career. I went from a complete beginner to landing a job as a web developer in just 6 months.",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    name: "Tigist Haile",
    role: "UX Designer",
    content: "The UI/UX Design course was incredibly comprehensive. The instructors were supportive and the projects were challenging enough to build a strong portfolio.",
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    name: "Yonas Tesfaye",
    role: "Data Analyst",
    content: "I took the Data Science Fundamentals course and it helped me pivot my career into analytics. The hands-on approach really made a difference.",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
];

const courses = [
  {
    title: "Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript and React to become a full-stack web developer",
    duration: "12 weeks",
    level: "Beginner to Intermediate",
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=600&q=80",
    price: "19,999 ETB",
    rating: 4.8,
  },
  {
    title: "UI/UX Design Masterclass",
    description: "Master user experience design and create beautiful interfaces that users love",
    duration: "8 weeks",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80",
    price: "15,999 ETB",
    rating: 4.9,
  },
  {
    title: "Data Science Fundamentals",
    description: "Learn Python, data analysis, visualization and machine learning basics",
    duration: "10 weeks",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    price: "17,999 ETB",
    rating: 4.7,
  }
];

const Index = () => {
  useScrollReveal();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-black overflow-x-hidden">
      {/* Background image with dark overlay */}
      <div className="fixed inset-0 w-full h-full z-0">
        {/* Background image - great for learning theme */}
        <img
          src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80"
          alt="Learning background"
          className="w-full h-full object-cover object-center brightness-50 saturate-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-violet-900/80" />
      </div>
      {/* Navbar */}
      <header className={`sticky top-0 z-50 flex flex-col sm:flex-row items-center justify-between px-6 py-4 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-black/40 backdrop-blur-sm'}`}>
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-glow hover:drop-shadow-xl transition mb-4 sm:mb-0">Ethio Digital Academy</Link>
        <nav className="flex flex-wrap gap-2 md:gap-4 justify-center">
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
      
      {/* Main Content with Scroll Area */}
      <ScrollArea className="flex-1 relative z-10 overflow-y-auto">
        <main className="flex-1 flex flex-col relative z-10 px-4">
          {/* Hero Section */}
          <div className="flex justify-center items-center min-h-[calc(100vh-80px)] py-20">
            <div className="glass-morphism p-10 pt-8 rounded-3xl shadow-2xl max-w-2xl w-full text-center animate-fade-in bg-gradient-to-br from-black/95 via-black/90 to-violet-900/80">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white leading-[1.15] drop-shadow-glow">
                Welcome to <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Ethio Digital Academy</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 font-medium mb-7">
                The magic of online learning! <span className="block text-pink-400">Interactive Courses, Smart Progress Tracking, and Live Sessions</span>
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/courses"
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg shadow-md hover:scale-105 transition-all hover:bg-pink-700 duration-200 animate-scale-in"
                >
                  Explore Courses
                </Link>
                <Link
                  to="/library"
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg shadow-md hover:scale-105 transition-all hover:bg-indigo-700 duration-200 animate-scale-in"
                >
                  Browse Library
                </Link>
              </div>
              <p className="mt-8 text-base text-gray-400 animate-fade-in">
                Start your journey toward mastery <span className="text-purple-300 font-bold">&#9733;</span>
              </p>
            </div>
          </div>

          {/* Featured Courses */}
          <section className="py-20 w-full max-w-6xl mx-auto px-4 reveal-on-scroll">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-glow mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Featured Courses</span>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">Expand your skills with our most popular courses designed to fast-track your career in technology</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <Card key={index} className="glass-morphism border-0 shadow-lg overflow-hidden hover:shadow-purple-500/20 transition-all duration-300 hover:translate-y-[-5px]">
                  <div className="h-48 overflow-hidden">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-all duration-700 hover:scale-110" />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">{course.level}</span>
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm text-gray-300">{course.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-white">{course.title}</CardTitle>
                    <CardDescription className="text-gray-300">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Duration: {course.duration}</span>
                      <span className="font-semibold text-purple-300">{course.price}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">Enroll Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/courses" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors">
                View all courses <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </section>

          {/* Features Section */}
          <section className="w-full max-w-6xl mx-auto px-4 py-20 reveal-on-scroll">
            <h2 className="text-3xl font-bold text-center mb-16 text-white drop-shadow-glow">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Discover Our Features</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureLinks.map((feature, index) => (
                <Link
                  key={feature.label}
                  to={feature.to}
                  className={`glass-morphism p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-purple-500/20 hover:scale-105 group ${index % 2 === 0 ? 'hover:bg-purple-900/30' : 'hover:bg-blue-900/30'}`}
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
          </section>

          {/* Testimonials */}
          <section className="w-full py-20 bg-gradient-to-r from-purple-900/20 via-black/40 to-indigo-900/20 backdrop-blur-sm reveal-on-scroll">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-glow mb-4">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Student Testimonials</span>
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto">Hear from our students about their experience learning with Ethio Digital Academy</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="glass-morphism border-0 shadow-lg hover:shadow-purple-500/10 transition-all">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{testimonial.name}</h4>
                          <p className="text-sm text-gray-400">{testimonial.role}</p>
                        </div>
                      </div>
                      <blockquote className="text-gray-300">"{testimonial.content}"</blockquote>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-400" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="py-20 w-full max-w-6xl mx-auto px-4 reveal-on-scroll">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-white">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Why Choose Ethio Digital Academy</span>
                </h2>
                <p className="text-gray-300 mb-8">Our academy was founded with a mission to empower Ethiopians through digital skills development, bridging the technological gap and creating opportunities for career advancement.</p>
                
                <div className="space-y-4">
                  {[
                    "Industry-experienced instructors",
                    "Hands-on practical projects",
                    "Flexible learning schedules",
                    "Job placement assistance",
                    "Affordable payment plans",
                    "Local context and examples"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-green-500/20 text-green-400">
                        <Check size={16} />
                      </div>
                      <span className="text-gray-200">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg transition-all">
                    Learn more about us <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
                  alt="Students learning" 
                  className="rounded-xl shadow-2xl relative"
                />
              </div>
            </div>
          </section>

          {/* Latest Blog/News Section */}
          <section className="py-20 w-full max-w-6xl mx-auto px-4 reveal-on-scroll">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white drop-shadow-glow mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Latest From Our Blog</span>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">Stay updated with the latest trends in technology and education</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "The Future of Tech Education in Ethiopia",
                  excerpt: "How digital learning is transforming education across Ethiopia and creating new opportunities...",
                  image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
                  date: "May 5, 2025",
                  readTime: "5 min read"
                },
                {
                  title: "Web Development Trends in 2025",
                  excerpt: "Discover the latest web development frameworks and technologies that are shaping the industry...",
                  image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
                  date: "April 28, 2025",
                  readTime: "8 min read"
                },
                {
                  title: "Starting a Career in Data Science",
                  excerpt: "A comprehensive guide for beginners looking to enter the field of data science and analytics...",
                  image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=600&q=80",
                  date: "April 15, 2025",
                  readTime: "6 min read"
                }
              ].map((post, index) => (
                <Card key={index} className="glass-morphism border-0 shadow-lg overflow-hidden hover:shadow-purple-500/20 transition-all">
                  <div className="h-40 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-all duration-500 hover:scale-110" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-3 text-xs text-gray-400">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-white">{post.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{post.excerpt}</p>
                    <Link to="#" className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
                      Read more <ChevronRight size={14} className="ml-1" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full max-w-4xl mx-auto mb-20 reveal-on-scroll">
            <div className="glass-morphism p-8 rounded-3xl text-center bg-gradient-to-br from-purple-900/40 via-black/80 to-blue-900/40">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Begin Your Learning Journey?</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Join thousands of students who are already advancing their careers with our courses and expert-led sessions.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/auth" className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold shadow-lg hover:shadow-purple-500/20 rounded-full flex items-center justify-center">
                  <LogIn className="mr-2" size={20} /> Sign Up Now
                </Link>
                <Link to="/contact" className="px-8 py-3 border border-white/20 hover:bg-white/10 text-white rounded-full flex items-center justify-center">
                  <Mail className="mr-2" size={20} /> Contact Us
                </Link>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-black/60 backdrop-blur-md text-gray-400 pt-16 pb-8 relative z-10 reveal-on-scroll mt-auto border-t border-white/10">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Ethio Digital Academy</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Empowering Ethiopians with digital skills for a brighter future in the global tech ecosystem.
                  </p>
                  <div className="flex space-x-4">
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
                    <li className="flex items-start gap-2 text-sm">
                      <MapPin className="text-purple-400 mt-0.5" size={18} />
                      <span>Addis Ababa, Ethiopia<br />Bole Road, Friendship Building</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Mail className="text-purple-400" size={18} />
                      <a href="mailto:info@ethiodigitalacademy.com" className="hover:text-white">info@ethiodigitalacademy.com</a>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Phone className="text-purple-400" size={18} />
                      <a href="tel:+251911234567" className="hover:text-white">+251 911 234 567</a>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-8 mt-8 border-t border-gray-800 text-center">
                <p className="text-sm text-gray-500">
                  &copy; Ethio Digital Academy {new Date().getFullYear()}. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </main>
      </ScrollArea>
    </div>
  );
};

export default Index;
