"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const categories = [
  { label: "All", value: "all" },
  { label: "Clothing & Apparel", value: "clothing-apparel" },
  { label: "Footwear", value: "footwear" },
  { label: "Fashion Accessories", value: "fashion-accessories" },
  { label: "Electronics", value: "electronics" },
  { label: "Phone Accessories", value: "phone-accessories" },
  { label: "Home Appliances", value: "home-appliances" },
  { label: "Beauty Products", value: "beauty-products" },
  { label: "Personal Care Items", value: "personal-care" },
  { label: "Watches & Jewelry", value: "watches-jewelry" },
  { label: "Groceries & Packaged Foods", value: "groceries-packaged-foods" },
  { label: "Furniture", value: "furniture" },
  { label: "Home Décor", value: "home-decor" },
  { label: "Kitchenware", value: "kitchenware" },
  { label: "Books & Stationery", value: "books-stationery" },
  { label: "Baby Products", value: "baby-products" },
  { label: "Toys & Games", value: "toys-games" },
  { label: "Sports & Fitness Equipment", value: "sports-fitness" },
  { label: "Computer Accessories", value: "computer-accessories" },
  { label: "Office Supplies", value: "office-supplies" },
  { label: "Digital Products", value: "digital-products" },
  { label: "Automotive Accessories", value: "automotive-accessories" },
  { label: "Pet Supplies", value: "pet-supplies" },
  { label: "Health Products", value: "health-products" },
  { label: "Craft & DIY Supplies", value: "craft-diy" },
  { label: "Event & Party Supplies", value: "event-party-supplies" },
];

const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    const cat = category || "all";
    const params = new URLSearchParams();
    if (cat && cat !== "all") params.set("cat", cat);
    if (q) params.set("q", q);
    router.push(`/shop${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="block border border-r-0 border-slate-300 rounded-l-md bg-slate-50 text-slate-700 px-2 py-2 text-xs truncate focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer max-w-[120px]"
      >
        {categories.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="text"
        placeholder="Search..."
        className="w-full border border-slate-300 rounded-none border-r-0 py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400 text-sm md:text-base"
      />
      <button
        type="submit"
        className="bg-primary text-white px-4 md:px-6 rounded-r-md hover:bg-blue-600 transition-colors flex items-center justify-center cursor-pointer"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
};

export default SearchBar;
