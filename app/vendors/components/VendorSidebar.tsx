"use client";

import React from "react";
import Link from "next/link";
import { 
  Home, 
  Search, 
  TrendingUp, 
  ShoppingCart, 
  User, 
  PanelLeftClose,
  PanelLeftOpen,
  X
} from "lucide-react";

interface VendorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const VendorSidebar = ({ isOpen, onClose, isCollapsed, onToggle }: VendorSidebarProps) => {
  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/shop" },
    { icon: TrendingUp, label: "Trending", href: "/trending" },
    { icon: ShoppingCart, label: "Shop Now", href: "/shop" },
  ];

  const bottomItem = { icon: User, label: "Account", href: "/account" };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[110] md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 h-full bg-white border-r border-slate-100 z-[120] transition-all duration-300 ease-in-out flex flex-col items-center
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "w-16" : "w-64 md:w-24"}
        `}
      >
        {/* Mobile Close Button & Toggle Area */}
        <div className="w-full flex items-center justify-between p-6 md:justify-center">
          <Link href="/" className="md:hidden flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              D
            </div>
            {!isCollapsed && (
              <span className="font-black text-xl tracking-tight text-slate-900">
                DUUKA
              </span>
            )}
          </Link>

          <button 
            onClick={onToggle}
            className="hidden md:flex p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-primary transition-all group relative"
          >
            {isCollapsed ? <PanelLeftOpen className="w-6 h-6" /> : <PanelLeftClose className="w-6 h-6" />}
          </button>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl md:hidden transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 w-full overflow-y-auto no-scrollbar flex flex-col items-center pb-6">
          {/* Logo/Brand Icon Area - Desktop Only */}
          <div className="mb-10 hidden md:block">
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
          <nav className="flex flex-col gap-6 mb-8 w-full items-center">
            {navItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.href}
                className="group relative flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors w-full px-4"
              >
                <div className={`p-3 rounded-2xl group-hover:bg-primary/5 transition-colors ${isCollapsed ? "scale-90" : ""}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                
                {!isCollapsed && (
                  <span className="text-[10px] font-bold uppercase tracking-wider md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                )}
                
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[80]">
                    {item.label}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* Bottom Account Item */}
          <div className="mt-auto w-full flex flex-col items-center">
            <Link 
              href={bottomItem.href}
              className="group relative flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors w-full px-4"
            >
              <div className={`p-3 rounded-2xl group-hover:bg-primary/5 transition-colors ${isCollapsed ? "scale-90" : ""}`}>
                <bottomItem.icon className="w-6 h-6" />
              </div>
              
              {!isCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  {bottomItem.label}
                </span>
              )}

              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[80]">
                  {bottomItem.label}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                </div>
              )}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default VendorSidebar;