"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { 
  Heart, 
  Trash2, 
  ArrowLeft, 
  ShoppingBag, 
  ChevronRight,
  Loader2,
  ShoppingCart
} from 'lucide-react';

const WishlistPage = () => {
  const { wishlistItems, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return `KES ${price?.toLocaleString() || 0}`;
  };

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-128px)] bg-background flex flex-col items-center justify-center p-4">
        <div className="bg-background p-12 rounded-[2.5rem] shadow-2xl shadow-primary/5 flex flex-col items-center gap-6 border border-border max-w-md w-full text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-muted-foreground/30" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground tracking-tight">Your wishlist is empty</h2>
            <p className="text-muted-foreground font-medium">Start adding items you love to your wishlist!</p>
          </div>
          <Link 
            href="/shop" 
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
          >
            Explore Products
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-20 pt-4 md:pt-10">
      <div className="w-full px-4 md:px-8 py-4 md:py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-semibold text-sm mb-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </Link>
            <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
              My Wishlist
              <span className="text-lg font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
              </span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {wishlistItems.map((product: any) => (
            <div key={product._id} className="group bg-background rounded-[2.5rem] p-6 border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
              <div className="flex gap-6">
                {/* Product Image */}
                <div 
                    onClick={() => router.push(`/shop/product/${product._id}`)}
                    className="relative w-32 aspect-square rounded-[1.25rem] overflow-hidden bg-muted border border-border shrink-0 cursor-pointer flex items-center justify-center"
                  >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 
                        onClick={() => router.push(`/shop/product/${product._id}`)}
                        className="font-black text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2 cursor-pointer"
                      >
                        {product.name}
                      </h3>
                      <button 
                        onClick={() => removeFromWishlist(product._id)}
                        className="text-muted-foreground/40 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    {product.shop && (
                      <Link 
                        href={`/shop/${product.shop.username ? `@${product.shop.username}` : product.shop._id || product.shop.id}`}
                        className="text-muted-foreground text-xs font-bold mt-1 uppercase tracking-wider flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        {product.shop.name}
                        {product.shop.username && (
                          <span className="text-[10px] lowercase tracking-normal opacity-70">
                            @{product.shop.username}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-black text-primary">
                      {formatPrice(product.price)}
                    </span>
                    <button 
                      onClick={() => addToCart(product._id)}
                      className="bg-foreground text-background p-3 rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all shadow-lg shadow-foreground/10 hover:shadow-primary/20"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
