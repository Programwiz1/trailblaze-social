
import { Heart, MessageSquare } from "lucide-react";

interface PostActionsProps {
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  onLikeClick: () => void;
  onCommentClick: () => void;
}

export const PostActions = ({
  isLiked,
  likesCount,
  commentsCount,
  onLikeClick,
  onCommentClick,
}: PostActionsProps) => {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <button
        onClick={onLikeClick}
        className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
      >
        <Heart className={`w-6 h-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
        <span>{likesCount}</span>
      </button>
      <button
        onClick={onCommentClick}
        className="flex items-center space-x-1 text-gray-600 hover:text-nature-500 transition-colors"
      >
        <MessageSquare className="w-6 h-6" />
        <span>{commentsCount}</span>
      </button>
    </div>
  );
};
