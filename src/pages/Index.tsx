import { useState } from "react";
import { Search, Filter, Car, Bus, Trash, Footprints, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import TrailCard from "@/components/TrailCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    status: "warning" as const,
    alert: "Nesting season - partial closure"
  },
  {
    id: "2",
    name: "Crystal Mountain Peak",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5",
    difficulty: "hard" as const,
    rating: 4.9,
    distance: 5.6,
    time: "4h 15m",
    status: "closed" as const,
    alert: "Trail closed due to wildfire risk"
  },
  {
    id: "3",
    name: "Riverside Nature Walk",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b",
    difficulty: "easy" as const,
    rating: 4.5,
    distance: 1.8,
    time: "1h 15m",
    status: "open" as const,
    alert: null
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

  const filteredTrails = mockTrails.filter(trail => {
    const searchTerms = searchQuery.toLowerCase();
    return (
      trail.name.toLowerCase().includes(searchTerms) ||
      trail.difficulty.toLowerCase().includes(searchTerms) ||
      trail.time.toLowerCase().includes(searchTerms)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-nature-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-nature-800 mb-4">
            Discover Your Next Adventure
          </h1>
          <p className="text-lg text-nature-600 max-w-2xl mx-auto">
            Explore the most beautiful hiking trails and share your experiences with
            fellow adventurers.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-nature-800">Find Your Perfect Trail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-nature-500" />
              <Input
                placeholder="Search trails by name, difficulty, or duration..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-gradient-to-r from-nature-50 to-white border-nature-200">
          <CardHeader>
            <CardTitle className="text-nature-800">Travel Impact Calculator</CardTitle>
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
            <Card key={tip.title} className="bg-nature-50 border-nature-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-nature-100 rounded-lg">
                    <tip.icon className="w-6 h-6 text-nature-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-nature-800">{tip.title}</h3>
                    <p className="text-nature-600 text-sm">{tip.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrails.map((trail) => (
            <TrailCard key={trail.id} {...trail} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
