"use client";

import React from "react";
import { Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { categories as allCategories } from "@/constants/categories";

interface ShopLeftSidebarProps {
  currentCat: string;
  priceRange: { min: string; max: string };
  setPriceRange: React.Dispatch<React.SetStateAction<{ min: string; max: string }>>;
  desktopSearchQuery: string;
  setDesktopSearchQuery: (q: string) => void;
  showDesktopSuggestions: boolean;
  setShowDesktopSuggestions: (show: boolean) => void;
  desktopSuggestions: any[];
  onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  onCategoryClick: (cat: string) => void;
}

export const ShopLeftSidebar = ({
  currentCat,
  priceRange,
  setPriceRange,
  desktopSearchQuery,
  setDesktopSearchQuery,
  showDesktopSuggestions,
  setShowDesktopSuggestions,
  desktopSuggestions,
  onSearch,
  onCategoryClick,
}: ShopLeftSidebarProps) => {
  const router = useRouter();
  const categories = allCategories.filter(c => c.value !== 'all');

  return (
    <div className="hidden lg:block w-[280px] shrink-0">
      <aside className="fixed top-[128px] w-[280px] h-[calc(100vh-128px)] overflow-y-auto custom-scrollbar px-6 py-6 pb-24 space-y-8">
        
        {/* Search */}
        <div className="relative group">
          <form onSubmit={onSearch} className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              name="q"
              type="text"
              value={desktopSearchQuery || ""}
              onChange={(e) => {
                setDesktopSearchQuery(e.target.value);
                setShowDesktopSuggestions(true);
              }}
              onFocus={() => setShowDesktopSuggestions(true)}
              placeholder="Search shops..."
              className="w-full bg-muted border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </form>

          {/* Desktop Suggestions Dropdown */}
          {showDesktopSuggestions && desktopSearchQuery.trim() && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDesktopSuggestions(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {desktopSuggestions.length > 0 ? (
                  <div className="p-2 space-y-1">
                    {desktopSuggestions.map((shop: any) => (
                      <button
                        key={shop.id}
                        onClick={() => {
                          router.push(`/shop/${shop.handle || shop.id}`);
                          setShowDesktopSuggestions(false);
                        }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-xl transition-all group text-left"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted shrink-0">
                          <img src={shop.avatar} alt={shop.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-foreground truncate group-hover:text-primary transition-colors">{shop.name}</p>
                          <p className="text-[10px] font-bold text-muted-foreground/60 truncate">{shop.handle}</p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                    <button
                      onClick={() => onSearch({ preventDefault: () => {} } as any)}
                      className="w-full flex items-center gap-2 p-2 text-primary font-bold text-[10px] hover:bg-primary/5 rounded-xl transition-all"
                    >
                      <Search className="w-3 h-3" />
                      <span>Search for "{desktopSearchQuery}"</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground">No exact matches found</p>
                    <button
                      onClick={() => onSearch({ preventDefault: () => {} } as any)}
                      className="mt-2 text-primary text-[10px] font-black uppercase hover:underline"
                    >
                      See all results
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="mt-2 px-2">
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">
              Press Enter to search shops
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">Categories</h3>
            {currentCat !== 'all' && (
              <button
                onClick={() => onCategoryClick('all')}
                className="text-[10px] font-bold text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.value}
                  onClick={() => onCategoryClick(category.value)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group ${
                    currentCat === category.value
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    currentCat === category.value
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted group-hover:bg-primary/10 group-hover:text-primary'
                  }`}>
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                  </div>
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Filter */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">Price Range</h3>
            {(priceRange.min || priceRange.max) && (
              <button
                onClick={() => setPriceRange({ min: '', max: '' })}
                className="text-[10px] font-bold text-primary hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          <div className="px-2 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/30">KES</span>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  placeholder="Min"
                  className="w-full bg-muted border-none rounded-xl py-2 pl-8 pr-2 text-xs font-bold focus:ring-1 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/30 transition-all"
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/30">KES</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  placeholder="Max"
                  className="w-full bg-muted border-none rounded-xl py-2 pl-8 pr-2 text-xs font-bold focus:ring-1 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/30 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
