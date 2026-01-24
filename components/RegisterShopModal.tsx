"use client";

import React, { useState } from "react";
import { 
  Store, 
  X,
  MapPin, 
  Phone, 
  Mail, 
  Package, 
  CheckCircle2,
  Image as ImageIcon,
  Camera,
  Trash2,
  AtSign,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { categories as allCategories } from "@/constants/categories";

const categories = allCategories.filter(c => c.value !== 'all');

interface RegisterShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (shopData: any) => void;
}

export const RegisterShopModal = ({ isOpen, onClose, onSuccess }: RegisterShopModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    description: "",
    category: "",
    address: "",
    phone: "",
    email: ""
  });

  const [usernameStatus, setUsernameStatus] = useState<{
    loading: boolean;
    available: boolean | null;
    error: string | null;
  }>({
    loading: false,
    available: null,
    error: null
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  useEffect(() => {
    const checkUsername = async () => {
      if (!formData.username) {
        setUsernameStatus({ loading: false, available: null, error: null });
        return;
      }

      if (formData.username.length < 3) {
        setUsernameStatus({ loading: false, available: null, error: "Username too short" });
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        setUsernameStatus({ loading: false, available: null, error: "Only letters, numbers and underscores" });
        return;
      }

      setUsernameStatus(prev => ({ ...prev, loading: true }));
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";
        const res = await fetch(`${apiUrl}/shops/check-username/${formData.username}`);
        const data = await res.json();
        setUsernameStatus({
          loading: false,
          available: data.available,
          error: data.available ? null : "Username already taken"
        });
      } catch (e) {
        setUsernameStatus({ loading: false, available: null, error: "Error checking availability" });
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  if (!isOpen) return null;

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
      // Step 1: Register the shop
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
        throw new Error(data.message || data.error || "Failed to register shop");
      }

      // Step 2: Handle image uploads
      if (logoFile || bannerFile) {
        const brandingData = new FormData();
        if (logoFile) brandingData.append("avatar", logoFile);
        if (bannerFile) brandingData.append("banner", bannerFile);

        try {
          await fetch(`${apiUrl}/shops/my-shop/branding`, {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${token}`
            },
            body: brandingData
          });
        } catch (brandingErr) {
          console.error("Branding upload error:", brandingErr);
          toast.error("Shop created, but images could not be uploaded.");
        }
      }

      // Step 3: Update local user data
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (userData) {
        userData.accountType = "seller";
        localStorage.setItem("user", JSON.stringify(userData));
      }
      
      toast.success("Shop registered successfully!");
      onSuccess(data.data);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to register shop");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 custom-scrollbar">
        <div className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md px-8 py-6 flex items-center justify-between border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Register Your Shop</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Establish your brand identity</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-lg rounded-xl transition-all active:scale-95 group"
          >
            <X className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-10">
          {/* Branding Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 ml-2">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Branding & Visuals</h3>
            </div>
            
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
              <div className="p-6 md:p-8 space-y-8">
                <div className="relative rounded-[2rem] overflow-hidden border-2 border-slate-50 bg-slate-50 aspect-[21/9] group/banner">
                  {bannerPreview ? (
                    <>
                      <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/banner:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                        <div className="flex gap-4">
                          <label className="w-10 h-10 bg-white text-slate-900 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-110">
                            <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                            <Camera className="w-5 h-5" />
                          </label>
                          <button 
                            type="button"
                            onClick={() => { setBannerFile(null); setBannerPreview(null); }}
                            className="w-10 h-10 bg-white text-red-500 rounded-xl flex items-center justify-center transition-all shadow-xl hover:scale-110"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 hover:bg-white hover:border-primary/30 transition-all cursor-pointer group/upload">
                      <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                      <ImageIcon className="w-8 h-8 text-slate-300 mb-2 group-hover/upload:text-primary transition-colors" />
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Upload Banner</p>
                    </label>
                  )}

                  <div className="absolute bottom-4 left-6">
                    <div className="relative w-20 h-20 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white group/logo">
                      {logoPreview ? (
                        <>
                          <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                            <label className="w-8 h-8 bg-white text-slate-900 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-all">
                              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                              <Camera className="w-4 h-4" />
                            </label>
                          </div>
                        </>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full bg-slate-50 cursor-pointer hover:bg-white transition-all group/logo-upload">
                          <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                          <Store className="w-5 h-5 text-slate-300 group-hover/logo-upload:text-primary transition-colors" />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Identity Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 ml-2">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Store Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Shop Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Urban Threads Collective"
                  className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 shadow-sm transition-all font-bold text-slate-900 placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex justify-between">
                  <span>Shop Handle</span>
                  {usernameStatus.loading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                </label>
                <div className="relative group">
                  <AtSign className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    usernameStatus.error ? 'text-red-400' : 
                    usernameStatus.available ? 'text-emerald-400' : 
                    'text-slate-400'
                  }`} />
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="your_shop_handle"
                    className={`w-full pl-14 pr-6 py-4 bg-white border rounded-2xl focus:outline-none focus:ring-4 shadow-sm transition-all font-bold text-slate-900 placeholder:text-slate-300 ${
                      usernameStatus.error ? 'border-red-100 focus:ring-red-500/5 focus:border-red-500/30' : 
                      usernameStatus.available ? 'border-emerald-100 focus:ring-emerald-500/5 focus:border-emerald-500/30' : 
                      'border-slate-100 focus:ring-primary/5 focus:border-primary/30'
                    }`}
                  />
                </div>
                {usernameStatus.error && (
                  <p className="text-[10px] font-bold text-red-500 ml-4 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {usernameStatus.error}
                  </p>
                )}
                {usernameStatus.available && (
                  <p className="text-[10px] font-bold text-emerald-500 ml-4 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Username is available
                  </p>
                )}
              </div>

              <div className="space-y-2 col-span-full">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Description</label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="What makes your shop special?"
                  rows={3}
                  className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 shadow-sm transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Category</label>
                <div className="relative group">
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 shadow-sm transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  <Package className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Business Email</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="hello@yourshop.com"
                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 shadow-sm transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+254 700 000 000"
                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 shadow-sm transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Physical Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. 1st Floor, Garden Plaza"
                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 shadow-sm transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100/50">
              <CheckCircle2 className={`w-5 h-5 ${formData.name && formData.email ? 'text-emerald-500' : 'text-slate-300'}`} />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Ready to Launch</p>
                <p className="text-[8px] font-bold text-slate-500">Your shop will be live instantly</p>
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 md:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.name || !formData.category || !formData.username || usernameStatus.available === false}
                className="flex-1 md:flex-none px-12 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? "Registering..." : "Launch Shop"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
