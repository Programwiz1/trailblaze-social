import { useState } from "react";
import { Camera, Loader2, PlusCircle, TreePine, Bird, Calendar, Leaf, ExternalLink, MapPin } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

const ecoFacts = [
  {
    title: "Climate Impact on Local Birds",
    description: "Rising temperatures are causing earlier spring migrations, affecting breeding patterns of local songbirds.",
    icon: Bird
  },
  {
    title: "Forest Ecosystem Changes",
    description: "Warmer winters are allowing pine beetles to survive longer, threatening our conifer forests.",
    icon: TreePine
  },
  {
    title: "Native Plant Adaptations",
    description: "Local wildflowers are blooming an average of 7 days earlier than they did 50 years ago.",
    icon: Leaf
  }
];

const conservationEvents = [
  {
    title: "Wildlife Photography Workshop",
    date: "Next Saturday, 10 AM",
    location: "Visitor Center",
    description: "Learn how to photograph wildlife responsibly with professional nature photographer Sarah Johnson."
  },
  {
    title: "Native Plant Restoration",
    date: "Sunday, May 15, 9 AM",
    location: "East Ridge Trail",
    description: "Help us restore native plant species along the trail. Tools and guidance provided."
  },
  {
    title: "Bird Migration Webinar",
    date: "Thursday, 7 PM",
    location: "Online",
    description: "Join our expert panel discussing the impact of climate change on bird migration patterns."
  }
];

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
                          <div className={`mt-2 p-3 rounded-lg ${speciesReport.conservationStatus?.color || 'bg-gray-100'}`}>
                            <div className="text-sm font-medium">
                              Identified as: {speciesReport.identifiedSpecies}
                              <br />
                              Confidence: {(speciesReport.confidence! * 100).toFixed(1)}%
                            </div>
                            {speciesReport.conservationStatus && (
                              <div className="mt-2 text-sm">
                                <div className="font-medium">Conservation Status: {speciesReport.conservationStatus.status}</div>
                                <div className="text-gray-600">{speciesReport.conservationStatus.description}</div>
                              </div>
                            )}
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
          
          {/* Eco Facts Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Today's Eco Facts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ecoFacts.map((fact, index) => (
                <Card key={index} className="bg-green-50">
                  <CardHeader className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <fact.icon className="w-5 h-5 text-green-600" />
                      <CardTitle className="text-lg text-green-800">{fact.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-700">{fact.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Conservation Events Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Conservation Events</h2>
            <div className="space-y-4">
              {conservationEvents.map((event, index) => (
                <Card key={index} className="text-left">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center space-x-2 mt-1">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>{event.location}</span>
                          </div>
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Register
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{event.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
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
