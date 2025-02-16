
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import SocialPost from "@/components/SocialPost";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { EcoFactsSection } from "@/components/EcoFactsSection";
import { ConservationEventsSection } from "@/components/ConservationEventsSection";

interface PostProfile {
  username: string;
  avatar_url: string | null;
}

interface Post {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
  type: string | null;
  species_data: any | null;
  profiles: PostProfile;
  likes: { count: number }[];
  comments: Array<{
    id: string;
    content: string;
    user_id: string;
    created_at: string;
  }>;
}

const Social = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
    setupRealtimeSubscription();
  }, []);

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
        profiles: user_id (
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    // Transform the data to include the profile information
    const transformedPosts = (data as Post[])?.map(post => ({
      ...post,
      username: post.profiles?.username,
      userAvatar: post.profiles?.avatar_url,
    }));

    setPosts(transformedPosts || []);
  };

  const setupRealtimeSubscription = () => {
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
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !user) return;

    setUploading(true);
    try {
      // Upload image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('post-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      // Create post in database
      const { error: postError } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            image_url: publicUrl,
            caption: caption,
            type: 'trail'
          }
        ]);

      if (postError) throw postError;

      toast({
        title: "Success!",
        description: "Your post has been shared.",
      });

      setNewPostOpen(false);
      setImageFile(null);
      setCaption("");
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-nature-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-nature-800 mb-4">Trail Community</h1>
          <p className="text-nature-600 mb-6">
            Share your hiking adventures and help document local wildlife
          </p>

          <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
            <DialogTrigger asChild>
              <Button className="mb-8 bg-nature-600 hover:bg-nature-700 text-white">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Post</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Share your adventure..."
                    required
                  />
                </div>
                <Button type="submit" disabled={uploading} className="w-full">
                  {uploading ? "Posting..." : "Post"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          
          <EcoFactsSection />
          <ConservationEventsSection />
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <SocialPost
              key={post.id}
              id={post.id}
              user={post.username || post.user_id}
              userAvatar={post.userAvatar}
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
      </main>
    </div>
  );
};

export default Social;
