"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  Store,
  LogOut
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";

const menuItems = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", href: "/account" },
  { icon: <Package className="w-5 h-5" />, label: "My Orders", href: "/account/orders" },
  { icon: <Heart className="w-5 h-5" />, label: "Wishlist", href: "/wishlist" },
  { icon: <MapPin className="w-5 h-5" />, label: "Addresses", href: "/account/addresses" },
  { icon: <CreditCard className="w-5 h-5" />, label: "Payment Methods", href: "/account/payments" },
  { icon: <Bell className="w-5 h-5" />, label: "Notifications", href: "/account/notifications" },
  { icon: <ShieldCheck className="w-5 h-5" />, label: "Security", href: "/account/security" },
  { icon: <Store className="w-5 h-5" />, label: "Seller Center", href: "/account/seller" },
];

export const AccountSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/auth?mode=login");
  };

  return (
    <div className="h-full flex flex-col">
        <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold">Account</h2>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {menuItems.map((item) => (
            <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.href
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
            >
                {item.icon}
                <span className="font-semibold text-sm">{item.label}</span>
            </Link>
            ))}
        </nav>
        <div className="p-4 border-t border-border">
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-red-500 hover:bg-red-500/10"
            >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold text-sm">Logout</span>
            </button>
        </div>
    </div>
  );
};