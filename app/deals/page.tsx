"use client";

import React, { Suspense } from "react";
import { Tag, Home } from "lucide-react";
import Link from "next/link";

const DealsContent = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10 animate-pulse"></div>
          <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto rotate-6 border border-primary/20">
            <Tag className="w-10 h-10 text-primary" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-foreground uppercase tracking-tight">No Deals Right Now</h1>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed">
            We're currently hunting for the best offers and exclusive discounts for you. 
            Check back soon or explore our shop for amazing products at great prices.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/shop" 
            className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
          >
            Explore Shop
          </Link>
          <Link 
            href="/" 
            className="px-8 py-4 bg-muted text-muted-foreground rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-muted/80 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

const DealsPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Tag className="w-10 h-10 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Loading Deals...</p>
        </div>
      </div>
    }>
      <DealsContent />
    </Suspense>
  );
};

export default DealsPage;
