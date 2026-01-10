import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import Navbar from "@/components/nav";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from "sonner";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Duuka E-Commerce",
  description: "Top Multivendor E-Commerce Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/weblysleekuisb.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistMono.variable} antialiased`}>
        <CartProvider>
          <WishlistProvider>
            <Toaster position="top-right" richColors />
            <Navbar />
            {children}
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
