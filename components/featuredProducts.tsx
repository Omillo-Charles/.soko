import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, ChevronRight, Heart } from "lucide-react";

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      title: "Adidas Predator Football Boots",
      price: 129.99,
      rating: 4.5,
      vendor: "Adidas Kenya",
      image: "/products/predator.jpg",
      description:
        "Enhanced control with rubber zones, firm-ground studs, and a breathable lightweight fit.",
    },
    {
      id: 2,
      title: "Premium Sound System",
      price: 249.99,
      rating: 4.6,
      vendor: "JBL",
      image: "/products/system.jpg",
      description:
        "Deep bass, crisp highs, Bluetooth/USB/FM connectivity, and room-filling 5.1 surround.",
    },
    {
      id: 3,
      title: "Inter and AC Milan Jersey",
      price: 89.99,
      rating: 4.7,
      vendor: "Adidas Kenya",
      image: "/products/jersey.jpg",
      description:
        "Breathable fabric, classic Nerazzurri stripes, slim athletic fit for match days.",
    },
    {
      id: 4,
      title: "Dr. Mattress Orthopedic Mattress",
      price: 199.99,
      rating: 4.8,
      vendor: "Dr. Mattress",
      image: "/products/mattress.jpg",
      description:
        "Orthopedic support with high-density foam, breathable cover, and pressure relief for deep sleep.",
    },
  ];

  return (
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
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                  priority={p.id === 1}
                />
                <div className="absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full p-2 shadow">
                  <ShoppingCart className="w-4 h-4 text-slate-700" />
                </div>
                <div className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow">
                  <Heart className="w-4 h-4 text-slate-700" />
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-slate-500">{p.vendor}</div>
                <div className="mt-1 font-medium">{p.title}</div>
                <div className="mt-1 text-xs text-slate-500 font-light">{p.description}</div>
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
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
