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
  Store,
  ArrowLeftRight,
  LogIn
} from "lucide-react";

import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import LogoutConfirmation from "@/components/LogoutConfirmation";
import { RegisterShopModal } from "@/components/RegisterShopModal";

const AccountPage = () => {
  const router = useRouter();
  const { user, isLoading: userLoading, logout, updateAccountType, isUpdatingAccountType } = useUser();

  const [accountType, setAccountType] = useState<"buyer" | "seller">("buyer");
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!userLoading && !user) {
      router.push("/auth?mode=login");
    }
    if (user) {
      setAccountType(user.accountType || "buyer");
    }
  }, [user, userLoading, router]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/auth?mode=login");
  };

  const toggleAccountType = async (targetType?: "buyer" | "seller") => {
    const newType = targetType || (accountType === "buyer" ? "seller" : "buyer");
    
    try {
      await updateAccountType(newType);
      setAccountType(newType);
      toast.success(`Switched to ${newType} account`);
      return true;
    } catch (error) {
      console.error("Error switching account:", error);
      toast.error("Failed to switch account type");
      return false;
    }
  };

  const handleSellerCenterClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 1. Ensure we are in seller mode
    const success = await toggleAccountType("seller");
    if (success) {
      // 2. Check if user has a shop registered
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";
      const token = localStorage.getItem("accessToken");
      
      try {
        const response = await fetch(`${apiUrl}/shops/my-shop`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (data.success && data.data) {
          // Shop exists, go to dashboard
          window.location.href = "/account/seller";
        } else {
          // No shop, show registration modal
          setIsLoading(false);
          setShowRegisterModal(true);
        }
      } catch (err) {
        console.error("Error checking shop:", err);
        window.location.href = "/account/seller"; // Fallback
      }
    } else {
      setIsLoading(false);
    }
  };

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const menuItems = [
    { icon: <Package className="w-5 h-5" />, label: "My Orders", href: "/account/orders", desc: "Track, return, or buy things again" },
    { icon: <Heart className="w-5 h-5" />, label: "Wishlist", href: "/wishlist", desc: "Your saved items and collections" },
    { icon: <MapPin className="w-5 h-5" />, label: "Addresses", href: "/account/addresses", desc: "Edit addresses for orders" },
    { icon: <CreditCard className="w-5 h-5" />, label: "Payment Methods", href: "/account/payments", desc: "Manage your saved cards" },
    { icon: <Bell className="w-5 h-5" />, label: "Notifications", href: "/account/notifications", desc: "Set your communication preferences" },
    { icon: <ShieldCheck className="w-5 h-5" />, label: "Security", href: "/account/security", desc: "Change password and protect account" },
    { icon: <Store className="w-5 h-5" />, label: "Seller Center", href: "/account/seller", desc: "Manage your store and sell products" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-20 pt-8 px-4">
      <div className="max-w-6xl mx-auto">
        <LogoutConfirmation 
          isOpen={showLogoutConfirm} 
          onClose={() => setShowLogoutConfirm(false)} 
          onConfirm={confirmLogout} 
        />
        <RegisterShopModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={() => {
            setShowRegisterModal(false);
            window.location.href = "/account/seller";
          }}
        />
        {/* Header Section */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-row flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                  Hello, {isMounted ? (user?.name || "User") : "User"}!
                </h1>
                <span className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider font-black whitespace-nowrap ${
                  accountType === "seller" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                }`}>
                  {accountType} Mode
                </span>
              </div>
              <p className="text-slate-500 font-medium">{isMounted ? user?.email : ""}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <span className="px-4 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Verified Account
                </span>
                <span className="px-4 py-1.5 bg-primary/5 text-primary text-xs font-bold rounded-full border border-primary/10">
                  Member since {isMounted ? new Date().getFullYear() : "2026"}
                </span>
                <button 
                  onClick={() => toggleAccountType()}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 transition-all duration-300 ${
                    accountType === "seller" 
                    ? "bg-amber-50 text-amber-700 border-amber-200" 
                    : "bg-indigo-50 text-indigo-700 border-indigo-200"
                  }`}
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  Switch to {accountType === "buyer" ? "Seller" : "Buyer"}
                </button>
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Dashboard Menu */}
          <div className="flex-1 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 px-2">
              <LayoutDashboard className="w-5 h-5 text-primary" />
              Account Settings
            </h2>
            <div className="flex flex-wrap gap-4">
              {menuItems.map((item, index) => {
                const isSellerCenter = item.label === "Seller Center";
                
                return (
                  <Link 
                    key={index} 
                    href={item.href}
                    onClick={isSellerCenter ? handleSellerCenterClick : undefined}
                    className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all text-left flex-[1_1_300px]"
                  >
                    <div className="w-10 h-10 bg-slate-50 group-hover:bg-primary/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors mb-4">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">{item.label}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    <div className="mt-4 flex items-center text-primary text-xs font-bold transition-opacity">
                      {isSellerCenter && accountType !== "seller" ? "Become a Seller" : "Manage"} <ChevronRight className="w-3 h-3 ml-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:w-80 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 px-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Quick Stats
            </h2>
            <div className="bg-primary p-8 rounded-[2rem] text-white relative overflow-hidden shadow-xl shadow-primary/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative z-10">
                <p className="text-blue-100 text-sm font-medium">Total Balance</p>
                <p className="text-3xl font-bold mt-1">KES 0.00</p>
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
