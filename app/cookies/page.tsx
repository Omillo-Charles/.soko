"use client";

import React from "react";
import { Cookie, Shield, Eye, Settings, Clock, Info, FileText, Bell, Mail } from "lucide-react";

const CookiePolicyPage = () => {
  const lastUpdated = "January 14, 2026";

  const sections = [
    {
      title: "What are Cookies?",
      icon: <Cookie className="w-5 h-5" />,
      content: [
        "Cookies are small text files stored on your device when you visit a website.",
        "They help the website remember your actions and preferences over time.",
        "Cookies allow us to provide a more personalized and efficient browsing experience.",
        "They can be 'persistent' (stored until they expire) or 'session' (deleted when you close your browser)."
      ]
    },
    {
      title: "How We Use Cookies",
      icon: <Eye className="w-5 h-5" />,
      content: [
        "Essential Cookies: Required for basic site functionality like secure login and cart management.",
        "Analytical Cookies: Help us understand how visitors interact with Duuka to improve performance.",
        "Preference Cookies: Remember your language, currency, and display settings.",
        "Marketing Cookies: Used to deliver relevant advertisements and track campaign effectiveness."
      ]
    },
    {
      title: "Managing Your Preferences",
      icon: <Settings className="w-5 h-5" />,
      content: [
        "You can control and manage cookies through your browser settings.",
        "Most browsers allow you to refuse or delete cookies, but this may affect site functionality.",
        "You can opt-out of third-party tracking cookies through specialized privacy tools.",
        "Blocking all cookies will make certain features like the shopping cart unavailable."
      ]
    },
    {
      title: "Third-Party Cookies",
      icon: <Shield className="w-5 h-5" />,
      content: [
        "We use services like Google Analytics to analyze traffic and site usage.",
        "Payment processors use cookies to ensure transaction security and fraud prevention.",
        "Social media plugins may set cookies if you interact with them on our platform.",
        "We do not control how these third parties use their cookies; please check their respective policies."
      ]
    }
  ];

  return (
    <main className="flex flex-col pb-24 lg:pb-0 bg-slate-50/30">
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold mb-4">
              <Cookie className="w-3.5 h-3.5" />
              Your Privacy Choice
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Cookie Policy
            </h1>
            <p className="mt-4 text-slate-600 text-lg leading-relaxed">
              This policy explains how Duuka uses cookies and similar technologies to 
              recognize you when you visit our marketplace. It explains what these 
              technologies are and why we use them.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Version 1.0
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
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">Cookie Expiration</h3>
                </div>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Session cookies expire immediately when you close your browser. Persistent cookies 
                  remain on your device for a set period (usually 30 to 365 days) unless you 
                  manually delete them before their expiration date.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['30 Days', '90 Days', '1 Year', 'Session Only'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-[160px]">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-slate-900 mb-4">Cookie Support</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Have questions about how we use cookies or want to exercise your right to opt-out? 
                  Our technical privacy team is ready to help.
                </p>
                <a 
                  href="mailto:privacy@duuka.com"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-slate-400">Technical Support</div>
                    <div className="text-sm font-bold text-slate-900">privacy@duuka.com</div>
                  </div>
                </a>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6">
                <h4 className="font-bold text-slate-900 text-sm mb-4">Related Policies</h4>
                <nav className="space-y-3">
                  {[
                    { name: 'Privacy Policy', href: '/privacy' },
                    { name: 'Terms of Service', href: '/terms' },
                    { name: 'Seller Agreement', href: '#' },
                    { name: 'Data Protection', href: '#' }
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

export default CookiePolicyPage;
