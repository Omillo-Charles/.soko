"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, X, Loader2 } from "lucide-react";
import api from "@/lib/api";

import { categories } from "@/constants/categories";

const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get(`/products?q=${query}&limit=5`);
        if (response.data.success) {
          setSuggestions(response.data.data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    const cat = category || "all";
    const params = new URLSearchParams();
    if (cat && cat !== "all") params.set("cat", cat);
    if (q) params.set("q", q);
    
    setShowSuggestions(false);
    router.push(`/shop${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleSuggestionClick = (product: any) => {
    setQuery(product.name);
    setShowSuggestions(false);
    router.push(`/shop/product/${product._id}`);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={onSubmit} className="flex w-full relative">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block border border-r-0 border-slate-200 rounded-l-2xl bg-slate-50 text-slate-700 px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer max-w-[140px] appearance-none"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
            type="text"
            placeholder="Search products, brands and categories..."
            className="w-full border-y border-slate-200 rounded-none py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 text-sm font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setSuggestions([]); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-slate-900 text-white px-6 rounded-r-2xl hover:bg-primary transition-all flex items-center justify-center cursor-pointer shadow-lg shadow-slate-900/10"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                Product Suggestions
              </div>
              {suggestions.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                      {product.name}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                      in {product.category}
                    </div>
                  </div>
                  <div className="text-xs font-black text-primary">
                    KES {product.price?.toLocaleString()}
                  </div>
                </button>
              ))}
              <button 
                onClick={() => onSubmit()}
                className="w-full py-3 px-4 text-center text-xs font-bold text-slate-500 hover:text-primary hover:bg-slate-50 border-t border-slate-50 transition-all"
              >
                See all results for "{query}"
              </button>
            </div>
          ) : query.trim().length >= 2 && !isLoading ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-900">No product found</p>
              <p className="text-xs text-slate-500 mt-1">Try a different search term</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

