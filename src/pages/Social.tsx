
import Navbar from "@/components/Navbar";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { PostsList } from "@/components/PostsList";
import { EcoFactsSection } from "@/components/EcoFactsSection";
import { ConservationEventsSection } from "@/components/ConservationEventsSection";
import { usePosts } from "@/hooks/usePosts";

const Social = () => {
  const { posts, refreshPosts } = usePosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-nature-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-nature-800 mb-4">Trail Community</h1>
          <p className="text-nature-600 mb-6">
            Share your hiking adventures and help document local wildlife
          </p>

          <CreatePostDialog onSuccess={refreshPosts} />
          
          <EcoFactsSection />
          <ConservationEventsSection />
        </div>

        <PostsList posts={posts} />
      </main>
    </div>
  );
};

export default Social;
