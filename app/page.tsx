import Link from "next/link";
import { ShoppingCart, Star, Zap, Truck, ShieldCheck, Headphones, ChevronRight, Store, Tag, Heart, Shirt, Home as HomeIcon, Dumbbell, Smartphone } from "lucide-react";
import Categories from "@/components/categories";

export default function Home() {
  const categories = [
    { name: "Electronics", icon: Smartphone, href: "/shop?cat=electronics" },
    { name: "Fashion", icon: Shirt, href: "/shop?cat=fashion" },
    { name: "Home & Garden", icon: HomeIcon, href: "/shop?cat=home" },
    { name: "Beauty", icon: Tag, href: "/shop?cat=beauty" },
    { name: "Sports", icon: Dumbbell, href: "/shop?cat=sports" },
  ];

  const products = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    title: `Premium Product ${i + 1}`,
    price: 29.99 + i,
    rating: 4 + (i % 2) * 0.5,
    vendor: i % 2 === 0 ? "VendorX" : "ShopPro",
  }));

  const vendors = [
    { name: "VendorX", href: "/vendors/vendorx" },
    { name: "ShopPro", href: "/vendors/shoppro" },
    { name: "MarketHub", href: "/vendors/markethub" },
    { name: "PrimeDeals", href: "/vendors/primedeals" },
  ];

  return (
    <main className="flex flex-col">
      <Categories />

      <section className="bg-white">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <Link key={c.name} href={c.href} className="group border border-slate-200 rounded-md p-4 flex items-center gap-3 hover:shadow-sm hover:border-slate-300 transition">
                  <Icon className="w-6 h-6 text-primary" />
                  <span className="text-sm md:text-base font-medium group-hover:text-primary">{c.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted">
        <div className="container mx-auto px-4 md:px-8 py-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold">Featured Products</h2>
            <Link href="/shop" className="text-primary flex items-center gap-1 font-medium">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="relative h-32 md:h-40 bg-slate-100">
                  <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow">
                    <Heart className="w-4 h-4 text-slate-700" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="text-xs text-slate-500">{p.vendor}</div>
                  <div className="mt-1 font-medium">{p.title}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold">KSh {(p.price * 132).toFixed(0)}</span>
                    <span className="text-slate-400 line-through text-sm">KSh {(p.price * 132 + 500).toFixed(0)}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4" />
                    <span className="ml-2 text-xs text-slate-500">{p.rating} / 5</span>
                  </div>
                  <button className="mt-4 w-full bg-primary text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-600 transition">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container mx-auto px-4 md:px-8 py-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold">Top Vendors</h2>
            <Link href="/vendors" className="text-primary flex items-center gap-1 font-medium">
              Explore
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {vendors.map((v) => (
              <Link key={v.name} href={v.href} className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition">
                <div className="font-semibold">{v.name}</div>
                <div className="mt-2 text-sm text-slate-500">Trusted seller • Fast delivery</div>
                <div className="mt-4 inline-flex items-center gap-2 text-primary font-medium">
                  Visit Store
                  <Store className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted">
        <div className="container mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-md p-4">
              <Truck className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold">Fast Delivery</div>
                <div className="text-sm text-slate-500">Across all regions in Kenya</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-md p-4">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold">Secure Payment</div>
                <div className="text-sm text-slate-500">Encrypted and protected</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-md p-4">
              <Headphones className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold">24/7 Support</div>
                <div className="text-sm text-slate-500">We are here to help</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-md p-4">
              <Zap className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold">Best Deals</div>
                <div className="text-sm text-slate-500">Daily discounts and offers</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
