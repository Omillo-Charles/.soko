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
      const endpoints = shopId?.startsWith('@')
        ? [
            `/shops/handle/${shopId.slice(1)}/rate`,
            `/shops/handle/${shopId.slice(1)}/reviews`,
          ]
        : [
            `/shops/${shopId}/rate`,
            `/shops/${shopId}/reviews`,
          ];

      let response: any = null;
      let lastError: any = null;

      for (const ep of endpoints) {
        const isHandle = shopId?.startsWith('@');
        const raw = isHandle ? shopId.slice(1) : shopId;
        const base = { rating: Math.max(1, Math.min(5, selectedRating)), comment: comment.trim() };
        const variants = [
          base,
          { rating: base.rating },
          { stars: base.rating, comment: base.comment },
          { score: base.rating, comment: base.comment },
          { rating: base.rating, review: base.comment },
          { rating: base.rating, content: base.comment },
        ].map(v => ({
          ...v,
          shop: raw,
          shopId: !isHandle ? raw : undefined,
          handle: isHandle ? raw : undefined,
        }));

        for (const payload of variants) {
          try {
            response = await api.post(ep, payload);
            if (response?.data) {
              break;
            }
          } catch (err: any) {
            lastError = err;
            const status = err?.response?.status;
            const data = err?.response?.data;
            // eslint-disable-next-line no-console
            console.warn('Shop review request failed', { ep, status, data });
            if ([404, 405, 500, 501].includes(Number(status))) {
              continue;
            }
            throw err;
          }
        }
        if (response?.data) break;
      }

      if (!response?.data?.success) {
        // If we didn't get a successful response, throw the last captured error
        if (lastError) throw lastError;
        throw new Error("Failed to submit review");
      }

      if (response.data.success) {
        toast.success("Thank you for your review!");
        const newRating = response.data.data?.rating;
        const newReviewsCount = response.data.data?.reviewsCount;
        // Update cached shop + popular shops immediately
        queryClient.setQueryData(['shop', shopId], (old: any) => old ? { ...old, rating: newRating ?? old.rating, reviewsCount: newReviewsCount ?? old.reviewsCount } : old);
        queryClient.setQueriesData({ queryKey: ['shop'] }, (old: any, query: any) => {
          if (!old) return old;
          const cachedId = old._id || old.id;
          if (String(cachedId) === String(shopId)) {
            return { ...old, rating: newRating ?? old.rating, reviewsCount: newReviewsCount ?? old.reviewsCount };
          }
          return old;
        });
        queryClient.setQueriesData({ queryKey: ['popular-shops'] }, (old: any) => {
          if (!old) return old;
          if (Array.isArray(old)) {
            return old.map((s: any) => {
              const sid = s._id || s.id;
              if (String(sid) === String(shopId)) {
                return { ...s, rating: newRating ?? s.rating, reviewsCount: newReviewsCount ?? s.reviewsCount };
              }
              return s;
            });
          }
          return old;
        });

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
      const msg = error.response?.data?.message || error.friendlyMessage || error.message || "Failed to submit rating. Please try again.";
      toast.error(msg);
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
