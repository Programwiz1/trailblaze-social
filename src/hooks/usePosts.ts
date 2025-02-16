
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
    // First fetch posts with likes and comments
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select(`
        *,
        likes (count),
        comments (
          id,
          content,
          user_id,
          created_at
        )
      `)
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      return;
    }

    if (postsData) {
      // Then fetch profiles for all user_ids
      const userIds = postsData.map(post => post.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // Create a map of user_id to profile data
      const profileMap = profilesData?.reduce((acc, profile) => ({
        ...acc,
        [profile.id]: profile
      }), {}) || {};

      // Combine posts with their profile data
      const postsWithProfiles = postsData.map(post => ({
        ...post,
        profile: profileMap[post.user_id] ? {
          username: profileMap[post.user_id].username,
          avatar_url: profileMap[post.user_id].avatar_url
        } : {
          username: 'Unknown User',
          avatar_url: null
        }
      }));

      setPosts(postsWithProfiles as Post[]);
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
