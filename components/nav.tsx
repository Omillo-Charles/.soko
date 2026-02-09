"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingCart, 
  User, 
  Heart, 
  Menu, 
  Phone, 
  Home, 
  Store, 
  Tag, 
  Crown, 
  MoreHorizontal, 
  Info, 
  Shield, 
  FileText, 
  Cookie, 
  Mail,
  BadgeCheck
} from "lucide-react";
import SearchBar from "@/components/searchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUser } from "@/hooks/useUser";

const Navbar = () => {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const { user, token } = useUser();
  const [mounted, setMounted] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted ? !!token : false;
  const isPremium = mounted ? !!user?.isPremium : false;
  const cartCount = mounted ? totalItems : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  // Redirect premium users from /premium to /premium/dashboard
  const premiumLink = isPremium ? "/premium/dashboard" : "/premium";

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('mobile-more-menu');
      const button = document.getElementById('mobile-more-button');
      if (menu && !menu.contains(event.target as Node) && button && !button.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  const moreMenuItems = [
    { icon: <Info className="w-4 h-4" />, label: "About Us", href: "/about" },
    { icon: <Mail className="w-4 h-4" />, label: "Contact", href: "/contact" },
    { icon: <Shield className="w-4 h-4" />, label: "Privacy Policy", href: "/privacy" },
    { icon: <FileText className="w-4 h-4" />, label: "Terms of Service", href: "/terms" },
    { icon: <Cookie className="w-4 h-4" />, label: "Cookie Policy", href: "/cookies" },
    { icon: <Phone className="w-4 h-4" />, label: "Help Center", href: "/help" },
  ];

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
            className={`transition-colors pr-4 ${pathname === "/help" ? "text-secondary font-bold" : "hover:text-slate-50"}`}
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
              <Link href="/wishlist" className="relative transition-colors">
                <Heart className={`w-6 h-6 ${pathname === "/wishlist" ? "text-primary fill-primary/20" : "text-slate-50"}`} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              </Link>
              <Link href="/cart" className="relative transition-colors">
                <ShoppingCart className={`w-6 h-6 ${pathname === "/cart" ? "text-primary" : "text-slate-50"}`} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                  {cartCount}
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
            <Link href={isLoggedIn ? "/account" : "/auth"} className={`flex flex-col items-center group transition-colors ${pathname.startsWith("/account") || pathname === "/auth" ? "text-primary" : "text-slate-50"}`}>
              <User className={`w-6 h-6 transition-colors ${pathname.startsWith("/account") || pathname === "/auth" ? "text-primary" : "group-hover:text-primary"}`} />
              <span className={`text-xs mt-1 font-medium transition-colors ${pathname.startsWith("/account") || pathname === "/auth" ? "text-primary" : "text-slate-400 group-hover:text-primary"}`}>
                {isLoggedIn ? "Dashboard" : "Account"}
              </span>
            </Link>
            <Link
              href="/wishlist"
              className={`flex flex-col items-center group relative transition-colors ${pathname === "/wishlist" ? "text-primary" : "text-slate-50"}`}
            >
              <Heart className={`w-6 h-6 transition-colors ${pathname === "/wishlist" ? "text-primary" : "group-hover:text-primary"}`} />
              <span className={`text-xs mt-1 font-medium transition-colors ${pathname === "/wishlist" ? "text-primary" : "group-hover:text-primary"}`}>
                Wishlist
              </span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className={`flex flex-col items-center group relative transition-colors ${pathname === "/cart" ? "text-primary" : "text-slate-50"}`}
            >
              <ShoppingCart className={`w-6 h-6 transition-colors ${pathname === "/cart" ? "text-primary" : "group-hover:text-primary"}`} />
              <span className={`text-xs mt-1 font-medium transition-colors ${pathname === "/cart" ? "text-primary" : "group-hover:text-primary"}`}>
                Cart
              </span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                {cartCount}
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
              className={`flex items-center gap-2 cursor-pointer h-12 px-4 transition-colors ${pathname === "/categories" ? "bg-black/30 text-secondary" : "bg-black/10 hover:bg-black/20"}`}
            >
              <Menu className={`w-5 h-5 ${pathname === "/categories" ? "text-secondary" : ""}`} />
              <span className={pathname === "/categories" ? "font-bold" : ""}>All Categories</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link 
                href="/" 
                className={`transition-colors ${pathname === "/" ? "text-secondary font-bold underline decoration-2 underline-offset-8" : "hover:text-primary-foreground/80"}`}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className={`transition-colors ${pathname === "/shop" ? "text-secondary font-bold underline decoration-2 underline-offset-8" : "hover:text-primary-foreground/80"}`}
              >
                Shop
              </Link>
              <Link
                href="/deals"
                className={`transition-colors ${pathname === "/deals" ? "text-secondary font-bold underline decoration-2 underline-offset-8" : "hover:text-primary-foreground/80"}`}
              >
                Deals
              </Link>
              <Link
                href={premiumLink}
                className={`flex items-center gap-1.5 transition-colors font-bold ${pathname.startsWith("/premium") ? "text-amber-200 underline decoration-2 underline-offset-8" : "text-amber-300 hover:text-amber-200"}`}
              >
                <Crown className={`w-4 h-4 fill-current ${pathname.startsWith("/premium") ? "animate-pulse" : ""}`} />
                {isPremium ? "Dashboard" : "Premium"}
              </Link>
              <Link
                href="/contact"
                className={`transition-colors ${pathname === "/contact" ? "text-secondary font-bold underline decoration-2 underline-offset-8" : "hover:text-primary-foreground/80"}`}
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="text-sm font-medium text-primary-foreground/90">
            Free Shipping on Orders Over KES 30,000
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Bottom Navigation (Fixed) */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-[0_-1px_3px_rgba(0,0,0,0.1)] z-50">
      {/* More Menu Card */}
      {showMoreMenu && (
        <div 
          id="mobile-more-menu"
          className="absolute bottom-full right-4 mb-4 w-56 bg-background rounded-[2rem] border border-border shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300 overflow-hidden"
        >
          <div className="p-4 bg-primary/5 border-b border-border">
            <h3 className="text-[10px] font-black text-foreground uppercase tracking-widest">More Links</h3>
          </div>
          <div className="p-2 grid grid-cols-1 gap-1">
            {moreMenuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setShowMoreMenu(false)}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-colors group ${isActive ? "bg-primary/10 text-primary" : "hover:bg-primary/5"}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isActive ? "bg-primary text-primary-foreground" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"}`}>
                    {item.icon}
                  </div>
                  <span className={`text-xs font-bold transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-around items-center p-2 text-[10px] font-medium text-muted-foreground">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${pathname === "/" ? "text-primary" : "hover:text-primary"}`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/shop"
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${pathname === "/shop" ? "text-primary" : "hover:text-primary"}`}
        >
          <Store className="w-5 h-5" />
          <span>Shop</span>
        </Link>
        <Link
          href="/deals"
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${pathname === "/deals" ? "text-primary" : "hover:text-primary"}`}
        >
          <Tag className="w-5 h-5" />
          <span>Deals</span>
        </Link>
        <Link
          href={isLoggedIn ? "/account" : "/auth"}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${pathname.startsWith("/account") || pathname === "/auth" ? "text-primary" : "hover:text-primary"}`}
        >
          <User className="w-5 h-5" />
          <span>{isLoggedIn ? "Dashboard" : "Account"}</span>
        </Link>
        <Link
          href="/premium"
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${pathname === "/premium" ? "text-amber-500" : "text-amber-600 hover:text-amber-500"}`}
        >
          <Crown className={`w-5 h-5 ${pathname === "/premium" ? "fill-amber-500/20" : "fill-amber-600/10"}`} />
          <span className="font-bold">Premium</span>
        </Link>
        <button
          id="mobile-more-button"
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${showMoreMenu ? "text-primary" : "hover:text-primary"}`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span>More</span>
        </button>
      </div>
    </div>
    </>
  );
};

export default Navbar;
