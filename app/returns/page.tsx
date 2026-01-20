"use client";

import React from "react";
import { RefreshCcw, Package, Truck, CreditCard, ShieldCheck, AlertCircle, FileText, Bell, Mail, ArrowRight } from "lucide-react";

const ReturnsPage = () => {
  const lastUpdated = "January 14, 2026";

  const sections = [
    {
      title: "Return Eligibility",
      icon: <Package className="w-5 h-5" />,
      content: [
        "Items must be returned within 14 days of delivery.",
        "Products must be in their original packaging with all tags attached.",
        "Items must be unused, unwashed, and in the same condition as received.",
        "Certain items (hygiene products, custom orders) are non-returnable."
      ]
    },
    {
      title: "The Return Process",
      icon: <RefreshCcw className="w-5 h-5" />,
      content: [
        <>Initiate your return through your 'Order History' in your <span className="text-secondary">.</span>Soko account.</>,
        "Select the reason for return and upload photos if the item is damaged.",
        "Wait for the seller's approval (usually within 24-48 hours).",
        "Once approved, you'll receive a return shipping label or instructions."
      ]
    },
    {
      title: "Refunds & Credit",
      icon: <CreditCard className="w-5 h-5" />,
      content: [
        "Refunds are processed back to your original payment method.",
        "Processing time usually takes 5-10 business days after the item is received.",
        <>You may opt for <span className="text-secondary">.</span>Soko Store Credit for faster reimbursement.</>,
        "Shipping costs are non-refundable unless the item was faulty."
      ]
    },
    {
      title: "Shipping Your Return",
      icon: <Truck className="w-5 h-5" />,
      content: [
        "Pack the item securely to prevent damage during transit.",
        "Include the original packing slip or return authorization form.",
        "Use the provided shipping label or a trackable shipping service.",
        "Keep your tracking number until the refund is fully processed."
      ]
    }
  ];

  return (
    <main className="flex flex-col pb-24 lg:pb-0 bg-slate-50/30">
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold mb-4">
              <RefreshCcw className="w-3.5 h-3.5" />
              Easy Returns
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Returns & Refunds
            </h1>
            <p className="mt-4 text-slate-600 text-lg leading-relaxed">
              We want you to be completely satisfied with your purchase. If something isn't 
              quite right, our straightforward return policy ensures a hassle-free experience.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Version 1.5
              </span>
              <span className="flex items-center gap-1.5">
                <Bell className="w-4 h-4" />
                Last updated: {lastUpdated}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {sections.map((section, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
                </div>
                <ul className="space-y-4">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-600 leading-relaxed">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/30 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">Buyer Protection</h3>
                </div>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Every purchase on <span className="text-secondary">.</span>Soko is covered by our Buyer Protection program. If your 
                  item doesn't arrive or is significantly different from the description, 
                  we guarantee a full refund.
                </p>
                <button className="flex items-center gap-2 text-primary font-bold text-sm hover:text-blue-400 transition-colors">
                  Learn more about protection <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-[128px]">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-slate-900 mb-4">Start a Return</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  The quickest way to handle a return is through your user dashboard. 
                  Need help with a specific order?
                </p>
                <a 
                  href="mailto:support@dotsoko.com"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-slate-400">Customer Support</div>
                    <div className="text-sm font-bold text-slate-900">support@dotsoko.com</div>
                  </div>
                </a>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6">
                <h4 className="font-bold text-slate-900 text-sm mb-4">Policy Hub</h4>
                <nav className="space-y-3">
                  {[
                    { name: 'Terms of Service', href: '/terms' },
                    { name: 'Privacy Policy', href: '/privacy' },
                    { name: 'Cookie Policy', href: '/cookies' },
                    { name: 'Seller Agreement', href: '#' }
                  ].map((item) => (
                    <a 
                      key={item.name}
                      href={item.href} 
                      className="block text-sm text-slate-500 hover:text-primary transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ReturnsPage;
