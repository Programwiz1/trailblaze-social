
import { Link } from "react-router-dom";
import { TrailCardActions } from "./trail/TrailCardActions";
import { TrailInfo } from "./trail/TrailInfo";

interface TrailCardProps {
  id: string;
  name: string;
  image: string;
  difficulty: "easy" | "moderate" | "hard";
  rating: number;
  distance: number;
  time: string;
  status?: "open" | "warning" | "closed";
  alert?: string | null;
  completed?: boolean;
}

const TrailCard = ({ 
  id, 
  name, 
  image, 
  difficulty, 
  rating, 
  distance, 
  time,
  status = "open",
  alert,
  completed = false
}: TrailCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl">
      <Link to={`/trail/${id}`} className="block">
        <div className="aspect-w-16 aspect-h-9 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/trail/${id}`}>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        </Link>
        
        <TrailInfo
          rating={rating}
          distance={distance}
          time={time}
          difficulty={difficulty}
          status={status}
          alert={alert}
        />

        <div className="mt-4">
          <TrailCardActions
            id={id}
            name={name}
            image={image}
            difficulty={difficulty}
            rating={rating}
            distance={distance}
            time={time}
            completed={completed}
          />
        </div>
      </div>
    </div>
  );
};

export default TrailCard;
