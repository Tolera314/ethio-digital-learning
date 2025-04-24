
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";

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
            <h2 className="text-2xl font-bold text-white">3 Certificates Earned</h2>
            <p className="text-gray-300">Keep learning to earn more certificates</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {certificates.map(certificate => (
          <CertificateCard key={certificate.id} certificate={certificate} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-400 mb-4">Looking for more accomplishments?</p>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
          Browse Available Courses
        </Button>
      </div>
    </PageLayout>
  );
};

export default Certificates;
