
import { useState } from "react";
import { Search, Filter, Car, Bus, Trash, Footprints, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import TrailCard from "@/components/TrailCard";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for initial implementation
const mockTrails = [
  {
    id: "1",
    name: "Emerald Lake Trail",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    difficulty: "moderate" as const,
    rating: 4.8,
    distance: 3.2,
    time: "2h 30m",
  },
  {
    id: "2",
    name: "Crystal Mountain Peak",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5",
    difficulty: "hard" as const,
    rating: 4.9,
    distance: 5.6,
    time: "4h 15m",
  },
  {
    id: "3",
    name: "Riverside Nature Walk",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b",
    difficulty: "easy" as const,
    rating: 4.5,
    distance: 1.8,
    time: "1h 15m",
  },
];

const leaveNoTraceTips = [
  {
    icon: Footprints,
    title: "Stay on Trail",
    description: "Protect fragile ecosystems by sticking to marked paths"
  },
  {
    icon: Trash,
    title: "Pack It Out",
    description: "Carry all trash with you, including biodegradable waste"
  },
  {
    icon: AlertTriangle,
    title: "Respect Wildlife",
    description: "Observe from a distance and never feed wild animals"
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [distance, setDistance] = useState<string>("");
  const [transportMode, setTransportMode] = useState<string>("");

  const calculateCarbonFootprint = (distance: string, mode: string) => {
    const dist = parseFloat(distance);
    if (isNaN(dist)) return 0;
    
    // Rough estimates in kg CO2 per mile
    const factors = {
      car: 0.404,
      carpool: 0.202,
      bus: 0.14,
      train: 0.14
    };
    
    return (dist * (factors[mode as keyof typeof factors] || 0)).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Next Adventure
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the most beautiful hiking trails and share your experiences with
            fellow adventurers.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Travel Impact Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance to Trail (miles)
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter distance"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transportation Mode
                </label>
                <Select onValueChange={setTransportMode} value={transportMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">
                      <span className="flex items-center">
                        <Car className="w-4 h-4 mr-2" />
                        Drive Alone
                      </span>
                    </SelectItem>
                    <SelectItem value="carpool">
                      <span className="flex items-center">
                        <Car className="w-4 h-4 mr-2" />
                        Carpool
                      </span>
                    </SelectItem>
                    <SelectItem value="bus">
                      <span className="flex items-center">
                        <Bus className="w-4 h-4 mr-2" />
                        Public Transit
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <div className="w-full">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Carbon Footprint
                  </div>
                  <div className="bg-gray-100 p-2 rounded-md">
                    {distance && transportMode ? (
                      <span className="text-lg font-semibold">
                        {calculateCarbonFootprint(distance, transportMode)} kg CO2
                      </span>
                    ) : (
                      <span className="text-gray-500">
                        Enter details to calculate
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {leaveNoTraceTips.map((tip) => (
            <Alert key={tip.title}>
              <tip.icon className="h-4 w-4" />
              <AlertTitle>{tip.title}</AlertTitle>
              <AlertDescription>
                {tip.description}
              </AlertDescription>
            </Alert>
          ))}
        </div>

        <div className="mb-8">
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search trails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nature-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Filter className="text-gray-400 w-5 h-5 hover:text-nature-500 transition-colors" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTrails.map((trail) => (
            <TrailCard key={trail.id} {...trail} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
