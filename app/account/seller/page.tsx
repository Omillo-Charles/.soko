"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  ShoppingBag, 
  Package, 
  Users, 
  BarChart3, 
  Plus, 
  ArrowLeft,
  ArrowLeftRight,
  TrendingUp,
  Store,
  Settings,
  ChevronRight,
  LogOut,
  Bell,
  MapPin
} from "lucide-react";

import { useUser } from "@/hooks/useUser";
import { useMyShop } from "@/hooks/useShop";
import { useMyProducts } from "@/hooks/useProducts";
import { useSellerOrders } from "@/hooks/useSellerOrders";
import LogoutConfirmation from "@/components/LogoutConfirmation";
import { RegisterShopModal } from "@/components/RegisterShopModal";

const SellerDashboard = () => {
  const router = useRouter();
  const { user, isLoading: isUserLoading, logout } = useUser();
  const { data: shop, isLoading: isShopLoading, error: shopError } = useMyShop();
  const { data: products = [], isLoading: isProductsLoading } = useMyProducts();
  const { orders = [], isLoading: isOrdersLoading } = useSellerOrders();

  const [accountType, setAccountType] = useState<"seller" | "buyer">("seller");
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
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
      setShowRegisterModal(true);
    }
  }, [user, isUserLoading, shop, isShopLoading, shopError, router]);

  const isLoading = isUserLoading || isShopLoading || isProductsLoading || isOrdersLoading;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const toggleAccountType = async () => {
    const newType = "buyer";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${apiUrl}/users/update-account-type`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ accountType: newType }),
      });

      if (!response.ok) throw new Error("Failed to switch account type");

      const data = await response.json();
      
      // Update local storage and redirect
      localStorage.setItem("user", JSON.stringify(data.data));
      router.push("/account");
    } catch (error) {
      console.error("Error switching account:", error);
      alert("Failed to switch account type. Please try again.");
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    router.push("/auth?mode=login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeOrders = orders.filter(order => ['pending', 'processing', 'shipped'].includes(order.status)).length;
  
  // Calculate total sales only for items belonging to this shop
  const totalSales = orders
    .filter(order => order.status !== 'cancelled')
    .reduce((acc, order) => {
      const shopItemsTotal = order.items
        .filter(item => item.shop === shop?._id || (typeof item.shop === 'object' && (item.shop as any)._id === shop?._id))
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return acc + shopItemsTotal;
    }, 0);

  const stats = [
    { label: "Total Sales", value: `KES ${totalSales.toLocaleString()}`, icon: <BarChart3 className="w-5 h-5" />, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", trend: "+0%" },
    { label: "Active Orders", value: activeOrders.toString(), icon: <Package className="w-5 h-5" />, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", trend: activeOrders > 0 ? `+${activeOrders}` : "0" },
    { label: "Total Products", value: products.length.toString(), icon: <ShoppingBag className="w-5 h-5" />, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400", trend: products.length > 0 ? `+${products.length}` : "0" },
    { label: "Store Visits", value: "0", icon: <TrendingUp className="w-5 h-5" />, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", trend: "+0%" },
  ];

  const quickActions = [
    { label: "Add Product", icon: <Plus className="w-5 h-5" />, href: "/account/seller/products?action=add", color: "bg-primary text-primary-foreground" },
    { label: "View Store", icon: <Store className="w-5 h-5" />, href: shop?._id ? `/shop/${shop._id}` : `/shop/my-shop`, color: "bg-background text-foreground border border-border" },
    { label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/account/seller/settings", color: "bg-background text-foreground border border-border" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0 lg:flex">
      <RegisterShopModal 
        isOpen={showRegisterModal}
        onClose={() => router.push("/account")}
        onSuccess={() => window.location.reload()}
      />
      <LogoutConfirmation 
        isOpen={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)} 
        onConfirm={confirmLogout} 
      />
      
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-background px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">Seller Center</span>
        </div>
        <button className="p-2 hover:bg-muted rounded-lg">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-72 shrink-0 border-r border-border">
        <aside 
          className="fixed top-[128px] w-72 h-[calc(100vh-128px)] bg-background flex flex-col overflow-y-auto custom-scrollbar"
        >
          <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Store className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-black text-xl text-foreground tracking-tight">Seller Center</h1>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <Link href="/account/seller" className="flex items-center gap-3 px-4 py-3 bg-primary/5 text-primary rounded-xl font-bold transition-all">
            <BarChart3 className="w-5 h-5" />
            Overview
          </Link>
          <Link href="/account/seller/products" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl font-medium transition-all group">
            <ShoppingBag className="w-5 h-5 group-hover:text-primary" />
            Products
          </Link>
          <Link href="/account/seller/orders" className="flex items-center justify-between px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl font-medium transition-all group">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 group-hover:text-primary" />
              Orders
            </div>
            {activeOrders > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {activeOrders}
              </span>
            )}
          </Link>
          <Link href="/account/seller/customers" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl font-medium transition-all group">
            <Users className="w-5 h-5 group-hover:text-primary" />
            Customers
          </Link>
          <Link href="/account/seller/analytics" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl font-medium transition-all group">
            <TrendingUp className="w-5 h-5 group-hover:text-primary" />
            Analytics
          </Link>
        </nav>

        <div className="p-6 border-t border-border space-y-3">
          <button 
            onClick={toggleAccountType}
            className="w-full flex items-center gap-3 px-4 py-3 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-xl font-bold transition-all"
          >
            <ArrowLeftRight className="w-5 h-5" />
            Switch to Buyer
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl font-bold transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
        </aside>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-3 lg:p-8 pb-32 lg:pb-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-foreground tracking-tight">{isMounted ? (shop?.name || "Store Overview") : "Store Overview"}</h2>
              <p className="text-muted-foreground font-medium text-sm">Welcome back, {isMounted ? (user?.name || "User") : "User"}! Your shop is looking great.</p>
            </div>
            <div className="flex items-center gap-3">
              {quickActions.map((action, idx) => (
                <Link 
                  key={idx}
                  href={action.href}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm hover:shadow-md ${action.color}`}
                >
                  {action.icon}
                  <span className="hidden sm:inline">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-background p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                    {stat.trend}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-black text-foreground mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Shop Profile Card - Full Width */}
          <div className="bg-background rounded-[2.5rem] border border-border shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 h-48 md:h-auto bg-muted relative shrink-0">
              {shop?.banner ? (
                <img src={shop.banner} alt="Shop Banner" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary/60" />
              )}
              
              <div className="absolute -bottom-10 left-8 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:-right-12 md:left-auto">
                <div className="w-24 h-24 bg-background rounded-[2rem] p-1.5 shadow-2xl relative z-10">
                  <div className="w-full h-full bg-muted rounded-[1.5rem] flex items-center justify-center overflow-hidden">
                    {shop?.avatar ? (
                      <img src={shop.avatar} alt="Shop Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <Store className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-8 pt-14 md:pt-8 md:pl-20 grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-foreground text-2xl tracking-tight">{isMounted ? (shop?.name || user?.name + "'s Shop") : "Your Shop"}</h3>
                  {shop?.username && (
                    <span className="text-xs font-bold text-muted-foreground">@{shop.username}</span>
                  )}
                </div>
                <p className="text-muted-foreground font-medium text-sm">Status: <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg text-xs">{shop?.isVerified ? "Verified" : "Active"}</span></p>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-bold">Category:</span>
                    <span className="text-sm font-black text-foreground capitalize">{shop?.category || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-bold">Location:</span>
                    <span className="text-sm font-black text-foreground">{shop?.address || "N/A"}</span>
                  </div>
                </div>

                <Link 
                  href="/account/seller/settings"
                  className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all inline-block"
                >
                  Edit Shop Profile
                </Link>
              </div>

              <div className="border-t lg:border-t-0 lg:border-l border-border pt-8 lg:pt-0 lg:pl-8">
                <h3 className="font-bold text-foreground text-lg mb-4">Quick Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                  <Link href="/account/seller/products" className="flex items-center justify-between p-3 hover:bg-muted rounded-xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                        <ShoppingBag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="font-bold text-sm text-foreground">Products</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                  <Link href="/account/seller/orders" className="flex items-center justify-between p-3 hover:bg-muted rounded-xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors relative">
                        <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        {activeOrders > 0 && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-background" />
                        )}
                      </div>
                      <span className="font-bold text-sm text-foreground">Orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeOrders > 0 && (
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded">
                          {activeOrders}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                  <Link href="/account/seller/settings" className="flex items-center justify-between p-3 hover:bg-muted rounded-xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                        <Settings className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="font-bold text-sm text-foreground">Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-background rounded-[2rem] border border-border shadow-sm overflow-hidden">
              <div className="p-8 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-foreground text-lg">Recent Orders</h3>
                <Link href="/account/seller/orders" className="text-primary text-sm font-bold hover:underline">
                  View All
                </Link>
              </div>
              <div className="p-4">
                {orders.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-bold text-foreground">No orders yet</h4>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">
                      When you start receiving orders, they will appear here for you to manage.
                    </p>
                    <button className="mt-6 px-6 py-2 bg-foreground text-background rounded-xl font-bold text-sm hover:opacity-90 transition-colors">
                      Share Your Store
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <Link 
                        key={order._id}
                        href={`/account/orders/${order._id}`}
                        className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 rounded-2xl border border-border transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-border shadow-sm">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">Order #{order._id.slice(-6).toUpperCase()}</p>
                            <p className="text-muted-foreground text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground text-sm">
                            KES {order.items
                              .filter(item => item.shop === shop?._id || (typeof item.shop === 'object' && (item.shop as any)._id === shop?._id))
                              .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                              .toLocaleString()}
                          </p>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-background rounded-[2rem] border border-border shadow-sm overflow-hidden">
              <div className="p-8 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-foreground text-lg">My Products</h3>
                <Link href="/account/seller/products" className="text-primary text-sm font-bold hover:underline">
                  View All
                </Link>
              </div>
              <div className="p-8">
                {products.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-bold text-foreground">No products yet</h4>
                    <p className="text-muted-foreground text-sm mt-2">Start adding products to see them here.</p>
                    <Link href="/account/seller/products?action=add" className="mt-4 inline-block px-6 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm">
                      Add Your First Product
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product: any) => (
                      <div key={product._id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl border border-border group hover:bg-background hover:shadow-md transition-all">
                        <div className="w-16 aspect-square rounded-xl overflow-hidden bg-background shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-foreground truncate">{product.name}</h4>
                          <p className="text-muted-foreground text-sm font-bold text-primary">KES {product.price?.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                          <p className="text-[10px] text-muted-foreground mt-1 font-bold">{product.stock} units</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;
