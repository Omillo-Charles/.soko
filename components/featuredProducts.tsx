"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, ChevronRight, Heart, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useFeaturedProducts } from "@/hooks/useProducts";

const FeaturedProducts = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const { data: products = [], isLoading } = useFeaturedProducts(4);


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
          {(products || []).map((p: any) => (
            <div key={p._id || Math.random()} className="bg-white border border-slate-200 rounded-lg overflow-hidden group">
              <div className="relative h-32 md:h-40 bg-slate-100 cursor-pointer" onClick={() => p._id && router.push(`/shop/product/${p._id}`)}>
                <Image
                  src={p.image || "/placeholder-product.jpg"}
                  alt={p.name || "Product"}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    p._id && addToCart(p._id);
                  }}
                  className="absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-all hover:scale-110 active:scale-95 z-10"
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-4 h-4 text-slate-700" />
                </button>
                <button 
                  onClick={async (e) => {
                    e.stopPropagation();
                    p._id && await toggleWishlist(p._id);
                  }}
                  className={`absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-all hover:scale-110 z-10 ${
                    p._id && isInWishlist(p._id) ? 'text-pink-500' : 'text-slate-700'
                  }`}
                  title={p._id && isInWishlist(p._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`w-4 h-4 ${p._id && isInWishlist(p._id) ? 'fill-current' : ''}`} />
                </button>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-[10px] text-slate-400 ml-1">({p.rating || "4.5"})</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors cursor-pointer" onClick={() => p._id && router.push(`/shop/product/${p._id}`)}>
                  {p.name || "Untitled Product"}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-slate-900">KES {(p.price || 0).toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 line-through">KES {((p.price || 0) * 1.2).toLocaleString()}</span>
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
