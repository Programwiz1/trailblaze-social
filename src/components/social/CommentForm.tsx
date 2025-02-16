
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CommentFormProps {
  newComment: string;
  onCommentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CommentForm = ({ newComment, onCommentChange, onSubmit }: CommentFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex space-x-2">
      <Input
        type="text"
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => onCommentChange(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" variant="secondary">
        Post
      </Button>
    </form>
  );
};
