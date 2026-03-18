import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DesignComments({ design, currentUser, canComment }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (design && showComments) {
      loadComments();
      
      // Subscribe to real-time updates
      const unsubscribe = base44.entities.DesignComment.subscribe((event) => {
        if (event.data?.design_id === design.id) {
          if (event.type === 'create') {
            setComments(prev => [...prev, event.data]);
          } else if (event.type === 'delete') {
            setComments(prev => prev.filter(c => c.id !== event.id));
          }
        }
      });

      return unsubscribe;
    }
  }, [design, showComments]);

  const loadComments = async () => {
    try {
      const commentsList = await base44.entities.DesignComment.filter(
        { design_id: design.id },
        '-created_date'
      );
      setComments(commentsList);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !canComment) return;

    setLoading(true);
    try {
      await base44.entities.DesignComment.create({
        design_id: design.id,
        user_id: currentUser.id,
        user_name: currentUser.full_name || currentUser.email,
        comment: newComment.trim()
      });
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
    setLoading(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await base44.entities.DesignComment.delete(commentId);
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  if (!currentUser?.isPremiumActive) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showComments ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-[var(--border-primary)] w-80 max-h-[500px] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[var(--text-primary)]" />
              <h3 className="font-semibold text-[var(--text-primary)]">Comments ({comments.length})</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowComments(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)] text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {comment.user_name}
                    </span>
                    {comment.user_id === currentUser.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{comment.comment}</p>
                  <span className="text-xs text-[var(--text-tertiary)] mt-1">
                    {new Date(comment.created_date).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>

          {canComment && (
            <div className="p-4 border-t border-[var(--border-primary)]">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[60px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={loading || !newComment.trim()}
                  size="icon"
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button
          onClick={() => setShowComments(true)}
          className="rounded-full h-14 w-14 shadow-xl"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
          {comments.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {comments.length}
            </span>
          )}
        </Button>
      )}
    </div>
  );
}