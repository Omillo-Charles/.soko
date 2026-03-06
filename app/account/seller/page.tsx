"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShoppingBag, 
  Package, 
  BarChart3, 
  Plus, 
  TrendingUp,
  Store,
  Settings
} from "lucide-react";

import { useUser } from "@/hooks/useUser";
import { useMyShop } from "@/hooks/useShop";
import { useMyProducts } from "@/hooks/useProducts";
import { useSellerOrders } from "@/hooks/useSellerOrders";

const SellerDashboard = () => {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();
  const { data: shop, isLoading: isShopLoading, error: shopError } = useMyShop();
  const { data: products = [], isLoading: isProductsLoading } = useMyProducts();
  const { orders = [], isLoading: isOrdersLoading } = useSellerOrders();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isUserLoading && !user) {
      router.push("/auth?mode=login");
      return;
    }

    if (user && user.accountType !== "seller") {
      router.push("/account");
      return;
    }

    if (!isShopLoading && !shop && !shopError) {
      router.push("/account/seller/create");
    }
  }, [user, isUserLoading, shop, isShopLoading, shopError, router]);

  const isLoading = isUserLoading || isShopLoading || isProductsLoading || isOrdersLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeOrders = orders.filter(order => ['pending', 'processing', 'shipped'].includes(order.status)).length;
  
  const totalSales = orders
    .filter(order => order.status !== 'cancelled')
    .reduce((acc, order) => {
      const shopItemsTotal = order.items
        .filter(item => item.shop === shop?._id || (typeof item.shop === 'object' && (item.shop as any)._id === shop?._id))
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return acc + shopItemsTotal;
    }, 0);

  const stats = [
    { label: "Total Sales", value: `KES ${totalSales.toLocaleString()}`, icon: <BarChart3 className="w-5 h-5" />, color: "bg-emerald-500/10 text-emerald-600" },
    { label: "Active Orders", value: activeOrders.toString(), icon: <Package className="w-5 h-5" />, color: "bg-blue-500/10 text-blue-600" },
    { label: "Total Products", value: products.length.toString(), icon: <ShoppingBag className="w-5 h-5" />, color: "bg-purple-500/10 text-purple-600" },
    { label: "Store Visits", value: "0", icon: <TrendingUp className="w-5 h-5" />, color: "bg-amber-500/10 text-amber-600" },
  ];

  const quickActions = [
    { label: "Add Product", icon: <Plus className="w-5 h-5" />, href: "/account/seller/products?action=add", color: "bg-primary text-primary-foreground" },
    { label: "View Store", icon: <Store className="w-5 h-5" />, href: shop ? `/shop/${shop.username ? `@${shop.username}` : shop._id}` : `/shop/my-shop`, color: "bg-muted text-foreground" },
    { label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/account/seller/settings", color: "bg-muted text-foreground" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{isMounted ? (shop?.name || "Store Overview") : "Store Overview"}</h2>
          <p className="text-muted-foreground">Welcome back, {isMounted ? (user?.name || "User") : "User"}!</p>
        </div>
        <div className="flex items-center gap-3">
          {quickActions.map((action, idx) => (
            <Link 
              key={idx}
              href={action.href}
              className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors ${action.color}`}
            >
              {action.icon}
              <span className="hidden sm:inline">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-background p-6 rounded-xl border border-border">
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboard;
