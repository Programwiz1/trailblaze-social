
import SocialPost from "@/components/SocialPost";
import { Post } from "@/hooks/usePosts";

interface PostsListProps {
  posts: Post[];
}

export const PostsList = ({ posts }: PostsListProps) => {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <SocialPost
          key={post.id}
          id={post.id}
          user={post.profile?.username || post.user_id}
          userAvatar={post.profile?.avatar_url}
          image={post.image_url}
          caption={post.caption || ""}
          likes={post.likes?.[0]?.count || 0}
          comments={post.comments || []}
          timestamp={new Date(post.created_at).toLocaleDateString()}
          type={post.type as "trail" | "species" || "trail"}
          speciesData={post.species_data}
        />
      ))}
    </div>
  );
};
