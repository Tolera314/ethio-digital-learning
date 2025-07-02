
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileText } from 'lucide-react';
import { logActivity } from '@/utils/activityLogger';

export const MaterialUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    file: null as File | null
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File must be less than 50MB",
          variant: "destructive"
        });
        return;
      }
      
      setFormData(prev => ({ ...prev, file }));
      
      // Auto-detect material type based on file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      let materialType = '';
      
      switch (extension) {
        case 'pdf':
          materialType = 'PDF Document';
          break;
        case 'ppt':
        case 'pptx':
          materialType = 'Presentation';
          break;
        case 'doc':
        case 'docx':
          materialType = 'Document';
          break;
        case 'epub':
          materialType = 'E-Book';
          break;
        default:
          materialType = 'Other';
      }
      
      setFormData(prev => ({ ...prev, type: materialType }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.file || !formData.type) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      // Mock material upload - replace with actual Supabase storage upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const materialId = Math.random().toString(36).substr(2, 9);
      
      await logActivity('material_upload', materialId, 'material', {
        title: formData.title,
        material_type: formData.type,
        file_name: formData.file.name
      });

      toast({
        title: "Success",
        description: "Material uploaded successfully",
      });

      // Reset form
      setFormData({
        title: '',
        type: '',
        file: null
      });
      
      // Reset file input
      const fileInput = document.getElementById('material-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error uploading material:', error);
      toast({
        title: "Error",
        description: "Failed to upload material",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const materialTypes = [
    'PDF Document',
    'E-Book',
    'Presentation',
    'Document',
    'Spreadsheet',
    'Other'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Course Material
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="material-title">Material Title</Label>
            <Input
              id="material-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter material title..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="material-type">Material Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select material type" />
              </SelectTrigger>
              <SelectContent>
                {materialTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="material-file">Upload File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <div className="space-y-2">
                  <Input
                    id="material-file"
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.epub,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="max-w-xs mx-auto"
                  />
                  {formData.file && (
                    <p className="text-sm text-gray-600">
                      Selected: {formData.file.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Supported: PDF, DOC, PPT, EPUB, XLS (Max: 50MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={uploading}
            className="w-full"
          >
            {uploading ? 'Uploading...' : 'Upload Material'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
