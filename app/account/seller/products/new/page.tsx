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
  Trash2
} from "lucide-react";

import { categories as allCategories } from "@/constants/categories";

const categories = allCategories.filter(c => c.value !== 'all');

const NewProductPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);

    if (!imageFile) {
      setError("Please select a product image");
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
      router.push("/shop");
    } catch (err: any) {
      setError(err.message);
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
    <div className="min-h-screen bg-white md:bg-slate-50 flex justify-center selection:bg-primary/10">
      {/* Top Navigation / Modal Header */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 z-50">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => handleSubmit(e as any)}
            disabled={isLoading || !formData.name || !imageFile}
            className="bg-primary text-white px-5 py-1.5 rounded-full font-bold text-sm disabled:opacity-50 transition-all hover:bg-primary/90"
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white min-h-screen pt-14 flex flex-col">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 md:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-xl text-sm font-medium flex items-center gap-2">
              <Info className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-50">
                {shop?.logo ? (
                  <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2 group">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-primary">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    autoFocus
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Vintage Leather Camera Bag"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                
                <div className="space-y-2 group">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-primary">Description</label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your product's magic, materials, and unique features..."
                    rows={4}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-700 placeholder:text-slate-400 resize-none min-h-[140px] leading-relaxed"
                  />
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/50 group animate-in fade-in zoom-in duration-500">
                  <img src={imagePreview} alt="Preview" className="w-full max-h-[450px] object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <button 
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-white text-red-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-90 z-10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Metadata Fields (Styled as catchy interactive pills) */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2.5 bg-slate-50 hover:bg-white hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 px-4 py-2.5 rounded-2xl border border-slate-200 group">
                  <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-primary/10 transition-colors border border-slate-100">
                    <DollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Price</span>
                    <input
                      type="number"
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="bg-transparent border-none focus:ring-0 p-0 text-sm font-black text-slate-900 placeholder:text-slate-400 w-24"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-slate-50 hover:bg-white hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 px-4 py-2.5 rounded-2xl border border-slate-200 relative group">
                  <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-primary/10 transition-colors border border-slate-100">
                    <Layers className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Category</span>
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="bg-transparent border-none focus:ring-0 p-0 text-sm font-black text-slate-900 appearance-none pr-6 cursor-pointer"
                    >
                      <option value="">Select</option>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-slate-50 hover:bg-white hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 px-4 py-2.5 rounded-2xl border border-slate-200 group">
                  <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-primary/10 transition-colors border border-slate-100">
                    <Tag className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Stock</span>
                    <input
                      type="number"
                      name="stock"
                      required
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="1"
                      className="bg-transparent border-none focus:ring-0 p-0 text-sm font-black text-slate-900 placeholder:text-slate-400 w-16"
                    />
                  </div>
                </div>
              </div>

              {/* Action Icons Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-4">
                <div className="flex items-center gap-1">
                  <label className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <ImageIcon className="w-5 h-5" />
                  </label>
                  <button type="button" className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors opacity-50 cursor-not-allowed">
                    <Plus className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors opacity-50 cursor-not-allowed">
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="hidden md:block">
                   <button
                    type="submit"
                    disabled={isLoading || !formData.name || !imageFile}
                    className="bg-primary text-white px-6 py-2 rounded-full font-bold text-sm disabled:opacity-50 transition-all hover:bg-primary/90 shadow-sm"
                  >
                    {isLoading ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProductPage;
