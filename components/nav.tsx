import Link from "next/link";
import { Search, ShoppingCart, User, Heart, Menu, Phone } from "lucide-react";

const Navbar = () => {
  return (
    <header className="w-full flex flex-col shadow-sm sticky top-0 z-50 bg-white">
      {/* Top Bar */}
      <div className="hidden md:flex bg-slate-900 text-slate-200 text-xs py-2 px-4 md:px-8 justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Welcome to Duuka Multivendor Store</span>
          <div className="flex items-center gap-1">
             <Phone className="w-3 h-3" /> <span>+123 456 7890</span>
          </div>
        </div>
        <div className="flex items-center gap-4 divide-x divide-slate-700">
          <Link href="/help" className="hover:text-white transition-colors pr-4">Help Center</Link>
          <div className="cursor-pointer hover:text-white transition-colors pl-4">English / USD</div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 md:px-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            {/* Mobile Top Row: Logo & Icons */}
            <div className="flex w-full md:w-auto justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
                  Duuka<span className="text-secondary">.</span>
                </Link>

                {/* Mobile Icons (Visible only on mobile) */}
                <div className="flex items-center gap-4 md:hidden">
                    <Link href="/cart" className="relative">
                        <ShoppingCart className="w-6 h-6 text-slate-700" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-white text-[10px] flex items-center justify-center rounded-full">2</span>
                    </Link>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 w-full max-w-2xl md:mx-4 relative order-last md:order-none">
                <div className="flex w-full">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full border border-r-0 border-slate-300 rounded-l-md py-2 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400 text-sm md:text-base"
                    />
                    <button className="bg-primary text-white px-4 md:px-6 rounded-r-md hover:bg-blue-600 transition-colors flex items-center justify-center cursor-pointer">
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Desktop Icons (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-6 text-slate-700">
                <Link href="/account" className="flex flex-col items-center group">
                    <User className="w-6 h-6 group-hover:text-primary transition-colors" />
                    <span className="text-xs mt-1 font-medium group-hover:text-primary">Account</span>
                </Link>
                <Link href="/wishlist" className="flex flex-col items-center group relative">
                    <Heart className="w-6 h-6 group-hover:text-primary transition-colors" />
                    <span className="text-xs mt-1 font-medium group-hover:text-primary">Wishlist</span>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-white text-[10px] flex items-center justify-center rounded-full">0</span>
                </Link>
                <Link href="/cart" className="flex flex-col items-center group relative">
                    <ShoppingCart className="w-6 h-6 group-hover:text-primary transition-colors" />
                    <span className="text-xs mt-1 font-medium group-hover:text-primary">Cart</span>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-white text-[10px] flex items-center justify-center rounded-full">2</span>
                </Link>
            </div>
        </div>
      </div>

      {/* Navigation Bar (Desktop Only) */}
      <div className="bg-primary text-white hidden md:block">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-12">
            <div className="flex items-center gap-8 text-sm font-medium">
                <div className="flex items-center gap-2 cursor-pointer bg-blue-700 h-12 px-4 hover:bg-blue-800 transition-colors">
                    <Menu className="w-5 h-5" />
                    <span>All Categories</span>
                </div>
                <nav className="flex items-center gap-6">
                    <Link href="/" className="hover:text-slate-200 transition-colors">Home</Link>
                    <Link href="/shop" className="hover:text-slate-200 transition-colors">Shop</Link>
                    <Link href="/vendors" className="hover:text-slate-200 transition-colors">Vendors</Link>
                    <Link href="/blog" className="hover:text-slate-200 transition-colors">Blog</Link>
                    <Link href="/contact" className="hover:text-slate-200 transition-colors">Contact</Link>
                </nav>
            </div>
            <div className="text-sm font-medium text-slate-100">
                Free Shipping on Orders Over $50
            </div>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation (Fixed) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-1px_3px_rgba(0,0,0,0.1)] z-50">
          <div className="flex justify-around items-center p-2 text-[10px] font-medium text-slate-600">
              <Link href="/" className="flex flex-col items-center gap-1 p-2 hover:text-primary">
                  <Menu className="w-5 h-5" />
                  <span>Home</span>
              </Link>
              <Link href="/shop" className="flex flex-col items-center gap-1 p-2 hover:text-primary">
                  <Search className="w-5 h-5" />
                  <span>Shop</span>
              </Link>
              <Link href="/cart" className="flex flex-col items-center gap-1 p-2 hover:text-primary relative">
                  <div className="relative">
                      <ShoppingCart className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-secondary text-white text-[9px] flex items-center justify-center rounded-full">2</span>
                  </div>
                  <span>Cart</span>
              </Link>
              <Link href="/account" className="flex flex-col items-center gap-1 p-2 hover:text-primary">
                  <User className="w-5 h-5" />
                  <span>Account</span>
              </Link>
          </div>
      </div>
    </header>
  )
}

export default Navbar
