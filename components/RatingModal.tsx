"use client";

import React, { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useUser } from "@/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  initialRating?: number;
  onRatingUpdate?: (newRating: number, newCount: number) => void;
}

const RatingModal = ({
  isOpen,
  onClose,
  productId,
  productName,
  initialRating = 0,
  onRatingUpdate,
}: RatingModalProps) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

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
        
        // Invalidate queries to update the UI globally
        queryClient.invalidateQueries({ queryKey: ['product', productId] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['featured-products'] });

        if (onRatingUpdate) {
          onRatingUpdate(response.data.data.rating, response.data.data.reviewsCount);
        }
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error: any) {
      console.error("Error rating product:", error);
      toast.error(error.response?.data?.message || "Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center">
              <Star className="w-10 h-10 text-amber-500 fill-amber-500" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                Rate Product
              </h3>
              <p className="text-slate-500 font-medium text-sm px-4">
                How was your experience with <span className="text-slate-900 font-bold">"{productName}"</span>?
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
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200 fill-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>

            {isSubmitting ? (
              <div className="flex items-center gap-2 text-primary animate-pulse py-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-black uppercase tracking-widest">Submitting...</span>
              </div>
            ) : (
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Tap a star to rate
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
