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
  RotateCcw,
  MessageCircle,
  Plus,
  Minus,
  CheckCircle2,
  Info
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";
      try {
        const res = await fetch(`${apiUrl}/products/${id}`);
        const data = await res.json();
        
        if (data.success) {
          setProduct(data.data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleWishlistToggle = async () => {
    const action = await toggleWishlist(product._id);
    if (action && product) {
      setProduct({
        ...product,
        likesCount: Math.max(0, (product.likesCount || 0) + (action === 'added' ? 1 : -1))
      });
    }
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
          {error || "We couldn't find the product you're looking for."}
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
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header/Navigation */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full transition-colors ${
                isInWishlist(product._id) ? 'bg-pink-50 text-pink-500' : 'hover:bg-slate-50 text-slate-400'
              }`}
            >
              <Heart className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-[3rem] overflow-hidden bg-white border border-slate-100 shadow-sm relative group">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {product.discount > 0 && (
                <div className="absolute top-8 left-8 bg-red-500 text-white px-4 py-2 rounded-2xl font-black text-sm shadow-xl shadow-red-500/20">
                  -{product.discount}% OFF
                </div>
              )}
            </div>
            
            {/* Thumbnail selector - if multiple images existed */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {[product.image, product.image, product.image].map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === idx ? 'border-primary' : 'border-transparent bg-white'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Link 
                  href={`/shop/${product.shop?._id}`}
                  className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-wider hover:bg-primary/20 transition-colors"
                >
                  {product.shop?.name || "Official Store"}
                </Link>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold">4.8</span>
                  <span className="text-slate-400 font-medium">(120 reviews)</span>
                </div>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <div className="flex items-center gap-1 text-pink-500">
                  <Heart className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold">{product.likesCount || 0}</span>
                  <span className="text-slate-400 font-medium text-xs">likes</span>
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl font-black text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-xl text-slate-300 font-bold line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>

              <p className="text-slate-500 font-medium leading-relaxed text-lg mb-8">
                {product.description || "Premium quality product with exceptional features and durable construction. Perfect for daily use and designed to meet all your needs with style and efficiency."}
              </p>

              {/* Options - Size/Color (Static for now) */}
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Select Color</h4>
                  <div className="flex gap-3">
                    {['bg-slate-900', 'bg-blue-500', 'bg-red-500'].map((color, idx) => (
                      <button 
                        key={idx}
                        className={`w-10 h-10 rounded-full border-2 ${idx === 0 ? 'border-primary p-0.5' : 'border-transparent'}`}
                      >
                        <div className={`w-full h-full rounded-full ${color}`}></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-6 mb-10">
                <div className="flex items-center bg-white border border-slate-100 rounded-2xl p-1 shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <Minus className="w-5 h-5 text-slate-600" />
                  </button>
                  <span className="w-12 text-center font-black text-slate-900 text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <Plus className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
                <div className="text-slate-400 font-bold">
                  Only <span className="text-primary">8 items</span> left!
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={() => addToCart(product._id, quantity)}
                  className="flex-1 bg-slate-900 text-white h-16 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl shadow-slate-900/10 hover:shadow-primary/20"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </button>
                <button 
                  onClick={handleWishlistToggle}
                  className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all border ${
                    isInWishlist(product._id) 
                      ? 'bg-pink-50 border-pink-100 text-pink-500 shadow-lg shadow-pink-500/10' 
                      : 'bg-white border-slate-100 text-slate-400 hover:border-pink-200 hover:text-pink-500'
                  }`}
                >
                  <Heart className={`w-7 h-7 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Features/Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3 p-4 bg-white rounded-3xl border border-slate-100">
                <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-900 uppercase">Authentic</h5>
                  <p className="text-[10px] text-slate-400 font-bold">100% Genuine</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-3xl border border-slate-100">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-900 uppercase">Fast Delivery</h5>
                  <p className="text-[10px] text-slate-400 font-bold">Within 24 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-3xl border border-slate-100">
                <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-900 uppercase">Easy Returns</h5>
                  <p className="text-[10px] text-slate-400 font-bold">30-day policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs/Description Detail */}
        <div className="mt-20">
          <div className="flex border-b border-slate-100 mb-10 overflow-x-auto scrollbar-hide">
            {['Description', 'Specifications', 'Reviews (120)'].map((tab, idx) => (
              <button 
                key={tab}
                className={`px-8 py-4 font-black text-sm uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${
                  idx === 0 ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="max-w-3xl">
            <h3 className="text-2xl font-black text-slate-900 mb-6">Product Experience</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-lg mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <ul className="space-y-4">
              {[
                "High-performance materials for long-lasting durability",
                "Ergonomic design optimized for maximum comfort",
                "Eco-friendly manufacturing process and sustainable packaging",
                "Versatile style that complements any outfit or occasion"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-40 flex gap-4">
        <button 
          onClick={() => addToCart(product._id, quantity)}
          className="flex-1 bg-slate-900 text-white h-14 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-slate-900/10"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
        <button 
          onClick={handleWishlistToggle}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
            isInWishlist(product._id) 
              ? 'bg-pink-50 border-pink-100 text-pink-500' 
              : 'bg-white border-slate-100 text-slate-400'
          }`}
        >
          <Heart className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
