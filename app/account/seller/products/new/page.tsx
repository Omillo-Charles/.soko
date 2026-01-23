"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  DollarSign, 
  Info,
  ChevronLeft,
  Image as ImageIcon,
  Layers,
  CheckCircle2,
  Plus,
  Trash2,
  Store
} from "lucide-react";
import { toast } from "sonner";

import { categories as allCategories } from "@/constants/categories";

const categories = allCategories.filter(c => c.value !== 'all');

const NewProductPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [shop, setShop] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "1",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndShop = async () => {
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
          setShop(data.data);
        } else {
          router.push("/account/seller/register-shop");
        }
      } catch (err) {
        console.error("Error checking shop:", err);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthAndShop();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!imageFile) {
      toast.error("Please select a product image");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("accessToken");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("content", formData.description);
      submitData.append("price", formData.price);
      submitData.append("category", formData.category);
      submitData.append("stock", formData.stock);
      submitData.append("image", imageFile);

      const response = await fetch(`${apiUrl}/products`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: submitData
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Server returned non-JSON response:", text);
        throw new Error(`Server error (${response.status}): ${response.statusText}. The server did not return a valid JSON response.`);
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to post product");
      }

      // Success! Redirect to shop page to see the new product
      toast.success("Product listed successfully!");
      router.push("/shop");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
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
      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 pt-0 pb-32 md:pt-1 md:pb-32">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Column: Form */}
          <div className="w-full lg:w-3/5 space-y-4 md:space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Listing</h1>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Drafting in {shop?.name || 'Shop'}</p>
              </div>
              <button 
                onClick={() => router.back()} 
                className="p-3 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 rounded-2xl transition-all active:scale-95 group border border-transparent hover:border-slate-100"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="p-8 md:p-10 space-y-8">
                  {/* Image Upload Area */}
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Product Media</label>
                    {imagePreview ? (
                      <div className="relative group rounded-[2rem] overflow-hidden border-2 border-slate-100 bg-slate-50 aspect-video">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                          <div className="flex gap-3">
                            <label className="w-12 h-12 bg-white hover:bg-primary hover:text-white text-slate-900 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-110">
                              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                              <ImageIcon className="w-5 h-5" />
                            </label>
                            <button 
                              type="button"
                              onClick={() => { setImageFile(null); setImagePreview(null); }}
                              className="w-12 h-12 bg-white hover:bg-red-500 hover:text-white text-red-500 rounded-2xl flex items-center justify-center transition-all shadow-xl hover:scale-110"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 hover:bg-white hover:border-primary/30 transition-all cursor-pointer group">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <div className="w-16 h-16 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-xl transition-all duration-500">
                          <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Click to upload photo</span>
                        <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">High quality JPG, PNG or WebP</span>
                      </label>
                    )}
                  </div>

                  {/* Text Fields */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Product Details</label>
                      <input
                        type="text"
                        name="name"
                        required
                        autoFocus
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Give your item a catchy name..."
                        className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300 text-lg"
                      />
                      <textarea
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe the magic behind this product..."
                        rows={4}
                        className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none min-h-[160px] leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Category</label>
                        <div className="relative group">
                          <select
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:bg-white transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                          >
                            <option value="">Select category</option>
                            {categories.map(cat => (
                              <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                          </select>
                          <Layers className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-primary transition-colors" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Price (KES)</label>
                          <input
                            type="number"
                            name="price"
                            required
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Stock</label>
                          <input
                            type="number"
                            name="stock"
                            required
                            value={formData.stock}
                            onChange={handleInputChange}
                            placeholder="1"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-5 h-5 ${formData.name && formData.description && formData.price && formData.category && imageFile ? 'text-emerald-500' : 'text-slate-200'}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ready to publish</span>
                </div>
                <button
                  onClick={(e) => handleSubmit(e as any)}
                  disabled={isLoading || !formData.name || !imageFile}
                  className="bg-primary text-white px-10 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest disabled:opacity-50 transition-all hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/30 active:scale-95 flex items-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Post Listing</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Preview */}
          <div className="hidden lg:block lg:w-2/5 sticky top-32 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Preview</h3>
                <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Real-time
                </span>
              </div>

              {/* Glassmorphism Preview Card Container */}
              <div className="bg-white/40 backdrop-blur-xl border border-white rounded-[3rem] p-8 shadow-2xl shadow-slate-200/50">
                <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden group shadow-lg">
                  {/* Mock Product Card */}
                  <div className="aspect-square bg-slate-50 relative overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 gap-3">
                        <ImageIcon className="w-12 h-12" />
                        <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">
                          {formData.category || 'Category'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-black text-slate-900 text-lg truncate leading-tight">
                        {formData.name || 'Your Product Name'}
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <Store className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {shop?.name || 'Your Store'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Price</span>
                        <span className="font-black text-primary text-xl tracking-tight">
                          KES {formData.price || '0'}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/10">
                        <Plus className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-primary/5 rounded-[2rem] border border-primary/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Info className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Pro Tip</span>
                  </div>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed">
                    Products with clear, high-resolution photos and detailed descriptions sell 3x faster on <span className="text-secondary">.</span>Soko
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

export default NewProductPage;
