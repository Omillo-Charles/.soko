"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardHeader from "./components/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/userDashboard") return "Dashboard Overview";
    if (pathname.includes("/products")) return "Inventory Management";
    if (pathname.includes("/orders")) return "Order Management";
    if (pathname.includes("/deliveries")) return "Delivery Logistics";
    return "Admin Control Center";
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      <DashboardSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden relative">
        <DashboardHeader 
          title={getPageTitle()} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
