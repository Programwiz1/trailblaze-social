import { useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import Navbar from "@/components/Navbar";
import TrailCard from "@/components/TrailCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SearchTrails from "@/components/trails/SearchTrails";
import TravelImpactCalculator from "@/components/trails/TravelImpactCalculator";
import LeaveNoTraceTips from "@/components/trails/LeaveNoTraceTips";
import { transformServerData } from "@/utils/trailUtils";

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

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [distance, setDistance] = useState<string>("");
  const [transportMode, setTransportMode] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [serverResponse, setServerResponse] = useState<Array<[string, number, number, number]> | null>(null);
  const [googleMapsKey, setGoogleMapsKey] = useState<string>("");

  console.log('Current serverResponse state:', serverResponse); // Debug log

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleMapsKey,
  });

  useEffect(() => {
    const fetchApiKey = async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_name', 'GOOGLE_MAPS_API_KEY')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching Google Maps API key:', error);
        toast.error("Error loading Google Maps API key");
        return;
      }
      
      if (data) {
        console.log('Successfully fetched Google Maps API key'); // Debug log
        setGoogleMapsKey(data.key_value);
      } else {
        console.error('Google Maps API key not found in database');
        toast.error("Unable to load Google Maps");
      }
    };

    fetchApiKey();
  }, []);

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
    if (isNaN(dist)) return "0";
    
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

    setIsSearching(true);
    setServerResponse(null);

    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      setCoordinates({ lat: latitude, lng: longitude });

      console.log('Sending request with:', { latitude, longitude, description: searchQuery });

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

      const rawData = await response.json();
      console.log("Raw server response:", rawData);

      // Handle the case where the response is in the format { places: Array }
      const placesData = Array.isArray(rawData) ? rawData : rawData.places;
      
      if (!Array.isArray(placesData)) {
        throw new Error('Invalid response format from server');
      }

      // Transform the data into the expected format with explicit type
      const transformedData: [string, number, number, number][] = placesData.map(place => {
        if (Array.isArray(place) && place.length === 4) {
          // Ensure each element has the correct type
          const [name, weather, popularity, dist] = place;
          return [
            String(name),
            Number(weather),
            Number(popularity),
            Number(dist)
          ] as [string, number, number, number];
        }
        // If it's an object, transform it to tuple format
        return [
          String(place.name || ''),
          Number(place.weather_rank || 12.6),
          Number(place.popularity || 0.8),
          Number(place.distance || 0)
        ] as [string, number, number, number];
      });

      setServerResponse(transformedData);
      toast.success("Found the best locations for you!");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong while processing your request");
      setServerResponse(null); // Reset on error
    } finally {
      setIsSearching(false);
    }
  };

  const displayedTrails = serverResponse ? transformServerData(serverResponse) : mockTrails;
  console.log('Final displayed trails:', displayedTrails);

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

        <SearchTrails
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          isSearching={isSearching}
          isLoaded={isLoaded}
        />

        <TravelImpactCalculator
          distance={distance}
          setDistance={setDistance}
          transportMode={transportMode}
          setTransportMode={setTransportMode}
          calculateCarbonFootprint={calculateCarbonFootprint}
        />

        <LeaveNoTraceTips />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTrails && displayedTrails.length > 0 ? (
            displayedTrails.map((trail) => (
              <TrailCard key={trail.id} {...trail} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No trails found. Try searching for trails near you!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
