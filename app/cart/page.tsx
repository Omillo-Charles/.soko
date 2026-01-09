"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  CreditCard,
  ChevronRight,
  Store
} from 'lucide-react';

// Mock cart data based on featured products
const INITIAL_CART_ITEMS = [
  {
    id: 1,
    title: "Adidas Predator Football Boots",
    price: 17150,
    vendor: "Adidas Kenya",
    image: "/products/predator.jpg",
    quantity: 1,
    size: "42",
    color: "Core Black"
  },
  {
    id: 3,
    title: "Inter and AC Milan Jersey",
    price: 11850,
    vendor: "Adidas Kenya",
    image: "/products/jersey.jpg",
    quantity: 2,
    size: "L",
    color: "Home Kit"
  }
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const [promoCode, setPromoCode] = useState("");

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingThreshold = 6500;
  const shippingFee = 500;
  const shipping = subtotal > shippingThreshold ? 0 : shippingFee;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString()}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-primary/5 flex flex-col items-center gap-6 border border-slate-100 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-slate-300" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your cart is empty</h2>
            <p className="text-slate-500 font-medium">Looks like you haven't added anything to your cart yet.</p>
          </div>
          <Link 
            href="/shop" 
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-primary/20"
          >
            Start Shopping
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full px-4 md:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-semibold text-sm mb-2">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Your Cart
              <span className="text-lg font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Product Image */}
                  <div className="relative w-full sm:w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                          <Store className="w-3 h-3" />
                          {item.vendor}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                          {item.title}
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                          {item.size && (
                            <span className="text-xs font-bold text-slate-400">
                              SIZE: <span className="text-slate-600">{item.size}</span>
                            </span>
                          )}
                          {item.color && (
                            <span className="text-xs font-bold text-slate-400">
                              COLOR: <span className="text-slate-600">{item.color}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-primary rounded-lg transition-all disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-primary rounded-lg transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-slate-900">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <div className="text-xs font-bold text-slate-400">
                          {formatPrice(item.price)} each
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Trust Badges - Hidden on mobile, shown on desktop here */}
            <div className="hidden lg:grid grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Fast Delivery</div>
                  <div className="text-xs text-slate-500">2-3 business days</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Buyer Protection</div>
                  <div className="text-xs text-slate-500">Secure transactions</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Easy Payment</div>
                  <div className="text-xs text-slate-500">Multiple options</div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-primary/5 sticky top-32">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-slate-500 font-bold">
                  <span>Subtotal</span>
                  <span className="text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-bold">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : "text-slate-900"}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                    <p className="text-[10px] text-primary font-bold leading-tight">
                      Add {formatPrice(shippingThreshold - subtotal)} more for FREE shipping!
                    </p>
                  </div>
                )}
                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-slate-900 font-bold">Total</span>
                  <div className="text-right">
                    <div className="text-xl font-black text-primary leading-none">
                      {formatPrice(total)}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold tracking-wider uppercase">VAT INCLUDED</p>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-8">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                  Promo Code
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="text" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm min-w-0"
                  />
                  <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shrink-0">
                    Apply
                  </button>
                </div>
              </div>

              <button className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-primary/20 group">
                Checkout Now
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-center justify-center gap-4 grayscale opacity-40">
                  {/* Payment Methods Icons Mockup */}
                  <div className="w-10 h-6 bg-slate-200 rounded"></div>
                  <div className="w-10 h-6 bg-slate-200 rounded"></div>
                  <div className="w-10 h-6 bg-slate-200 rounded"></div>
                  <div className="w-10 h-6 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* Trust Badges - Shown on mobile here, hidden on desktop */}
            <div className="grid lg:hidden grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Fast Delivery</div>
                  <div className="text-xs text-slate-500">2-3 business days</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Buyer Protection</div>
                  <div className="text-xs text-slate-500">Secure transactions</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Easy Payment</div>
                  <div className="text-xs text-slate-500">Multiple options</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default CartPage;
