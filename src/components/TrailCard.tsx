
import { Star, Timer, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

interface TrailCardProps {
  id: string;
  name: string;
  image: string;
  difficulty: "easy" | "moderate" | "hard";
  rating: number;
  distance: number;
  time: string;
}

const TrailCard = ({ id, name, image, difficulty, rating, distance, time }: TrailCardProps) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Link
      to={`/trail/${id}`}
      className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl"
    >
      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(
              difficulty
            )}`}
          >
            {difficulty}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
          
          <div>
            <span>{distance.toFixed(1)} mi</span>
          </div>
          
          <div className="flex items-center">
            <Timer className="mr-1 h-4 w-4" />
            <span>{time}</span>
          </div>
        </div>
      </div>
      
      <div className="absolute right-4 top-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="rounded-full bg-white p-2 shadow-lg">
          <ArrowUpRight className="h-4 w-4 text-nature-600" />
        </div>
      </div>
    </Link>
  );
};

export default TrailCard;
