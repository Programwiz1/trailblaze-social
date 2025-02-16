
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface TrailCompletionDialogProps {
  name: string;
  reviewRating: number;
  setReviewRating: (rating: number) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  difficultyRating: "easy" | "moderate" | "hard";
  setDifficultyRating: (difficulty: "easy" | "moderate" | "hard") => void;
  durationMinutes: number;
  setDurationMinutes: (duration: number) => void;
  onComplete: () => void;
}

export const TrailCompletionDialog = ({
  name,
  reviewRating,
  setReviewRating,
  reviewText,
  setReviewText,
  difficultyRating,
  setDifficultyRating,
  durationMinutes,
  setDurationMinutes,
  onComplete,
}: TrailCompletionDialogProps) => {
  return (
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

        <Button onClick={onComplete} className="w-full">
          Save Completion
        </Button>
      </div>
    </DialogContent>
  );
};
