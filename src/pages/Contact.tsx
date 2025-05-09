
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const ContactInfo = ({ icon: Icon, title, content }: { icon: any, title: string, content: string | React.ReactNode }) => (
  <div className="flex items-start gap-3 p-4 rounded-lg bg-black/30 border border-white/10 backdrop-blur-sm hover:bg-purple-950/20 transition-all">
    <div className="p-3 rounded-full bg-purple-900/30 text-purple-400">
      <Icon size={24} />
    </div>
    <div>
      <h3 className="font-semibold text-lg mb-1 text-white">{title}</h3>
      <p className="text-gray-300">{content}</p>
    </div>
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll respond soon!",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <PageLayout 
      title="Contact Us" 
      subtitle="We'd love to hear from you. Reach out with any questions or inquiries."
      backgroundImage="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&w=1200&q=80"
    >
      <ScrollArea className="h-full w-full overflow-auto pb-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-10 animate-fade-in">
            <ContactInfo 
              icon={Mail} 
              title="Email Us" 
              content={<a href="mailto:info@ethiodigitalacademy.com" className="text-purple-300 hover:underline">info@ethiodigitalacademy.com</a>} 
            />
            <ContactInfo 
              icon={Phone} 
              title="Call Us" 
              content={<a href="tel:+251911234567" className="text-purple-300 hover:underline">+251 911 234 567</a>} 
            />
            <ContactInfo 
              icon={MapPin} 
              title="Visit Us" 
              content="Addis Ababa, Ethiopia - Bole Road, Friendship Building, 4th Floor" 
            />
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
            {/* Contact Form */}
            <Card className="col-span-1 lg:col-span-3 glass-morphism border-0 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-200">Your Name</label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="John Doe" 
                        required 
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-200">Your Email</label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="john@example.com" 
                        required 
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-200">Subject</label>
                    <Input 
                      id="subject" 
                      name="subject" 
                      value={formData.subject} 
                      onChange={handleChange} 
                      placeholder="How can we help you?" 
                      required 
                      className="bg-black/40 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-200">Message</label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      placeholder="Your message..." 
                      required 
                      rows={5}
                      className="bg-black/40 border-white/20 resize-none"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"} 
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Map */}
            <div className="col-span-1 lg:col-span-2">
              <Card className="h-full glass-morphism border-0 shadow-xl overflow-hidden">
                <CardContent className="p-0 h-full">
                  <div className="relative h-full min-h-[300px]">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5768805033883!2d38.76174!3d9.0062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85f0f9c22a8f%3A0xf8934f7edb9b24b8!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1715268388859!5m2!1sen!2sus" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      allowFullScreen={false} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Ethio Digital Academy Location"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { q: "How do I enroll in a course?", a: "You can browse our courses and click on the 'Enroll' button. You'll need to create an account if you don't have one already." },
                { q: "Do you offer certificates?", a: "Yes! Upon successful completion of our courses, you'll receive a digital certificate that you can share on your resume or social media." },
                { q: "What payment methods do you accept?", a: "We accept credit/debit cards, mobile money, and bank transfers. You can view all payment options on our payment page." },
                { q: "Are there any prerequisites for courses?", a: "Each course lists its prerequisites on the course detail page. Some beginner courses have no prerequisites at all." },
              ].map((faq, i) => (
                <Card key={i} className="glass-morphism border-0 shadow-lg hover:shadow-purple-500/10 transition-all">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-2 text-white">{faq.q}</h4>
                    <p className="text-gray-300">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="mb-8 text-center py-8 px-4 rounded-xl bg-gradient-to-r from-purple-900/30 via-black/40 to-blue-900/30 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-2 text-white">Stay Updated</h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">Subscribe to our newsletter for the latest updates, course releases, and special offers.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                placeholder="Your email address" 
                type="email" 
                className="bg-black/60 border-white/20"
              />
              <Button className="bg-gradient-to-r from-purple-600 to-pink-500">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </PageLayout>
  );
};

export default Contact;
