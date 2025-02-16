
import { useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import Navbar from "@/components/Navbar";
import TrailCard from "@/components/TrailCard";
import SearchSection from "@/components/home/SearchSection";
import CarbonCalculator from "@/components/home/CarbonCalculator";
import LeaveNoTraceTips from "@/components/home/LeaveNoTraceTips";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { transformServerData } from "@/utils/trailUtils";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [distance, setDistance] = useState<string>("");
  const [transportMode, setTransportMode] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [trails, setTrails] = useState<any[]>([]);
  const [googleMapsKey, setGoogleMapsKey] = useState<string>("");

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
    setTrails([]);

    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      setCoordinates({ lat: latitude, lng: longitude });

      const response = await fetch('https://271f-136-159-213-22.ngrok-free.app/locations', {
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
      console.log('Server response:', data);
      
      const transformedTrails = transformServerData(data);
      console.log('Transformed trails:', transformedTrails);
      setTrails(transformedTrails);
      
      toast.success("Found trails near you!");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong while processing your request");
    } finally {
      setIsSearching(false);
    }
  };

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

        <SearchSection
          searchQuery={searchQuery}
          isSearching={isSearching}
          isLoaded={isLoaded}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
        />

        <CarbonCalculator
          distance={distance}
          transportMode={transportMode}
          onDistanceChange={setDistance}
          onTransportModeChange={setTransportMode}
        />

        <LeaveNoTraceTips />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trails.map((trail) => (
            <TrailCard key={trail.id} {...trail} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
