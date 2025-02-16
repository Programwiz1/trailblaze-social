
import { Star, Timer } from "lucide-react";

interface TrailInfoProps {
  rating: number;
  distance: number;
  time: string;
  difficulty: "easy" | "moderate" | "hard";
  status?: "open" | "warning" | "closed";
  alert?: string | null;
}

export const TrailInfo = ({ rating, distance, time, difficulty, status = "open", alert }: TrailInfoProps) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{}</h3>
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

      {alert && (
        <div className={`mt-3 p-2 rounded-md text-sm ${getStatusColor(status)}`}>
          {alert}
        </div>
      )}
    </>
  );
};
