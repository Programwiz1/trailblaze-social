import { useState, useEffect } from "react";
import { Search, Filter, Car, Bus, Trash, Footprints, AlertTriangle, Loader2, Sun, CloudRain, Cloud } from "lucide-react";
import { useLoadScript } from "@react-google-maps/api";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const getWeatherIcon = (rank: number) => {
  if (rank >= 8) return "Excellent";
  if (rank >= 6) return "Good";
  if (rank >= 4) return "Fair";
  return "Poor";
};

const getDifficulty = (popularityRank: number): "easy" | "moderate" | "hard" => {
  if (popularityRank >= 8) return "easy";
  if (popularityRank >= 5) return "moderate";
  return "hard";
};

const formatDistance = (distance: number): string => {
  const hours = Math.floor(distance / 3);
  const minutes = Math.round((distance % 3) * 20);
  return `${hours}h ${minutes}m`;
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [distance, setDistance] = useState<string>("");
  const [transportMode, setTransportMode] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [serverResponse, setServerResponse] = useState<Array<[string, number, number, number]> | null>(null);
  const [googleMapsKey, setGoogleMapsKey] = useState<string>("");

  // Fetch Google Maps API key from Supabase
  useEffect(() => {
    const fetchApiKey = async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_name', 'GOOGLE_MAPS_API_KEY')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching Google Maps API key:', error);
        return;
      }
      
      if (data) {
        setGoogleMapsKey(data.key_value);
      } else {
        console.error('Google Maps API key not found in database');
        toast.error("Unable to load Google Maps");
      }
    };

    fetchApiKey();
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleMapsKey,
  });

  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });
  };

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter your preferences first");
      return;
    }

    if (!isLoaded) {
      toast.error("Google Maps is not loaded yet");
      return;
    }

    setIsSearching(true);
    setServerResponse(null);

    try {
      // Get current location
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      setCoordinates({ lat: latitude, lng: longitude });

      // Send data to server
      const response = await fetch('https://bcbf-136-159-213-22.ngrok-free.app/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude,
          longitude,
          description: searchQuery
        })
      });

      if (!response.ok) {
        throw new Error('Server response was not ok');
      }

      const data = await response.json();
      setServerResponse(data);
      toast.success("Found the best locations for you!");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong while processing your request");
    } finally {
      setIsSearching(false);
    }
  };

  const transformServerData = (data: [string, number, number, number][]) => {
    return data.map((location, index) => ({
      id: `server-${index}`,
      name: location[0],
      image: `https://source.unsplash.com/featured/?nature,trail&sig=${index}`,
      difficulty: getDifficulty(location[2]),
      rating: location[2], // Using popularity rank as rating
      distance: location[3],
      time: formatDistance(location[3]),
      status: location[1] >= 6 ? "open" : location[1] >= 4 ? "warning" : "closed",
      alert: location[1] < 6 ? `Weather conditions: ${getWeatherIcon(location[1])}` : null
    }));
  };

  const displayedTrails = serverResponse 
    ? transformServerData(serverResponse)
    : mockTrails;

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
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-nature-500" />
                <Input
                  placeholder="Enter any preferences"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim() || !isLoaded}
                className="bg-nature-600 hover:bg-nature-700"
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Find Trails"
                )}
              </Button>
            </div>

            {isSearching && (
              <div className="mt-4 p-4 bg-nature-50 rounded-lg">
                <div className="flex items-center justify-center gap-4">
                  <Loader2 className="h-6 w-6 animate-spin text-nature-600" />
                  <p className="text-nature-600">Searching for trails near you...</p>
                </div>
              </div>
            )}
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
          {displayedTrails.map((trail) => (
            <TrailCard key={trail.id} {...trail} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
