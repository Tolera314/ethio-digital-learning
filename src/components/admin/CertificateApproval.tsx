
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
        },
        {
          id: '3',
          student_name: 'Ahmed Hassan',
          course_title: 'Data Analysis with Python',
          completion_date: '2025-01-12',
          payment_status: 'pending',
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

      // Log the activity with proper metadata
      await logActivity('certificate_approve', certificateId, 'certificate', {
        action: action,
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
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading certificates...</p>
        </div>
      </div>
    );
  }

  const pendingCertificates = certificates.filter(cert => cert.status === 'pending');

  return (
    <Card className="glass-morphism border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FileText className="h-5 w-5 text-yellow-400" />
          Certificate Approval
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingCertificates.map((certificate) => (
            <div key={certificate.id} className="p-4 border border-white/10 rounded-lg bg-black/30 hover:bg-black/40 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{certificate.student_name}</h4>
                  <p className="text-sm text-gray-300">{certificate.course_title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      Completed: {new Date(certificate.completion_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Badge 
                  variant={certificate.payment_status === 'completed' ? 'default' : 'destructive'}
                  className={certificate.payment_status === 'completed' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                  }
                >
                  {certificate.payment_status === 'completed' ? 'Payment Complete' : 'Payment Pending'}
                </Badge>
              </div>
              
              {certificate.payment_status === 'completed' ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleCertificateAction(certificate.id, 'approve')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCertificateAction(certificate.id, 'reject')}
                    className="border-red-300 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              ) : (
                <p className="text-amber-400 text-sm">
                  ⚠️ Payment must be completed before certificate can be approved
                </p>
              )}
            </div>
          ))}
          
          {pendingCertificates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No pending certificates</p>
              <p className="text-gray-500 text-sm">All certificates have been processed</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
