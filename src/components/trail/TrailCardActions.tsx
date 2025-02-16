
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Bookmark, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

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
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState("");
  const [difficultyRating, setDifficultyRating] = useState<"easy" | "moderate" | "hard">("moderate");
  const [durationMinutes, setDurationMinutes] = useState<number>(120);

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
      const trailUUID = id.includes('-') ? id : 
        '00000000-0000-0000-0000-' + id.padStart(12, '0');

      const { data: existingCompletion } = await supabase
        .from('trail_completions')
        .select('id')
        .eq('trail_id', trailUUID)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingCompletion) {
        toast({
          title: "Already completed",
          description: "You have already completed this trail",
          variant: "destructive",
        });
        setIsCompleteDialogOpen(false);
        return;
      }

      const { error } = await supabase
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

      if (error) throw error;

      setIsCompleteDialogOpen(false);
      toast({
        title: "Trail completed!",
        description: "Your completion and review have been saved",
      });

      window.location.reload();
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
      const trailUUID = id.includes('-') ? id : 
        '00000000-0000-0000-0000-' + id.padStart(12, '0');

      const { error } = await supabase
        .from('trail_completions')
        .delete()
        .eq('trail_id', trailUUID)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Trail uncompleted",
        description: "Trail has been marked as incomplete",
      });

      window.location.reload();
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
        onClick={(e) => {
          e.preventDefault();
          handleSaveTrail();
        }}
      >
        <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
        {isSaved ? "Saved" : "Save"}
      </Button>

      {completed ? (
        <Button
          variant="outline"
          size="sm"
          className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
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
              className={isCompleteDialogOpen ? "bg-green-600 text-white hover:bg-green-700 border-green-600" : ""}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Complete
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
      )}
    </div>
  );
};
