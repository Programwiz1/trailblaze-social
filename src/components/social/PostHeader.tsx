
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostHeaderProps {
  user: string;
  userAvatar?: string;
  timestamp: string;
  firstName?: string;
  lastName?: string;
}

export const PostHeader = ({ user, userAvatar, timestamp, firstName, lastName }: PostHeaderProps) => {
  const displayName = firstName && lastName 
    ? `${firstName} ${lastName}` 
    : firstName || lastName || user;

  return (
    <div className="p-4 flex items-center space-x-2">
      <Avatar>
        <AvatarImage src={userAvatar} />
        <AvatarFallback>
          <User className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium text-gray-900">{displayName}</p>
        <p className="text-xs text-gray-500">{timestamp}</p>
      </div>
    </div>
  );
};
