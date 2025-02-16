
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrailCard from "@/components/TrailCard";
import { Loader2 } from "lucide-react";

interface SavedTrail {
  id: string;
  trail_id: string;
  created_at: string;
}

interface CompletedTrail {
  id: string;
  trail_id: string;
  completed_at: string;
  rating: number;
  review_text: string | null;
  difficulty_rating: "easy" | "moderate" | "hard";
  duration_minutes: number;
}

interface UserProfile {
  username: string;
  avatar_url: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedTrails, setSavedTrails] = useState<SavedTrail[]>([]);
  const [completedTrails, setCompletedTrails] = useState<CompletedTrail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndTrails = async () => {
      if (!user) return;

      try {
        // Fetch profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Fetch saved trails
        const { data: savedData } = await supabase
          .from('saved_trails')
          .select('*')
          .eq('user_id', user.id);

        if (savedData) {
          setSavedTrails(savedData);
        }

        // Fetch completed trails
        const { data: completedData } = await supabase
          .from('trail_completions')
          .select('*')
          .eq('user_id', user.id);

        if (completedData) {
          setCompletedTrails(completedData);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndTrails();
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

        <Tabs defaultValue="completed" className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="completed" className="flex-1">Completed Trails</TabsTrigger>
            <TabsTrigger value="saved" className="flex-1">Saved Trails</TabsTrigger>
          </TabsList>

          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedTrails.map((trail) => (
                <TrailCard
                  key={trail.id}
                  id={trail.trail_id}
                  name={`Trail ${trail.trail_id}`} // This should be replaced with actual trail data
                  image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
                  difficulty={trail.difficulty_rating}
                  rating={trail.rating}
                  distance={2.5} // This should be replaced with actual trail data
                  time={`${Math.floor(trail.duration_minutes / 60)}h ${trail.duration_minutes % 60}m`}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedTrails.map((trail) => (
                <TrailCard
                  key={trail.id}
                  id={trail.trail_id}
                  name={`Trail ${trail.trail_id}`} // This should be replaced with actual trail data
                  image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
                  difficulty="moderate"
                  rating={4.5}
                  distance={2.5}
                  time="2h 30m"
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
