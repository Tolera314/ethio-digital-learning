
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Share2, Printer, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Certificate {
  id: string;
  title: string;
  date: string;
  instructor: string;
  status: 'approved' | 'pending' | 'payment_required';
  paymentCompleted: boolean;
}

interface CertificateActionsProps {
  certificates: Certificate[];
}

export const CertificateActions: React.FC<CertificateActionsProps> = ({ certificates }) => {
  const { toast } = useToast();

  const handleDownload = (certificate: Certificate) => {
    if (!certificate.paymentCompleted) {
      toast({
        title: "Payment Required",
        description: "Complete payment to download your certificate",
        variant: "destructive"
      });
      return;
    }

    // Mock download functionality
    toast({
      title: "Download Started",
      description: `Downloading ${certificate.title} certificate`,
    });
  };

  const handleShare = (certificate: Certificate) => {
    if (!certificate.paymentCompleted) {
      toast({
        title: "Payment Required",
        description: "Complete payment to share your certificate",
        variant: "destructive"
      });
      return;
    }

    // Mock share functionality
    const shareUrl = `${window.location.origin}/certificates/${certificate.id}`;
    navigator.clipboard.writeText(shareUrl);
    
    toast({
      title: "Link Copied",
      description: "Certificate share link copied to clipboard",
    });
  };

  const handlePrint = (certificate: Certificate) => {
    if (!certificate.paymentCompleted) {
      toast({
        title: "Payment Required",
        description: "Complete payment to print your certificate",
        variant: "destructive"
      });
      return;
    }

    // Mock print functionality
    window.print();
    
    toast({
      title: "Print Dialog Opened",
      description: "Certificate ready for printing",
    });
  };

  const getStatusBadge = (certificate: Certificate) => {
    if (!certificate.paymentCompleted) {
      return <Badge variant="destructive">Payment Required</Badge>;
    }
    
    switch (certificate.status) {
      case 'approved':
        return <Badge variant="default">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending Approval</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          My Certificates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{certificate.title}</h4>
                  <p className="text-sm text-gray-600">Instructor: {certificate.instructor}</p>
                  <p className="text-sm text-gray-500">Completed: {certificate.date}</p>
                </div>
                {getStatusBadge(certificate)}
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  onClick={() => handleDownload(certificate)}
                  disabled={!certificate.paymentCompleted}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleShare(certificate)}
                  disabled={!certificate.paymentCompleted}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePrint(certificate)}
                  disabled={!certificate.paymentCompleted}
                >
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Button>
                
                {!certificate.paymentCompleted && (
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Complete Payment
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {certificates.length === 0 && (
            <p className="text-center text-gray-500 py-8">No certificates available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
