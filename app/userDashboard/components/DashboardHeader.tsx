"use client";

import React from "react";
import { Bell, Search, Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

const DashboardHeader = ({ title, onMenuClick }: HeaderProps) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[90]">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl lg:hidden transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight line-clamp-1">{title}</h1>
          <p className="hidden xs:block text-[10px] text-slate-500 font-bold uppercase tracking-widest">Admin Control Center</p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Search Bar - Desktop Only */}
        <div className="hidden xl:flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all w-64">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 w-full"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 md:pl-6 md:border-l md:border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 leading-none">Alex Johnson</p>
            <p className="text-[10px] text-primary font-bold uppercase tracking-tighter mt-1">Super Admin</p>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black shadow-lg shadow-slate-200 cursor-pointer hover:scale-105 transition-transform">
            AJ
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
