import { useState } from "react";
import { PlusCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import SocialPost from "@/components/SocialPost";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { pipeline } from "@huggingface/transformers";
import { SpeciesReportDialog } from "@/components/SpeciesReportDialog";
import { EcoFactsSection } from "@/components/EcoFactsSection";
import { ConservationEventsSection } from "@/components/ConservationEventsSection";

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSpeciesReport(prev => ({ ...prev, image: file }));
      identifySpecies(file);
    }
  };

  const identifySpecies = async (file: File) => {
    setIsIdentifying(true);
    try {
      // Convert File to base64 string
      const base64String = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.readAsDataURL(file);
      });

      // Initialize the image classification pipeline
      const classifier = await pipeline(
        "image-classification",
        "onnx-community/mobilenetv4_conv_small.e2400_r224_in1k",
        { device: "webgpu" }
      );

      // Classify the image using base64 string
      const results = await classifier(base64String);
      
      if (Array.isArray(results) && results.length > 0) {
        const topResult = results[0];
        if ('label' in topResult && 'score' in topResult) {
          // Get conservation status from mock IUCN data
          const conservationStatus = iucnData[topResult.label] || {
            status: "Unknown",
            description: "Conservation status not available",
            color: "bg-gray-100"
          };

          setSpeciesReport(prev => ({
            ...prev,
            identifiedSpecies: topResult.label,
            confidence: topResult.score,
            conservationStatus
          }));

          toast({
            title: "Species Identified",
            description: `We think this might be a ${topResult.label} (${(topResult.score * 100).toFixed(1)}% confidence)`,
          });
        }
      }
    } catch (error) {
      console.error("Error identifying species:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to identify species. Please try again.",
      });
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the report to your backend
    toast({
      title: "Report Submitted",
      description: "Thank you for contributing to our wildlife database!",
    });
    setReportDialogOpen(false);
    setSpeciesReport({
      image: null,
      location: "",
      notes: ""
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Trail Community</h1>
          <p className="text-gray-600 mb-6">
            Share your hiking adventures and help document local wildlife
          </p>

          <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mb-8">
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
