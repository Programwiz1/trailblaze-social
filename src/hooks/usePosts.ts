
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PostProfile {
  username: string;
  avatar_url: string | null;
}

export interface Post {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
  type: string | null;
  species_data: any | null;
  profile: PostProfile;
  likes: { count: number }[];
  comments: Array<{
    id: string;
    content: string;
    user_id: string;
    created_at: string;
  }>;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    // Using a left join to get profile data even if some posts don't have matching profiles
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        likes (count),
        comments (
          id,
          content,
          user_id,
          created_at
        ),
        profile:profiles (
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    if (data) {
      // Transform and filter out posts with invalid profile data
      const validPosts = data
        .filter(post => post.profile && post.profile.username)
        .map(post => ({
          ...post,
          profile: {
            username: post.profile.username,
            avatar_url: post.profile.avatar_url
          }
        }));

      setPosts(validPosts as Post[]);
    }
  };

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts'
      }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { posts, refreshPosts: fetchPosts };
};
