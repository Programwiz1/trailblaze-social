
import { useState } from "react";
import { Heart, MessageSquare, User, Bird, MapPin, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
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
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      user: "Current User",
      content: newComment,
      timestamp: "Just now"
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 flex items-center space-x-2">
        <Avatar>
          <AvatarImage src={userAvatar} />
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-gray-900">{user}</p>
          <p className="text-xs text-gray-500">{timestamp}</p>
        </div>
      </div>

      <img src={image} alt="Post" className="w-full h-96 object-cover" />

      <div className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
          >
            <Heart className={`w-6 h-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            <span>{likes}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-gray-600 hover:text-nature-500 transition-colors"
          >
            <MessageSquare className="w-6 h-6" />
            <span>{comments.length}</span>
          </button>
        </div>

        <p className="text-gray-900 mb-2">{caption}</p>

        {type === "species" && speciesData && (
          <div className="mt-4 bg-green-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2 text-green-800">
              <Bird className="w-4 h-4" />
              <span className="font-medium">{speciesData.name}</span>
            </div>
            <p className="text-sm text-green-700 italic">{speciesData.scientificName}</p>
            <div className="flex items-center space-x-4 text-sm text-green-700">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{speciesData.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{speciesData.time}</span>
              </div>
            </div>
            <div className="text-sm text-green-700">
              AI Confidence: {(speciesData.confidence * 100).toFixed(1)}%
            </div>
          </div>
        )}

        {showComments && (
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-2">
                  <p className="font-medium">{comment.user}</p>
                  <p className="text-gray-600">{comment.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex space-x-2">
              <Input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="secondary">
                Post
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialPost;
