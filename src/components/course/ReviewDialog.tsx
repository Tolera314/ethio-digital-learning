
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { reviewCourse } from "@/utils/courseActions";
import { useAuth } from "@/context/AuthContext";

interface ReviewDialogProps {
  courseId: number;
  courseTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewDialog({ courseId, courseTitle, open, onOpenChange }: ReviewDialogProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  
  const handleSubmit = () => {
    // Submit the review
    const success = reviewCourse(courseId, rating, comment, user?.id);
    if (success) {
      // Reset form
      setRating(5);
      setComment('');
      // Close dialog
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Rate & Review</DialogTitle>
          <DialogDescription>
            Share your experience about "{courseTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Your Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`${
                      rating >= star
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-400"
                    }`}
                    size={24}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Your Review</label>
            <Textarea
              placeholder="Share your experience with this course..."
              className="bg-black/20 border-white/10"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-600"
            onClick={handleSubmit}
          >
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewDialog;
