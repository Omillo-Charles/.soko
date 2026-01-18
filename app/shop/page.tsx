"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Star, 
  ShoppingBag, 
  MessageCircle, 
  Repeat2, 
  Heart, 
  Share2,
  MoreHorizontal,
  TrendingUp,
  CheckCircle2,
  LayoutGrid,
  List,
  Info,
  Plus,
  ArrowRight,
  ShoppingCart
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { categories as allCategories } from "@/constants/categories";
import { toast } from "sonner";

import { useProducts } from "@/hooks/useProducts";
import { usePopularShops, useFollowShop } from "@/hooks/useShop";
import { useUser } from "@/hooks/useUser";

const ShopPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const cat = searchParams.get("cat") || "all";
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  const { user: currentUser } = useUser();
  const { data: popularShopsData, isLoading: isShopsLoading } = usePopularShops();
  const followMutation = useFollowShop();

  const [showFab, setShowFab] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  const { data: productsData, isLoading: isProductsLoading, error: productsError } = useProducts({
    q: query,
    cat: cat !== 'all' ? cat : undefined,
    following: activeTab === 'following' ? 'true' : undefined
  });

  const products = productsData || [];

  const popularShops = React.useMemo(() => {
    return (popularShopsData || []).map((s: any) => ({
      id: s._id || s.id || `shop-${Math.random()}`,
      name: s.name || "Unknown Shop",
      handle: `@${(s.name || "shop").toLowerCase().replace(/\s+/g, "_")}`,
      avatar: s.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name || "shop"}`,
      followers: s.followersCount || s.followers?.length || 0,
      verified: s.isVerified || false,
      followersList: s.followers || [],
      products: s.productsCount || s.products?.length || 0
    }));
  }, [popularShopsData]);

  const handleFollowToggle = async (shopId: string) => {
    if (!currentUser) {
      toast.error("Please login to follow shops");
      router.push("/auth?mode=login");
      return;
    }

    try {
      await followMutation.mutateAsync(shopId);
      toast.success("Updated follow status");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to toggle follow");
    }
  };

  const displayProducts = React.useMemo(() => {
    const formatted = products.map((p: any) => ({
      id: p._id || p.id || `product-${Math.random()}`,
      vendor: {
        id: p.shop?._id || p.shop?.id || `vendor-${Math.random()}`,
        name: p.shop?.name || "Unknown Shop",
        handle: `@${p.shop?.name?.toLowerCase().replace(/\s+/g, "_") || "shop"}`,
        avatar: p.shop?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.shop?.name || "shop"}`,
        verified: p.shop?.isVerified || false
      },
      content: p.description || p.content || "",
      image: p.image,
      price: p.price?.toLocaleString() || "0",
      rating: p.rating || 0,
      reviews: p.reviewsCount || 0,
      likes: p.likesCount || 0,
      reposts: p.repostsCount || 0,
      comments: p.commentsCount || 0,
      time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Just now"
    }));

    if (activeTab === 'following' && currentUser) {
      // Filter is already handled by the API when following=true is passed
      return formatted;
    }
    return formatted;
  }, [products, activeTab, currentUser]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const isLoading = isProductsLoading;
  const error = productsError ? (productsError as any).response?.data?.message || "Failed to load products" : null;

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
    router.push(`/shop?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get('q') as string).trim();
    const params = new URLSearchParams(searchParams.toString());
    
    // When searching, we want to search across all categories by default 
    // unless the user explicitly wants to stay in the current category.
    // The user said "searching the results across the categories", so I'll clear cat.
    params.delete('cat'); 
    
    if (q) {
      params.set('q', q);
    } else {
      params.delete('q');
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr_320px]">
        
        {/* Left Sidebar - Categories & Filters */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <aside className="fixed top-[160px] w-[280px] h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar px-6 py-6 pb-24 space-y-8">
            {/* Search */}
            <div className="relative group">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input 
                  name="q"
                  type="text" 
                  defaultValue={query}
                  placeholder="Search products..." 
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </form>
              <div className="mt-2 px-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  Press Enter to search all categories
                </p>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Categories</h3>
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
                {categories.map((category) => (
                  <button 
                    key={category.value}
                    onClick={() => handleCategoryClick(category.value)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group ${
                      cat === category.value 
                        ? 'text-primary bg-primary/10' 
                        : 'text-slate-600 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Price Range</h3>
              <div className="px-2 space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input type="number" placeholder="Min" className="w-full bg-slate-50 border-none rounded-xl py-2 px-3 text-xs font-bold focus:ring-1 focus:ring-primary/20" />
                  </div>
                  <div className="flex-1">
                    <input type="number" placeholder="Max" className="w-full bg-slate-50 border-none rounded-xl py-2 px-3 text-xs font-bold focus:ring-1 focus:ring-primary/20" />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Middle Feed - Products */}
        <main className="flex-1 min-w-0 border-x border-slate-100 pb-24 lg:pb-0">
          {/* Header - Twitter Style */}
          <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-100">
            <div className="px-4 py-4">
              <h1 className="text-xl font-black text-slate-900">Explore</h1>
            </div>
            <div className="flex">
              {[
                { id: 'foryou', label: 'For You' },
                { id: 'following', label: 'Following' },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'foryou' | 'following')}
                  className="flex-1 hover:bg-slate-100/50 transition-colors relative h-14 flex items-center justify-center group"
                >
                  <span className={`text-sm font-bold ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-500'}`}>
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
            {isLoading ? (
              <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-sm">Loading products...</p>
              </div>
            ) : error ? (
              <div className="p-20 flex flex-col items-center justify-center text-red-400 gap-4">
                <Info className="w-10 h-10" />
                <p className="font-bold text-sm">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-slate-100 text-slate-600 rounded-full text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-6 text-center animate-in fade-in duration-700">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-2">
                  <ShoppingBag className="w-10 h-10 text-slate-200" />
                </div>
                <div className="space-y-2 max-w-xs">
                  <p className="font-black text-slate-900 text-lg uppercase tracking-tight">
                    {activeTab === 'following' && !currentUser 
                      ? "Login Required" 
                      : query 
                        ? "No product found"
                        : "No products yet"}
                  </p>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    {activeTab === 'following' && !currentUser
                      ? "Sign in to your account to view updates from your favorite shops."
                      : query
                        ? `We couldn't find any matches for "${query}" across our categories.`
                        : "Be the first to post something amazing in this category!"}
                  </p>
                </div>
                {activeTab === 'following' && !currentUser ? (
                  <Link 
                    href="/auth?mode=login"
                    className="mt-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-900/10 hover:bg-primary transition-all"
                  >
                    Login Now
                  </Link>
                ) : query ? (
                  <button 
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.delete('q');
                      router.push(`/shop?${params.toString()}`);
                    }}
                    className="mt-2 px-8 py-3.5 bg-slate-100 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all"
                  >
                    Clear Search
                  </button>
                ) : (
                  <Link 
                    href="/account/seller/products/new"
                    className="mt-2 px-8 py-3.5 bg-primary text-white rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all"
                  >
                    Post a Product
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-100 bg-white">
                {displayProducts.map((product: any) => (
                  <div 
                    key={product.id} 
                    onClick={() => router.push(`/shop/product/${product.id}`)}
                    className="p-4 md:p-6 hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <div className="flex gap-3 md:gap-4">
                      {/* Profile Image */}
                      <div className="shrink-0">
                        <div 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            router.push(`/shop/${product.vendor.id}`);
                          }}
                          className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 bg-slate-50 hover:opacity-90 transition-opacity"
                        >
                          <img src={product.vendor.avatar} alt={product.vendor.name} className="w-full h-full object-cover" />
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 min-w-0">
                        {/* Header: Name, Handle, Time */}
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                router.push(`/shop/${product.vendor.id}`);
                              }}
                              className="text-sm font-black text-slate-900 truncate hover:underline flex items-center gap-1"
                            >
                              {product.vendor.name}
                              {product.vendor.verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/10" />}
                            </span>
                            <span className="text-slate-500 text-xs truncate">{product.vendor.handle}</span>
                            <span className="text-slate-400 text-xs shrink-0">· {product.time}</span>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); }}
                            className="text-slate-400 hover:text-primary p-1 rounded-full hover:bg-primary/5 transition-all"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Product Content */}
                        <p className="text-slate-800 text-[13px] leading-relaxed mb-3 whitespace-pre-wrap">
                          {product.content}
                        </p>

                        {/* Product Image */}
                        {product.image && (
                          <div className="rounded-2xl overflow-hidden border border-slate-100 mb-3 bg-slate-50 relative aspect-video group/img">
                            <img 
                              src={product.image} 
                              alt="Product" 
                              className="w-full h-full object-cover group-hover/img:scale-[1.02] transition-transform duration-500" 
                            />
                            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-xl shadow-slate-900/5">
                              <span className="text-primary font-black text-sm">KES {product.price}</span>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons: Twitter Style */}
                        <div className="flex items-center justify-between max-w-md text-slate-500 -ml-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); }}
                            className="flex items-center gap-0 group transition-colors hover:text-primary"
                          >
                            <div className="p-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
                              <MessageCircle className="w-[18px] h-[18px]" />
                            </div>
                            <span className="text-xs font-bold">{product.comments || 0}</span>
                          </button>

                          <button 
                            onClick={(e) => { e.stopPropagation(); }}
                            className="flex items-center gap-0 group transition-colors hover:text-green-500"
                          >
                            <div className="p-1.5 rounded-full group-hover:bg-green-500/10 transition-colors">
                              <Repeat2 className="w-[18px] h-[18px]" />
                            </div>
                            <span className="text-xs font-bold">{product.reposts || 0}</span>
                          </button>

                          <button 
                            onClick={async (e) => { 
                              e.stopPropagation();
                              await toggleWishlist(product.id);
                            }}
                            className={`flex items-center gap-0 group transition-colors ${
                              isInWishlist(product.id) ? 'text-pink-500' : 'hover:text-pink-500'
                            }`}
                          >
                            <div className={`p-1.5 rounded-full transition-colors ${
                              isInWishlist(product.id) ? 'bg-pink-500/10' : 'group-hover:bg-pink-500/10'
                            }`}>
                              <Heart className={`w-[18px] h-[18px] ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                            </div>
                            <span className="text-xs font-bold">{product.likes || 0}</span>
                          </button>

                          <button 
                            onClick={(e) => { 
                              e.stopPropagation();
                              addToCart(product.id);
                            }}
                            className="flex items-center gap-0 group transition-colors hover:text-primary"
                          >
                            <div className="p-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
                              <ShoppingCart className="w-[18px] h-[18px]" />
                            </div>
                            <span className="text-xs font-bold">Add to Cart</span>
                          </button>

                          <button 
                            onClick={(e) => { e.stopPropagation(); }}
                            className="flex items-center gap-2 group transition-colors hover:text-slate-900"
                          >
                            <div className="p-2 rounded-full group-hover:bg-slate-100 transition-colors">
                              <Share2 className="w-[18px] h-[18px]" />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar - Trending/Quick Links */}
        <div className="hidden lg:block w-[320px] shrink-0">
          <aside className="fixed top-[160px] w-[320px] h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar px-6 py-6 pb-24 space-y-8">
            {/* Popular Shops */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Popular Shops</h3>
              <div className="space-y-1">
                {popularShops.map((vendor: any) => (
                  <div 
                    key={vendor.id} 
                    className="p-3 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-3 rounded-xl group"
                    onClick={() => router.push(`/shop/${vendor.id}`)}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                        <img src={vendor.avatar} alt={vendor.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-black text-slate-900 truncate">{vendor.name}</p>
                          {vendor.verified && <CheckCircle2 className="w-3 h-3 text-primary fill-primary/10" />}
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 truncate">{vendor.handle}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] font-bold text-slate-500">{vendor.followers} followers</p>
                          <span className="text-slate-300 text-[8px]">·</span>
                          <p className="text-[10px] font-bold text-slate-500">{vendor.products} products</p>
                        </div>
                      </div>
                    </div>
                    {currentUser?._id !== vendor.id && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleFollowToggle(vendor.id); }}
                        disabled={followMutation.isPending && followMutation.variables === vendor.id}
                        className={`bg-slate-900 text-white text-[11px] font-black px-4 py-1.5 rounded-full hover:bg-primary transition-all shrink-0 ${
                          vendor.followersList?.includes(currentUser?._id) 
                            ? 'bg-slate-100 text-slate-900 hover:bg-red-50 hover:text-red-600 hover:border-red-100' 
                            : ''
                        } ${followMutation.isPending && followMutation.variables === vendor.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {followMutation.isPending && followMutation.variables === vendor.id ? '...' : (vendor.followersList?.includes(currentUser?._id) ? 'Following' : 'Follow')}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Special Offers */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Special Offers</h3>
              <div className="space-y-3 px-2">
                {specialOffers.map((offer, index) => (
                  <div 
                    key={offer.title} 
                    className={`group cursor-pointer relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                      index === 0 
                        ? 'bg-primary shadow-blue-500/20' 
                        : 'bg-secondary shadow-orange-500/20'
                    }`}
                  >
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">{offer.title}</p>
                      <p className="text-xl font-black text-white leading-tight">{offer.discount}</p>
                    </div>
                    
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
                    
                    <div className="absolute right-3 bottom-3 text-5xl opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500 transform -rotate-12">
                      {offer.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flash Deals */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Flash Deals</h3>
              <div className="space-y-4 px-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-3 group cursor-pointer">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 shrink-0">
                      <div className="w-full h-full bg-slate-200 animate-pulse"></div>
                    </div>
                    <div className="min-w-0 flex-1 py-1">
                      <p className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">Premium Item {i}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-primary font-black text-sm">KES {i * 1500}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: i === 1 ? '75%' : '40%' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="px-4 py-4 border-t border-slate-50 flex flex-wrap gap-x-4 gap-y-2">
              {['Terms', 'Privacy', 'Help', 'Cookies', 'About'].map(link => (
                <button key={link} className="text-[11px] font-bold text-slate-400 hover:text-primary transition-colors">{link}</button>
              ))}
              <p className="text-[11px] font-bold text-slate-300 w-full mt-2">© 2026 Duuka Marketplace</p>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Action Button for Sellers */}
      {currentUser?.accountType === 'seller' && (
        <Link
          href="/account/seller/products/new"
          className={`fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40 transition-all duration-300 transform ${
            showFab ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
          }`}
        >
          <div className="bg-primary text-white p-4 rounded-full shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all group flex items-center gap-2">
            <Plus className="w-6 h-6" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black text-sm whitespace-nowrap">
              POST PRODUCT
            </span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default ShopPage;
