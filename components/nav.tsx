"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Heart, Menu, Phone, Home, Store, Tag, Crown } from "lucide-react";
import SearchBar from "@/components/searchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const Navbar = () => {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    // Check login status
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      {/* Spacer to prevent content from hiding behind the fixed navbar */}
      <div className="h-[100px] md:h-[128px]"></div>
      
      <header 
        className="w-full flex flex-col shadow-sm fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-white/5"
      >
      {/* Top Bar */}
      <div className="hidden md:flex bg-slate-950 border-b border-white/5 text-slate-400 text-xs py-2 px-4 md:px-8 justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">
            Welcome to <span className="text-secondary">.</span>Soko Multivendor Store
          </span>
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" /> <span>+123 456 7890</span>
          </div>
        </div>
        <div className="flex items-center gap-4 divide-x divide-white/10">
          <Link
            href="/help"
            className="hover:text-slate-50 transition-colors pr-4"
          >
            Help Center
          </Link>
          <div className="cursor-pointer hover:text-slate-50 transition-colors pl-4">
            English / KES
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-slate-900 py-1.5 md:py-3 px-4 md:px-8">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-1.5 md:gap-4">
          {/* Mobile Top Row: Logo & Icons */}
          <div className="flex w-full md:w-auto justify-between items-center">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl md:text-3xl font-bold text-slate-50 tracking-tight"
            >
              <span className="text-secondary">.</span>Soko
            </Link>

            {/* Mobile Icons (Visible only on mobile) */}
            <div className="flex items-center gap-4 md:hidden">
              <ThemeToggle />
              <Link href="/wishlist" className="relative">
                <Heart className="w-6 h-6 text-slate-50" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                  {wishlistItems.length}
                </span>
              </Link>
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-slate-50" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 w-full max-w-2xl md:mx-4 relative order-last md:order-none">
            <SearchBar />
          </div>

          {/* Desktop Icons (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-6 text-slate-50">
            <ThemeToggle />
            <Link href={isLoggedIn ? "/account" : "/auth"} className="flex flex-col items-center group">
              <User className="w-6 h-6 group-hover:text-primary transition-colors" />
              <span className="text-xs mt-1 font-medium group-hover:text-primary text-slate-400">
                {isLoggedIn ? "Dashboard" : "Account"}
              </span>
            </Link>
            <Link
              href="/wishlist"
              className="flex flex-col items-center group relative"
            >
              <Heart className="w-6 h-6 group-hover:text-primary transition-colors" />
              <span className="text-xs mt-1 font-medium group-hover:text-primary">
                Wishlist
              </span>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="flex flex-col items-center group relative"
            >
              <ShoppingCart className="w-6 h-6 group-hover:text-primary transition-colors" />
              <span className="text-xs mt-1 font-medium group-hover:text-primary">
                Cart
              </span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Bar (Desktop Only) */}
      <div className="bg-primary text-primary-foreground hidden md:block">
        <div className="w-full px-4 md:px-8 flex items-center justify-between h-12">
          <div className="flex items-center gap-8 text-sm font-medium">
            <Link 
              href="/categories"
              className="flex items-center gap-2 cursor-pointer bg-black/10 h-12 px-4 hover:bg-black/20 transition-colors"
            >
              <Menu className="w-5 h-5" />
              <span>All Categories</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="hover:text-primary-foreground/80 transition-colors">
                Home
              </Link>
              <Link
                href="/shop"
                className="hover:text-primary-foreground/80 transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/deals"
                className="hover:text-primary-foreground/80 transition-colors"
              >
                Deals
              </Link>
              <Link
                href="/premium"
                className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors font-bold"
              >
                <Crown className="w-4 h-4 fill-current" />
                Premium
              </Link>
              <Link
                href="/contact"
                className="hover:text-primary-foreground/80 transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="text-sm font-medium text-primary-foreground/90">
            Free Shipping on Orders Over KES 6,500
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Bottom Navigation (Fixed) - Moved outside the header to keep it visible */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-[0_-1px_3px_rgba(0,0,0,0.1)] z-50">
      <div className="flex justify-around items-center p-2 text-[10px] font-medium text-muted-foreground">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 p-2 hover:text-primary"
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/shop"
          className="flex flex-col items-center gap-1 p-2 hover:text-primary"
        >
          <Store className="w-5 h-5" />
          <span>Shop</span>
        </Link>
        <Link
          href="/deals"
          className="flex flex-col items-center gap-1 p-2 hover:text-primary"
        >
          <Tag className="w-5 h-5" />
          <span>Deals</span>
        </Link>
        <Link
          href="/premium"
          className="flex flex-col items-center gap-1 p-2 text-amber-600 hover:text-amber-500"
        >
          <Crown className="w-5 h-5 fill-amber-600/10" />
          <span className="font-bold">Premium</span>
        </Link>
        <Link
          href="/cart"
          className="flex flex-col items-center gap-1 p-2 hover:text-primary relative"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-secondary text-primary-foreground text-[9px] flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <span>Cart</span>
        </Link>
        <Link
          href={isLoggedIn ? "/account" : "/auth"}
          className="flex flex-col items-center gap-1 p-2 hover:text-primary"
        >
          <User className="w-5 h-5" />
          <span>{isLoggedIn ? "Dashboard" : "Account"}</span>
        </Link>
      </div>
    </div>
    </>
  );
};

export default Navbar;
