import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | .Soko E-Commerce",
  description: "Learn more about .Soko, our mission, our story, and how we are empowering digital commerce.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
