
import { Star, Timer, ArrowUpRight, Bookmark, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "./ui/use-toast";

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
  alert
}: TrailCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState("");
  const [difficultyRating, setDifficultyRating] = useState<"easy" | "moderate" | "hard">("moderate");
  const [durationMinutes, setDurationMinutes] = useState<number>(120);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user) return;
      
      const trailUUID = id.includes('-') ? id : 
        '00000000-0000-0000-0000-' + id.padStart(12, '0');

      const { data } = await supabase
        .from('saved_trails')
        .select('id')
        .eq('trail_id', trailUUID)
        .eq('user_id', user.id)
        .maybeSingle();

      setIsSaved(!!data);
    };

    checkIfSaved();
  }, [id, user]);

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

  const handleSaveTrail = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save trails",
        variant: "destructive",
      });
      return;
    }

    try {
      const trailUUID = id.includes('-') ? id : 
        '00000000-0000-0000-0000-' + id.padStart(12, '0');

      if (isSaved) {
        // Delete the saved trail
        const { error } = await supabase
          .from('saved_trails')
          .delete()
          .eq('trail_id', trailUUID)
          .eq('user_id', user.id);

        if (error) throw error;
        
        setIsSaved(false);
        toast({
          title: "Trail unsaved",
          description: "Trail has been removed from your saved trails",
        });
      } else {
        // Check if trail is already saved
        const { data: existingData } = await supabase
          .from('saved_trails')
          .select('id')
          .eq('trail_id', trailUUID)
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingData) {
          toast({
            title: "Already saved",
            description: "This trail is already in your saved trails",
          });
          setIsSaved(true);
          return;
        }

        // Save the trail with all details
        const { error } = await supabase
          .from('saved_trails')
          .insert([
            { 
              trail_id: trailUUID, 
              user_id: user.id,
              trail_name: name,
              trail_image: image,
              trail_difficulty: difficulty,
              trail_rating: rating,
              trail_distance: distance,
              trail_time: time
            }
          ]);

        if (error) throw error;
        
        setIsSaved(true);
        toast({
          title: "Trail saved",
          description: "Trail has been added to your saved trails",
        });
      }
    } catch (error) {
      console.error('Error saving trail:', error);
      toast({
        title: "Error",
        description: "There was an error saving the trail",
        variant: "destructive",
      });
    }
  };

  const handleCompleteTrail = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to mark trails as completed",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert the trail_id to a proper UUID format if it's not already
      const trailUUID = id.includes('-') ? id : 
        '00000000-0000-0000-0000-' + id.padStart(12, '0');

      await supabase
        .from('trail_completions')
        .insert([
          {
            trail_id: trailUUID,
            user_id: user.id,
            rating: reviewRating,
            review_text: reviewText,
            difficulty_rating: difficultyRating,
            duration_minutes: durationMinutes
          }
        ]);
      setIsCompleted(true);
      setIsCompleteDialogOpen(false);
      toast({
        title: "Trail completed!",
        description: "Your completion and review have been saved",
      });
    } catch (error) {
      console.error('Error completing trail:', error);
      toast({
        title: "Error",
        description: "There was an error saving your completion",
        variant: "destructive",
      });
    }
  };

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
        <div className="mb-2 flex items-start justify-between">
          <Link to={`/trail/${id}`}>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          </Link>
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

        <div className="mt-4 flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              handleSaveTrail();
            }}
          >
            <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Saved" : "Save"}
          </Button>

          <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={isCompleted ? "bg-green-50 text-green-600" : ""}
              >
                <CheckCircle className={`h-4 w-4 mr-2 ${isCompleted ? "fill-current" : ""}`} />
                {isCompleted ? "Completed" : "Mark as Complete"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Complete Trail: {name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <Select value={String(reviewRating)} onValueChange={(v) => setReviewRating(Number(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <SelectItem key={rating} value={String(rating)}>
                          {rating} {rating === 1 ? "star" : "stars"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Experience</label>
                  <Textarea
                    placeholder="Share your experience on this trail..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty Rating</label>
                  <Select value={difficultyRating} onValueChange={(v) => setDifficultyRating(v as "easy" | "moderate" | "hard")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Select value={String(durationMinutes)} onValueChange={(v) => setDurationMinutes(Number(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="180">3 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="300">5 hours</SelectItem>
                      <SelectItem value="360">6+ hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleCompleteTrail} className="w-full">
                  Save Completion
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default TrailCard;
