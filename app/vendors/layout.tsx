"use client";

import React, { useState } from "react";
import VendorSidebar from "./components/VendorSidebar";
import VendorHeader from "./components/VendorHeader";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <VendorSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      {/* Main Content Area */}
      <div className={`
        flex-1 flex flex-col min-w-0 transition-all duration-300
        md:${isSidebarCollapsed ? "ml-16" : "ml-24"}
      `}>
        <VendorHeader 
          onMenuClick={() => setIsSidebarOpen(true)} 
          isSidebarCollapsed={isSidebarCollapsed}
        />
        
        <div className="flex-1 flex overflow-hidden pt-20 relative">
          {children}
        </div>
      </div>
    </div>
  );
}