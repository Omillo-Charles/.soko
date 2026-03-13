import React from "react";
import { 
  Shield, Lock, Eye, FileText, Bell, Globe, Mail, 
  Scale, Gavel, ShieldCheck, ShoppingBag, Users, 
  Cookie, Settings, RefreshCcw, Truck, Info, Heart, Target,
  Clock, Package, CreditCard
} from "lucide-react";

export interface LegalSection {
  title: string;
  icon: React.ReactNode;
  content: (string | React.ReactNode)[];
}

export interface LegalContent {
  slug: string;
  title: string;
  description: string;
  lastUpdated: string;
  version: string;
  badge: {
    text: string;
    icon: React.ReactNode;
  };
  sections: LegalSection[];
  ctaCard?: {
    title: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
    icon: React.ReactNode;
    tags?: string[];
  };
  sidebar?: {
    questionTitle: string;
    questionDesc: string;
    contactEmail: string;
    contactLabel: string;
  };
}

export const LEGAL_PAGES: Record<string, LegalContent> = {
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    description: "At .Soko, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you use our marketplace.",
    lastUpdated: "January 12, 2026",
    version: "1.2",
    badge: { text: "Privacy Matters", icon: React.createElement(Shield, { className: "w-3.5 h-3.5" }) },
    sections: [
      {
        title: "Information We Collect",
        icon: React.createElement(Eye, { className: "w-5 h-5" }),
        content: [
          "Personal identification information (Name, email address, phone number, etc.)",
          "Billing and shipping information for order fulfillment.",
          "Device information and IP addresses for security and analytics.",
          "Shopping preferences and interaction data to improve your experience."
        ]
      },
      {
        title: "How We Use Your Data",
        icon: React.createElement(Lock, { className: "w-5 h-5" }),
        content: [
          "To process and manage your orders and payments.",
          "To provide customer support and respond to your inquiries.",
          "To send you service updates, security alerts, and marketing communications (with your consent).",
          "To prevent fraud and maintain the security of our marketplace."
        ]
      },
      {
        title: "Data Sharing & Third Parties",
        icon: React.createElement(Globe, { className: "w-5 h-5" }),
        content: [
          "We share necessary data with vendors (shops) you purchase from to fulfill orders.",
          "Third-party payment processors handle your financial data securely.",
          "Logistics partners receive shipping details to deliver your items.",
          "We never sell your personal information to third parties for marketing."
        ]
      },
      {
        title: "Your Privacy Rights",
        icon: React.createElement(Shield, { className: "w-5 h-5" }),
        content: [
          "The right to access and receive a copy of your personal data.",
          "The right to rectify inaccurate or incomplete information.",
          "The right to request deletion of your data (subject to legal obligations).",
          "The right to withdraw consent for marketing at any time."
        ]
      }
    ],
    ctaCard: {
      title: "Cookies & Tracking",
      description: "We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking 'Accept', you consent to our use of cookies.",
      buttonText: "Manage Cookie Settings",
      icon: React.createElement(Lock, { className: "w-6 h-6" })
    },
    sidebar: {
      questionTitle: "Questions?",
      questionDesc: "If you have any questions about this Privacy Policy or our data practices, please don't hesitate to contact our privacy team.",
      contactEmail: "privacy@dotsoko.com",
      contactLabel: "Email our DPO"
    }
  },
  terms: {
    slug: "terms",
    title: "Terms of Service",
    description: "These terms govern your use of the .Soko marketplace. Please read them carefully to understand your rights and obligations as a user of our platform.",
    lastUpdated: "January 14, 2026",
    version: "1.2",
    badge: { text: "Legal Framework", icon: React.createElement(Scale, { className: "w-3.5 h-3.5" }) },
    sections: [
      {
        title: "1. Acceptance of Terms",
        icon: React.createElement(ShieldCheck, { className: "w-5 h-5" }),
        content: [
          "By accessing or using .Soko, you agree to be bound by these Terms of Service.",
          "If you do not agree to these terms, you may not use our platform or services.",
          "We reserve the right to modify these terms at any time, with updates effective upon posting.",
          "Continued use of the platform constitutes acceptance of any updated terms."
        ]
      },
      {
        title: "2. Marketplace Platform",
        icon: React.createElement(ShoppingBag, { className: "w-5 h-5" }),
        content: [
          ".Soko provides a marketplace where sellers can list products and buyers can purchase them.",
          "We are not the seller of items listed by third-party vendors on the platform.",
          "Transactions are directly between the buyer and the seller.",
          "We facilitate payment processing but are not responsible for product quality or delivery by sellers."
        ]
      },
      {
        title: "3. User Accounts",
        icon: React.createElement(Users, { className: "w-5 h-5" }),
        content: [
          "You must provide accurate and complete information when creating an account.",
          "You are responsible for maintaining the confidentiality of your account credentials.",
          "Users must be at least 18 years old or have parental/guardian consent.",
          "We reserve the right to suspend or terminate accounts that violate our community guidelines."
        ]
      },
      {
        title: "4. Fees and Payments",
        icon: React.createElement(Scale, { className: "w-5 h-5" }),
        content: [
          "Sellers agree to pay the commission fees specified in the Seller Agreement.",
          "Buyers are responsible for the purchase price and any applicable shipping or tax fees.",
          "All payments are processed through secure third-party payment gateways.",
          "Refunds are subject to our Return Policy and individual seller terms."
        ]
      }
    ],
    ctaCard: {
      title: "Cookies & Tracking",
      description: "We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking 'Accept', you consent to our use of cookies.",
      buttonText: "Manage Cookie Settings",
      icon: React.createElement(Lock, { className: "w-6 h-6" })
    },
    sidebar: {
      questionTitle: "Need Help?",
      questionDesc: "If you need clarification on any of our terms or have a specific legal inquiry, our compliance team is here to assist you.",
      contactEmail: "legal@dotsoko.com",
      contactLabel: "Legal Department"
    }
  },
  cookies: {
    slug: "cookies",
    title: "Cookie Policy",
    description: "This policy explains how .Soko uses cookies and similar technologies to recognize you when you visit our marketplace. It explains what these technologies are and why we use them.",
    lastUpdated: "January 14, 2026",
    version: "1.0",
    badge: { text: "Your Privacy Choice", icon: React.createElement(Cookie, { className: "w-3.5 h-3.5" }) },
    sections: [
      {
        title: "What are Cookies?",
        icon: React.createElement(Cookie, { className: "w-5 h-5" }),
        content: [
          "Cookies are small text files stored on your device when you visit a website.",
          "They help the website remember your actions and preferences over time.",
          "Cookies allow us to provide a more personalized and efficient browsing experience.",
          "They can be 'persistent' (stored until they expire) or 'session' (deleted when you close your browser)."
        ]
      },
      {
        title: "How We Use Cookies",
        icon: React.createElement(Eye, { className: "w-5 h-5" }),
        content: [
          "Essential Cookies: Required for basic site functionality like secure login and cart management.",
          "Analytical Cookies: Help us understand how visitors interact with .Soko to improve performance.",
          "Preference Cookies: Remember your language, currency, and display settings.",
          "Marketing Cookies: Used to deliver relevant advertisements and track campaign effectiveness."
        ]
      },
      {
        title: "Managing Your Preferences",
        icon: React.createElement(Settings, { className: "w-5 h-5" }),
        content: [
          "You can control and manage cookies through your browser settings.",
          "Most browsers allow you to refuse or delete cookies, but this may affect site functionality.",
          "You can opt-out of third-party tracking cookies through specialized privacy tools.",
          "Blocking all cookies will make certain features like the shopping cart unavailable."
        ]
      },
      {
        title: "Third-Party Cookies",
        icon: React.createElement(Shield, { className: "w-5 h-5" }),
        content: [
          "We use services like Google Analytics to analyze traffic and site usage.",
          "Payment processors use cookies to ensure transaction security and fraud prevention.",
          "Social media plugins may set cookies if you interact with them on our platform.",
          "We do not control how these third parties use their cookies; please check their respective policies."
        ]
      }
    ],
    ctaCard: {
      title: "Cookie Expiration",
      description: "Session cookies expire immediately when you close your browser. Persistent cookies remain on your device for a set period (usually 30 to 365 days) unless you manually delete them before their expiration date.",
      tags: ['30 Days', '90 Days', '1 Year', 'Session Only'],
      icon: React.createElement(Clock, { className: "w-6 h-6" })
    },
    sidebar: {
      questionTitle: "Cookie Support",
      questionDesc: "Have questions about how we use cookies or want to exercise your right to opt-out? Our technical privacy team is ready to help.",
      contactEmail: "privacy@dotsoko.com",
      contactLabel: "Technical Support"
    }
  },
  returns: {
    slug: "returns",
    title: "Returns & Refunds",
    description: "We want you to be completely satisfied with your purchase. If something isn't quite right, our straightforward return policy ensures a hassle-free experience.",
    lastUpdated: "January 14, 2026",
    version: "1.5",
    badge: { text: "Easy Returns", icon: React.createElement(RefreshCcw, { className: "w-3.5 h-3.5" }) },
    sections: [
      {
        title: "Return Eligibility",
        icon: React.createElement(Package, { className: "w-5 h-5" }),
        content: [
          "Items must be returned within 14 days of delivery.",
          "Products must be in their original packaging with all tags attached.",
          "Items must be unused, unwashed, and in the same condition as received.",
          "Certain items (hygiene products, custom orders) are non-returnable."
        ]
      },
      {
        title: "The Return Process",
        icon: React.createElement(RefreshCcw, { className: "w-5 h-5" }),
        content: [
          "Initiate your return through your 'Order History' in your .Soko account.",
          "Select the reason for return and upload photos if the item is damaged.",
          "Wait for the seller's approval (usually within 24-48 hours).",
          "Once approved, you'll receive a return shipping label or instructions."
        ]
      },
      {
        title: "Refunds & Credit",
        icon: React.createElement(CreditCard, { className: "w-5 h-5" }),
        content: [
          "Refunds are processed back to your original payment method.",
          "Processing time usually takes 5-10 business days after the item is received.",
          "You may opt for .Soko Store Credit for faster reimbursement.",
          "Shipping costs are non-refundable unless the item was faulty."
        ]
      },
      {
        title: "Shipping Your Return",
        icon: React.createElement(Truck, { className: "w-5 h-5" }),
        content: [
          "Pack the item securely to prevent damage during transit.",
          "Include the original packing slip or return authorization form.",
          "Use the provided shipping label or a trackable shipping service.",
          "Keep your tracking number until the refund is fully processed."
        ]
      }
    ],
    ctaCard: {
      title: "Buyer Protection",
      description: "Every purchase on .Soko is covered by our Buyer Protection program. If your item doesn't arrive or is significantly different from the description, we guarantee a full refund.",
      icon: React.createElement(ShieldCheck, { className: "w-6 h-6" })
    },
    sidebar: {
      questionTitle: "Start a Return",
      questionDesc: "The quickest way to handle a return is through your user dashboard. Need help with a specific order?",
      contactEmail: "support@dotsoko.com",
      contactLabel: "Customer Support"
    }
  },
  about: {
    slug: "about",
    title: "Empowering Digital Commerce",
    description: "Welcome to .Soko, the ultimate multivendor marketplace connecting buyers and sellers in a seamless, secure ecosystem.",
    lastUpdated: "2026",
    version: "1.0",
    badge: { text: "About Us", icon: React.createElement(Info, { className: "w-3.5 h-3.5" }) },
    sections: [
      {
        title: "Our Mission",
        icon: React.createElement(Target, { className: "w-5 h-5" }),
        content: [
          ".Soko is more than just a marketplace. We are a community-driven platform designed to connect people with quality products while helping businesses thrive in the digital age.",
          "We believe in democratizing commerce by providing tools that allow anyone, anywhere to start and grow their business.",
          "Our mission is to create a seamless, secure, and enjoyable shopping experience for everyone."
        ]
      },
      {
        title: "Our Story",
        icon: React.createElement(Globe, { className: "w-5 h-5" }),
        content: [
          "Starting in 2024, we set out to bridge the gap between local artisans and global markets.",
          "In a rapidly changing world, we noticed that many talented sellers were struggling to find their place online. We built .Soko to solve this problem.",
          "Today, we are proud to support thousands of entrepreneurs across the region, providing them with the tools they need to succeed."
        ]
      },
      {
        title: "Core Values",
        icon: React.createElement(Heart, { className: "w-5 h-5" }),
        content: [
          "Trust & Security: We prioritize the safety of our buyers and sellers with secure payment systems and verified profiles.",
          "Community First: Building a thriving ecosystem where small businesses and individual sellers can grow and succeed.",
          "Innovation: Continuously improving our platform with the latest technology to provide a seamless shopping experience.",
          "Sustainability: Supporting local economies and promoting sustainable commerce across the region."
        ]
      }
    ],
    ctaCard: {
      title: "Join Our Team",
      description: "We are always looking for passionate individuals to help us build the future of commerce. Check out our careers page for open positions.",
      buttonText: "View Openings",
      buttonLink: "/careers",
      icon: React.createElement(ShoppingBag, { className: "w-6 h-6" })
    },
    sidebar: {
      questionTitle: "Get in Touch",
      questionDesc: "Have questions or want to partner with us? We'd love to hear from you.",
      contactEmail: "hello@dotsoko.com",
      contactLabel: "General Inquiries"
    }
  }
};
