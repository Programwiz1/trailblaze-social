
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Bookmark, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { TrailCompletionDialog } from "./TrailCompletionDialog";
import { 
  checkTrailStatus, 
  saveTrail, 
  unsaveTrail, 
  completeTrail, 
  uncompleteTrail 
} from "./trailUtils";

interface TrailCardActionsProps {
  id: string;
  name: string;
  image: string;
  difficulty: "easy" | "moderate" | "hard";
  rating: number;
  distance: number;
  time: string;
  completed?: boolean;
}

export const TrailCardActions = ({ 
  id, 
  name, 
  image, 
  difficulty, 
  rating, 
  distance, 
  time,
  completed = false 
}: TrailCardActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState("");
  const [difficultyRating, setDifficultyRating] = useState<"easy" | "moderate" | "hard">("moderate");
  const [durationMinutes, setDurationMinutes] = useState<number>(120);

  useEffect(() => {
    const fetchTrailStatus = async () => {
      if (!user) return;
      const status = await checkTrailStatus(id, user.id);
      setIsSaved(status.isSaved);
      setIsCompleted(status.isCompleted);
    };

    fetchTrailStatus();
  }, [user, id]);

  const handleSaveTrail = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save trails",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isSaved) {
        await unsaveTrail(id, user.id);
        setIsSaved(false);
        toast({
          title: "Trail unsaved",
          description: "Trail has been removed from your saved trails",
        });
      } else {
        await saveTrail(id, user.id, { name, image, difficulty, rating, distance, time });
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
      await completeTrail(id, user.id, {
        rating: reviewRating,
        reviewText,
        difficultyRating,
        durationMinutes
      });
      
      setIsCompleteDialogOpen(false);
      setIsCompleted(true);
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

  const handleRemoveCompletion = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await uncompleteTrail(id, user.id);
      setIsCompleted(false);
      toast({
        title: "Trail uncompleted",
        description: "Trail has been marked as incomplete",
      });
    } catch (error) {
      console.error('Error removing trail completion:', error);
      toast({
        title: "Error",
        description: "There was an error updating the trail status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSaveTrail}
      >
        <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
        {isSaved ? "Saved" : "Save"}
      </Button>

      {isCompleted ? (
        <Button
          variant="outline"
          size="sm"
          className="bg-green-600 text-white hover:bg-green-700 border-green-600"
          onClick={handleRemoveCompletion}
        >
          <CheckCircle className="h-4 w-4 mr-2 fill-current" />
          Mark as Incomplete
        </Button>
      ) : (
        <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Complete
            </Button>
          </DialogTrigger>
          <TrailCompletionDialog
            name={name}
            reviewRating={reviewRating}
            setReviewRating={setReviewRating}
            reviewText={reviewText}
            setReviewText={setReviewText}
            difficultyRating={difficultyRating}
            setDifficultyRating={setDifficultyRating}
            durationMinutes={durationMinutes}
            setDurationMinutes={setDurationMinutes}
            onComplete={handleCompleteTrail}
          />
        </Dialog>
      )}
    </div>
  );
};
