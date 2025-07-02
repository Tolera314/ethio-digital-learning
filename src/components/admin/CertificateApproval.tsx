
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, FileText, Calendar } from 'lucide-react';
import { logActivity } from '@/utils/activityLogger';

interface PendingCertificate {
  id: string;
  student_name: string;
  course_title: string;
  completion_date: string;
  payment_status: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const CertificateApproval = () => {
  const [certificates, setCertificates] = useState<PendingCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingCertificates();
  }, []);

  const fetchPendingCertificates = async () => {
    try {
      // Mock data for now - replace with actual Supabase query when certificates table is created
      const mockCertificates: PendingCertificate[] = [
        {
          id: '1',
          student_name: 'John Doe',
          course_title: 'Web Development Fundamentals',
          completion_date: '2025-01-15',
          payment_status: 'completed',
          status: 'pending'
        },
        {
          id: '2',
          student_name: 'Jane Smith',
          course_title: 'UX/UI Design Principles',
          completion_date: '2025-01-10',
          payment_status: 'completed',
          status: 'pending'
        }
      ];
      
      setCertificates(mockCertificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending certificates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCertificateAction = async (certificateId: string, action: 'approve' | 'reject') => {
    try {
      // Mock approval/rejection - replace with actual Supabase update
      setCertificates(prev => 
        prev.map(cert => 
          cert.id === certificateId 
            ? { ...cert, status: action === 'approve' ? 'approved' : 'rejected' }
            : cert
        )
      );

      await logActivity('certificate_approve', certificateId, 'certificate', {
        action,
        certificate_id: certificateId
      });

      toast({
        title: "Success",
        description: `Certificate ${action}d successfully`,
      });
    } catch (error) {
      console.error(`Error ${action}ing certificate:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} certificate`,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading certificates...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Certificate Approval
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {certificates.filter(cert => cert.status === 'pending').map((certificate) => (
            <div key={certificate.id} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{certificate.student_name}</h4>
                  <p className="text-sm text-gray-600">{certificate.course_title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      Completed: {new Date(certificate.completion_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Badge variant={certificate.payment_status === 'completed' ? 'default' : 'secondary'}>
                  {certificate.payment_status}
                </Badge>
              </div>
              
              {certificate.payment_status === 'completed' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleCertificateAction(certificate.id, 'approve')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCertificateAction(certificate.id, 'reject')}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
          
          {certificates.filter(cert => cert.status === 'pending').length === 0 && (
            <p className="text-center text-gray-500 py-8">No pending certificates</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
