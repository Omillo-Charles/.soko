import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | .Soko E-Commerce",
  description: "Explore thousands of products from local and international sellers on .Soko.",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
