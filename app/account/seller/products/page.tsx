"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  Loader2
} from "lucide-react";

const SellerProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
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
        const res = await fetch(`${apiUrl}/products/my-products`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
        }
      } catch (e) {
        console.error("Error fetching products:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setIsDeleting(productId);
    const token = localStorage.getItem("accessToken");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

    try {
      const res = await fetch(`${apiUrl}/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        setProducts(products.filter(p => p._id !== productId));
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (e) {
      console.error("Error deleting product:", e);
      alert("An error occurred while deleting the product");
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
    <div className="min-h-screen bg-slate-50 pb-20">
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
            <Link 
              href="/account/seller/products/new"
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>ADD PRODUCT</span>
            </Link>
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
              <Link 
                href="/account/seller/products/new"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>CREATE YOUR FIRST PRODUCT</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredProducts.map((product) => (
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
    </div>
  );
};

export default SellerProductsPage;
