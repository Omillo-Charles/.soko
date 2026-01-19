"use client";

import React from "react";
import { Shield, Lock, Eye, FileText, Bell, Globe, Mail } from "lucide-react";

const PrivacyPage = () => {
  const lastUpdated = "January 12, 2026";

  const sections = [
    {
      title: "Information We Collect",
      icon: <Eye className="w-5 h-5" />,
      content: [
        "Personal identification information (Name, email address, phone number, etc.)",
        "Billing and shipping information for order fulfillment.",
        "Device information and IP addresses for security and analytics.",
        "Shopping preferences and interaction data to improve your experience."
      ]
    },
    {
      title: "How We Use Your Data",
      icon: <Lock className="w-5 h-5" />,
      content: [
        "To process and manage your orders and payments.",
        "To provide customer support and respond to your inquiries.",
        "To send you service updates, security alerts, and marketing communications (with your consent).",
        "To prevent fraud and maintain the security of our marketplace."
      ]
    },
    {
      title: "Data Sharing & Third Parties",
      icon: <Globe className="w-5 h-5" />,
      content: [
        "We share necessary data with vendors (shops) you purchase from to fulfill orders.",
        "Third-party payment processors handle your financial data securely.",
        "Logistics partners receive shipping details to deliver your items.",
        "We never sell your personal information to third parties for marketing."
      ]
    },
    {
      title: "Your Privacy Rights",
      icon: <Shield className="w-5 h-5" />,
      content: [
        "The right to access and receive a copy of your personal data.",
        "The right to rectify inaccurate or incomplete information.",
        "The right to request deletion of your data (subject to legal obligations).",
        "The right to withdraw consent for marketing at any time."
      ]
    }
  ];

  return (
    <main className="flex flex-col pb-24 lg:pb-0 bg-slate-50/30">
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold mb-4">
              <Shield className="w-3.5 h-3.5" />
              Privacy Matters
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-4 text-slate-600 text-lg leading-relaxed">
              At <span className="text-secondary">.</span>Soko, we take your privacy seriously. This policy explains how we collect, 
              use, and protect your personal information when you use our marketplace.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Version 1.2
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
                <h3 className="text-2xl font-bold mb-4">Cookies & Tracking</h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  We use cookies to enhance your browsing experience, serve personalized ads or content, 
                  and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
                </p>
                <button className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-slate-100 transition-colors">
                  Manage Cookie Settings
                </button>
              </div>
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-[160px]">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-slate-900 mb-4">Questions?</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, 
                  please don't hesitate to contact our privacy team.
                </p>
                <a 
                  href="mailto:privacy@dotsoko.com"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-slate-400">Email our DPO</div>
                    <div className="text-sm font-bold text-slate-900">privacy@dotsoko.com</div>
                  </div>
                </a>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6">
                <h4 className="font-bold text-slate-900 text-sm mb-4">Legal Directory</h4>
                <nav className="space-y-3">
                  {['Terms of Service', 'Cookie Policy', 'Seller Agreement', 'Buyer Protection'].map((item) => (
                    <a 
                      key={item}
                      href="#" 
                      className="block text-sm text-slate-500 hover:text-primary transition-colors"
                    >
                      {item}
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

export default PrivacyPage;
