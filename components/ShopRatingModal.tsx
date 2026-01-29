"use client";

import React, { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useUser } from "@/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";

interface ShopRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId: string;
  shopName: string;
  onRatingUpdate?: (newRating: number) => void;
}

const ShopRatingModal = ({
  isOpen,
  onClose,
  shopId,
  shopName,
  onRatingUpdate,
}: ShopRatingModalProps) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to rate this shop");
      return;
    }

    if (selectedRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(`/shops/${shopId}/rate`, { 
        rating: selectedRating,
        comment: comment.trim()
      });

      if (response.data.success) {
        toast.success("Thank you for your review!");
        
        // Invalidate queries to update the UI globally
        queryClient.invalidateQueries({ queryKey: ['shop', shopId] });
        queryClient.invalidateQueries({ queryKey: ['shop-reviews', shopId] });
        queryClient.invalidateQueries({ queryKey: ['popular-shops'] });

        if (onRatingUpdate) {
          onRatingUpdate(response.data.data.rating);
        }
        setTimeout(() => {
          onClose();
          setSelectedRating(0);
          setComment("");
        }, 1000);
      }
    } catch (error: any) {
      console.error("Error rating shop:", error);
      toast.error(error.response?.data?.message || "Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRate = (rating: number) => {
    setSelectedRating(rating);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-background w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
              <Star className="w-10 h-10 text-primary fill-primary" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-foreground leading-tight">
                Rate Shop
              </h3>
              <p className="text-muted-foreground font-medium text-sm px-4">
                How was your experience with <span className="text-foreground font-bold">"{shopName}"</span>?
              </p>
            </div>

            <div className="flex items-center gap-2 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={isSubmitting}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRate(star)}
                  className="relative p-1 transition-all hover:scale-125 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      (hoverRating || selectedRating) >= star
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/20 fill-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="w-full space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest px-1">
                  Your Review (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience..."
                  className="w-full min-h-[120px] p-4 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none text-sm font-medium"
                  disabled={isSubmitting}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || selectedRating === 0}
                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    SUBMITTING...
                  </>
                ) : (
                  "SUBMIT REVIEW"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopRatingModal;
