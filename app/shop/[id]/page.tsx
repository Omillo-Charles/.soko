"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Users,
  Info,
  ChevronLeft,
  ShoppingBag,
  Star,
  CheckCircle2,
  MoreHorizontal,
  Share2,
  Heart,
  MessageCircle,
  Repeat2,
  Filter,
  LayoutGrid,
  TrendingUp,
  ShoppingCart
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { useShop, useShopProducts, usePopularShops, useFollowShop, useShopLists, useMyShop } from "@/hooks/useShop";
import { useUser } from "@/hooks/useUser";
import RatingModal from "@/components/RatingModal";
import ShareModal from "@/components/ShareModal";

const ShopProfilePage = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user: currentUser } = useUser();
  const { data: myShop } = useMyShop();
  
  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({
    isOpen: false,
    url: "",
    title: ""
  });

  const [activeSection, setActiveSection] = useState('Products');
  const [isMounted, setIsMounted] = useState(false);

  // Rating Modal State
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
    initialRating: number;
  }>({
    isOpen: false,
    productId: "",
    productName: "",
    initialRating: 0
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: shop, isLoading: isShopLoading, error: shopError } = useShop(id);
  const { data: productsData = [], isLoading: isProductsLoading } = useShopProducts(id);
  const { data: popularShopsData = [] } = usePopularShops();
  const { data: listData = [], isLoading: isListsLoading } = useShopLists(id, activeSection as 'Followers' | 'Following');
  const followMutation = useFollowShop();

  const products = React.useMemo(() => {
    return (productsData || []).map((p: any) => ({
      ...p,
      _id: String(p._id || p.id || `product-${Math.random()}`),
      name: String(p.name || "Untitled Product"),
      price: Number(p.price || 0),
      description: String(p.description || ""),
      image: p.image || p.images?.[0] || null,
      likesCount: Number(p.likesCount || p.likes?.length || 0),
      commentsCount: Number(p.commentsCount || p.comments?.length || 0),
      repostsCount: Number(p.repostsCount || 0),
      rating: Number(p.rating || 0),
      reviewsCount: Number(p.reviewsCount || 0)
    }));
  }, [productsData]);

  const isFollowing = shop?.followers?.some((f: any) => String(f._id || f) === String(currentUser?._id));
  
  const popularShops = React.useMemo(() => {
    return (popularShopsData || []).map((s: any) => ({
      id: String(s._id || s.id || `shop-${Math.random()}`),
      name: String(s.name || "Unknown Shop"),
      handle: s.username ? `@${s.username}` : `@${String(s.name || "shop").toLowerCase().replace(/\s+/g, "_")}`,
      avatar: s.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name || "shop"}`,
      followers: Number(s.followersCount || s.followers?.length || 0),
      verified: Boolean(s.isVerified || false)
    }));
  }, [popularShopsData]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please login to follow shops");
      router.push("/auth?mode=login");
      return;
    }

    if (shop?.owner === currentUser?._id) {
      toast.error("You cannot follow your own shop");
      return;
    }

    try {
      await followMutation.mutateAsync(id);
      toast.success(isFollowing ? "Unfollowed shop" : "Following shop");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to toggle follow");
    }
  };

  const isLoading = isShopLoading;
  const error = shopError ? (shopError as any).response?.data?.message || "Failed to load shop" : null;

  // Use the actual products length if productsCount is missing
  const productsCount = shop?.productsCount || shop?.products?.length || products.length || 0;


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
          <Info className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Oops!</h1>
        <p className="text-slate-500 font-medium mb-8 text-center max-w-md">
          {error || "We couldn't find the shop you're looking for."}
        </p>
        <button 
          onClick={() => router.push("/shop")}
          className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:bg-blue-700 transition-all"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr_320px]">
        
        {/* Left Sidebar */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <aside className="fixed top-[128px] w-[280px] h-[calc(100vh-128px)] overflow-y-auto custom-scrollbar px-6 py-6 pb-24 space-y-8">
            <button 
              onClick={() => router.push('/shop')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-primary hover:bg-primary/5 transition-all group w-full"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Explore
            </button>

            <div className="space-y-4 pt-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Store Sections</h3>
              <div className="space-y-1">
                {[
                  { name: 'Products', icon: <ShoppingBag className="w-5 h-5" />, count: products.length },
                  { name: 'Reviews', icon: <Star className="w-5 h-5" />, count: 0 },
                  { name: 'About', icon: <Info className="w-5 h-5" /> },
                  { name: 'Followers', icon: <Users className="w-5 h-5" />, count: shop?.followersCount ?? shop?.followers?.length },
                  { name: 'Following', icon: <Users className="w-5 h-5" />, count: shop?.followingCount ?? shop?.following?.length },
                ].map((item) => (
                  <button 
                    key={item.name}
                    onClick={() => setActiveSection(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      activeSection === item.name ? 'text-primary bg-primary/5' : 'text-slate-600 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.name}
                    </div>
                    {item.count !== undefined && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        activeSection === item.name ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>

       {/* Middle Feed - Products */}
        <main className="flex-1 min-w-0 border-x border-slate-100 pb-24 lg:pb-0">
          {/* Header - Profile Style */}
          <div className="sticky top-[100px] md:top-[128px] bg-white/80 backdrop-blur-md z-30 border-b border-slate-100 px-4 py-4 flex items-center gap-4">
            <button onClick={() => router.back()} className="lg:hidden p-2 hover:bg-slate-100 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-none">{shop.name}</h1>
              <p className="text-xs font-bold text-slate-500 mt-1">{products.length} products</p>
            </div>
          </div>

          {/* Banner & Profile Info */}
          <div className="relative">
            <div className="h-48 bg-slate-100 relative overflow-hidden">
              {shop.banner && <img src={shop.banner} alt="Banner" className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
            </div>
            
            <div className="px-4 pb-6">
              <div className="relative flex justify-between items-end -mt-16 mb-4">
                <div className="w-32 h-32 rounded-[2.5rem] border-4 border-white overflow-hidden bg-slate-100 shadow-xl">
                  <img 
                    src={shop.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${shop.name}`} 
                    alt={shop.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex gap-2 pb-2">
                  {!isMounted ? (
                    <button 
                      className="px-6 py-2 rounded-full text-sm font-black transition-all bg-slate-900 text-white hover:bg-primary"
                    >
                      Follow
                    </button>
                  ) : (
                    <>
                      {currentUser && (!myShop || String(myShop._id || myShop.id) !== String(id)) && shop?.owner !== currentUser?._id && (
                        <button 
                          onClick={handleFollowToggle}
                          disabled={followMutation.isPending}
                          className={`px-6 py-2 rounded-full text-sm font-black transition-all ${
                            isFollowing 
                              ? 'bg-slate-100 text-slate-900 hover:bg-red-50 hover:text-red-600 hover:border-red-100' 
                              : 'bg-slate-900 text-white hover:bg-primary'
                          } ${followMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {followMutation.isPending ? '...' : (isFollowing ? 'Following' : 'Follow')}
                        </button>
                      )}
                      {!currentUser && (
                        <button 
                          onClick={handleFollowToggle}
                          className="px-6 py-2 rounded-full text-sm font-black transition-all bg-slate-900 text-white hover:bg-primary"
                        >
                          Follow
                        </button>
                      )}
                    </>
                  )}
                  <button className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition-all">
                    <Share2 className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition-all">
                    <MoreHorizontal className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xl font-black text-slate-900">{shop.name}</h2>
                  {shop.isVerified && <CheckCircle2 className="w-5 h-5 text-primary fill-primary/10" />}
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-slate-500">{shop.username ? `@${shop.username}` : `@${shop.name.toLowerCase().replace(/\s+/g, "_")}`}</p>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <button 
                    onClick={() => setActiveSection('Followers')}
                    className="text-sm font-bold text-slate-900 hover:underline"
                  >
                    {shop?.followersCount ?? shop?.followers?.length ?? 0} <span className="text-slate-500">Followers</span>
                  </button>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <button 
                    onClick={() => setActiveSection('Following')}
                    className="text-sm font-bold text-slate-900 hover:underline"
                  >
                    {shop?.followingCount ?? shop?.following?.length ?? 0} <span className="text-slate-500">Following</span>
                  </button>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <button 
                    onClick={() => setActiveSection('Products')}
                    className="text-sm font-bold text-slate-900 hover:underline"
                  >
                    {productsCount} <span className="text-slate-500">Products</span>
                  </button>
                </div>
              </div>

              <p className="mt-4 text-[13px] text-slate-600 font-medium leading-relaxed max-w-2xl">
                {shop.description}
              </p>
            </div>
          </div>

          {/* Main Feed Content */}
          <div className="border-t border-slate-100">
            {activeSection === 'Products' ? (
              products.length === 0 ? (
                <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4 text-center">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <div>
                    <p className="font-black text-slate-900">No products found</p>
                    <p className="text-sm">This shop hasn't posted any products yet.</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {products.map((product: any) => (
                    <div 
                      key={product._id} 
                      onClick={() => router.push(`/shop/product/${product._id}`)}
                      className="p-4 md:p-6 hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <div className="flex gap-3 md:gap-4">
                        {/* Profile Image (Small in feed) */}
                        <div className="shrink-0">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 bg-slate-50">
                            <img 
                              src={shop.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${shop.name}`} 
                              alt={shop.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-sm font-black text-slate-900 truncate flex items-center gap-1">
                                {shop.name}
                                {shop.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/10" />}
                              </span>
                              <span className="text-slate-500 text-xs truncate">{shop.username ? `@${shop.username}` : `@${shop.name.toLowerCase().replace(/\s+/g, "_")}`}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setRatingModal({
                                    isOpen: true,
                                    productId: product._id,
                                    productName: product.name,
                                    initialRating: product.rating
                                  });
                                }}
                                className="text-slate-300 hover:text-amber-500 p-1.5 rounded-full hover:bg-amber-50 transition-all"
                                title="Rate Product"
                              >
                                <Star className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <p className="text-slate-800 text-[13px] leading-relaxed mb-3 whitespace-pre-wrap">
                            {product.description}
                          </p>

                          {product.image && (
                            <div className="rounded-[1.25rem] overflow-hidden border border-slate-100 mb-3 bg-slate-50 relative aspect-video group/img flex items-center justify-center">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="max-w-full max-h-full object-contain group-hover/img:scale-[1.02] transition-transform duration-500" 
                              />
                              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-xl flex flex-col items-end">
                                <span className="text-primary font-black text-sm">KES {product.price?.toLocaleString()}</span>
                                {product.rating > 0 && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                    <span className="text-[10px] font-black text-amber-600">{product.rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between max-w-md text-slate-500 -ml-2">
                            <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 group hover:text-primary transition-colors">
                              <div className="p-2 rounded-full group-hover:bg-primary/10">
                                <MessageCircle className="w-[18px] h-[18px]" />
                              </div>
                              <span className="text-xs font-bold">{product.commentsCount || 0}</span>
                            </button>
                            <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 group hover:text-green-500 transition-colors">
                              <div className="p-2 rounded-full group-hover:bg-green-500/10">
                                <Repeat2 className="w-[18px] h-[18px]" />
                              </div>
                              <span className="text-xs font-bold">{product.repostsCount || 0}</span>
                            </button>
                            <button 
                              onClick={async (e) => {
                                e.stopPropagation();
                                await toggleWishlist(product._id);
                              }} 
                              className={`flex items-center gap-2 group transition-colors ${
                                isInWishlist(product._id) ? 'text-pink-500' : 'hover:text-pink-500'
                              }`}
                            >
                              <div className={`p-2 rounded-full transition-colors ${
                                isInWishlist(product._id) ? 'bg-pink-500/10' : 'group-hover:bg-pink-500/10'
                              }`}>
                                <Heart className={`w-[18px] h-[18px] ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                              </div>
                              <span className="text-xs font-bold">{product.likesCount || 0}</span>
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product._id);
                              }} 
                              className="flex items-center gap-2 group hover:text-primary transition-colors"
                            >
                              <div className="p-2 rounded-full group-hover:bg-primary/10">
                                <ShoppingCart className="w-[18px] h-[18px]" />
                              </div>
                              <span className="text-xs font-bold">Add to Cart</span>
                            </button>
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation();
                                const productUrl = `${window.location.origin}/shop/product/${product._id}`;
                                setShareModal({
                                  isOpen: true,
                                  url: productUrl,
                                  title: product.name
                                });
                              }}
                              className="p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              <Share2 className="w-[18px] h-[18px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : activeSection === 'Reviews' ? (
              <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4 text-center">
                <Star className="w-12 h-12 opacity-20" />
                <div>
                  <p className="font-black text-slate-900">No reviews yet</p>
                  <p className="text-sm">Customers haven't left any reviews for this shop yet.</p>
                </div>
              </div>
            ) : activeSection === 'Followers' ? (
              <div className="divide-y divide-slate-100">
                {isListsLoading ? (
                  <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-bold text-sm">Loading followers...</p>
                  </div>
                ) : listData.length === 0 ? (
                  <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4 text-center">
                    <Users className="w-12 h-12 opacity-20" />
                    <div>
                      <p className="font-black text-slate-900">No followers yet</p>
                      <p className="text-sm">This shop doesn't have any followers yet.</p>
                    </div>
                  </div>
                ) : (
                  (listData || []).map((follower: any) => (
                    <div key={follower._id || follower.id || Math.random()} className="p-4 md:p-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0">
                          <img 
                            src={follower.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${follower.name || 'user'}`} 
                            alt={follower.name || 'User'} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-none mb-1">{follower.name}</p>
                          <p className="text-xs font-bold text-slate-400">{follower.username ? `@${follower.username}` : `@${(follower.name || 'user').toLowerCase().replace(/\s+/g, "_")}`}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : activeSection === 'Following' ? (
              <div className="divide-y divide-slate-100">
                {isListsLoading ? (
                  <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-bold text-sm">Loading following...</p>
                  </div>
                ) : (listData || []).length === 0 ? (
                  <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4 text-center">
                    <Users className="w-12 h-12 opacity-20" />
                    <div>
                      <p className="font-black text-slate-900">Not following anyone</p>
                      <p className="text-sm">This shop isn't following anyone yet.</p>
                    </div>
                  </div>
                ) : (
                  (listData || []).map((followedShop: any) => (
                    <div 
                      key={followedShop._id || followedShop.id || Math.random()} 
                      onClick={() => (followedShop._id || followedShop.id) && router.push(`/shop/${followedShop._id || followedShop.id}`)}
                      className="p-4 md:p-6 flex items-center justify-between gap-4 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0">
                          <img 
                            src={followedShop.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${followedShop.name || 'shop'}`} 
                            alt={followedShop.name || 'Shop'} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="font-black text-slate-900 text-sm">{followedShop.name || 'Unknown Shop'}</p>
                            {followedShop.isVerified && <CheckCircle2 className="w-3 h-3 text-primary fill-primary/10" />}
                          </div>
                          <p className="text-xs font-bold text-slate-400">{followedShop.username ? `@${followedShop.username}` : `@${(followedShop.name || 'shop').toLowerCase().replace(/\s+/g, "_")}`}</p>
                        </div>
                      </div>
                      <button className="px-4 py-1.5 bg-slate-100 text-slate-900 rounded-full text-xs font-black hover:bg-slate-200 transition-all">
                        View Shop
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="p-8 md:p-12 space-y-8">
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-4">About {shop.name}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {shop.description || "No description provided."}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contact Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                        <Phone className="w-4 h-4 text-primary" />
                        {shop.phone}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                        <Mail className="w-4 h-4 text-primary" />
                        {shop.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                        <MapPin className="w-4 h-4 text-primary" />
                        {shop.address}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Store Stats</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-slate-500">Member Since</span>
                        <span className="text-slate-900">{new Date(shop.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-slate-500">Total Products</span>
                        <span className="text-slate-900">{products.length}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-slate-500">Verified</span>
                        <span className={shop.isVerified ? "text-green-600" : "text-slate-400"}>
                          {shop.isVerified ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <RatingModal 
          isOpen={ratingModal.isOpen}
          onClose={() => setRatingModal(prev => ({ ...prev, isOpen: false }))}
          productId={ratingModal.productId}
          productName={ratingModal.productName}
          initialRating={ratingModal.initialRating}
          onRatingUpdate={() => {
            // Refresh shop data or products
            window.location.reload();
          }}
        />

        <ShareModal 
          isOpen={shareModal.isOpen}
          onClose={() => setShareModal(prev => ({ ...prev, isOpen: false }))}
          url={shareModal.url}
          title={shareModal.title}
        />

        {/* Right Sidebar */}
        <div className="hidden lg:block w-[320px] shrink-0">
          <aside className="fixed top-[128px] w-[320px] h-[calc(100vh-128px)] overflow-y-auto custom-scrollbar px-6 py-6 pb-24 space-y-8">
            {/* Store Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-lg font-black text-slate-900">0.0</p>
                <div className="flex justify-center gap-0.5 my-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-2.5 h-2.5 text-slate-200" />)}
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rating</p>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-lg font-black text-slate-900">{shop?.followersCount ?? shop?.followers?.length ?? 0}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Followers</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Information</h3>
              <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight mb-0.5">Location</p>
                    <p className="text-xs font-bold text-slate-700 leading-snug">{shop.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight mb-0.5">Phone</p>
                    <p className="text-xs font-bold text-slate-700">{shop.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight mb-0.5">Email</p>
                    <p className="text-xs font-bold text-slate-700 truncate">{shop.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Stores */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Popular Stores</h3>
              <div className="space-y-1">
                {popularShops
                  .filter((s: any) => s.id !== id) // Filter out the current shop
                  .slice(0, 5) // Limit to 5 shops
                  .map((vendor: any) => (
                  <div 
                    key={vendor.id} 
                    onClick={() => router.push(`/shop/${vendor.id}`)}
                    className="p-3 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-3 rounded-xl group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-100 shrink-0">
                        <img src={vendor.avatar} alt={vendor.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-slate-900 text-sm truncate">{vendor.name}</p>
                          {vendor.verified && <CheckCircle2 className="w-3 h-3 text-primary fill-primary/10" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-slate-400 text-[11px] truncate">{vendor.handle}</p>
                          <span className="text-slate-300">·</span>
                          <p className="text-slate-400 text-[11px] font-bold">{vendor.followers} followers</p>
                        </div>
                      </div>
                    </div>
                    <button className="bg-slate-900 text-white text-[11px] font-black px-4 py-1.5 rounded-full hover:bg-primary transition-all shrink-0">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ShopProfilePage;