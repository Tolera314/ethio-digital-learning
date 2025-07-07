import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Heart, MessageSquare, Star, Flag, Send, Play, FileText, Presentation, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { logActivity } from '@/utils/activityLogger';

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  file_name: string;
  tags: string[] | null;
  created_at: string;
  instructor_channels: {
    channel_name: string;
  };
  likes_count?: number;
  comments_count?: number;
  avg_rating?: number;
  user_liked?: boolean;
  user_rating?: number;
}

interface Comment {
  id: string;
  comment_text: string;
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

export const ContentViewer = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

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
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch interaction counts and user interactions
      const contentWithStats = await Promise.all(
        data.map(async (item) => {
          // Get likes count
          const { count: likesCount } = await supabase
            .from('content_interactions')
            .select('*', { count: 'exact' })
            .eq('content_id', item.id)
            .eq('interaction_type', 'like');

          // Get comments count
          const { count: commentsCount } = await supabase
            .from('content_comments')
            .select('*', { count: 'exact' })
            .eq('content_id', item.id);

          // Get average rating
          const { data: ratings } = await supabase
            .from('content_ratings')
            .select('rating')
            .eq('content_id', item.id);

          const avgRating = ratings && ratings.length > 0 
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
            : 0;

          // Check if user liked
          const { data: userLike } = await supabase
            .from('content_interactions')
            .select('*')
            .eq('content_id', item.id)
            .eq('user_id', user?.id)
            .eq('interaction_type', 'like')
            .single();

          // Get user rating
          const { data: userRating } = await supabase
            .from('content_ratings')
            .select('rating')
            .eq('content_id', item.id)
            .eq('user_id', user?.id)
            .single();

          return {
            ...item,
            likes_count: likesCount || 0,
            comments_count: commentsCount || 0,
            avg_rating: Math.round(avgRating * 10) / 10,
            user_liked: !!userLike,
            user_rating: userRating?.rating || 0
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
      setComments([]);
    }
  };

  const handleLike = async (contentId: string) => {
    if (!user) return;

    try {
      const item = content.find(c => c.id === contentId);
      if (!item) return;

      if (item.user_liked) {
        // Unlike
        await supabase
          .from('content_interactions')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id)
          .eq('interaction_type', 'like');
      } else {
        // Like
        await supabase
          .from('content_interactions')
          .insert({
            content_id: contentId,
            user_id: user.id,
            interaction_type: 'like'
          });

        await logActivity('video_like', contentId, 'content', {
          title: item.title
        });
      }

      fetchContent(); // Refresh to update counts
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
    }
  };

  const handleComment = async (contentId: string) => {
    if (!user || !newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('content_comments')
        .insert({
          content_id: contentId,
          user_id: user.id,
          comment_text: newComment.trim()
        });

      if (error) throw error;

      const item = content.find(c => c.id === contentId);
      await logActivity('video_comment', contentId, 'content', {
        title: item?.title,
        comment: newComment.trim()
      });

      setNewComment('');
      fetchComments(contentId);
      fetchContent(); // Refresh to update counts
      
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    }
  };

  const handleRating = async (contentId: string, rating: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('content_ratings')
        .upsert({
          content_id: contentId,
          user_id: user.id,
          rating
        });

      if (error) throw error;

      const item = content.find(c => c.id === contentId);
      await logActivity('instructor_rate', contentId, 'content', {
        title: item?.title,
        rating
      });

      fetchContent(); // Refresh to update ratings
      
      toast({
        title: "Success",
        description: "Rating submitted successfully",
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive"
      });
    }
  };

  const handleReport = async (contentId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('content_interactions')
        .insert({
          content_id: contentId,
          user_id: user.id,
          interaction_type: 'report'
        });

      toast({
        title: "Success",
        description: "Content reported successfully",
      });
    } catch (error) {
      console.error('Error reporting content:', error);
      toast({
        title: "Error",
        description: "Failed to report content",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'presentation':
        return <Presentation className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                  <p className="text-sm text-gray-600 mb-2">
                    by {item.instructor_channels.channel_name}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    {getFileIcon(item.file_type)}
                    <span className="text-sm text-gray-500 capitalize">
                      {item.file_type}
                    </span>
                  </div>
                </div>
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {item.likes_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {item.comments_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {item.avg_rating && item.avg_rating > 0 ? item.avg_rating.toFixed(1) : 'No ratings'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={item.user_liked ? "default" : "outline"}
                    onClick={() => handleLike(item.id)}
                    disabled={!user}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    Like
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedContent(item);
                      fetchComments(item.id);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Comment
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReport(item.id)}
                    disabled={!user}
                  >
                    <Flag className="h-4 w-4 mr-1" />
                    Report
                  </Button>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-sm">Rate:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(item.id, star)}
                      disabled={!user}
                      className="p-1"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          star <= (item.user_rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <a
                  href={item.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    View/Download
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comments Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{selectedContent.title}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedContent(null)}
              >
                Close
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex gap-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  disabled={!user}
                />
                <Button
                  onClick={() => handleComment(selectedContent.id)}
                  disabled={!user || !newComment.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Comments ({comments.length})</h4>
              {comments.map((comment) => (
                <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">
                      {comment.profiles?.full_name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
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
