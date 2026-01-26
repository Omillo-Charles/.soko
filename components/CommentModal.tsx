"use client";

import React, { useState } from "react";
import { X, Send, MessageSquare, Loader2 } from "lucide-react";
import { useComments } from "@/hooks/useComments";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

const CommentModal = ({ isOpen, onClose, productId, productName }: CommentModalProps) => {
  const [content, setContent] = useState("");
  const { createComment, isPosting } = useComments(productId);
  const { user } = useUser();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to post a comment");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    createComment(
      { productId, content: content.trim() },
      {
        onSuccess: () => {
          setContent("");
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Add Comment</h3>
              <p className="text-xs text-slate-500 line-clamp-1">{productName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Your Comment
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you think about this product?"
              className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none outline-none"
              autoFocus
            />
            <p className="mt-2 text-[10px] text-slate-400 text-right">
              {content.length}/1000 characters
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPosting || !content.trim()}
              className="flex-[2] px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {isPosting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Post Comment
            </button>
          </div>
        </form>

        {/* Footer info */}
        {!user && (
          <div className="px-6 py-4 bg-amber-50 border-t border-amber-100">
            <p className="text-xs text-amber-700 text-center">
              You must be <a href="/auth" className="font-bold underline">logged in</a> to post a comment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentModal;
