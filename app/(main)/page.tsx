import Link from "next/link";
import { Zap, Truck, ShieldCheck, Headphones, ChevronRight, Store } from "lucide-react";
import Categories from "@/components/categories";
import FeaturedProducts from "@/components/featuredProducts";

export default function Home() {

  const vendors = [
    { name: "VendorX", href: "/vendors/vendorx" },
    { name: "ShopPro", href: "/vendors/shoppro" },
    { name: "MarketHub", href: "/vendors/markethub" },
    { name: "PrimeDeals", href: "/vendors/primedeals" },
  ];

  return (
    <main className="flex flex-col relative overflow-hidden">
      {/* Minimalist Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-brand-soft-blue via-brand-soft-indigo/30 to-transparent"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-[10%] right-[-5%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px]"></div>
      </div>

      <Categories />
      <FeaturedProducts />

      <section className="bg-white/40 backdrop-blur-sm border-y border-slate-100/50">
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

      <section className="bg-muted/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl p-4 shadow-sm">
              <Truck className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold">Fast Delivery</div>
                <div className="text-sm text-slate-500">Across all regions in Kenya</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl p-4 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold">Secure Payment</div>
                <div className="text-sm text-slate-500">Encrypted and protected</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl p-4 shadow-sm">
              <Headphones className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold">24/7 Support</div>
                <div className="text-sm text-slate-500">We are here to help</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl p-4 shadow-sm">
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
