
import Navbar from "@/components/Navbar";
import SocialPost from "@/components/SocialPost";

const mockPosts = [
  {
    id: "1",
    user: "Sarah Hiker",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    caption: "Just completed the Emerald Lake Trail! The views were absolutely breathtaking 🏔️ #hiking #nature #adventure",
    likes: 124,
    comments: [
      {
        id: "c1",
        user: "John",
        content: "Amazing view! Which trail is this?",
        timestamp: "2h ago"
      },
      {
        id: "c2",
        user: "Lisa",
        content: "Love this spot! The lake is so crystal clear.",
        timestamp: "1h ago"
      }
    ],
    timestamp: "3h ago"
  },
  {
    id: "2",
    user: "Mike Adventure",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5",
    caption: "Early morning hike to Crystal Mountain Peak. Worth every step! 🌄 #sunrise #mountainview",
    likes: 89,
    comments: [
      {
        id: "c3",
        user: "Emma",
        content: "The sunrise looks magical!",
        timestamp: "30m ago"
      }
    ],
    timestamp: "5h ago"
  }
];

const Social = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Trail Community</h1>
          <p className="text-gray-600">
            Share your hiking adventures and connect with fellow trail enthusiasts
          </p>
        </div>

        <div className="space-y-6">
          {mockPosts.map((post) => (
            <SocialPost key={post.id} {...post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Social;
