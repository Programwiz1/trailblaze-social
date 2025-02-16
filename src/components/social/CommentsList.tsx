
interface Comment {
  id: string;
  content: string;
  user_id: string;
  username?: string;
}

interface CommentsListProps {
  comments: Comment[];
  commentUsernames: Record<string, string>;
}

export const CommentsList = ({ comments, commentUsernames }: CommentsListProps) => {
  return (
    <div className="space-y-2">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-2">
          <p className="font-medium">{commentUsernames[comment.user_id] || 'Unknown User'}:</p>
          <p className="text-gray-600">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};
