"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Truck, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Info, 
  Trash2, 
  MessageSquare as MessageIcon,
  ShoppingBag,
  TrendingUp,
  LayoutGrid,
  Filter,
  Search,
  ArrowRight,
  Repeat2
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUser } from "@/hooks/useUser";
import { useComments } from "@/hooks/useComments";
import { usePopularShops, useFollowShop, useMyShop } from "@/hooks/useShop";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { categories as allCategories } from "@/constants/categories";
import ProductRating from "@/components/ProductRating";
import ShareModal from "@/components/ShareModal";
import CommentModal from "@/components/CommentModal";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user: currentUser } = useUser();
  const { data: myShop } = useMyShop();
  const { data: popularShopsData } = usePopularShops();
  const followMutation = useFollowShop();
  
  const { data: product, isLoading, error } = useProduct(id as string);
  const [quantity, setQuantity] = useState(1);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { comments, isLoading: isCommentsLoading, deleteComment } = useComments(id as string);
  const { data: productsData, isLoading: isProductsLoading } = useProducts({ limit: 6 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const popularShops = React.useMemo(() => {
    return (popularShopsData || []).map((s: any) => ({
      id: s._id || s.id || `shop-${Math.random()}`,
      name: s.name || "Unknown Shop",
      handle: s.username ? `@${s.username}` : null,
      avatar: s.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name || "shop"}`,
      followers: s.followersCount || s.followers?.length || 0,
      verified: s.isVerified || false,
      followersList: s.followers || [],
      products: s.productsCount || s.products?.length || 0
    }));
  }, [popularShopsData]);

  const handleFollowToggle = async (shopId: string) => {
    if (!currentUser) {
      router.push("/auth?mode=login");
      return;
    }
    try {
      await followMutation.mutateAsync(shopId);
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleWishlistToggle = async () => {
    await toggleWishlist(product._id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
          <Info className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Oops!</h1>
        <p className="text-slate-500 font-medium mb-8 text-center max-w-md">
          {error instanceof Error ? error.message : (error || "Product not found")}
        </p>
        <button onClick={() => router.push("/shop")} className="px-8 py-3 bg-primary text-white rounded-full font-bold">Back to Shop</button>
      </div>
    );
  }

  const categories = allCategories.filter(c => c.value !== 'all');

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr_320px]">
        
        {/* Left Sidebar - Categories */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <aside className="fixed top-[128px] w-[280px] h-[calc(100vh-128px)] overflow-y-auto custom-scrollbar px-6 py-6 pb-24 space-y-8">
            <button 
              onClick={() => router.push('/shop')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-primary hover:bg-primary/5 transition-all group w-full"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Explore
            </button>

            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <Link 
                    key={category.value}
                    href={`/shop?cat=${category.value}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-primary hover:bg-primary/5 transition-all group"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">{(category as any).icon}</span>
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Middle Feed - Product Detail */}
        <main className="flex-1 min-w-0 border-x border-slate-100 pb-24 lg:pb-0">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-[100px] bg-white/80 backdrop-blur-md z-30 border-b border-slate-100 px-4 py-4 flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-black text-slate-900 truncate">{product.name}</h1>
          </div>

          <div className="p-4 md:p-8 space-y-12">
            {/* Main Product Info Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="flex flex-col">
                {/* 1. Shop Name Header */}
                <div className="p-5 md:px-8 md:pt-8 md:pb-3 flex items-center justify-between">
                  <Link href={`/shop/${product.shop?._id}`} className="group flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-50 shadow-sm">
                      <img src={product.shop?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${product.shop?.name}`} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors flex items-center gap-1.5">
                        {product.shop?.name || "Official Store"}
                        {product.shop?.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/10" />}
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Visit Shop</p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2">
                    <button onClick={handleWishlistToggle} className={`p-2 rounded-full hover:bg-slate-50 transition-all ${isInWishlist(product._id) ? 'text-pink-500 bg-pink-50' : 'text-slate-300'}`}>
                      <Heart className={`w-4.5 h-4.5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                    </button>
                    <button onClick={() => setIsShareModalOpen(true)} className="p-2 rounded-full hover:bg-slate-50 text-slate-300 transition-all">
                      <Share2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                {/* 2. Photo Section */}
                <div className="px-4 md:px-8 py-2">
                  <div className="aspect-square md:aspect-video max-h-[500px] rounded-[1.5rem] overflow-hidden bg-slate-50/50 shadow-inner group relative flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-lg border border-white/20">
                      <span className="text-lg font-black text-primary">{formatPrice(product.price)}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Description & Info Section */}
                <div className="p-5 md:p-8 space-y-6">
                  <div className="space-y-3">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">{product.name}</h1>
                    <p className="text-slate-500 leading-relaxed text-sm md:text-base font-medium max-w-3xl">{product.description}</p>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                      <ProductRating 
                        productId={product._id} 
                        initialRating={product.rating}
                        initialReviewsCount={product.reviewsCount}
                      />
                      
                      <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-100/50 max-w-md">
                        <div className="text-[10px] font-black text-slate-900 uppercase tracking-[0.1em]">Select Quantity</div>
                        <div className="flex items-center bg-white rounded-lg p-0.5 shadow-sm border border-slate-100">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1.5 hover:bg-slate-50 rounded-md transition-all"><Minus className="w-3.5 h-3.5 text-slate-600" /></button>
                          <span className="w-10 text-center text-xs font-black text-slate-900">{quantity}</span>
                          <button onClick={() => setQuantity(quantity + 1)} className="p-1.5 hover:bg-slate-50 rounded-md transition-all"><Plus className="w-3.5 h-3.5 text-slate-600" /></button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 max-w-md">
                      <button 
                        onClick={() => addToCart(product._id, quantity)}
                        className="w-full bg-slate-900 text-white h-14 rounded-xl font-black text-sm flex items-center justify-center gap-3 hover:bg-primary transition-all active:scale-[0.98] shadow-lg shadow-slate-900/10"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart — {formatPrice(product.price * quantity)}
                      </button>
                      
                      <div className="flex items-center justify-center gap-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pt-2">
                        <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Secure</div>
                        <div className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Delivery</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reordered Sections: Comments first, then Recommended */}
            
            {/* Comments Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Community Feedback</h2>
                  <p className="text-sm font-bold text-slate-500 mt-1">{comments.length} comments</p>
                </div>
                <button 
                  onClick={() => setIsCommentModalOpen(true)}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl font-black text-xs hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Write Comment
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isCommentsLoading ? (
                  [1, 2].map(i => <div key={i} className="h-32 bg-slate-50 rounded-2xl animate-pulse" />)
                ) : comments.length > 0 ? (
                  comments.map((comment: any) => (
                    <div key={comment._id} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-3 relative group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-slate-100">
                          <img src={comment.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${comment.user?.name}`} alt="" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{comment.user?.name}</p>
                          <p className="text-[10px] font-bold text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">{comment.content}</p>
                      {currentUser && currentUser._id === comment.user?._id && (
                        <button 
                          onClick={() => deleteComment(comment._id)}
                          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-2 py-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                    <p className="text-sm font-bold text-slate-400">No comments yet. Be the first!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Products Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Recommended for You</h2>
                <Link href="/shop" className="text-sm font-bold text-primary hover:underline">View All</Link>
              </div>

              <div className="divide-y divide-slate-100 bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                {isProductsLoading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-40 animate-pulse bg-slate-50" />)
                ) : productsData?.map((p: any) => (
                  <div 
                    key={p._id} 
                    onClick={() => router.push(`/shop/product/${p._id}`)}
                    className="p-4 md:p-6 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex gap-4 md:gap-6">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-sm md:text-base font-black text-slate-900 truncate group-hover:text-primary transition-colors">{p.name}</h3>
                            <span className="text-sm font-black text-primary shrink-0">{formatPrice(p.price)}</span>
                          </div>
                          <p className="text-xs md:text-sm font-medium text-slate-500 line-clamp-2 mt-1">{p.description}</p>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] md:text-xs font-bold text-slate-400">
                          <div className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {p.likesCount || 0}</div>
                          <div className="flex items-center gap-1"><MessageIcon className="w-3.5 h-3.5" /> {p.commentsCount || 0}</div>
                          {p.rating > 0 && <div className="flex items-center gap-1 text-amber-500"><Star className="w-3.5 h-3.5 fill-current" /> {p.rating}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Popular Shops */}
        <div className="hidden lg:block w-[320px] shrink-0">
          <aside className="fixed top-[128px] w-[320px] h-[calc(100vh-128px)] overflow-y-auto custom-scrollbar px-6 py-6 pb-24 space-y-8">
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
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] font-bold text-slate-500">{vendor.followers} followers</p>
                        </div>
                      </div>
                    </div>
                    {isMounted && currentUser && (!myShop || String(myShop._id || myShop.id) !== String(vendor.id)) && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleFollowToggle(vendor.id); }}
                        className={`text-[10px] font-black px-4 py-1.5 rounded-full transition-all ${
                          vendor.followersList?.includes(currentUser?._id) 
                            ? 'bg-slate-100 text-slate-900 hover:bg-red-50 hover:text-red-600' 
                            : 'bg-slate-900 text-white hover:bg-primary'
                        }`}
                      >
                        {vendor.followersList?.includes(currentUser?._id) ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

      </div>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        url={isMounted ? window.location.href : ''} 
        title={product.name} 
      />
      <CommentModal 
        isOpen={isCommentModalOpen} 
        onClose={() => setIsCommentModalOpen(false)} 
        productId={product._id} 
        productName={product.name} 
      />
    </div>
  );
};

export default ProductDetailsPage;
