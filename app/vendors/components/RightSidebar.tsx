"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  TrendingUp, 
  Store, 
  Star, 
  ChevronRight,
  Facebook,
  Instagram,
  Youtube,
  Search,
  BadgeCheck,
  X
} from 'lucide-react';

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
  </svg>
);

const RightSidebar = () => {
  const topVendors = [
    { name: "TechGiant", rating: 4.9, color: "bg-blue-500", icon: Store },
    { name: "StyleVault", rating: 4.8, color: "bg-purple-500", icon: Store },
    { name: "HomeHaven", rating: 4.7, color: "bg-emerald-500", icon: Store },
  ];

  const topProducts = [
    { name: "M3 MacBook Air", price: "145k", image: "/categories/computer accessories/computer.jpg" },
    { name: "Urban Sneakers", price: "8.5k", image: "/categories/footwear/footwear.jpg" },
    { name: "Desk Organizer", price: "3.2k", image: "/categories/home decor/decor.jpg" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[350px] h-[calc(100vh-80px)] fixed top-20 right-0 p-6 gap-6 overflow-y-auto no-scrollbar border-l border-slate-50 bg-white z-30">
      {/* Search Bar Widget */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Search Products..." 
          className="w-full bg-slate-100 border-none rounded-full py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
        />
      </div>

      {/* Top Vendors Section */}
      <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
          Top Vendors <BadgeCheck className="w-5 h-5 text-primary" />
        </h3>
        <div className="space-y-4">
          {topVendors.map((vendor) => (
            <div key={vendor.name} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${vendor.color} rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform`}>
                  <vendor.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-sm text-slate-900">{vendor.name}</div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-tighter">
                    <Star className="w-3 h-3 fill-amber-500" /> {vendor.rating} Verified
                  </div>
                </div>
              </div>
              <button className="bg-white p-2 rounded-full border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button className="w-full mt-6 text-primary text-xs font-black uppercase tracking-widest hover:underline transition-all">
          Show More
        </button>
      </div>

      {/* Top Products Section */}
      <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
          Trending <TrendingUp className="w-5 h-5 text-rose-500" />
        </h3>
        <div className="space-y-4">
          {topProducts.map((product) => (
            <div key={product.name} className="flex items-center gap-4 group cursor-pointer">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-sm text-slate-900 truncate">{product.name}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">KSh {product.price}</div>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest mt-1 hover:underline">
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social & Links Section */}
      <div className="px-4 py-2">
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
          {['Terms', 'Privacy', 'Cookie Policy', 'Accessibility', 'Ads Info', '© 2026 Duuka'].map((link) => (
            <span key={link} className="text-[10px] font-bold text-slate-400 hover:underline cursor-pointer uppercase tracking-tighter">{link}</span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <Link href="#" className="hover:text-primary transition-colors"><XIcon /></Link>
          <Link href="#" className="hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></Link>
          <Link href="#" className="hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></Link>
          <Link href="#" className="hover:text-primary transition-colors"><Youtube className="w-5 h-5" /></Link>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;