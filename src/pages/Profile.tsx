
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post } from "@/hooks/usePosts";
import { PostsList } from "@/components/PostsList";
import TrailCard from "@/components/TrailCard";
import { Loader2 } from "lucide-react";

interface UserProfile {
  username: string;
  avatar_url: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      if (!user) return;

      try {
        // Fetch profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .maybeSingle();

        if (profileData) {
          setProfile(profileData);
        }

        // Fetch user's posts with likes and comments
        const { data: postsData } = await supabase
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
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (postsData) {
          setPosts(postsData as Post[]);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-nature-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <p className="text-center text-lg">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-nature-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-nature-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback>{profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile?.username || user.email}</h1>
              <p className="text-gray-500">Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
            <TabsTrigger value="trails" className="flex-1">Trail Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            {posts.length > 0 ? (
              <PostsList posts={posts} />
            ) : (
              <p className="text-center text-gray-500 py-8">No posts yet.</p>
            )}
          </TabsContent>

          <TabsContent value="trails">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.filter(post => post.type === 'trail').map(post => (
                <TrailCard
                  key={post.id}
                  id={post.id}
                  name={post.caption || 'Unnamed Trail'}
                  image={post.image_url}
                  difficulty="moderate"
                  rating={4.5}
                  distance={2.5}
                  time="1h 30m"
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
