"use client";

import React from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Target, 
  Users, 
  Zap, 
  Mail, 
  Info, 
  Search,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Footer from "@/components/footer";

const CareersPage = () => {
  const perks = [
    {
      title: "Innovation First",
      desc: "Work with the latest technologies to solve real-world commerce problems.",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      title: "Community Driven",
      desc: "Join a team that values collaboration and supports local entrepreneurs.",
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: "Growth Mindset",
      desc: "We invest in your professional development and career progression.",
      icon: <Target className="w-5 h-5" />,
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      {/* Header Section */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold mb-4">
              <Briefcase className="w-3.5 h-3.5" />
              Careers
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Build the Future of <br />
              <span className="text-primary">Digital Commerce</span>
            </h1>
            <p className="mt-6 text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl">
              At <span className="text-secondary">.</span>Soko, we're on a mission to democratize commerce. 
              We're looking for passionate people to join us in building a platform that empowers everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Job Listings */}
          <div className="lg:col-span-8 space-y-12">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Current Openings</h2>
                <div className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">
                  0 positions
                </div>
              </div>

              {/* Empty State */}
              <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No open jobs yet</h3>
                <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
                  We don't have any active job openings at the moment, but we're always growing! 
                  Follow us for updates or send your CV for future consideration.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a 
                    href="mailto:careers@dotsoko.com"
                    className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Send your CV
                  </a>
                  <Link 
                    href="/contact"
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

            {/* Perks Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {perks.map((perk, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-4">
                    {perk.icon}
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">{perk.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{perk.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-[128px]">
              {/* Talent Pool Card */}
              <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Join our Talent Pool</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    Don't see a role that fits? Send us your resume anyway! We'll reach out when 
                    the right opportunity comes along.
                  </p>
                  <a 
                    href="mailto:talent@dotsoko.com"
                    className="flex items-center justify-between w-full p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                  >
                    <span className="font-bold">Drop your CV</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
              </div>

              {/* Culture Note */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-6">
                <h4 className="font-bold text-slate-900 mb-4">Our Culture</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We are a remote-first company with a presence across East Africa. We value 
                  diversity, ownership, and the ability to move fast without breaking things.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CareersPage;
