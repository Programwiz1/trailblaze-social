import { useState } from "react";
import { PlusCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import SocialPost from "@/components/SocialPost";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SpeciesReportDialog } from "@/components/SpeciesReportDialog";
import { EcoFactsSection } from "@/components/EcoFactsSection";
import { ConservationEventsSection } from "@/components/ConservationEventsSection";

interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

interface SocialPostProps {
  id: string;
  user: string;
  userAvatar?: string;
  image: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  type?: "trail" | "species";
  speciesData?: SpeciesData;
}

interface SpeciesData {
  name: string;
  scientificName: string;
  location: string;
  time: string;
  confidence: number;
}

const mockPosts = [
  {
    id: "1",
    user: "John Hikes",
    userAvatar: "https://images.unsplash.com/photo-1503023345310-154ca6123c14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    image: "https://images.unsplash.com/photo-15188398e99c9-e69e52ddca27?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    caption: "Amazing hike at Emerald Lake! The views were breathtaking.",
    likes: 32,
    comments: [
      { id: "1", user: "Jane Doe", content: "Looks beautiful!", timestamp: "2 hours ago" },
      { id: "2", user: "Peter Pan", content: "I need to visit this place.", timestamp: "1 hour ago" }
    ],
    timestamp: "3 hours ago"
  },
  {
    id: "2",
    user: "Wildlife Watcher",
    userAvatar: "https://images.unsplash.com/photo-1534528741702-a0cfa97013ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aHVtYW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    image: "https://images.unsplash.com/photo-1543326872-193f29a3924f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8d2lsZGxpZmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    caption: "Spotted a rare Blue Jay on the trail today! #wildlife #birdwatching",
    likes: 57,
    comments: [
      { id: "3", user: "EcoFriend", content: "Great sighting!", timestamp: "4 hours ago" }
    ],
    timestamp: "5 hours ago",
    type: "species",
    speciesData: {
      name: "Blue Jay",
      scientificName: "Cyanocitta cristata",
      location: "North Ridge Trail",
      time: "11:30 AM",
      confidence: 0.85
    }
  }
];

const Social = () => {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [speciesReport, setSpeciesReport] = useState({
    image: null,
    location: "",
    notes: "",
    identifiedSpecies: undefined,
    confidence: undefined,
    conservationStatus: undefined,
  });
  const [isIdentifying, setIsIdentifying] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSpeciesReport(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIdentifying(true);

    // Simulate species identification (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSpeciesReport(prev => ({
      ...prev,
      identifiedSpecies: "Monarch Butterfly",
      confidence: 0.95,
      conservationStatus: {
        status: "Near Threatened",
        description: "Monarch populations have declined due to habitat loss.",
        color: "bg-yellow-100"
      }
    }));

    setIsIdentifying(false);
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

          <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mb-8 bg-nature-600 hover:bg-nature-700 text-white">
                <PlusCircle className="w-4 h-4 mr-2" />
                Report Species Sighting
              </Button>
            </DialogTrigger>
            <SpeciesReportDialog
              speciesReport={speciesReport}
              isIdentifying={isIdentifying}
              onImageUpload={handleImageUpload}
              onSubmit={handleSubmitReport}
              onLocationChange={(value) => setSpeciesReport(prev => ({ ...prev, location: value }))}
              onNotesChange={(value) => setSpeciesReport(prev => ({ ...prev, notes: value }))}
            />
          </Dialog>
          
          <EcoFactsSection />
          <ConservationEventsSection />
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
