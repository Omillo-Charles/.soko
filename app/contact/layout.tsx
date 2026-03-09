import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | .Soko E-Commerce",
  description: "Get in touch with the .Soko support team for inquiries, help, or partnerships.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
