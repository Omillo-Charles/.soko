"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, ChevronRight, Heart, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const FeaturedProducts = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";
      try {
        const response = await fetch(`${apiUrl}/products`);
        const data = await response.json();
        if (data.success) {
          // Take the first 4 products as featured
          setProducts(data.data.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="bg-muted py-12">
        <div className="flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-muted">
      <div className="w-full px-4 md:px-8 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">Featured Products</h2>
          <Link href="/shop" className="text-primary flex items-center gap-1 font-medium">
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p._id} className="bg-white border border-slate-200 rounded-lg overflow-hidden group">
              <div className="relative h-32 md:h-40 bg-slate-100 cursor-pointer" onClick={() => router.push(`/shop/product/${p._id}`)}>
                <Image
                  src={p.image || "/placeholder-product.jpg"}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p._id);
                  }}
                  className="absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-all hover:scale-110 active:scale-95 z-10"
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-4 h-4 text-slate-700" />
                </button>
                <button 
                  onClick={async (e) => {
                    e.stopPropagation();
                    const action = await toggleWishlist(p._id);
                    if (action) {
                      setProducts(prev => prev.map(item => 
                        item._id === p._id 
                          ? { ...item, likesCount: Math.max(0, (item.likesCount || 0) + (action === 'added' ? 1 : -1)) } 
                          : item
                      ));
                    }
                  }}
                  className={`absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-all hover:scale-110 z-10 ${
                    isInWishlist(p._id) ? 'text-pink-500' : 'text-slate-700'
                  }`}
                  title={isInWishlist(p._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(p._id) ? 'fill-current' : ''}`} />
                </button>
              </div>
              <div className="p-4 cursor-pointer" onClick={() => router.push(`/shop/product/${p._id}`)}>
                <div className="flex justify-between items-start">
                  <div className="text-xs text-slate-500">{p.shop?.name || "Official Store"}</div>
                  <div className="flex items-center gap-1 text-pink-500">
                    <Heart className={`w-3 h-3 ${isInWishlist(p._id) ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-bold">{p.likesCount || 0}</span>
                  </div>
                </div>
                <div className="mt-1 font-medium truncate group-hover:text-primary transition-colors">{p.name}</div>
                <div className="mt-1 text-xs text-slate-500 font-light line-clamp-2 h-8">{p.description}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-bold">KES {p.price.toLocaleString()}</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4" />
                  <span className="ml-2 text-xs text-slate-500">{p.rating || 4.5} / 5</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
