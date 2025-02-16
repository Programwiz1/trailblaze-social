
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    console.log('Fetching posts...');
    
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url,
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      return;
    }

    console.log('Posts data received:', postsData);

    // Ensure each post has a valid profiles object
    const sanitizedPosts = postsData?.map(post => ({
      ...post,
      profiles: post.profiles || {
        username: 'Unknown User',
        avatar_url: null,
        first_name: null,
        last_name: null
      }
    })) || [];

    console.log('Sanitized posts:', sanitizedPosts);
    setPosts(sanitizedPosts);
  };

  useEffect(() => {
    fetchPosts();

    // Set up real-time subscription
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

  return {
    posts,
    refreshPosts: fetchPosts,
  };
};
