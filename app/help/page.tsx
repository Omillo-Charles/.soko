"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  Truck,
  RotateCcw,
  Package,
  HelpCircle,
  BookOpen,
  Shield,
  CreditCard,
  MessageCircle,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const HelpPage = () => {
  return (
    <main className="flex flex-col pb-24 lg:pb-0">
      <section className="bg-white">
        <div className="container mx-auto px-4 md:px-8 pt-6 pb-16">
          {/* Header */}
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Help Center
            </h1>
            <p className="mt-3 text-slate-600 text-lg">
              Find answers, track orders, and manage your shopping experience.
            </p>
          </div>

          {/* Top Info Cards - Matching Contact Page Style */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/track-order"
              className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Track Order</div>
                <div className="text-sm text-slate-500">Check delivery status</div>
              </div>
            </Link>

            <Link 
              href="/returns"
              className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Returns</div>
                <div className="text-sm text-slate-500">Refunds & exchanges</div>
              </div>
            </Link>

            <Link 
              href="/shipping"
              className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Shipping</div>
                <div className="text-sm text-slate-500">Rates & delivery times</div>
              </div>
            </Link>
          </div>

          {/* Main Grid - Matching Contact Page Layout */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left/Middle Column: Browse Topics (Replaces the Form) */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Browse Help Topics
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Account Settings", desc: "Manage profile and security", icon: Shield },
                    { title: "Payment Methods", desc: "Cards, M-Pesa, and more", icon: CreditCard },
                    { title: <>Selling on <span className="text-secondary">.</span>Soko</>, desc: "Start your own shop today", icon: ArrowRight },
                    { title: "Buyer Protection", desc: "How we keep you safe", icon: HelpCircle },
                  ].map((topic, i) => {
                    const Icon = topic.icon;
                    return (
                      <div 
                        key={i}
                        className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors flex gap-4"
                      >
                        <div className="text-slate-400 group-hover:text-primary">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{topic.title}</h3>
                          <p className="text-xs text-slate-500 mt-1">{topic.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 p-6 bg-slate-50 rounded-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="font-bold text-slate-900 mb-2">Need a custom solution?</h3>
                    <p className="text-sm text-slate-600 mb-4 max-w-md">
                      If you can't find what you're looking for, our search tool can help you find specific articles.
                    </p>
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search help articles..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                  <HelpCircle className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-200/50 -rotate-12" />
                </div>
              </div>
            </div>

            {/* Right Column: Support Sidebar */}
            <div className="space-y-6">
              {/* Quick Links Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  {[
                    "Privacy Policy",
                    "Terms of Service",
                    "Buyer Protection",
                    "Seller Handbook",
                  ].map((link, i) => (
                    <li key={i}>
                      <Link 
                        href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center justify-between text-sm text-slate-600 hover:text-primary transition-colors py-1 group"
                      >
                        {link}
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Support Card */}
              <div className="bg-primary rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Still Stuck?</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  Our dedicated support team is ready to help you with any issue you might be facing.
                </p>
                <Link 
                  href="/contact"
                  className="w-full bg-white text-primary font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Us
                </Link>
              </div>

              {/* Status Indicator */}
              <div className="p-4 border border-slate-100 rounded-2xl flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-slate-600">All systems operational</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default HelpPage;
