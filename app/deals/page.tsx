"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search, 
  ShoppingBag, 
  CheckCircle2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { categories as allCategories } from "@/constants/categories";
import { toast } from "sonner";

import { useTrackActivity } from "@/hooks/useProducts";
import { useUser } from "@/hooks/useUser";

const DealsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const cat = searchParams.get("cat") || "all";
  
  const trackActivity = useTrackActivity();
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  const { user: currentUser } = useUser();
  const shopsQuery = searchParams.get("shops_q") || "";

  const [isMounted, setIsMounted] = useState(false);
  const [showFab, setShowFab] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [desktopSearchQuery, setDesktopSearchQuery] = useState(shopsQuery || "");
  const [showDesktopSuggestions, setShowDesktopSuggestions] = useState(false);

  // Sync search query with URL params
  useEffect(() => {
    setDesktopSearchQuery(shopsQuery || "");
  }, [shopsQuery]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Show if scrolling up or at the top
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowFab(false);
      } else {
        setShowFab(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isLoading = false;
  const error = null;

  const displayProducts: any[] = [];

  const categories = allCategories.filter(c => c.value !== 'all');

  const specialOffers = [
    { title: "Summer Sale", discount: "50% OFF", color: "bg-orange-500", icon: "🔥" },
    { title: "New Arrivals", discount: "FREE DELIVERY", color: "bg-blue-600", icon: "📦" },
  ];

  const handleCategoryClick = (categoryValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryValue === 'all') {
      params.delete('cat');
    } else {
      params.set('cat', categoryValue);
    }
    router.push(`/deals?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (desktopSearchQuery.trim()) {
      params.set('shops_q', desktopSearchQuery.trim());
    } else {
      params.delete('shops_q');
    }
    router.push(`/deals?${params.toString()}`);
    setShowDesktopSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr_320px]">
        
        {/* Left Sidebar - Categories & Filters */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <aside className="fixed top-[128px] w-[280px] h-[calc(100vh-128px)] overflow-y-auto custom-scrollbar px-6 py-6 pb-24 space-y-8">
            {/* Search */}
            <div className="relative group">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                </div>
                <input 
                  name="q"
                  type="text" 
                  value={desktopSearchQuery || ""}
                  onChange={(e) => {
                    setDesktopSearchQuery(e.target.value);
                  }}
                  placeholder="Search deals..." 
                  className="w-full bg-muted border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </form>
              
              <div className="mt-2 px-2">
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">
                  Press Enter to search deals
                </p>
              </div>
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
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </aside>
        </div>

        {/* Middle Feed - Products */}
        <main className="flex-1 min-w-0 border-x border-border pb-24 lg:pb-0">
          {/* Header - Twitter Style */}
          <div className="sticky top-[80px] md:top-[128px] bg-background/80 backdrop-blur-md z-30 border-b border-border">
            <div className="px-4 py-2 md:py-4 flex items-center justify-between">
              <h1 className="text-xl font-black text-foreground">Deals</h1>
            </div>
            <div className="flex">
              {[
                { id: 'foryou', label: 'For You' },
                { id: 'following', label: 'Following' },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'foryou' | 'following')}
                  className="flex-1 hover:bg-muted/50 transition-colors relative h-14 flex items-center justify-center group"
                >
                  <span className={`text-sm font-bold ${activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 h-1 w-16 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Feed */}
          <div>
            {displayProducts.length === 0 && (
              <div className="p-20 flex flex-col items-center justify-center text-muted-foreground gap-6 text-center animate-in fade-in duration-700">
                <div className="w-20 h-20 bg-muted rounded-[2rem] flex items-center justify-center mb-2">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground/20" />
                </div>
                <div className="space-y-2 max-w-xs">
                  <p className="font-black text-foreground text-lg uppercase tracking-tight">
                    No deals yet
                  </p>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    We're currently working on bringing you the best deals. Check back soon!
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar - Trending/Quick Links */}
        <div className="hidden lg:block w-[320px] shrink-0">
          <aside className="fixed top-[128px] w-[320px] h-[calc(100vh-128px)] overflow-y-auto custom-scrollbar px-6 py-6 pb-24 space-y-8">
            {/* Special Offers */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] px-2">Special Offers</h3>
              <div className="space-y-3 px-2">
                {specialOffers.map((offer, index) => (
                  <Link 
                    key={offer.title} 
                    href="/deals"
                    className={`group block relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                      index === 0 
                        ? 'bg-primary shadow-primary/20' 
                        : 'bg-secondary shadow-secondary/20'
                    }`}
                  >
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-primary-foreground/70 uppercase tracking-widest mb-1">{offer.title}</p>
                      <p className="text-xl font-black text-primary-foreground leading-tight">{offer.discount}</p>
                    </div>
                    
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary-foreground/10 rounded-full blur-2xl group-hover:bg-primary-foreground/20 transition-colors"></div>
                    
                    <div className="absolute right-3 bottom-3 text-5xl opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500 transform -rotate-12">
                      {offer.icon}
                    </div>
                  </Link>
                ))}
              </div>
            </div>



            {/* Links */}
            <div className="px-4 py-4 border-t border-border flex flex-wrap gap-x-4 gap-y-2">
              {[
                { label: 'Terms', href: '/terms' },
                { label: 'Privacy', href: '/privacy' },
                { label: 'Help', href: '/help' },
                { label: 'Cookies', href: '/cookies' },
                { label: 'About', href: '/about' }
              ].map(link => (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <p className="text-[11px] font-bold text-muted-foreground/40 w-full mt-2">© 2026 <span className="text-secondary">.</span>Soko Marketplace</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const DealsPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading Deals...</p>
        </div>
      </div>
    }>
      <DealsContent />
    </Suspense>
  );
};

export default DealsPage;
