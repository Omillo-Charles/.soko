"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Store, CheckCircle2, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface ShopSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const ShopSearchModal = ({ isOpen, onClose, initialQuery = "" }: ShopSearchModalProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("shops_q", query.trim());
    } else {
      params.delete("shops_q");
    }
    router.push(`/shop?${params.toString()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center p-0 md:p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-background w-full h-full md:h-auto md:max-w-xl md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-top-full md:slide-in-from-top-4 duration-500 border-x border-b border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"
          >
            <X className="w-6 h-6" />
          </button>
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for shops..."
              className="w-full bg-transparent border-none py-3 pl-8 pr-4 text-lg font-bold text-foreground placeholder:text-muted-foreground/30 focus:ring-0 outline-none"
            />
          </form>
          {query.trim() && (
            <button 
              onClick={handleSearch}
              className="p-2 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Suggestions / Info */}
        <div className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-[2rem] flex items-center justify-center">
              <Store className="w-10 h-10 text-muted-foreground/20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Find your favorite shop</h3>
              <p className="text-sm font-medium text-muted-foreground max-w-xs mx-auto">
                Search by shop name or handle to discover amazing products and deals.
              </p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="mt-12 grid grid-cols-1 gap-3">
            {[
              { label: "Verified Shops", icon: <CheckCircle2 className="w-4 h-4 text-primary" />, desc: "Look for the blue checkmark" },
              { label: "Top Rated", icon: <Store className="w-4 h-4 text-primary" />, desc: "Shops with high customer ratings" }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50">
                <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-foreground uppercase tracking-tight">{item.label}</p>
                  <p className="text-[10px] font-bold text-muted-foreground/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSearchModal;
