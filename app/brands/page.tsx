"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Store, 
  CheckCircle2, 
  Users, 
  ShoppingBag, 
  ArrowRight,
  Filter,
  LayoutGrid,
  MapPin,
  Star,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { usePopularShops, useFollowShop, useMyShop } from "@/hooks/useShop";
import { useUser } from "@/hooks/useUser";

const BrandsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useUser();
  const { data: myShop } = useMyShop();
  const { data: shops = [], isLoading } = usePopularShops();
  const followMutation = useFollowShop();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const normalizedShops = useMemo(() => {
    return (shops || []).map((shop: any) => ({
      ...shop,
      productsCount: shop.productsCount || shop.products?.length || 0,
      followersCount: shop.followersCount || shop.followers?.length || 0
    }));
  }, [shops]);

  const filteredShops = useMemo(() => {
    return normalizedShops.filter((shop: any) => 
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [normalizedShops, searchQuery]);

  const handleFollowToggle = async (e: React.MouseEvent, shopId: string) => {
    e.stopPropagation();
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

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
              Discover <span className="text-primary">Brands</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8">
              Explore the best stores on <span className="text-secondary">.</span>Soko From fashion to electronics, find verified vendors and follow your favorite brands for the latest updates.
            </p>
            
            {/* Search Bar */}
            <div className="relative group max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Search brands by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all text-sm font-bold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-5/6" />
                </div>
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-12 md:p-20 border border-slate-100 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">
              {searchQuery ? "No brands match your search" : "No brands yet"}
            </h2>
            <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
              {searchQuery 
                ? "Try searching with a different keyword or browse all available brands." 
                : "We're currently onboarding amazing brands. Check back soon or start your own store!"}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-primary transition-all shadow-lg shadow-slate-900/10"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShops.map((shop: any) => (
              <div 
                key={shop._id}
                onClick={() => router.push(`/shop/${shop._id}`)}
                className="group bg-white rounded-[2.5rem] border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
              >
                {/* Banner Part */}
                <div className="h-24 bg-slate-100 relative overflow-hidden">
                  {shop.banner ? (
                    <img src={shop.banner} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/10" />
                  )}
                </div>

                <div className="p-6 pt-0 flex-1 flex flex-col">
                  {/* Avatar & Header */}
                  <div className="relative z-10 flex items-end gap-4 -mt-10 mb-4 px-2">
                    <div className="w-20 h-20 rounded-3xl border-4 border-white overflow-hidden bg-slate-100 shadow-xl group-hover:scale-105 transition-transform duration-500">
                      <img 
                        src={shop.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${shop.name}`} 
                        alt={shop.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="pb-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-lg font-black text-slate-900 truncate group-hover:text-primary transition-colors">
                          {shop.name}
                        </h3>
                        {shop.isVerified && <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10 shrink-0" />}
                      </div>
                      <p className="text-xs font-bold text-slate-400">{shop.username ? `@${shop.username}` : `@${shop.name.toLowerCase().replace(/\s+/g, "_")}`}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 font-medium line-clamp-2 mb-6 px-2 leading-relaxed">
                    {shop.description || "Premium quality products and exceptional service."}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-50 flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl text-primary shadow-sm">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight leading-none mb-1">Followers</p>
                        <p className="text-xs font-black text-slate-900">{shop.followersCount || shop.followers?.length || 0}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-50 flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl text-orange-500 shadow-sm">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight leading-none mb-1">Products</p>
                        <p className="text-xs font-black text-slate-900">{shop.productsCount || shop.products?.length || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-auto flex items-center gap-3">
                    {!isMounted ? (
                      <button 
                        className="flex-1 h-11 rounded-xl text-xs font-black transition-all bg-slate-900 text-white hover:bg-primary shadow-lg shadow-slate-900/10"
                      >
                        Follow
                      </button>
                    ) : (
                      <>
                        {(!currentUser || (myShop && String(myShop._id || myShop.id) !== String(shop._id)) || (!myShop && shop.owner !== currentUser?._id)) && (
                          <button 
                            onClick={(e) => handleFollowToggle(e, shop._id)}
                            disabled={followMutation.isPending && followMutation.variables === shop._id}
                            className={`flex-1 h-11 rounded-xl text-xs font-black transition-all ${
                              currentUser && shop.followers?.includes(currentUser._id)
                                ? 'bg-slate-100 text-slate-900 hover:bg-red-50 hover:text-red-600 hover:border-red-100'
                                : 'bg-slate-900 text-white hover:bg-primary shadow-lg shadow-slate-900/10'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {followMutation.isPending && followMutation.variables === shop._id ? '...' : (
                              currentUser && shop.followers?.includes(currentUser._id) ? 'Following' : 'Follow'
                            )}
                          </button>
                        )}
                      </>
                    )}
                    <button className="w-11 h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-primary hover:border-primary transition-all group/btn shadow-sm">
                      <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandsPage;
