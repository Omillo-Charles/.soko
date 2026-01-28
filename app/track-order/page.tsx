"use client";

import React, { useState } from "react";
import { 
  Search, 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle,
  ArrowLeft,
  Calendar,
  Phone,
  HelpCircle
} from "lucide-react";
import Link from "next/link";

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      setShowResult(true);
    }, 1200);
  };

  const steps = [
    { status: 'Order Placed', date: 'Jan 12, 2026', time: '10:30 AM', completed: true, current: false },
    { status: 'Payment Confirmed', date: 'Jan 12, 2026', time: '10:45 AM', completed: true, current: false },
    { status: 'Processing', date: 'Jan 13, 2026', time: '02:15 PM', completed: true, current: false },
    { status: 'Shipped', date: 'Jan 14, 2026', time: '09:00 AM', completed: false, current: true },
    { status: 'Out for Delivery', date: 'Pending', time: '-', completed: false, current: false },
    { status: 'Delivered', date: 'Pending', time: '-', completed: false, current: false },
  ];

  return (
    <main className="min-h-screen bg-muted/30 pb-24 lg:pb-12">
      {/* Header */}
      <section className="bg-background border-b border-border">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <Link 
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Shopping
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
              Track Your Order
            </h1>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Enter your order ID to see real-time updates on your package's journey 
              from the shop to your doorstep.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Tracking Form Area */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-background border border-border rounded-3xl p-6 md:p-8 shadow-sm">
              <form onSubmit={handleTrack} className="relative">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Enter Order ID (e.g. SK-8291-00X)"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-foreground"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSearching}
                    className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center min-w-[160px]"
                  >
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      "Track Order"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {showResult && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                {/* Order Status Card */}
                <div className="bg-background border border-border rounded-3xl overflow-hidden shadow-sm">
                  <div className="p-6 md:p-8 bg-foreground text-background">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Current Status</p>
                        <h2 className="text-2xl font-black flex items-center gap-2">
                          <Truck className="w-6 h-6 text-primary" />
                          In Transit
                        </h2>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Expected Delivery</p>
                        <p className="text-xl font-black">Jan 16, 2026</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-bold uppercase">Order ID</p>
                          <p className="text-sm font-black text-foreground">{orderId}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-bold uppercase">Destination</p>
                          <p className="text-sm font-black text-foreground">Kampala, Uganda</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-bold uppercase">Last Update</p>
                          <p className="text-sm font-black text-foreground">2 hours ago</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-0 relative">
                      <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border" />
                      {steps.map((step, idx) => (
                        <div key={idx} className="relative pl-12 pb-10 last:pb-0 group">
                          <div className={`absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-background flex items-center justify-center z-10 transition-colors ${
                            step.completed ? 'bg-primary text-primary-foreground' : 
                            step.current ? 'bg-background border-primary text-primary' : 'bg-muted text-muted-foreground'
                          }`}>
                            {step.completed ? <CheckCircle2 className="w-5 h-5" /> : <div className={`w-2 h-2 rounded-full ${step.current ? 'bg-primary animate-pulse' : 'bg-current'}`} />}
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                            <div>
                              <p className={`font-black text-sm ${step.current ? 'text-primary' : 'text-foreground'}`}>{step.status}</p>
                              <p className="text-xs text-muted-foreground font-medium md:hidden">{step.date} · {step.time}</p>
                            </div>
                            <p className="hidden md:block text-xs text-muted-foreground font-bold">{step.date} · {step.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!showResult && !isSearching && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-background border border-border rounded-3xl">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-4">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Where is my Order ID?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You can find your Order ID in the confirmation email we sent you, 
                    or by visiting the 'Orders' section in your account dashboard.
                  </p>
                </div>
                <div className="p-6 bg-background border border-border rounded-3xl">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-4">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If you're having trouble tracking your package, please contact 
                    our 24/7 support team at support@dotsoko.com.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-primary rounded-3xl p-8 text-primary-foreground relative overflow-hidden shadow-xl shadow-primary/20">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-4">Download Our App</h3>
                <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
                  Get real-time push notifications about your order status and track 
                  your package on the go with the <span className="text-secondary">.</span>Soko mobile app.
                </p>
                <div className="space-y-3">
                  <button className="w-full py-3 bg-background text-foreground rounded-xl font-bold text-sm hover:bg-muted transition-colors">
                    App Store
                  </button>
                  <button className="w-full py-3 bg-background/10 text-primary-foreground border border-background/20 rounded-xl font-bold text-sm hover:bg-background/20 transition-colors">
                    Google Play
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-background/10 rounded-full blur-2xl" />
            </div>

            <div className="bg-background border border-border rounded-3xl p-6">
              <h4 className="font-black text-foreground text-sm mb-4 uppercase tracking-wider">Quick Support</h4>
              <div className="space-y-4">
                {[
                  { name: 'Shipping Policy', href: '#' },
                  { name: 'Refund Policy', href: '/returns' },
                  { name: 'FAQs', href: '/help' },
                ].map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href} 
                    className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors font-bold group"
                  >
                    {item.name}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TrackOrderPage;
