"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, LayoutGrid, ShoppingBag, Zap, Heart, Star } from "lucide-react";
import { categories as allCategories } from "@/constants/categories";

// Map categories to images or icons
const categoryMeta: Record<string, { image: string; icon: any; description: string }> = {
  "clothing-apparel": {
    image: "/categories/clothing/clothing.jpg",
    icon: <ShoppingBag className="w-5 h-5" />,
    description: "Trendy outfits and daily wear for all ages."
  },
  "footwear": {
    image: "/categories/footwear/footwear.jpg",
    icon: <Zap className="w-5 h-5" />,
    description: "Comfortable and stylish shoes for every occasion."
  },
  "fashion-accessories": {
    image: "/categories/fashion/fashionaccessories.jpg",
    icon: <Heart className="w-5 h-5" />,
    description: "Complete your look with our exclusive accessories."
  },
  "electronics": {
    image: "/categories/electronics/electronics.jpg",
    icon: <Zap className="w-5 h-5" />,
    description: "Latest gadgets and high-tech electronic devices."
  },
  "phone-accessories": {
    image: "/categories/phone%20accessories/phones.jpg",
    icon: <Zap className="w-5 h-5" />,
    description: "Cases, chargers, and more for your smartphones."
  },
  "home-appliances": {
    image: "/categories/home%20appliances/home.jpg",
    icon: <Zap className="w-5 h-5" />,
    description: "Modern appliances for a more efficient home."
  },
  "beauty-products": {
    image: "/categories/beauty%20products/beauty.jpg",
    icon: <Star className="w-5 h-5" />,
    description: "Skincare, makeup, and beauty essentials."
  },
  "personal-care": {
    image: "/categories/personal%20care/personal.jpg",
    icon: <Heart className="w-5 h-5" />,
    description: "Self-care and personal hygiene products."
  },
  "watches-jewelry": {
    image: "/categories/jewelary/watches.jpg",
    icon: <Star className="w-5 h-5" />,
    description: "Elegant watches and fine jewelry pieces."
  },
  "groceries-packaged-foods": {
    image: "/categories/groceries%20and%20foods/groceries.jpg",
    icon: <ShoppingBag className="w-5 h-5" />,
    description: "Fresh groceries and quality packaged food items."
  },
  "furniture": {
    image: "/categories/furniture/furniture.jpg",
    icon: <LayoutGrid className="w-5 h-5" />,
    description: "Stylish furniture for every room in your house."
  },
  "home-decor": {
    image: "/categories/home%20decor/decor.jpg",
    icon: <Star className="w-5 h-5" />,
    description: "Beautiful items to make your house a home."
  },
  "kitchenware": {
    image: "/categories/kitchenware/kitchen.jpg",
    icon: <LayoutGrid className="w-5 h-5" />,
    description: "Essential tools and appliances for your kitchen."
  },
  "books-stationery": {
    image: "/categories/stationery/stationery.jpg",
    icon: <Star className="w-5 h-5" />,
    description: "Books, notebooks, and office supplies."
  },
  "baby-products": {
    image: "/categories/baby%20products/baby.jpg",
    icon: <Heart className="w-5 h-5" />,
    description: "Everything you need for your little ones."
  },
  "toys-games": {
    image: "/categories/toys/toys.jpg",
    icon: <Zap className="w-5 h-5" />,
    description: "Fun and educational toys for children."
  },
  "sports-fitness": {
    image: "/categories/sports/sports.jpg",
    icon: <Zap className="w-5 h-5" />,
    description: "Gear up for your fitness and sporting activities."
  },
  "computer-accessories": {
    image: "/categories/computer%20accessories/computer.jpg",
    icon: <LayoutGrid className="w-5 h-5" />,
    description: "Enhance your computing experience."
  },
  "office-supplies": {
    image: "/categories/office%20supplies/office.jpg",
    icon: <LayoutGrid className="w-5 h-5" />,
    description: "Quality supplies for your professional workspace."
  },
  "digital-products": {
    image: "/categories/digital%20products/digital.jpg",
    icon: <Zap className="w-5 h-5" />,
    description: "Software, ebooks, and other digital assets."
  },
  "automotive-accessories": {
    image: "/categories/automotive/automotive.jpg",
    icon: <LayoutGrid className="w-5 h-5" />,
    description: "Essential accessories for your vehicle."
  },
  "pet-supplies": {
    image: "/categories/pet/pet.jpg",
    icon: <Heart className="w-5 h-5" />,
    description: "Care and supplies for your furry friends."
  },
  "health-products": {
    image: "/categories/health/health.jpg",
    icon: <Heart className="w-5 h-5" />,
    description: "Wellness and health maintenance products."
  },
  "craft-diy": {
    image: "/categories/craft/craft.jpg",
    icon: <Star className="w-5 h-5" />,
    description: "Supplies for your creative and DIY projects."
  },
  "event-party-supplies": {
    image: "/categories/events%20and%20parties/event.jpg",
    icon: <Zap className="w-5 h-5" />,
    description: "Everything you need for a memorable celebration."
  },
};

const CategoriesPage = () => {
  const displayCategories = allCategories.filter(c => c.value !== 'all');

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-[100px] md:top-[128px] bg-background/80 backdrop-blur-md z-30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black text-foreground tracking-tight">Explore Categories</h1>
            <p className="text-sm text-muted-foreground font-medium">Find everything you need across {displayCategories.length} categories</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayCategories.map((category: any) => {
            const meta = (categoryMeta as any)[category.value] || {
              image: "/placeholder-category.jpg",
              icon: <LayoutGrid className="w-5 h-5" />,
              description: `Browse all products in ${category.label}.`
            };

            return (
              <Link 
                key={category.value}
                href={`/shop?cat=${category.value}`}
                className="group relative bg-background rounded-3xl overflow-hidden border border-border hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  <Image 
                    src={meta.image} 
                    alt={category.label}
                    fill
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Category Label on Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-primary-foreground">
                      <div className="p-2 bg-primary-foreground/20 backdrop-blur-md rounded-xl">
                        {meta.icon}
                      </div>
                      <h2 className="text-lg font-black tracking-tight">{category.label}</h2>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6">
                    {meta.description}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs font-black text-primary uppercase tracking-widest group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Explore Products
                      <ChevronRight className="w-3 h-3" />
                    </span>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
