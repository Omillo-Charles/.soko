"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
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

const ShopProfilePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopData = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";
      try {
        // Fetch shop details
        const shopRes = await fetch(`${apiUrl}/shops/${id}`);
        const shopData = await shopRes.json();
        
        if (shopData.success) {
          setShop(shopData.data);
          
          // Fetch shop products
          const productsRes = await fetch(`${apiUrl}/products?shop=${id}`);
          const productsData = await productsRes.json();
          
          if (productsData.success) {
            setProducts(productsData.data);
          }
        } else {
          setError("Shop not found");
        }
      } catch (err) {
        console.error("Error fetching shop data:", err);
        setError("Failed to load shop profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchShopData();
    }
  }, [id]);

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
          <aside className="fixed w-[280px] h-screen overflow-y-auto custom-scrollbar px-6 py-6 space-y-8">
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
                  { name: 'Products', icon: <ShoppingBag className="w-5 h-5" />, active: true },
                  { name: 'Reviews', icon: <Star className="w-5 h-5" />, active: false },
                  { name: 'About', icon: <Info className="w-5 h-5" />, active: false },
                ].map((item) => (
                  <button 
                    key={item.name}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      item.active ? 'text-primary bg-primary/5' : 'text-slate-600 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>

       {/* Middle Feed - Products */}
        <main className="flex-1 min-w-0 border-x border-slate-100 pb-24 lg:pb-0">
          {/* Header - Profile Style */}
          <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-100 px-4 py-4 flex items-center gap-4">
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
                  <button className="px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-black hover:bg-primary transition-all">
                    Follow
                  </button>
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
                <p className="text-sm font-bold text-slate-500">@{shop.name.toLowerCase().replace(/\s+/g, "_")}</p>
              </div>

              <p className="mt-4 text-[13px] text-slate-600 font-medium leading-relaxed max-w-2xl">
                {shop.description}
              </p>
            </div>
          </div>

          {/* Product Feed */}
          <div className="border-t border-slate-100">
            {products.length === 0 ? (
              <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4 text-center">
                <ShoppingBag className="w-12 h-12 opacity-20" />
                <div>
                  <p className="font-black text-slate-900">No products found</p>
                  <p className="text-sm">This shop hasn't posted any products yet.</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {products.map((product) => (
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
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-sm font-black text-slate-900 truncate flex items-center gap-1">
                            {shop.name}
                            {shop.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/10" />}
                          </span>
                          <span className="text-slate-500 text-xs truncate">@{shop.name.toLowerCase().replace(/\s+/g, "_")}</span>
                        </div>

                        <p className="text-slate-800 text-[13px] leading-relaxed mb-3 whitespace-pre-wrap">
                          {product.description}
                        </p>

                        {product.image && (
                          <div className="rounded-2xl overflow-hidden border border-slate-100 mb-3 bg-slate-50 relative aspect-video group/img">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover group-hover/img:scale-[1.02] transition-transform duration-500" 
                            />
                            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-xl">
                              <span className="text-primary font-black text-sm">KES {product.price?.toLocaleString()}</span>
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
                              const action = await toggleWishlist(product._id);
                              if (action) {
                                setProducts(prev => prev.map(p => 
                                  p._id === product._id 
                                    ? { ...p, likesCount: Math.max(0, (p.likesCount || 0) + (action === 'added' ? 1 : -1)) } 
                                    : p
                                ));
                              }
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
                          <button onClick={(e) => e.stopPropagation()} className="p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                            <Share2 className="w-[18px] h-[18px]" />
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

        {/* Right Sidebar */}
        <div className="hidden lg:block w-[320px] shrink-0">
          <aside className="fixed w-[320px] h-screen overflow-y-auto custom-scrollbar px-6 py-6 space-y-8">
            {/* Store Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-lg font-black text-slate-900">4.9</p>
                <div className="flex justify-center gap-0.5 my-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-2.5 h-2.5 fill-primary text-primary" />)}
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rating</p>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-lg font-black text-slate-900">1.2k</p>
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
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-3 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-3 rounded-xl group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-100">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Shop${i}`} alt="Shop" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-sm truncate">Similar Shop {i}</p>
                        <p className="text-slate-400 text-[11px] truncate">@similar_shop_{i}</p>
                      </div>
                    </div>
                    <button className="bg-slate-900 text-white text-[11px] font-black px-4 py-1.5 rounded-full hover:bg-primary transition-all shrink-0">
                      Follow
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