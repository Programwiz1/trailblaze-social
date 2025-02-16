
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
        profile:profiles!posts_user_id_fkey (
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    setPosts(data as Post[]);
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
