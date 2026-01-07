"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  Settings, 
  ShoppingBag, 
  Heart, 
  LogOut, 
  ChevronRight,
  Package,
  MapPin,
  CreditCard,
  Bell,
  ShieldCheck,
  LayoutDashboard,
  LogIn
} from "lucide-react";

const AccountPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Protection logic: Check for token and user data
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/auth?mode=login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      router.push("/auth?mode=login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.push("/auth?mode=login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const menuItems = [
    { icon: <Package className="w-5 h-5" />, label: "My Orders", href: "/account/orders", desc: "Track, return, or buy things again" },
    { icon: <Heart className="w-5 h-5" />, label: "Wishlist", href: "/account/wishlist", desc: "Your saved items and collections" },
    { icon: <MapPin className="w-5 h-5" />, label: "Addresses", href: "/account/addresses", desc: "Edit addresses for orders" },
    { icon: <CreditCard className="w-5 h-5" />, label: "Payment Methods", href: "/account/payments", desc: "Manage your saved cards" },
    { icon: <Bell className="w-5 h-5" />, label: "Notifications", href: "/account/notifications", desc: "Set your communication preferences" },
    { icon: <ShieldCheck className="w-5 h-5" />, label: "Security", href: "/account/security", desc: "Change password and protect account" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-900">Hello, {user?.name || "User"}!</h1>
              <p className="text-slate-500 font-medium mt-1">{user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <span className="px-4 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Verified Account
                </span>
                <span className="px-4 py-1.5 bg-primary/5 text-primary text-xs font-bold rounded-full border border-primary/10">
                  Member since {new Date().getFullYear()}
                </span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 transition-colors rounded-2xl font-bold text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Dashboard Menu */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 px-2">
              <LayoutDashboard className="w-5 h-5 text-primary" />
              Account Settings
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {menuItems.map((item, index) => (
                <Link 
                  key={index} 
                  href={item.href}
                  className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all text-left"
                >
                  <div className="w-10 h-10 bg-slate-50 group-hover:bg-primary/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.label}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  <div className="mt-4 flex items-center text-primary text-xs font-bold transition-opacity">
                    Manage <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 px-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Quick Stats
            </h2>
            <div className="bg-primary p-8 rounded-[2rem] text-white relative overflow-hidden shadow-xl shadow-primary/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative z-10">
                <p className="text-blue-100 text-sm font-medium">Total Balance</p>
                <p className="text-3xl font-bold mt-1">$0.00</p>
                <button className="mt-6 w-full py-3 bg-white text-primary rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <LogIn className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-medium">Logged in from Chrome</p>
                    <p className="text-slate-400 text-xs">Today at 4:05 PM</p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Settings className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-medium">Account setup completed</p>
                    <p className="text-slate-400 text-xs">Today at 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
