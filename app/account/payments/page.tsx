"use client";

import React from "react";
import Link from "next/link";
import { CreditCard, ChevronLeft, Clock } from "lucide-react";

const PaymentsPage = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs/Back Button */}
        <Link 
          href="/account" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <div className="p-2 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm">Back to Account</span>
        </Link>

        {/* Content Section */}
        <div className="bg-background rounded-[2.5rem] border border-border p-12 text-center shadow-sm">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CreditCard className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-4xl font-black text-foreground mb-4 tracking-tight">
            Payments Management
          </h1>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full mb-8 border border-amber-500/20">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Coming Soon</span>
          </div>

          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed font-medium">
            We're currently building a secure and seamless way for you to manage your payment methods and transaction history. Stay tuned!
          </p>

          <div className="mt-12 pt-12 border-t border-border">
            <Link 
              href="/account"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
