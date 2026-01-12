"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft,
  Store,
  Settings,
  Trash2,
  Save,
  Loader2,
  AlertTriangle,
  User,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  TrendingUp,
  ArrowLeftRight,
  LogOut,
  ChevronRight,
  Camera,
  CheckCircle2,
  Info
} from "lucide-react";

const SellerSettingsPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [shop, setShop] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<"shop" | "account" | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "branding" | "danger">("profile");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    category: ""
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

  useEffect(() => {
    const checkAuthAndShop = async () => {
      const token = localStorage.getItem("accessToken");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        router.push("/auth?mode=login");
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.accountType !== "seller") {
          router.push("/account");
          return;
        }
        setUser(parsedUser);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";
        const shopRes = await fetch(`${apiUrl}/shops/my-shop`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const shopData = await shopRes.json();

        if (shopData.success && shopData.data) {
          setShop(shopData.data);
          setFormData({
            name: shopData.data.name || "",
            description: shopData.data.description || "",
            address: shopData.data.address || "",
            phone: shopData.data.phone || "",
            email: shopData.data.email || "",
            category: shopData.data.category || ""
          });
          setAvatarPreview(shopData.data.avatar || "");
          setBannerPreview(shopData.data.banner || "");
        } else {
          router.push("/account/seller/register-shop");
        }
      } catch (e) {
        console.error("Settings Auth Error:", e);
        router.push("/auth?mode=login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndShop();
  }, [router]);

  const handleUpdateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const token = localStorage.getItem("accessToken");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

    try {
      const response = await fetch(`${apiUrl}/shops/my-shop`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Error Response:", errorText);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setShop(data.data);
        alert("Shop settings updated successfully!");
      } else {
        alert(data.message || "Failed to update shop settings");
      }
    } catch (error) {
      console.error("Update Shop Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateBranding = async () => {
    setIsUpdating(true);
    const token = localStorage.getItem("accessToken");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

    try {
      const submitData = new FormData();
      if (avatarFile) submitData.append("avatar", avatarFile);
      if (bannerFile) submitData.append("banner", bannerFile);

      // If no new files, don't send anything
      if (!avatarFile && !bannerFile) {
        alert("Please select a new image to upload.");
        setIsUpdating(false);
        return;
      }

      // Use a AbortController to handle potential client-side timeouts
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

      const response = await fetch(`${apiUrl}/shops/my-shop/branding`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: submitData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Branding Server Error Response:", errorText);
        
        let errorMessage = "Server error occurred";
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error === "Request Timeout") {
            errorMessage = "The upload timed out. This usually happens with large images or slow internet. Please try again with a smaller file.";
          } else {
            errorMessage = errorJson.message || errorJson.error || errorMessage;
          }
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.success) {
        setShop(data.data);
        setAvatarFile(null);
        setBannerFile(null);
        alert("Shop branding updated successfully!");
      } else {
        alert(data.message || "Failed to update branding");
      }
    } catch (error: any) {
      console.error("Update Branding Error:", error);
      if (error.name === 'AbortError') {
        alert("The upload took too long and was cancelled. Please try with a smaller image or check your connection.");
      } else {
        alert(error.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteShop = async () => {
    const confirmName = prompt(`To delete your shop, please type your shop name: "${shop.name}"`);
    if (confirmName !== shop.name) {
      if (confirmName !== null) alert("Shop name mismatch. Deletion cancelled.");
      return;
    }

    setIsDeleting("shop");
    const token = localStorage.getItem("accessToken");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

    try {
      const response = await fetch(`${apiUrl}/shops/my-shop`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        // Switch back to buyer account type in local storage
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        userData.accountType = "buyer";
        localStorage.setItem("user", JSON.stringify(userData));
        
        alert("Shop deleted successfully. You have been switched back to a buyer account.");
        router.push("/account");
      } else {
        alert(data.message || "Failed to delete shop");
      }
    } catch (error) {
      console.error("Delete Shop Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("PERMANENT ACTION: Are you sure you want to delete your entire account? This will delete your shop, all products, and your user profile forever. This cannot be undone.")) {
      return;
    }

    setIsDeleting("account");
    const token = localStorage.getItem("accessToken");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

    try {
      const response = await fetch(`${apiUrl}/users/me`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        alert("Account deleted permanently. We're sorry to see you go.");
        router.push("/");
      } else {
        alert(data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Delete Account Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.push("/auth?mode=login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar (Consistent with Seller Center) */}
      <div className="hidden lg:block w-72 shrink-0 border-r border-slate-100">
        <aside className="fixed w-72 h-screen bg-white flex flex-col overflow-y-auto custom-scrollbar">
          <div className="p-8 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-black text-xl text-slate-900 tracking-tight">Seller Center</h1>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Settings</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-2">
            <Link href="/account/seller" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-all group">
              <BarChart3 className="w-5 h-5 group-hover:text-primary" />
              Overview
            </Link>
            <Link href="/account/seller/products" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-all group">
              <ShoppingBag className="w-5 h-5 group-hover:text-primary" />
              Products
            </Link>
            <Link href="/account/seller/orders" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-all group">
              <Package className="w-5 h-5 group-hover:text-primary" />
              Orders
            </Link>
            <Link href="/account/seller/settings" className="flex items-center gap-3 px-4 py-3 bg-primary/5 text-primary rounded-xl font-bold transition-all">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>

          <div className="p-6 border-t border-slate-50 space-y-3">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-10 pb-24 lg:pb-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/account/seller" className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-slate-600 shadow-sm">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Shop Settings</h2>
              <p className="text-slate-500 font-medium">Manage your store identity and account preferences.</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-white border border-slate-100 rounded-2xl w-full max-w-md shadow-sm">
            <button 
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "profile" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:text-slate-900"}`}
            >
              Shop Profile
            </button>
            <button 
              onClick={() => setActiveTab("branding")}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "branding" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:text-slate-900"}`}
            >
              Branding
            </button>
            <button 
              onClick={() => setActiveTab("danger")}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "danger" ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-slate-500 hover:text-red-500"}`}
            >
              Danger Zone
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "profile" && (
              <form onSubmit={handleUpdateShop} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8 md:p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Shop Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900"
                      placeholder="Your Shop Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900 appearance-none"
                    >
                      <option value="">Select Category</option>
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion</option>
                      <option value="home">Home & Garden</option>
                      <option value="beauty">Beauty</option>
                      <option value="sports">Sports</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea 
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900 resize-none"
                      placeholder="Describe what you sell..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Location / Address</label>
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900"
                      placeholder="e.g. Nairobi, Kenya"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900"
                      placeholder="+254..."
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex justify-end">
                  <button 
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    SAVE PROFILE CHANGES
                  </button>
                </div>
              </form>
            )}

            {activeTab === "branding" && (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8 md:p-10 space-y-10">
                {/* Banner Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Shop Banner</h3>
                  <div className="relative group">
                    <div className="h-48 w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-100">
                      {bannerPreview ? (
                        <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <TrendingUp className="w-12 h-12 opacity-20" />
                        </div>
                      )}
                    </div>
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center cursor-pointer">
                      <div className="flex flex-col items-center gap-2 text-white">
                        <Camera className="w-8 h-8" />
                        <span className="font-bold text-sm">Upload New Banner</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleBannerChange}
                        />
                      </div>
                    </label>
                  </div>
                  {bannerFile && (
                    <p className="text-xs text-primary font-bold">Selected: {bannerFile.name}</p>
                  )}
                </div>

                {/* Avatar Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Shop Avatar</h3>
                  <div className="flex items-center gap-8">
                    <div className="relative group shrink-0">
                      <div className="w-32 h-32 bg-slate-100 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Store className="w-10 h-10 opacity-20" />
                          </div>
                        )}
                      </div>
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] flex items-center justify-center cursor-pointer">
                        <Camera className="w-6 h-6 text-white" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-bold text-slate-700">Upload Shop Avatar</p>
                      <p className="text-[10px] text-slate-400 font-bold">Square images (e.g. 512x512) work best for avatars.</p>
                      {avatarFile && (
                        <p className="text-xs text-primary font-bold">Selected: {avatarFile.name}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex justify-end">
                  <button 
                    onClick={handleUpdateBranding}
                    disabled={isUpdating}
                    className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    SAVE BRANDING CHANGES
                  </button>
                </div>
              </div>
            )}

            {activeTab === "danger" && (
              <div className="space-y-6">
                {/* Delete Shop Card */}
                <div className="bg-white rounded-[2.5rem] border border-red-100 shadow-sm overflow-hidden">
                  <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center shrink-0">
                      <Store className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Delete Shop</h3>
                      <p className="text-slate-500 font-medium mt-1">
                        This will remove your store, products, and sales history. Your buyer account will remain active.
                      </p>
                    </div>
                    <button 
                      onClick={handleDeleteShop}
                      disabled={isDeleting !== null}
                      className="w-full md:w-auto px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-sm hover:bg-red-100 transition-all disabled:opacity-50"
                    >
                      {isDeleting === "shop" ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "DELETE SHOP"}
                    </button>
                  </div>
                </div>

                {/* Delete Account Card */}
                <div className="bg-slate-900 rounded-[2.5rem] shadow-xl overflow-hidden">
                  <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center shrink-0">
                      <Trash2 className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">Delete Account</h3>
                      <p className="text-slate-400 font-medium mt-1">
                        Permanently remove your account and all associated data. This action is irreversible.
                      </p>
                    </div>
                    <button 
                      onClick={handleDeleteAccount}
                      disabled={isDeleting !== null}
                      className="w-full md:w-auto px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      {isDeleting === "account" ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "DELETE ACCOUNT"}
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black text-amber-900 text-sm uppercase tracking-tight">Warning</h4>
                    <p className="text-amber-800 text-xs font-bold leading-relaxed mt-1">
                      Destructive actions cannot be undone. Please ensure you have backed up any important data or completed pending orders before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerSettingsPage;
