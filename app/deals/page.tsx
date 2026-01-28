"use client";

import React from "react";
import { Tag, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DealsPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-[70vh] bg-background flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Icon container */}
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-muted rounded-[2.5rem] flex items-center justify-center mx-auto transition-transform hover:rotate-12 duration-500">
            <Tag className="w-10 h-10 text-muted-foreground/40 stroke-[1.5px]" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 bg-primary rounded-full" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">
            Exclusive <span className="text-primary">Deals</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">
            No deals right now, check later. We're currently curating the best offers for you.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => router.back()}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-foreground text-background font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all shadow-xl shadow-foreground/10 flex items-center justify-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          <Link 
            href="/shop"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-background border border-border text-muted-foreground font-bold text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Shop
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="pt-12 flex justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
