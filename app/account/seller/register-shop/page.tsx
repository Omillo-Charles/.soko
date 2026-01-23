"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Store, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Mail, 
  Info,
  ChevronLeft,
  ShoppingBag,
  Package,
  CheckCircle2,
  Image as ImageIcon,
  Globe,
  Camera,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

import { categories as allCategories } from "@/constants/categories";

const categories = allCategories.filter(c => c.value !== 'all');

const RegisterShopPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    address: "",
    phone: "",
    email: ""
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  useEffect(() => {
    const checkExistingShop = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/auth?mode=login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";
      try {
        const response = await fetch(`${apiUrl}/shops/my-shop`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success && data.data) {
          router.push("/account/seller");
        }
      } catch (err) {
        console.error("Error checking shop:", err);
      } finally {
        setIsChecking(false);
      }
    };

    checkExistingShop();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setBannerPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("accessToken");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

    try {
      // Step 1: Register the shop with text data first (using JSON as the API seems to prefer it for shop profile)
      const response = await fetch(`${apiUrl}/shops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Shop registration error detail:", data);
        throw new Error(data.message || data.error || "Failed to register shop");
      }

      // Step 2: If there are images, upload them separately to the branding endpoint
      // This matches the pattern used in the seller settings page
      if (logoFile || bannerFile) {
        const brandingData = new FormData();
        if (logoFile) brandingData.append("avatar", logoFile);
        if (bannerFile) brandingData.append("banner", bannerFile);

        try {
          const brandingResponse = await fetch(`${apiUrl}/shops/my-shop/branding`, {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${token}`
            },
            body: brandingData
          });

          if (!brandingResponse.ok) {
            const brandingError = await brandingResponse.json();
            console.error("Branding upload error:", brandingError);
            // We don't throw here because the shop was already created successfully
            toast.error("Shop created, but there was an error uploading the images. You can update them later in settings.");
          }
        } catch (brandingErr) {
          console.error("Branding upload fetch error:", brandingErr);
          toast.error("Shop created, but images could not be uploaded. You can update them in settings.");
        }
      }

      // Step 3: Update local user data to reflect seller status and redirect
       const userData = JSON.parse(localStorage.getItem("user") || "{}");
       if (userData) {
         userData.accountType = "seller";
         localStorage.setItem("user", JSON.stringify(userData));
       }
       toast.success("Shop registered successfully!");
       router.push("/account/seller");
    } catch (err: any) {
      toast.error(err.message || "Failed to register shop");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-primary/10">
      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 pt-8 pb-32 md:py-12">
        {/* Studio Header */}
        <div className="flex items-center justify-between mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Store className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shop Studio</h1>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Establish your brand identity</p>
          </div>
          <button 
            onClick={() => router.back()} 
            className="p-4 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 rounded-2xl transition-all active:scale-95 group border border-transparent hover:border-slate-100 flex items-center gap-3"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900">Cancel</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Column: Form */}
          <div className="w-full lg:w-3/5 space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Branding Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-4 ml-2">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Branding & Visuals</h2>
                </div>
                
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden group/card transition-all hover:shadow-primary/5">
                  <div className="p-8 md:p-10 space-y-8">
                    {/* Banner Upload Zone */}
                    <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-slate-50 bg-slate-50 aspect-[21/9] group/banner">
                      {bannerPreview ? (
                        <>
                          <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover transition-transform duration-1000 group-hover/banner:scale-110" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/banner:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-md">
                            <div className="flex gap-4 scale-90 group-hover/banner:scale-100 transition-transform duration-500">
                              <label className="w-12 h-12 bg-white hover:bg-primary hover:text-white text-slate-900 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-2xl hover:scale-110 active:scale-90">
                                <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                                <Camera className="w-5 h-5" />
                              </label>
                              <button 
                                type="button"
                                onClick={() => { setBannerFile(null); setBannerPreview(null); }}
                                className="w-12 h-12 bg-white hover:bg-red-500 hover:text-white text-red-500 rounded-2xl flex items-center justify-center transition-all shadow-2xl hover:scale-110 active:scale-90"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full border-4 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50 hover:bg-white hover:border-primary/30 transition-all cursor-pointer group/upload">
                          <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                          <div className="w-16 h-16 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center mb-4 group-hover/upload:scale-110 group-hover/upload:rotate-6 transition-all duration-500">
                            <ImageIcon className="w-7 h-7 text-slate-400 group-hover/upload:text-primary" />
                          </div>
                          <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Upload Shop Banner</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-2">Recommended: 1200x400px</p>
                        </label>
                      )}

                      {/* Logo Upload Zone - Overlapping */}
                      <div className="absolute bottom-6 left-8 group/logo">
                        <div className="relative w-28 h-28 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden bg-white ring-8 ring-white/20 transition-transform duration-500 hover:scale-105">
                          {logoPreview ? (
                            <>
                              <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                                <label className="w-10 h-10 bg-white text-slate-900 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all active:scale-90">
                                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                  <Camera className="w-4 h-4" />
                                </label>
                              </div>
                            </>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-full bg-slate-50 cursor-pointer hover:bg-white transition-all group/logo-upload">
                              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                              <div className="p-3 rounded-xl bg-white shadow-sm border border-slate-100 group-hover/logo-upload:scale-110 transition-transform">
                                <Store className="w-6 h-6 text-slate-400 group-hover/logo-upload:text-primary" />
                              </div>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-2">Logo</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Information Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-4 ml-2">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Store Identity</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3 col-span-full">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Shop Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Urban Threads Collective"
                      className="w-full px-8 py-6 bg-white border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 shadow-xl shadow-slate-200/20 transition-all font-bold text-slate-900 placeholder:text-slate-300 text-lg"
                    />
                  </div>

                  <div className="space-y-3 col-span-full">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Description</label>
                    <textarea
                      name="description"
                      required
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="What makes your shop special? Your story, your mission..."
                      rows={5}
                      className="w-full px-8 py-6 bg-white border border-slate-100 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 shadow-xl shadow-slate-200/20 transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Category</label>
                    <div className="relative group">
                      <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-8 py-5 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 shadow-xl shadow-slate-200/20 transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                      <Package className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Business Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="hello@yourshop.com"
                        className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 shadow-xl shadow-slate-200/20 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+254 700 000 000"
                        className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 shadow-xl shadow-slate-200/20 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Physical Address</label>
                    <div className="relative group">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="e.g. 1st Floor, Garden Plaza"
                        className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 shadow-xl shadow-slate-200/20 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Action Bar */}
              <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <CheckCircle2 className={`w-5 h-5 ${formData.name && formData.email && formData.address ? 'text-emerald-500' : 'text-slate-300'}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Ready to Launch</p>
                    <p className="text-[9px] font-bold text-slate-500 mt-0.5">Your shop will be live instantly</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !formData.name}
                  className="w-full md:w-auto bg-primary text-white px-12 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] disabled:opacity-50 transition-all hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/40 active:scale-95 flex items-center justify-center gap-4 group"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Launching...</span>
                    </>
                  ) : (
                    <>
                      <span>Launch Your Studio</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Preview */}
          <div className="hidden lg:block lg:w-2/5 sticky top-32 animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="space-y-8">
              <div className="flex items-center justify-between px-6">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Real-time Preview</h3>
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Studio Active</span>
                </div>
              </div>

              {/* Glassmorphism Preview Card */}
              <div className="bg-white/40 backdrop-blur-xl border border-white rounded-[4rem] p-10 shadow-2xl shadow-slate-200/60 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-2xl relative z-10">
                  {/* Mock Shop Banner */}
                  <div className="h-40 bg-slate-50 relative overflow-hidden">
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-100 to-slate-50">
                        <ImageIcon className="w-10 h-10 text-slate-200" />
                      </div>
                    )}
                    <div className="absolute top-6 right-6">
                      <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/50">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em]">
                          {formData.category || 'CATEGORY'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mock Shop Profile */}
                  <div className="px-8 pb-8 relative">
                    <div className="relative -mt-12 mb-6 inline-block">
                      <div className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden bg-white ring-8 ring-slate-50/50">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-200">
                            <Store className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 text-2xl tracking-tight">
                          {formData.name || 'Your Brand Name'}
                        </h4>
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
                          <CheckCircle2 className="w-3 h-3 text-white fill-current" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-tight">
                          {formData.address || 'Business Location'}
                        </span>
                      </div>
                    </div>

                    <p className="mt-6 text-sm font-bold text-slate-500 line-clamp-3 leading-relaxed">
                      {formData.description || 'Your studio description will appear here. Share your unique vision with your future customers.'}
                    </p>

                    <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex gap-6">
                        <div className="text-center">
                          <p className="text-lg font-black text-slate-900">0</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Products</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-black text-slate-900">5.0</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</p>
                        </div>
                      </div>
                      <button className="px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-slate-900/20 active:scale-95 transition-transform">
                        Visit Shop
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="mt-8 p-8 bg-gradient-to-br from-emerald-50 to-white rounded-[2.5rem] border border-emerald-100 shadow-xl shadow-emerald-500/5 space-y-4 relative overflow-hidden group/info">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/info:scale-150 transition-transform duration-1000">
                    <Globe className="w-20 h-20 text-emerald-500" />
                  </div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-white flex items-center justify-center shadow-lg shadow-emerald-200/50">
                      <Globe className="w-6 h-6 text-emerald-500" />
                    </div>
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Global Presence</span>
                  </div>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed relative z-10">
                    Your studio will be indexed globally, making your products accessible to millions of shoppers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterShopPage;
