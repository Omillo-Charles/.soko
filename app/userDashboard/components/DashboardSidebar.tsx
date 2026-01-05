"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  ShoppingBag, 
  Truck, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  X
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/userDashboard" },
    { icon: Package, label: "Products", href: "/userDashboard/products" },
    { icon: FileText, label: "Posts", href: "/userDashboard/posts" },
    { icon: ShoppingBag, label: "Orders", href: "/userDashboard/orders" },
    { icon: Truck, label: "Deliveries", href: "/userDashboard/deliveries" },
    { icon: Users, label: "Customers", href: "/userDashboard/customers" },
  ];

  const bottomItems = [
    { icon: Settings, label: "Settings", href: "/userDashboard/settings" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[110] lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-100 flex flex-col z-[120] transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              D
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900">
              DUUKA
            </span>
          </Link>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl lg:hidden transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 mb-4 mt-4">
            Menu
          </div>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`
                  flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group
                  ${isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-primary"}`} />
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
              </Link>
            );
          })}

          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 mt-10 mb-4">
            Preferences
          </div>
          {bottomItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group
                  ${isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-primary"}`} />
                <span className="font-bold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Area */}
        <div className="p-4 border-t border-slate-50">
          <button className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all duration-200 group">
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-500" />
            <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
