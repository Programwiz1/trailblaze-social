
import { useState } from "react";
import { Camera, Loader2, PlusCircle, TreePine, Bird } from "lucide-react";
import Navbar from "@/components/Navbar";
import SocialPost from "@/components/SocialPost";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { pipeline } from "@huggingface/transformers";

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
    type: "trail"
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
    type: "species",
    speciesData: {
      name: "Red-tailed Hawk",
      scientificName: "Buteo jamaicensis",
      location: "Crystal Mountain Peak",
      time: "7:30 AM",
      confidence: 0.92
    }
  }
];

interface SpeciesReport {
  image: File | null;
  location: string;
  notes: string;
  identifiedSpecies?: string;
  confidence?: number;
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
      // Create an image element from the file
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await img.decode(); // Wait for the image to load

      // Initialize the image classification pipeline
      const classifier = await pipeline(
        "image-classification",
        "onnx-community/mobilenetv4_conv_small.e2400_r224_in1k",
        { device: "webgpu" }
      );

      // Classify the image
      const results = await classifier(img);
      
      if (results && results.length > 0) {
        const topResult = results[0];
        setSpeciesReport(prev => ({
          ...prev,
          identifiedSpecies: topResult.label,
          confidence: topResult.score
        }));

        toast({
          title: "Species Identified",
          description: `We think this might be a ${topResult.label} (${(topResult.score * 100).toFixed(1)}% confidence)`,
        });
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
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Trail Community</h1>
          <p className="text-gray-600 mb-6">
            Share your hiking adventures and help document local wildlife
          </p>
          
          <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mb-4">
                <PlusCircle className="w-4 h-4 mr-2" />
                Report Species Sighting
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Wildlife Sighting</DialogTitle>
                <DialogDescription>
                  Help us track and protect local wildlife by reporting your sightings.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div className="space-y-2">
                  <Label>Photo</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {speciesReport.image ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(speciesReport.image)}
                          alt="Species preview"
                          className="max-h-48 mx-auto rounded"
                        />
                        {speciesReport.identifiedSpecies && (
                          <div className="mt-2 text-sm text-gray-600">
                            Identified as: {speciesReport.identifiedSpecies}
                            <br />
                            Confidence: {(speciesReport.confidence! * 100).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <Camera className="w-8 h-8 mx-auto mb-2" />
                        <p>Upload a photo for AI identification</p>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="e.g., North Ridge Trail, mile marker 3"
                    value={speciesReport.location}
                    onChange={e => setSpeciesReport(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Add any additional observations..."
                    value={speciesReport.notes}
                    onChange={e => setSpeciesReport(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isIdentifying}>
                  {isIdentifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Identifying Species...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
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
