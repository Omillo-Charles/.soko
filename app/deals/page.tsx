"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search, 
  ChevronRight, 
  ShoppingBag, 
  Tag,
  ArrowLeft,
  SlidersHorizontal,
  X,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { categories as allCategories } from "@/constants/categories";

const DealsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const cat = searchParams.get("cat") || "all";
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);

  // Sync search query with URL params
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  const handleCategoryClick = (categoryValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryValue === 'all') {
      params.delete('cat');
    } else {
      params.set('cat', categoryValue);
    }
    router.push(`/deals?${params.toString()}`);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    } else {
      params.delete('q');
    }
    router.push(`/deals?${params.toString()}`);
  };

  const categories = allCategories.filter(c => c.value !== 'all');

  return (
    <div className="min-h-screen bg-background pt-[64px] md:pt-[100px] lg:pt-[128px]">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        
        {/* Left Sidebar - Categories & Filters */}
        <div className={`
          fixed inset-0 z-50 lg:z-0 lg:relative lg:block
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
          w-full sm:w-[280px] bg-background lg:bg-transparent border-r border-border
        `}>
          <aside className="h-full lg:h-[calc(100vh-128px)] lg:sticky lg:top-0 overflow-y-auto overscroll-contain custom-scrollbar flex flex-col">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
              <span className="font-black uppercase tracking-tight">Filters</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-muted rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Search */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] px-2">Search Deals</h3>
                <form onSubmit={handleSearch} className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search offers..." 
                    className="w-full bg-muted border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-foreground placeholder:text-muted-foreground/30 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </form>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">Categories</h3>
                  {cat !== 'all' && (
                    <button 
                      onClick={() => handleCategoryClick('all')}
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
                        onClick={() => handleCategoryClick(category.value)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group ${
                          cat === category.value 
                            ? 'text-primary bg-primary/10' 
                            : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg transition-colors ${
                          cat === category.value 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-muted group-hover:bg-primary/10 group-hover:text-primary'
                        }`}>
                          {Icon && <Icon className="w-3.5 h-3.5" />}
                        </div>
                        <span className="truncate">{category.label}</span>
                        {cat === category.value && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Backdrop for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0 h-full lg:h-[calc(100vh-128px)] overflow-y-auto overscroll-contain custom-scrollbar">
          {/* Header - Shop Style */}
          <div className="sticky top-0 bg-background/80 backdrop-blur-md z-30 border-b border-border">
            <div className="px-4 md:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => router.back()}
                  className="p-2 hover:bg-muted rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-black text-foreground uppercase tracking-tight">Deals</h1>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-2xl transition-all active:scale-95"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 md:p-8 lg:p-12">
            {/* Page Title Section */}
            <div className="space-y-2 mb-12">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                <div className="w-8 h-[1px] bg-primary" />
                Limited Time Offers
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight uppercase">
                Exclusive <span className="text-primary">Deals</span>
              </h2>
              <p className="text-muted-foreground font-medium max-w-md">
                Browse through our hand-picked selection of the best offers and discounts across all categories.
              </p>
            </div>

            {/* Empty State - Shop Style */}
            <div className="bg-muted/30 border border-dashed border-border rounded-[2.5rem] p-12 md:p-24 flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 bg-background rounded-[2rem] flex items-center justify-center shadow-2xl shadow-foreground/5 rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Tag className="w-10 h-10 text-muted-foreground/20 stroke-[1.5px]" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                </div>
              </div>

              <div className="space-y-2 max-w-sm">
                <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">No deals yet</h2>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                  We're currently working with our sellers to bring you the best prices. Check back soon for exclusive offers!
                </p>
              </div>

              <Link 
                href="/shop"
                className="px-8 py-4 bg-foreground text-background rounded-2xl font-bold text-sm shadow-xl shadow-foreground/10 hover:bg-primary transition-all flex items-center gap-2 group"
              >
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Explore Shop
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DealsPage;
