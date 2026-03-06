"use client";

import { ReactNode, useState } from 'react';
import { AccountSidebar } from '@/components/AccountSidebar';
import { Menu, X } from 'lucide-react';

const AccountLayout = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* 1. Desktop Sidebar (Fixed on the left, below the global navbar) */}
      <aside className="hidden lg:flex w-72 border-r border-border flex-col fixed top-[128px] bottom-0 left-0 bg-background z-20">
        <AccountSidebar />
      </aside>

      {/* 2. Mobile Drawer (Independent implementation) */}
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Mobile Sliding Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-background border-r border-border transition-transform duration-300 ease-in-out lg:hidden flex flex-col
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="absolute top-4 right-4 z-[80]">
          <button 
            onClick={closeSidebar}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto" onClick={closeSidebar}>
          <AccountSidebar />
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-72 min-w-0">
        {/* Mobile Header (Only visible on mobile, sticky below the global mobile navbar) */}
        <header className="lg:hidden sticky top-[80px] z-30 flex items-center h-16 px-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <button
            onClick={toggleSidebar}
            className="p-2 mr-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg">Account</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;