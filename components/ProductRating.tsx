"use client";

import React, { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useUser } from "@/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";

interface ProductRatingProps {
  productId: string;
  initialRating?: number;
  initialReviewsCount?: number;
  onRatingUpdate?: (newRating: number, newCount: number) => void;
}

const ProductRating = ({ 
  productId, 
  initialRating = 0, 
  initialReviewsCount = 0,
  onRatingUpdate 
}: ProductRatingProps) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = async (rating: number) => {
    if (!user) {
      toast.error("Please login to rate this product");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(`/products/${productId}/rate`, { rating });
      
      if (response.data.success) {
        toast.success("Thank you for your rating!");
        setSelectedRating(rating);
        
        // Invalidate queries to update UI in real-time
        queryClient.invalidateQueries({ queryKey: ['product', productId] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['featured-products'] });

        if (onRatingUpdate) {
          onRatingUpdate(response.data.data.rating, response.data.data.reviewsCount);
        }
      }
    } catch (error: any) {
      console.error("Error rating product:", error);
      toast.error(error.response?.data?.message || "Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 py-6 border-t border-border">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Product Rating
        </h3>
        <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span className="text-xs font-black text-amber-600 dark:text-amber-400">
            {initialRating.toFixed(1)}
          </span>
          <span className="text-[10px] font-bold text-amber-600/60 dark:text-amber-400/60 ml-0.5">
            ({initialReviewsCount})
          </span>
        </div>
      </div>

      <div className="bg-muted/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 border border-border">
        <p className="text-sm font-bold text-muted-foreground">
          How would you rate this product?
        </p>
        
        <div className="flex items-center gap-2">
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
                className={`w-8 h-8 transition-colors ${
                  (hoverRating || selectedRating) >= star
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30 fill-transparent"
                }`}
              />
            </button>
          ))}
        </div>

        {isSubmitting && (
          <div className="flex items-center gap-2 text-primary animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest">Submitting...</span>
          </div>
        )}

        {!user && (
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">
            Sign in to leave a review
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductRating;
