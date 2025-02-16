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
import { useToast } from "@/components/ui/use-toast";
import { pipeline } from "@huggingface/transformers";

// Mock IUCN data for demonstration
const iucnData: Record<string, { status: string; description: string; color: string }> = {
  "Red-tailed Hawk": {
    status: "Least Concern",
    description: "Population stable and widespread",
    color: "bg-green-100"
  },
  "Golden Eagle": {
    status: "Near Threatened",
    description: "Population declining due to habitat loss",
    color: "bg-yellow-100"
  },
  "California Condor": {
    status: "Critically Endangered",
    description: "Extremely low population, intensive conservation efforts ongoing",
    color: "bg-red-100"
  }
};

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
    timestamp: "3h ago",
    type: "trail" as const
  },
  {
    id: "2",
    user: "Mike Adventure",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5",
    caption: "Spotted this beautiful Red-tailed Hawk on Crystal Mountain Peak! 🦅 #wildlife #birdwatching",
    likes: 89,
    comments: [
      {
        id: "c3",
        user: "Emma",
        content: "What a magnificent bird!",
        timestamp: "30m ago"
      }
    ],
    timestamp: "5h ago",
    type: "species" as const,
    speciesData: {
      name: "Red-tailed Hawk",
      scientificName: "Buteo jamaicensis",
      location: "Crystal Mountain Peak",
      time: "7:30 AM",
      confidence: 0.92,
      conservationStatus: {
        status: "Least Concern",
        description: "Population stable and widespread",
        color: "bg-green-100"
      }
    }
  }
];

interface SpeciesReport {
  image: File | null;
  location: string;
  notes: string;
  identifiedSpecies?: string;
  confidence?: number;
  conservationStatus?: {
    status: string;
    description: string;
    color: string;
  };
}

const Social = () => {
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [speciesReport, setSpeciesReport] = useState<SpeciesReport>({
    image: null,
    location: "",
    notes: ""
  });
  const { toast } = useToast();

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
