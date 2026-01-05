import Link from "next/link";
import { Zap, Truck, ShieldCheck, Headphones, ChevronRight } from "lucide-react";
import Categories from "@/components/categories";
import FeaturedProducts from "@/components/featuredProducts";

export default function Home() {
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
