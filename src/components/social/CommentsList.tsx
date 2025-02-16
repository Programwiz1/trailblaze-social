
interface Comment {
  id: string;
  content: string;
  user_id: string;
  username?: string;
}

interface CommentsListProps {
  comments: Comment[];
  commentUsernames: Record<string, {
    username: string;
    first_name?: string | null;
    last_name?: string | null;
  }>;
}

export const CommentsList = ({ comments, commentUsernames }: CommentsListProps) => {
  const getDisplayName = (userId: string) => {
    const profile = commentUsernames[userId];
    if (!profile) return "Unknown User";
    
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    
    return profile.first_name || profile.last_name || profile.username;
  };

  return (
    <div className="space-y-2">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-2">
          <p className="font-medium">{getDisplayName(comment.user_id)}:</p>
          <p className="text-gray-600">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};
