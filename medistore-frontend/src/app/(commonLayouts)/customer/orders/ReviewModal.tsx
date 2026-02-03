"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
// Only import the Server Action
import { handleCreateReview } from "@/app/actions/review.actions";

interface ReviewModalProps {
  orderItems: any[];
}

export function ReviewModal({ orderItems }: ReviewModalProps) {


  // Modal state
  const [open, setOpen] = useState(false);

  // Form state
  // Try multiple possible locations for the medicine ID
  const [selectedMedId, setSelectedMedId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync selectedMedId with orderItems when modal opens or orderItems change
  useEffect(() => {
    if (open && orderItems.length > 0 && !selectedMedId) {
      const initialMedId = orderItems[0]?.medicineId || orderItems[0]?.medicine?.id || "";
      setSelectedMedId(initialMedId);
    }
  }, [open, orderItems, selectedMedId]);

  const handleSubmit = async () => {


    // Basic Validation
    if (!selectedMedId) {

      return toast.error("Please select a product to review.");
    }
    if (!comment.trim()) {

      return toast.error("Please write a short comment about your experience.");
    }

    setIsSubmitting(true);


    try {
      // Trigger the Server Action

      const res = await handleCreateReview(selectedMedId, {
        rating,
        comment: comment.trim(),
      });



      if (res.success) {
        toast.success("Review posted successfully!");
        setComment(""); // Reset form
        setRating(5);
        setOpen(false); // Close modal
      } else {

        toast.error(res.message || "Failed to post review. Please try again.");
      }
    } catch (error) {

      toast.error("A network error occurred.");
    } finally {
      setIsSubmitting(false);

    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs border-amber-500 text-amber-600 hover:bg-amber-50"
        >
          <Star className="mr-1 h-3 w-3 fill-current" /> Review
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate Your Medicine</DialogTitle>
          <DialogDescription>
            Help others by sharing your experience with this medicine.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Product Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Product</label>
            <select
              className="w-full rounded-md border p-2 text-sm bg-background text-foreground"
              value={selectedMedId}
              onChange={(e) => {
                setSelectedMedId(e.target.value);
              }}
            >
              {!selectedMedId && (
                <option value="">Select a product...</option>
              )}
              {orderItems.map((item: any, index: number) => {
                // Try to get medicineId from multiple possible locations
                const medId = item.medicineId || item.medicine?.id || `unknown-${index}`;
                return (
                  <option key={`${medId}-${index}`} value={medId}>
                    {item.medicine?.name || "Unknown Medicine"}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Star Rating Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer transition-colors ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          {/* Comment Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Feedback</label>
            <Textarea
              placeholder="How was your experience with this medicine?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
            type="button"
          >
            {isSubmitting ? "Posting Review..." : "Post Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
