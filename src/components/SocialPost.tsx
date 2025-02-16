
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { PostHeader } from "./social/PostHeader";
import { PostImage } from "./social/PostImage";
import { PostActions } from "./social/PostActions";
import { CommentsList } from "./social/CommentsList";
import { CommentForm } from "./social/CommentForm";

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  username?: string;
}

interface SpeciesData {
  name: string;
  scientificName: string;
  location: string;
  time: string;
  confidence: number;
}

interface SocialPostProps {
  id: string;
  user: string;
  userAvatar?: string;
  image: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  type?: "trail" | "species";
  speciesData?: SpeciesData;
}

const SocialPost = ({
  id,
  user,
  userAvatar,
  image,
  caption,
  likes: initialLikes,
  comments: initialComments,
  timestamp,
  type = "trail",
  speciesData,
}: SocialPostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [commentUsernames, setCommentUsernames] = useState<Record<string, string>>({});

  const checkIfLiked = async () => {
    if (!currentUser) return;

    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', currentUser.id)
      .maybeSingle();

    setIsLiked(!!data);
  };

  useEffect(() => {
    checkIfLiked();
  }, [currentUser, id]);

  useEffect(() => {
    const fetchCommentUsernames = async () => {
      if (!comments.length) return;

      const userIds = comments.map(comment => comment.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds);

      if (profiles) {
        const usernameMap = profiles.reduce((acc, profile) => ({
          ...acc,
          [profile.id]: profile.username
        }), {});
        setCommentUsernames(usernameMap);
      }
    };

    fetchCommentUsernames();
  }, [comments]);

  const handleLike = async () => {
    if (!currentUser) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like posts",
      });
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', currentUser.id);
        setLikesCount(prev => prev - 1);
      } else {
        await supabase
          .from('likes')
          .insert([{ post_id: id, user_id: currentUser.id }]);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update like. Please try again.",
      });
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      const { data: comment, error } = await supabase
        .from('comments')
        .insert([{
          post_id: id,
          user_id: currentUser.id,
          content: newComment
        }])
        .select()
        .single();

      if (error) throw error;

      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', currentUser.id)
        .single();

      if (profile) {
        setCommentUsernames(prev => ({
          ...prev,
          [currentUser.id]: profile.username
        }));
      }

      setComments([...comments, comment]);
      setNewComment("");
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment. Please try again.",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <PostHeader user={user} userAvatar={userAvatar} timestamp={timestamp} />
      <PostImage image={image} />
      
      <div className="p-4">
        <PostActions
          isLiked={isLiked}
          likesCount={likesCount}
          commentsCount={comments.length}
          onLikeClick={handleLike}
          onCommentClick={() => setShowComments(!showComments)}
        />

        <p className="text-gray-900 mb-2">{caption}</p>

        {showComments && (
          <div className="mt-4 space-y-4">
            <CommentsList comments={comments} commentUsernames={commentUsernames} />

            {currentUser && (
              <CommentForm
                newComment={newComment}
                onCommentChange={setNewComment}
                onSubmit={handleAddComment}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialPost;
