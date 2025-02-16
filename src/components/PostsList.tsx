
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SocialPost from "./SocialPost";

interface Post {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
  type: string;
  species_data: any;
  profiles: {
    username: string;
    avatar_url: string | null;
    first_name: string | null;
    last_name: string | null;
  };
}

interface PostsListProps {
  posts: Post[];
}

export const PostsList = ({ posts }: PostsListProps) => {
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [commentsCount, setCommentsCount] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetchPostsData = async () => {
      // Fetch likes count for each post
      const likesPromises = posts.map(async (post) => {
        const { count } = await supabase
          .from('likes')
          .select('id', { count: 'exact' })
          .eq('post_id', post.id);
        return { postId: post.id, count: count || 0 };
      });

      // Fetch comments for each post
      const commentsPromises = posts.map(async (post) => {
        const { data: comments } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', post.id);
        return { postId: post.id, comments: comments || [] };
      });

      const likesResults = await Promise.all(likesPromises);
      const commentsResults = await Promise.all(commentsPromises);

      const newLikesCount: Record<string, number> = {};
      const newCommentsCount: Record<string, any[]> = {};

      likesResults.forEach(({ postId, count }) => {
        newLikesCount[postId] = count;
      });

      commentsResults.forEach(({ postId, comments }) => {
        newCommentsCount[postId] = comments;
      });

      setLikesCount(newLikesCount);
      setCommentsCount(newCommentsCount);
    };

    fetchPostsData();
  }, [posts]);

  if (!posts.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No posts yet. Be the first to share your adventure!</p>
      </div>
    );
  }

  console.log('Rendering posts:', posts); // Debug log

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        console.log('Rendering post:', post); // Debug log for each post
        return (
          <SocialPost
            key={post.id}
            id={post.id}
            userId={post.user_id}
            user={post.profiles?.username || "Unknown User"}
            userAvatar={post.profiles?.avatar_url || undefined}
            image={post.image_url}
            caption={post.caption || ""}
            likes={likesCount[post.id] || 0}
            comments={commentsCount[post.id] || []}
            timestamp={new Date(post.created_at).toLocaleString()}
            type={post.type as "trail" | "species"}
            speciesData={post.species_data}
          />
        );
      })}
    </div>
  );
};
