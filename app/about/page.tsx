"use client";

import React from "react";
import Link from "next/link";
import { 
  Users, 
  Target, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Heart,
  Briefcase,
  Mail,
  Info,
  CheckCircle2,
  Loader2
} from "lucide-react";
import Footer from "@/components/footer";
import { useStats } from "@/hooks/useStats";

const AboutPage = () => {
  const { data: statsData, isLoading: isStatsLoading } = useStats();

  const sections = [
    {
      title: "Our Mission",
      icon: <Target className="w-5 h-5" />,
      content: [
        <>.Soko is more than just a marketplace. We are a community-driven platform designed to connect people with quality products while helping businesses thrive in the digital age.</>,
        "We believe in democratizing commerce by providing tools that allow anyone, anywhere to start and grow their business.",
        "Our mission is to create a seamless, secure, and enjoyable shopping experience for everyone."
      ]
    },
    {
      title: "Our Story",
      icon: <Globe className="w-5 h-5" />,
      content: [
        "Starting in 2024, we set out to bridge the gap between local artisans and global markets.",
        "In a rapidly changing world, we noticed that many talented sellers were struggling to find their place online. We built .Soko to solve this problem.",
        "Today, we are proud to support thousands of entrepreneurs across the region, providing them with the tools they need to succeed."
      ]
    },
    {
      title: "Core Values",
      icon: <Heart className="w-5 h-5" />,
      content: [
        <><strong>Trust & Security:</strong> We prioritize the safety of our buyers and sellers with secure payment systems and verified profiles.</>,
        <><strong>Community First:</strong> Building a thriving ecosystem where small businesses and individual sellers can grow and succeed.</>,
        <><strong>Innovation:</strong> Continuously improving our platform with the latest technology to provide a seamless shopping experience.</>,
        <><strong>Sustainability:</strong> Supporting local economies and promoting sustainable commerce across the region.</>
      ]
    }
  ];

  const stats = [
    { label: "Active Users", value: statsData?.users ? `${statsData.users}+` : "..." },
    { label: "Verified Sellers", value: statsData?.shops ? `${statsData.shops}+` : "..." },
    { label: "Products Sold", value: statsData?.products ? `${statsData.products}+` : "..." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      {/* Header Section */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold mb-4">
              <Info className="w-3.5 h-3.5" />
              About Us
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Empowering Digital Commerce
            </h1>
            <p className="mt-4 text-slate-600 text-lg leading-relaxed">
              Welcome to <span className="text-secondary">.</span>Soko, the ultimate multivendor marketplace connecting buyers and sellers in a seamless, secure ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center min-h-[120px]">
                  {isStatsLoading ? (
                    <div className="flex justify-center py-2">
                      <Loader2 className="w-6 h-6 text-primary/30 animate-spin" />
                    </div>
                  ) : (
                    <p className="text-2xl md:text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                  )}
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Content Sections */}
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
                      <div>{item}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* CTA Card */}
            <div className="p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">Join Our Team</h3>
                </div>
                <p className="text-slate-300 leading-relaxed mb-6">
                  We are always looking for passionate individuals to help us build the future of commerce. 
                  Check out our careers page for open positions.
                </p>
                <Link 
                  href="/careers" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors"
                >
                  View Openings
                  <Briefcase className="w-4 h-4" />
                </Link>
              </div>
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-[128px]">
              
              {/* Contact Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-slate-900 mb-4">Get in Touch</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Have questions or want to partner with us? We'd love to hear from you.
                </p>
                <a 
                  href="mailto:hello@dotsoko.com"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-slate-400">General Inquiries</div>
                    <div className="text-sm font-bold text-slate-900">hello@dotsoko.com</div>
                  </div>
                </a>
              </div>

              {/* Quick Links */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h4 className="font-bold text-slate-900 text-sm mb-4">Company</h4>
                <nav className="space-y-3">
                  {[
                    { name: 'Shop', href: '/shop' },
                    { name: 'Careers', href: '/careers' },
                    { name: 'Help Center', href: '/help' },
                    { name: 'Contact', href: '/contact' }
                  ].map((item) => (
                    <Link 
                      key={item.name}
                      href={item.href} 
                      className="block text-sm text-slate-500 hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Seller CTA */}
              <div className="mt-6 bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-primary/20">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Become a Seller</h3>
                <p className="text-sm text-white/80 mb-6 leading-relaxed">
                  Start your business journey with .Soko today and reach millions of customers.
                </p>
                <Link 
                  href="/auth"
                  className="block w-full text-center py-3 bg-white text-primary rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  Get Started
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
