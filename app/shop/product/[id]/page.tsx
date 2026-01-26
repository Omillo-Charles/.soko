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
  Info,
  Trash2,
  MessageSquare as MessageIcon
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUser } from "@/hooks/useUser";
import { useComments } from "@/hooks/useComments";
import ProductRating from "@/components/ProductRating";
import ShareModal from "@/components/ShareModal";
import CommentModal from "@/components/CommentModal";

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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const { user } = useUser();
  const { comments, isLoading: isCommentsLoading, deleteComment } = useComments(id as string);

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
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
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
    <div className="min-h-screen bg-white pb-20">
      {/* Header/Navigation */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-50 sticky top-[100px] md:top-[128px] z-30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleWishlistToggle}
              className={`transition-colors ${
                isInWishlist(product._id) ? 'text-pink-500' : 'text-slate-300 hover:text-slate-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="text-slate-300 hover:text-slate-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          {/* Image Section */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="space-y-6">
              {/* Vendor & Meta */}
              <div className="flex items-center justify-between">
                <Link 
                  href={`/shop/${product.shop?._id}`}
                  className="group flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-50">
                    <img 
                      src={product.shop?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${product.shop?.name}`} 
                      className="w-full h-full object-cover" 
                      alt="" 
                    />
                  </div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors flex items-center gap-1">
                    {product.shop?.name || "Official Store"}
                    {product.shop?.isVerified && <CheckCircle2 className="w-3 h-3 text-primary fill-primary/10" />}
                  </div>
                </Link>

                <div className="flex items-center gap-3">
                  {(product.rating > 0) && (
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold">{product.rating}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-slate-400">
                    <Heart className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{product.likesCount || 0}</span>
                  </div>
                </div>
              </div>

              {/* Title & Price */}
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h1>
                <div className="text-xl font-bold text-primary">
                  {formatPrice(product.price)}
                </div>
              </div>

              {/* Description Short */}
              <p className="text-slate-500 leading-relaxed text-sm font-medium">
                {product.description}
              </p>

              {/* Product Rating Interaction */}
              <ProductRating 
                productId={product._id} 
                initialRating={product.rating}
                initialReviewsCount={product.reviewsCount}
                onRatingUpdate={(newRating, newCount) => {
                  setProduct({
                    ...product,
                    rating: newRating,
                    reviewsCount: newCount
                  });
                }}
              />

              {/* Selection Controls */}
              <div className="pt-2 space-y-4">
                <div className="flex items-center justify-between border-y border-slate-50 py-4">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quantity</div>
                  <div className="flex items-center bg-slate-50 rounded-lg p-0.5">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all"
                    >
                      <Minus className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-slate-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all"
                    >
                      <Plus className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Main Action */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => addToCart(product._id, quantity)}
                    className="flex-1 bg-slate-900 text-white h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary transition-all active:scale-[0.98]"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button 
                    onClick={handleWishlistToggle}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                      isInWishlist(product._id) 
                        ? 'bg-pink-50 border-pink-100 text-pink-500' 
                        : 'bg-white border-slate-100 text-slate-300 hover:border-slate-200 hover:text-slate-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Secure
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    Fast Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-20 border-t border-slate-100 pt-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                Community Feedback
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">
                  {comments.length}
                </span>
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Hear what others are saying about this product
              </p>
            </div>
            <button 
              onClick={() => setIsCommentModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm shadow-sm"
            >
              <MessageIcon className="w-4 h-4 text-primary" />
              Write a Comment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isCommentsLoading ? (
              [1, 2].map((i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-6 animate-pulse h-40"></div>
              ))
            ) : comments.length > 0 ? (
              comments.map((comment: any) => (
                <div 
                  key={comment._id} 
                  className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-50 shrink-0">
                        <img 
                          src={comment.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${comment.user?.name}`} 
                          className="w-full h-full object-cover" 
                          alt="" 
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {comment.user?.name}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    {user && user._id === comment.user?._id && (
                      <button 
                        onClick={() => deleteComment(comment._id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="md:col-span-2 bg-slate-50 rounded-3xl p-12 text-center border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <MessageIcon className="w-8 h-8 text-slate-200" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No comments yet</h3>
                <p className="text-slate-500 text-sm font-medium mb-6">Be the first to share your thoughts on this product!</p>
                <button 
                  onClick={() => setIsCommentModalOpen(true)}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-sm shadow-lg shadow-primary/20"
                >
                  Post First Comment
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modals */}
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        title={product.name}
      />

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        productId={product._id}
        productName={product.name}
      />

      {/* Mobile Sticky Action */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-50 p-4 z-40">
        <div className="max-w-6xl mx-auto flex gap-3">
          <button 
            onClick={() => addToCart(product._id, quantity)}
            className="flex-1 bg-slate-900 text-white h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <button 
            onClick={handleWishlistToggle}
            className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
              isInWishlist(product._id) 
                ? 'bg-pink-50 border-pink-100 text-pink-500' 
                : 'bg-white border-slate-100 text-slate-300'
            }`}
          >
            <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={typeof window !== "undefined" ? window.location.href : ""}
        title={product.name}
      />
    </div>
  );
};

export default ProductDetailsPage;
