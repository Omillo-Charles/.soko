"use client";

import React from "react";
import Link from "next/link";
import { 
  Home, 
  Search, 
  TrendingUp, 
  ShoppingBag, 
  User, 
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

interface SideBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const SideBar = ({ isCollapsed, onToggle }: SideBarProps) => {
  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/shop" },
    { icon: TrendingUp, label: "Trending", href: "/trending" },
    { icon: ShoppingBag, label: "Shop Now", href: "/shop" },
  ];

  const bottomItem = { icon: User, label: "Account", href: "/account" };

  return (
    <aside 
      className={`
        fixed top-0 left-0 h-full bg-white border-r border-slate-100 z-[70] transition-all duration-300 ease-in-out flex flex-col items-center
        ${isCollapsed ? "w-16" : "w-20 md:w-24"}
      `}
    >
      {/* Toggle Button - Fixed at top */}
      <div className="w-full flex justify-center py-6 bg-white z-10">
        <button 
          onClick={onToggle}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-primary transition-all group relative"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-6 h-6" />
          ) : (
            <PanelLeftClose className="w-6 h-6" />
          )}
          
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[80]">
              Expand
            </div>
          )}
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 w-full overflow-y-auto no-scrollbar flex flex-col items-center pb-6">
        {/* Logo/Brand Icon Area */}
        <div className="mb-10">
          <Link 
            href="/" 
            className={`
              bg-primary rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all
              ${isCollapsed ? "w-10 h-10 text-lg" : "w-12 h-12 text-xl"}
            `}
          >
            D
          </Link>
        </div>

        {/* Main Nav Items */}
        <nav className="flex flex-col gap-6 mb-8">
          {navItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className="group relative flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
            >
              <div className={`p-3 rounded-2xl group-hover:bg-primary/5 transition-colors ${isCollapsed ? "scale-90" : ""}`}>
                <item.icon className="w-6 h-6" />
              </div>
              
              {!isCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </span>
              )}
              
              <div className="absolute left-full ml-4 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[80]">
                {item.label}
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
              </div>
            </Link>
          ))}
        </nav>

        {/* Bottom Account Item - Now part of scroll flow but at bottom of content */}
        <div className="mt-auto">
          <Link 
            href={bottomItem.href}
            className="group relative flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
          >
            <div className={`p-3 rounded-2xl group-hover:bg-primary/5 transition-colors ${isCollapsed ? "scale-90" : ""}`}>
              <bottomItem.icon className="w-6 h-6" />
            </div>
            
            {!isCollapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                {bottomItem.label}
              </span>
            )}

            <div className="absolute left-full ml-4 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[80]">
              {bottomItem.label}
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
