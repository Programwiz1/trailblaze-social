
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrailCard from "@/components/TrailCard";
import Navbar from "@/components/Navbar";

interface CompletedTrail {
  id: string;
  trail_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  difficulty_rating: "easy" | "moderate" | "hard";
  duration_minutes: number;
  completed_at: string;
  trail_details?: SavedTrail;
}

interface SavedTrail {
  id: string;
  trail_id: string;
  user_id: string;
  trail_name: string;
  trail_image: string;
  trail_difficulty: "easy" | "moderate" | "hard";
  trail_rating: number;
  trail_distance: number;
  trail_time: string;
  created_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [completedTrails, setCompletedTrails] = useState<CompletedTrail[]>([]);
  const [savedTrails, setSavedTrails] = useState<SavedTrail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndTrails = async () => {
      if (!user) return;

      try {
        // First fetch saved trails to have the reference data
        const { data: savedData, error: savedError } = await supabase
          .from('saved_trails')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (savedError) throw savedError;
        const savedTrailsData = savedData as SavedTrail[] || [];
        setSavedTrails(savedTrailsData);

        // Then fetch completed trails
        const { data: completedData, error: completedError } = await supabase
          .from('trail_completions')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (completedError) throw completedError;
        
        // Map the completed trails with their saved trail details
        const completedWithDetails = (completedData || []).map(trail => {
          const savedTrail = savedTrailsData.find(st => st.trail_id === trail.trail_id);
          return {
            ...trail,
            trail_details: savedTrail,
          };
        });

        setCompletedTrails(completedWithDetails);
      } catch (error) {
        console.error('Error fetching trails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndTrails();
  }, [user]);

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-nature-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        Loading...
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-nature-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
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
                  name={trail.trail_details?.trail_name || trail.trail_id}
                  image={trail.trail_details?.trail_image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"}
                  difficulty={trail.difficulty_rating}
                  rating={trail.rating}
                  distance={trail.trail_details?.trail_distance || 0}
                  time={trail.trail_details?.trail_time || `${Math.floor(trail.duration_minutes / 60)}h ${trail.duration_minutes % 60}m`}
                  status="open"
                  completed={true}
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
                  name={trail.trail_name}
                  image={trail.trail_image}
                  difficulty={trail.trail_difficulty}
                  rating={trail.trail_rating}
                  distance={trail.trail_distance}
                  time={trail.trail_time}
                  status="open"
                  completed={completedTrails.some(ct => ct.trail_id === trail.trail_id)}
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
