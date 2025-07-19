
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2, ExternalLink, Loader2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const certificates = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    date: "March 15, 2025",
    image: "https://images.unsplash.com/photo-1523289333742-be1143f6b766?auto=format&fit=crop&w=800&q=80",
    instructor: "Dr. Abebe Bekele"
  },
  {
    id: 2,
    title: "UX/UI Design Principles",
    date: "January 22, 2025",
    image: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?auto=format&fit=crop&w=800&q=80",
    instructor: "Sara Tadesse"
  },
  {
    id: 3,
    title: "Introduction to Digital Marketing",
    date: "November 10, 2024",
    image: "https://images.unsplash.com/photo-1569017388730-020b5f80a004?auto=format&fit=crop&w=800&q=80", 
    instructor: "Michael Hailu"
  }
];

const CertificateCard = ({ certificate }: { certificate: typeof certificates[0] }) => (
  <Card className="overflow-hidden bg-black/40 border border-white/10 backdrop-blur-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
    <div className="relative">
      <img 
        src={certificate.image} 
        alt={certificate.title} 
        className="w-full h-40 object-cover object-center opacity-70"
      />
      <div className="absolute top-0 right-0 m-3">
        <Award size={40} className="text-yellow-400 drop-shadow-glow" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
    </div>
    <CardHeader className="relative z-10 -mt-10 pt-0">
      <div className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-6 transform transition-transform hover:scale-105 hover:shadow-xl">
        <h3 className="text-xl font-bold text-white mb-1">{certificate.title}</h3>
        <div className="flex flex-col gap-2 mb-4">
          <p className="text-sm text-gray-300">Issued: {certificate.date}</p>
          <p className="text-sm text-gray-300">Instructor: {certificate.instructor}</p>
        </div>
        <div className="flex justify-between mt-4">
          <Button className="bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-700 hover:to-amber-600 text-white">
            <Download size={16} className="mr-2" /> Download
          </Button>
          <Button variant="outline" className="border-white/20 hover:bg-white/10">
            <Share2 size={16} className="mr-2" /> Share
          </Button>
        </div>
      </div>
    </CardHeader>
  </Card>
);

const Certificates = () => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function loadCertificates() {
      if (!user) return;
      
      try {
        const { data, error } = await (supabase as any)
          .from('certificates')
          .select('*')
          .eq('user_id', user.id)
          .order('issued_date', { ascending: false });

        if (error) throw error;
        setCertificates(data || []);
      } catch (error) {
        console.error("Error loading certificates:", error);
        toast({
          title: "Error",
          description: "Failed to load certificates",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    loadCertificates();
  }, [user, toast]);

  const handleDownload = async (certificateId: string) => {
    try {
      // Generate and download certificate PDF
      toast({
        title: "Generating Certificate",
        description: "Your certificate is being prepared for download"
      });
      
      // In a real implementation, this would generate a PDF
      const link = document.createElement('a');
      link.href = `/api/certificates/${certificateId}/download`;
      link.download = `certificate-${certificateId}.pdf`;
      link.click();
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download certificate",
        variant: "destructive"
      });
    }
  };

  const handleShare = async (certificate: any) => {
    const shareUrl = `${window.location.origin}/verify/${certificate.verification_code}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${certificate.title} Certificate`,
          text: `Check out my certificate for ${certificate.title}!`,
          url: shareUrl
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "Certificate verification link copied to clipboard"
        });
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Certificate verification link copied to clipboard"
      });
    }
  };

  if (loading) {
    return (
      <PageLayout 
        title="Your Certificates" 
        subtitle="Showcase your achievements and skills"
        backgroundImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80"
      >
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Your Certificates" 
      subtitle="Showcase your achievements and skills"
      backgroundImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80"
    >
      <div className="glass-morphism p-6 rounded-xl mb-8 max-w-xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Award size={60} className="text-yellow-400 mr-4" />
          <div className="text-left">
            <h2 className="text-2xl font-bold text-white">{certificates.length} Certificates Earned</h2>
            <p className="text-gray-300">Keep learning to earn more certificates</p>
          </div>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-12">
          <Award size={80} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl text-gray-300 mb-2">No certificates yet</h3>
          <p className="text-gray-400 mb-6">Complete courses to earn your first certificate</p>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
            Browse Available Courses
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {certificates.map(certificate => (
              <Card key={certificate.id} className="overflow-hidden bg-black/40 border border-white/10 backdrop-blur-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                <div className="relative">
                  <div className="w-full h-40 bg-gradient-to-br from-yellow-600 to-amber-500 flex items-center justify-center">
                    <Award size={60} className="text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute top-0 right-0 m-3">
                    {certificate.is_verified && (
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Verified
                      </div>
                    )}
                  </div>
                </div>
                <CardHeader className="relative z-10 -mt-10 pt-0">
                  <div className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-6 transform transition-transform hover:scale-105 hover:shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-1">{certificate.title}</h3>
                    <div className="flex flex-col gap-2 mb-4">
                      <p className="text-sm text-gray-300">
                        Issued: {format(new Date(certificate.issued_date), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-gray-300">
                        Code: {certificate.verification_code}
                      </p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button 
                        onClick={() => handleDownload(certificate.id)}
                        className="bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-700 hover:to-amber-600 text-white"
                      >
                        <Download size={16} className="mr-2" /> Download
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleShare(certificate)}
                        className="border-white/20 hover:bg-white/10"
                      >
                        <Share2 size={16} className="mr-2" /> Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-400 mb-4">Looking for more accomplishments?</p>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
              Browse Available Courses
            </Button>
          </div>
        </>
      )}
    </PageLayout>
  );
};

export default Certificates;
