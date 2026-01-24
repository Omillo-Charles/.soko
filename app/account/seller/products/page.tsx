"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  ShoppingBag, 
  Plus, 
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronRight,
  Package,
  AlertCircle,
  Loader2,
  X,
  Image as ImageIcon,
  Layers,
  CheckCircle2,
  Tag,
  DollarSign,
  Info,
  Store
} from "lucide-react";
import { toast } from "sonner";
import { categories as allCategories } from "@/constants/categories";
import { RegisterShopModal } from "@/components/RegisterShopModal";

const categories = allCategories.filter(c => c.value !== 'all');

const SellerProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [shop, setShop] = useState<any>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "1",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchProducts = async () => {
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

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";
      
      // Fetch shop info first
      const shopRes = await fetch(`${apiUrl}/shops/my-shop`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const shopData = await shopRes.json();
      if (shopData.success && shopData.data) {
        setShop(shopData.data);
      } else {
        setShowRegisterModal(true);
        setIsLoading(false);
        return;
      }

      // Fetch products
      const res = await fetch(`${apiUrl}/products/my-products`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        router.push("/auth?mode=login");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [router]);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setShowCreateModal(true);
      // Clean up the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

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
    setIsSubmitting(true);

    if (!imageFile) {
      toast.error("Please select a product image");
      setIsSubmitting(false);
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
        headers: { "Authorization": `Bearer ${token}` },
        body: submitData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to post product");
      }

      toast.success("Product listed successfully!");
      setShowCreateModal(false);
      resetForm();
      fetchProducts(); // Refresh the list
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "1",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setIsDeleting(productId);
    const token = localStorage.getItem("accessToken");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

    try {
      const res = await fetch(`${apiUrl}/products/${productId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setProducts(products.filter(p => p._id !== productId));
        toast.success("Product deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (e) {
      console.error("Error deleting product:", e);
      toast.error("An error occurred while deleting the product");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading your products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-12">
      <RegisterShopModal 
        isOpen={showRegisterModal}
        onClose={() => router.push("/account")}
        onSuccess={() => window.location.reload()}
      />
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/account/seller" 
                className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">My Products</h1>
                <p className="text-xs text-slate-500 font-bold">Manage your store inventory</p>
              </div>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>ADD PRODUCT</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search products by name or category..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-600 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase">No products found</h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
              {searchQuery ? "Try adjusting your search filters to find what you're looking for." : "You haven't added any products to your shop yet."}
            </p>
            {!searchQuery && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>CREATE YOUR FIRST PRODUCT</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredProducts.map((product: any) => (
              <div 
                key={product._id}
                className="bg-white rounded-[2rem] border border-slate-100 p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                {/* Image */}
                <div className="w-full md:w-32 h-48 md:h-32 rounded-2xl overflow-hidden bg-slate-50 shrink-0 relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase">
                      Low Stock
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                      <span className="text-white text-[10px] font-black px-3 py-1 border-2 border-white rounded-lg uppercase">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md">
                      {product.category || "General"}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                      ID: {product._id.slice(-6)}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 truncate mb-1 uppercase tracking-tight">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <p className="text-xl font-black text-slate-900">
                      KES {product.price?.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Package className={`w-4 h-4 ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`} />
                      <span className={`text-sm font-bold ${product.stock > 0 ? 'text-slate-600' : 'text-red-500'}`}>
                        {product.stock} units available
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                  <Link 
                    href={`/account/seller/products/edit/${product._id}`}
                    className="flex-1 md:flex-none p-4 md:p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-bold text-sm"
                  >
                    <Edit2 className="w-5 h-5" />
                    <span className="md:hidden">Edit</span>
                  </Link>
                  <button 
                    onClick={() => handleDelete(product._id)}
                    disabled={isDeleting === product._id}
                    className="flex-1 md:flex-none p-4 md:p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-50"
                  >
                    {isDeleting === product._id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                    <span className="md:hidden">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => !isSubmitting && setShowCreateModal(false)}
          />
          <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="bg-slate-900 p-8 text-white relative shrink-0">
              <button 
                onClick={() => setShowCreateModal(false)}
                disabled={isSubmitting}
                className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-black uppercase tracking-tight">Create Listing</h3>
              <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">
                Drafting in {shop?.name || 'Your Shop'}
              </p>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Form Column */}
                <form onSubmit={handleSubmit} className="w-full lg:w-3/5 space-y-8">
                  <div className="space-y-8">
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

                  <div className="flex items-center justify-between gap-6 pt-8 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      disabled={isSubmitting}
                      className="px-8 py-4 bg-slate-100 text-slate-600 rounded-[2rem] font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.name || !imageFile}
                      className="bg-primary text-white px-10 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest disabled:opacity-50 transition-all hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/30 active:scale-95 flex items-center gap-3"
                    >
                      {isSubmitting ? (
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

                {/* Preview Column */}
                <div className="hidden lg:block lg:w-2/5 sticky top-0">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Preview</h3>
                      <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Real-time
                      </span>
                    </div>

                    <div className="bg-white/40 backdrop-blur-xl border border-white rounded-[3rem] p-8 shadow-2xl shadow-slate-200/50">
                      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden group shadow-lg">
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
        </div>
      )}
    </div>
  );
};

export default SellerProductsPage;
