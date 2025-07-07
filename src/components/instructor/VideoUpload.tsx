
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { logActivity } from '@/utils/activityLogger';

export const VideoUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    file: null as File | null
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Video must be less than 100MB",
          variant: "destructive"
        });
        return;
      }
      
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const ensureInstructorChannel = async () => {
    if (!user) return null;

    // Check if instructor channel exists
    const { data: existingChannel } = await supabase
      .from('instructor_channels')
      .select('id')
      .eq('instructor_id', user.id)
      .single();

    if (existingChannel) {
      return existingChannel.id;
    }

    // Create instructor channel
    const channelName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Instructor';
    const { data: newChannel, error } = await supabase
      .from('instructor_channels')
      .insert({
        instructor_id: user.id,
        channel_name: channelName,
        description: `${channelName}'s Channel`
      })
      .select('id')
      .single();

    if (error) throw error;
    return newChannel.id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.file || !user) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      // Ensure instructor channel exists
      const channelId = await ensureInstructorChannel();
      if (!channelId) throw new Error('Failed to create/find instructor channel');

      // Upload file to Supabase Storage
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('content-uploads')
        .upload(`videos/${fileName}`, formData.file);

      if (uploadError) throw uploadError;

      // Get file URL
      const { data: { publicUrl } } = supabase.storage
        .from('content-uploads')
        .getPublicUrl(`videos/${fileName}`);

      // Save to database
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      const { data: uploadData, error: dbError } = await supabase
        .from('content_uploads')
        .insert({
          instructor_id: user.id,
          channel_id: channelId,
          title: formData.title,
          description: formData.description,
          file_url: publicUrl,
          file_type: 'video',
          file_name: formData.file.name,
          file_size: formData.file.size,
          tags: tagsArray
        })
        .select()
        .single();

      if (dbError) throw dbError;

      await logActivity('video_upload', uploadData.id, 'video', {
        title: formData.title,
        file_name: formData.file.name,
        tags: tagsArray
      });

      toast({
        title: "Success",
        description: "Video uploaded successfully",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        tags: '',
        file: null
      });
      
      // Reset file input
      const fileInput = document.getElementById('video-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Upload Video
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="video-title">Video Title</Label>
            <Input
              id="video-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter video title..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-description">Description</Label>
            <Textarea
              id="video-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter video description..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-tags">Tags (comma-separated)</Label>
            <Input
              id="video-tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g., programming, tutorial, javascript"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-file">Upload Video</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <div className="space-y-2">
                  <Input
                    id="video-file"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="max-w-xs mx-auto"
                  />
                  {formData.file && (
                    <p className="text-sm text-gray-600">
                      Selected: {formData.file.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Supported: MP4, MOV, AVI, WMV (Max: 100MB)
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
            {uploading ? 'Uploading...' : 'Upload Video'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
