"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Settings, 
  ShoppingBag, 
  LogOut, 
  ArrowLeftRight,
  Store,
  Package,
  ArrowRight,
  Plus
} from "lucide-react";

import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import LogoutConfirmation from "@/components/LogoutConfirmation";
import { GoldCheck } from "@/components/GoldCheck";
import api from "@/lib/api";
import Link from "next/link";

const AccountPage = () => {
  const router = useRouter();
  const { user, isLoading: userLoading, logout, updateAccountType } = useUser();

  const [accountType, setAccountType] = useState<"buyer" | "seller">("buyer");
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasShop, setHasShop] = useState<boolean | null>(null);
  const [shopProducts, setShopProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!userLoading && !user) {
      router.push("/auth?mode=login");
    }
    if (user) {
      setAccountType(user.accountType || "buyer");
      checkShopStatus();
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (hasShop) {
      fetchShopProducts();
    }
  }, [hasShop]);

  const fetchShopProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await api.get("/products/my-products");
      if (res.data.success) {
        setShopProducts(res.data.data.slice(0, 4));
      }
    } catch (err) {
      console.error("Error fetching shop products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const checkShopStatus = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";
    const token = localStorage.getItem("accessToken");
    
    if (!token) return;

    try {
      const response = await fetch(`${apiUrl}/shops/my-shop`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      setHasShop(data.success && !!data.data);
    } catch (err) {
      console.error("Error checking shop:", err);
      setHasShop(false);
    }
  };

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
    
    if (accountType === newType) {
      return true;
    }

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
    
    const success = await toggleAccountType("seller");
    if (success) {
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
          window.location.href = "/account/seller";
        } else {
          setIsLoading(false);
          router.push("/account/seller/create");
        }
      } catch (err) {
        console.error("Error checking shop:", err);
        window.location.href = "/account/seller";
      }
    } else {
      setIsLoading(false);
    }
  };

  const isBusy = userLoading || isLoading;

  return (
    <div className="w-full mx-auto">
      {isBusy ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
      <>
        <LogoutConfirmation 
          isOpen={showLogoutConfirm} 
          onClose={() => setShowLogoutConfirm(false)} 
          onConfirm={confirmLogout} 
        />
      <div className="bg-background rounded-2xl p-8 shadow-sm border border-border mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-primary" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-row flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <h1 className="text-3xl font-bold text-foreground leading-tight">
                Hello, {isMounted ? (user?.name || "User") : "User"}!
              </h1>
              {user?.isPremium && (
                <GoldCheck className="w-6 h-6" />
              )}
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                accountType === "seller" ? "bg-amber-500/10 text-amber-700" : "bg-indigo-500/10 text-indigo-700"
              }`}>
                {accountType} Mode
              </span>
            </div>
            <p className="text-muted-foreground font-medium">{isMounted ? user?.email : ""}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <span className="px-4 py-1.5 bg-green-500/10 text-green-700 text-xs font-bold rounded-full border border-green-500/20 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Verified Account
              </span>
              <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                Member since {isMounted ? new Date().getFullYear() : "2026"}
              </span>
              {(!hasShop || accountType === "buyer") && (
                <button 
                  onClick={() => toggleAccountType()}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 transition-colors duration-300 ${
                    accountType === "seller" 
                    ? "bg-amber-500/10 text-amber-700 border-amber-500/20" 
                    : "bg-indigo-500/10 text-indigo-700 border-indigo-500/20"
                  }`}
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  Switch to {accountType === "buyer" ? "Seller" : "Buyer"}
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors rounded-xl font-bold text-sm w-full md:w-auto justify-center"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
            <button 
              onClick={handleSellerCenterClick}
              className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-xl font-bold text-sm w-full md:w-auto justify-center"
            >
              <Store className="w-4 h-4" />
              {hasShop === null ? "Checking Shop..." : hasShop ? "View Shop" : "Create Shop"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-background p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-primary"/>Quick Stats</h3>
            <div className="bg-primary p-6 rounded-xl text-primary-foreground relative overflow-hidden">
                <p className="opacity-80 text-sm font-medium">Total Balance</p>
                <p className="text-2xl font-bold mt-1">KES 0.00</p>
            </div>
        </div>
        <div className="bg-background p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-primary"/>Recent Activity</h3>
            <div className="space-y-4 text-sm">
                <p>Logged in from Chrome</p>
                <p>Account setup completed</p>
            </div>
        </div>
      </div>

      {hasShop && (
        <div className="bg-background rounded-2xl p-8 shadow-sm border border-border mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              <Package className="w-6 h-6 text-primary" />
              Products from your shop
            </h3>
            <Link 
              href="/account/seller/products"
              className="text-primary hover:text-primary/80 font-bold text-sm flex items-center gap-1 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : shopProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {shopProducts.map((product) => (
                <Link 
                  key={product.id || product._id}
                  href={`/account/seller/products/edit/${product.id || product._id}`}
                  className="group bg-muted/30 rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <img 
                      src={product.image || "/placeholder-product.png"} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-background/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-primary border border-border">
                      KES {product.price?.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {product.name}
                    </h4>
                    <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      {product.stock} units in stock
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed border-border">
              <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-20" />
              <p className="text-muted-foreground font-medium text-sm">No products listed yet.</p>
              <Link 
                href="/account/seller/products"
                className="inline-flex items-center gap-2 mt-4 text-primary font-bold text-sm hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add your first product
              </Link>
            </div>
          )}
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default AccountPage;
