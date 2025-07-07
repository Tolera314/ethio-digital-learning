import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Edit, Eye, EyeOff, Flag, MessageSquare, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  file_type: string;
  file_name: string;
  is_published: boolean;
  created_at: string;
  instructor_channels: {
    channel_name: string;
  };
  reports_count?: number;
  comments_count?: number;
  ratings_count?: number;
}

interface Comment {
  id: string;
  comment_text: string;
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

export const ContentManagement = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content_uploads')
        .select(`
          *,
          instructor_channels(channel_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch interaction counts
      const contentWithStats = await Promise.all(
        data.map(async (item) => {
          // Get reports count
          const { count: reportsCount } = await supabase
            .from('content_interactions')
            .select('*', { count: 'exact' })
            .eq('content_id', item.id)
            .eq('interaction_type', 'report');

          // Get comments count
          const { count: commentsCount } = await supabase
            .from('content_comments')
            .select('*', { count: 'exact' })
            .eq('content_id', item.id);

          // Get ratings count
          const { count: ratingsCount } = await supabase
            .from('content_ratings')
            .select('*', { count: 'exact' })
            .eq('content_id', item.id);

          return {
            ...item,
            reports_count: reportsCount || 0,
            comments_count: commentsCount || 0,
            ratings_count: ratingsCount || 0
          };
        })
      );

      setContent(contentWithStats);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (contentId: string) => {
    try {
      const { data, error } = await supabase
        .from('content_comments')
        .select(`
          id,
          comment_text,
          created_at,
          user_id,
          profiles!inner(full_name)
        `)
        .eq('content_id', contentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Set empty comments if there's an error
      setComments([]);
    }
  };

  const togglePublishStatus = async (contentId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('content_uploads')
        .update({ is_published: !currentStatus })
        .eq('id', contentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Content ${!currentStatus ? 'published' : 'unpublished'} successfully`,
      });

      fetchContent();
    } catch (error) {
      console.error('Error updating publish status:', error);
      toast({
        title: "Error",
        description: "Failed to update publish status",
        variant: "destructive"
      });
    }
  };

  const deleteContent = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete from storage first
      const content = await supabase
        .from('content_uploads')
        .select('file_url')
        .eq('id', contentId)
        .single();

      if (content.data?.file_url) {
        const filePath = content.data.file_url.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('content-uploads')
            .remove([`videos/${filePath}`, `documents/${filePath}`]);
        }
      }

      // Delete from database (cascade will handle related records)
      const { error } = await supabase
        .from('content_uploads')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content deleted successfully",
      });

      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive"
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('content_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });

      if (selectedContentId) {
        fetchComments(selectedContentId);
        fetchContent(); // Refresh to update counts
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {content.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                  <p className="text-sm text-gray-600 mb-2">
                    by {item.instructor_channels.channel_name}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Type: {item.file_type}</span>
                    <span>File: {item.file_name}</span>
                    <span>Created: {new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.is_published ? "default" : "secondary"}>
                    {item.is_published ? "Published" : "Draft"}
                  </Badge>
                  {item.reports_count && item.reports_count > 0 && (
                    <Badge variant="destructive">
                      {item.reports_count} Reports
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Flag className="h-4 w-4" />
                    {item.reports_count || 0} Reports
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {item.comments_count || 0} Comments
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {item.ratings_count || 0} Ratings
                  </span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => togglePublishStatus(item.id, item.is_published)}
                >
                  {item.is_published ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Publish
                    </>
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedContentId(item.id);
                    fetchComments(item.id);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  View Comments
                </Button>
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteContent(item.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {content.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No content found.
        </div>
      )}

      {/* Comments Modal */}
      {selectedContentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Comments Management</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedContentId(null)}
              >
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Comments ({comments.length})</h4>
              {comments.map((comment) => (
                <div key={comment.id} className="border-l-2 border-gray-200 pl-4 py-2">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="font-medium text-sm">
                        {comment.profiles?.full_name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteComment(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700">{comment.comment_text}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
