"use client";

import React from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Package
} from "lucide-react";
import Image from "next/image";

const ProductRow = ({ product }: any) => (
  <tr className="group hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
    <td className="py-3 sm:py-4 px-4 sm:px-6">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-100 relative overflow-hidden border border-slate-200 flex-shrink-0">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="font-black text-slate-900 text-sm truncate">{product.name}</p>
          <p className="text-[10px] sm:text-xs text-slate-500 font-medium">SKU: {product.sku}</p>
        </div>
      </div>
    </td>
    <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold text-slate-600">{product.category}</td>
    <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-black text-slate-900 whitespace-nowrap">{product.price}</td>
    <td className="py-3 sm:py-4 px-4 sm:px-6">
      <div className="flex flex-col gap-1">
        <span className="text-xs sm:text-sm font-black text-slate-900">{product.stock}</span>
        <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${product.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
            style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
          />
        </div>
      </div>
    </td>
    <td className="py-3 sm:py-4 px-4 sm:px-6">
      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
        product.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
      }`}>
        {product.status}
      </span>
    </td>
    <td className="py-3 sm:py-4 px-4 sm:px-6 text-right">
      <div className="flex items-center justify-end gap-1 sm:gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 sm:p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button className="p-1.5 sm:p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all">
          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </td>
  </tr>
);

const ProductsPage = () => {
  const products = [
    { id: 1, name: "MacBook Air M3", sku: "MAC-M3-001", category: "Laptops", price: "KSh 145,000", stock: 12, status: "Active", image: "/categories/computer accessories/computer.jpg" },
    { id: 2, name: "Nike Air Jordan", sku: "SHO-NIKE-042", category: "Footwear", price: "KSh 12,500", stock: 45, status: "Active", image: "/categories/footwear/footwear.jpg" },
    { id: 3, name: "Sony WH-1000XM5", sku: "AUD-SONY-005", category: "Audio", price: "KSh 45,000", stock: 8, status: "Active", image: "/categories/computer accessories/computer.jpg" },
    { id: 4, name: "Ergonomic Desk", sku: "FUR-DESK-099", category: "Furniture", price: "KSh 22,000", stock: 0, status: "Draft", image: "/categories/home decor/decor.jpg" },
  ];

  return (
    <main className="p-3 sm:p-6 md:p-8">
        <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-4 sm:p-5 md:p-6 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 bg-primary text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto no-scrollbar">
            <div className="min-w-[700px] sm:min-w-[800px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Product</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Price</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Stock</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <ProductRow key={product.id} product={product} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="p-4 sm:p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 order-2 sm:order-1">Showing 1 to 4 of 48 products</p>
            <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 border border-slate-200 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-not-allowed">Previous</button>
              <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-primary text-white rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-md shadow-primary/10 hover:scale-105 transition-all">Next</button>
            </div>
          </div>
        </div>
      </main>
  );
};

export default ProductsPage;
