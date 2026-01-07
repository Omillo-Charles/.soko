"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const items = [
  {
    name: "Home Décor",
    href: "/shop?cat=home-decor",
    image: "/categories/home decor/decor.jpg",
  },
  {
    name: "Kitchenware",
    href: "/shop?cat=kitchenware",
    image: "/categories/kitchenware/kitchen.jpg",
  },
  {
    name: "Books & Stationery",
    href: "/shop?cat=books-stationery",
    image: "/categories/stationery/stationery.jpg",
  },
  {
    name: "Baby Products",
    href: "/shop?cat=baby-products",
    image: "/categories/baby products/baby.jpg",
  },
  {
    name: "Toys & Games",
    href: "/shop?cat=toys-games",
    image: "/categories/toys/toys.jpg",
  },
  {
    name: "Sports & Fitness Equipment",
    href: "/shop?cat=sports-fitness-equipment",
    image: "/categories/sports/sports.jpg",
  },
  {
    name: "Computer Accessories",
    href: "/shop?cat=computer-accessories",
    image: "/categories/computer accessories/computer.jpg",
  },
  {
    name: "Office Supplies",
    href: "/shop?cat=office-supplies",
    image: "/categories/office supplies/office.jpg",
  },
  {
    name: "Digital Products",
    href: "/shop?cat=digital-products",
    image: "/categories/digital products/digital.jpg",
  },
  {
    name: "Automotive Accessories",
    href: "/shop?cat=automotive-accessories",
    image: "/categories/automotive/automotive.jpg",
  },
  {
    name: "Pet Supplies",
    href: "/shop?cat=pet-supplies",
    image: "/categories/pet/pet.jpg",
  },
  {
    name: "Health Products",
    href: "/shop?cat=health-products",
    image: "/categories/health/health.jpg",
  },
  {
    name: "Craft & DIY Supplies",
    href: "/shop?cat=craft-diy-supplies",
    image: "/categories/craft/craft.jpg",
  },
  {
    name: "Event & Party Supplies",
    href: "/shop?cat=event-party-supplies",
    image: "/categories/events and parties/event.jpg",
  },
  {
    name: "Clothing & Apparel",
    href: "/shop?cat=clothing-apparel",
    image: "/categories/clothing/clothing.jpg",
  },
  {
    name: "Footwear",
    href: "/shop?cat=footwear",
    image: "/categories/footwear/footwear.jpg",
  },
  {
    name: "Fashion Accessories",
    href: "/shop?cat=fashion-accessories",
    image: "/categories/fashion/fashionaccessories.jpg",
  },
  {
    name: "Electronics",
    href: "/shop?cat=electronics",
    image: "/categories/electronics/electronics.jpg",
  },
  {
    name: "Phone Accessories",
    href: "/shop?cat=phone-accessories",
    image: "/categories/phone accessories/phones.jpg",
  },
  {
    name: "Home Appliances",
    href: "/shop?cat=home-appliances",
    image: "/categories/home appliances/home.jpg",
  },
  {
    name: "Beauty Products",
    href: "/shop?cat=beauty-products",
    image: "/categories/beauty products/beauty.jpg",
  },
  {
    name: "Personal Care Items",
    href: "/shop?cat=personal-care",
    image: "/categories/personal care/personal.jpg",
  },
  {
    name: "Watches & Jewelry",
    href: "/shop?cat=watches-jewelry",
    image: "/categories/jewelary/watches.jpg",
  },
  {
    name: "Groceries & Packaged Foods",
    href: "/shop?cat=groceries-packaged-foods",
    image: "/categories/groceries and foods/groceries.jpg",
  },
  {
    name: "Furniture",
    href: "/shop?cat=furniture",
    image: "/categories/furniture/furniture.jpg",
  },
];

const Categories = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = 320;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 md:px-8 pt-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold">Shop by Category</h2>
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scroll("left")}
              className="p-2 border border-slate-300 rounded hover:bg-slate-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scroll("right")}
              className="p-2 border border-slate-300 rounded hover:bg-slate-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto md:overflow-x-hidden scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] md:[scrollbar-width:auto]"
        >
          {/* hide scrollbar on mobile */}
          <style jsx>{`
            div::-webkit-scrollbar { display: none; }
            @media (min-width: 768px) {
              div::-webkit-scrollbar { display: initial; height: 8px; }
            }
          `}</style>
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group min-w-[220px] md:min-w-[260px] border border-slate-200 rounded-lg overflow-hidden hover:shadow-sm transition"
            >
              <div className="relative h-28 md:h-36 bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 220px, 260px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-3 md:p-4">
                <div className="font-medium group-hover:text-primary">{item.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
