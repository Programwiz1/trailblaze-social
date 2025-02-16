
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import TrailCard from "@/components/TrailCard";

// Mock data for initial implementation
const mockTrails = [
  {
    id: "1",
    name: "Emerald Lake Trail",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    difficulty: "moderate",
    rating: 4.8,
    distance: 3.2,
    time: "2h 30m",
  },
  {
    id: "2",
    name: "Crystal Mountain Peak",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5",
    difficulty: "hard",
    rating: 4.9,
    distance: 5.6,
    time: "4h 15m",
  },
  {
    id: "3",
    name: "Riverside Nature Walk",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b",
    difficulty: "easy",
    rating: 4.5,
    distance: 1.8,
    time: "1h 15m",
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
