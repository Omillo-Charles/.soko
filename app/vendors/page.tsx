"use client";

import React from 'react';
import Image from 'next/image';
import RightSidebar from './components/RightSidebar';
import { 
  MessageCircle, 
  Heart, 
  Repeat2, 
  ShoppingCart, 
  MoreHorizontal,
  BadgeCheck,
  Share
} from 'lucide-react';

const VendorsPage = () => {
  const feedProducts = [
    {
      id: 1,
      vendor: "TechGiant",
      handle: "@techgiant_ke",
      avatar: "T",
      verified: true,
      time: "2h",
      description: "The new M3 MacBook Air is finally here! 💻 Experience unbelievable speed and all-day battery life. Available now in Midnight, Starlight, and Space Gray. #Apple #MacBookAir #TechDeals",
      image: "/categories/computer accessories/computer.jpg",
      likes: "1.2K",
      comments: "84",
      reposts: "156",
      cartCount: "12",
      price: "KSh 145,000"
    },
    {
      id: 2,
      vendor: "StyleVault",
      handle: "@stylevault",
      avatar: "S",
      verified: true,
      time: "4h",
      description: "Step into the weekend with our latest collection of urban sneakers. 👟 Premium comfort meets street style. Limited stock available! #Fashion #Sneakers #Streetwear",
      image: "/categories/footwear/footwear.jpg",
      likes: "856",
      comments: "42",
      reposts: "98",
      cartCount: "45",
      price: "KSh 8,500"
    },
    {
      id: 3,
      vendor: "HomeHaven",
      handle: "@homehaven",
      avatar: "H",
      verified: false,
      time: "6h",
      description: "Transform your workspace with our minimalist desk organizers. 🌿 Stay productive and keep your aesthetic on point. #HomeOffice #Organization #InteriorDesign",
      image: "/categories/home decor/decor.jpg",
      likes: "432",
      comments: "21",
      reposts: "45",
      cartCount: "8",
      price: "KSh 3,200"
    }
  ];

  return (
    <div className="flex flex-1 w-full lg:pr-[350px] overflow-hidden">
      <main className="flex-1 max-w-2xl border-r border-slate-100 min-h-screen min-w-0 overflow-y-auto no-scrollbar pb-20 md:pb-0">
        {/* Feed List */}
        <div className="divide-y divide-slate-100">
          {feedProducts.map((product) => (
            <article key={product.id} className="p-6 hover:bg-slate-50/50 transition-colors cursor-pointer group">
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-slate-200">
                  {product.avatar}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <span className="font-black text-slate-900 hover:underline">{product.vendor}</span>
                      {product.verified && <BadgeCheck className="w-4 h-4 text-primary fill-primary/10" />}
                      <span className="text-slate-500 text-sm ml-1">{product.handle} · {product.time}</span>
                    </div>
                    <button className="text-slate-400 hover:text-primary p-1 rounded-full hover:bg-primary/5">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-slate-800 leading-normal mb-4 whitespace-pre-wrap">
                    {product.description}
                  </p>

                  {/* Product Image */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100 mb-4 bg-slate-50 group-hover:border-slate-200 transition-colors">
                    <Image 
                      src={product.image} 
                      alt={product.description}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur text-white px-4 py-2 rounded-xl font-bold text-sm shadow-xl">
                      {product.price}
                    </div>
                  </div>

                  {/* Interaction Bar */}
                  <div className="flex items-center justify-between max-w-md text-slate-500">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors group/icon">
                      <div className="p-2 rounded-full group-hover/icon:bg-primary/10">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold -ml-1">{product.comments}</span>
                    </button>

                    <button className="flex items-center gap-1 hover:text-green-500 transition-colors group/icon">
                      <div className="p-2 rounded-full group-hover/icon:bg-green-500/10">
                        <Repeat2 className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold -ml-1">{product.reposts}</span>
                    </button>

                    <button className="flex items-center gap-1 hover:text-rose-500 transition-colors group/icon">
                      <div className="p-2 rounded-full group-hover/icon:bg-rose-500/10">
                        <Heart className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold -ml-1">{product.likes}</span>
                    </button>

                    <button className="flex items-center gap-1 hover:text-primary transition-colors group/icon">
                      <div className="p-2 rounded-full group-hover/icon:bg-primary/10">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold -ml-1">{product.cartCount || "0"}</span>
                    </button>

                    <button className="hover:text-primary transition-colors group/icon">
                      <div className="p-2 rounded-full group-hover/icon:bg-primary/10">
                        <Share className="w-5 h-5" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Padding for mobile */}
        <div className="h-20 md:hidden"></div>
      </main>

      <RightSidebar />
    </div>
  );
};

export default VendorsPage;