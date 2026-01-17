"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  BadgeCheck, 
  Star
} from "lucide-react";

const PremiumPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      price: { monthly: "0", annual: "0" },
      description: "Basic features for individuals and new sellers",
      features: [
        "Up to 10 product listings",
        "Standard seller dashboard",
        "Basic analytics",
        "Community support",
      ],
      buttonText: "Current Plan",
      buttonVariant: "outline",
      popular: false,
    },
    {
      name: "Premium",
      price: { monthly: "300", annual: "3,000" },
      description: "Everything you need to grow your business faster",
      features: [
        "Unlimited product listings",
        "Verification Checkmark (Blue Badge)",
        "Priority in search results",
        "Advanced sales analytics",
        "Featured shop placement",
        "24/7 Priority support",
        "Zero transaction fees",
        "Early access to new features",
      ],
      buttonText: "Upgrade to Premium",
      buttonVariant: "primary",
      popular: true,
    },
    {
      name: "Enterprise",
      price: { monthly: "1,000", annual: "10,000" },
      description: "Dedicated tools for large scale operations",
      features: [
        "Everything in Premium",
        "Dedicated Account Manager",
        "API access for automation",
        "Custom branding options",
        "Bulk inventory management",
        "Multi-user access (Teams)",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline",
      popular: false,
    },
  ];

  const benefits = [
    {
      icon: <BadgeCheck className="w-6 h-6 text-primary" />,
      title: "Verification Check",
      description: "Build instant trust with a verified badge on your profile and products."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      title: "Boosted Visibility",
      description: "Premium shops appear higher in search results and category listings."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
      title: "Buyer Protection",
      description: "Enhanced security features and priority resolution for your customers."
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: "Instant Payouts",
      description: "Get your funds faster with our express settlement system for premium sellers."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 pt-0">
      {/* Pricing Section */}
      <div id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-6">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-500 font-bold mb-8">Choose the plan that fits your growth stage</p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-6">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`text-sm font-black transition-all duration-300 px-4 py-2 rounded-xl ${!isAnnual ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Monthly
            </button>
            
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className={`w-16 h-8 rounded-full relative p-1 transition-all duration-500 shadow-inner group ${
                isAnnual 
                  ? 'bg-primary shadow-lg shadow-primary/30 ring-4 ring-primary/10' 
                  : 'bg-slate-200 hover:bg-slate-300'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500 transform flex items-center justify-center ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`}>
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isAnnual ? 'bg-primary scale-110' : 'bg-slate-300 scale-100'}`}></div>
              </div>
            </button>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsAnnual(true)}
                className={`text-sm font-black transition-all duration-300 px-4 py-2 rounded-xl ${isAnnual ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Annually
              </button>
              <span className="bg-amber-100 text-amber-600 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider animate-bounce">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-white rounded-[3rem] p-10 border transition-all duration-500 ${
                plan.popular 
                ? "border-primary shadow-2xl shadow-primary/10 scale-105 z-10" 
                : "border-slate-100 hover:border-slate-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Star className="w-3 h-3 fill-current" />
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-black text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-400 font-bold">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-slate-900">
                  KES {isAnnual ? plan.price.annual : plan.price.monthly}
                </span>
                <span className="text-slate-400 font-bold">
                  {isAnnual ? "/year" : "/month"}
                </span>
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  plan.buttonVariant === "primary"
                  ? "bg-primary text-white hover:scale-[1.02] shadow-lg shadow-primary/20"
                  : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Why Go Premium?</h2>
          <p className="text-slate-500 font-bold">Everything you need to stand out in the marketplace</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/5 transition-colors">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">{benefit.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-4">Still not sure?</h2>
            <p className="text-slate-400 font-medium mb-8 max-w-xl mx-auto">
              Our support team is here to help you choose the best plan for your business. Schedule a demo or chat with us today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all">
                Chat with Us
              </button>
              <button className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all">
                View Full Comparison
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
