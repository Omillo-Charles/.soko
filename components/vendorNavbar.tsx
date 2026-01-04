"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { name: "All", href: "/vendors" },
  { name: "Home Décor", href: "/shop?cat=home-decor" },
  { name: "Kitchenware", href: "/shop?cat=kitchenware" },
  { name: "Books & Stationery", href: "/shop?cat=books-stationery" },
  { name: "Baby Products", href: "/shop?cat=baby-products" },
  { name: "Toys & Games", href: "/shop?cat=toys-games" },
  { name: "Sports & Fitness", href: "/shop?cat=sports-fitness-equipment" },
  { name: "Computing", href: "/shop?cat=computer-accessories" },
  { name: "Office Supplies", href: "/shop?cat=office-supplies" },
  { name: "Digital Products", href: "/shop?cat=digital-products" },
  { name: "Automotive", href: "/shop?cat=automotive-accessories" },
  { name: "Pet Supplies", href: "/shop?cat=pet-supplies" },
  { name: "Health", href: "/shop?cat=health-products" },
  { name: "Craft & DIY", href: "/shop?cat=craft-diy-supplies" },
  { name: "Events & Parties", href: "/shop?cat=event-party-supplies" },
  { name: "Clothing", href: "/shop?cat=clothing-apparel" },
  { name: "Footwear", href: "/shop?cat=footwear" },
  { name: "Fashion", href: "/shop?cat=fashion-accessories" },
  { name: "Electronics", href: "/shop?cat=electronics" },
  { name: "Groceries", href: "/shop?cat=groceries-foods" }
];

interface VendorNavbarProps {
  isSidebarCollapsed: boolean;
}

const VendorNavbar = ({ isSidebarCollapsed }: VendorNavbarProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`
      fixed top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 h-16 flex items-center transition-all duration-300
      ${isSidebarCollapsed ? "left-16" : "left-20 md:left-24"}
      right-0 lg:pr-[350px]
    `}>
      <div className="w-full flex items-center gap-4">
        <button 
          onClick={() => scroll('left')}
          className="p-1 hover:bg-slate-100 rounded-full transition-colors md:hidden lg:flex hidden"
        >
          <ChevronLeft className="w-5 h-5 text-slate-400" />
        </button>

        <div 
          ref={scrollRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold text-slate-600 hover:text-primary hover:bg-primary/5 transition-all"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="p-1 hover:bg-slate-100 rounded-full transition-colors md:hidden lg:flex hidden"
        >
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
      </div>
    </nav>
  );
};

export default VendorNavbar;
