"use client";

import React from "react";
import { X, Copy, Facebook, Link as LinkIcon, Instagram } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface ShareShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  shopName: string;
}

const ShareShopModal = ({ isOpen, onClose, url, shopName }: ShareShopModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.433 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      color: "bg-[#25D366]",
      hoverColor: "hover:bg-[#20bd5b]",
      url: `https://wa.me/?text=${encodeURIComponent("Check out this shop: " + shopName + " " + url)}`,
    },
    {
      name: "X",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: "bg-black",
      hoverColor: "hover:bg-slate-800",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out " + shopName + " on Duuka!")}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-6 h-6" />,
      color: "bg-[#1877F2]",
      hoverColor: "hover:bg-[#166fe5]",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-6 h-6" />,
      color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
      hoverColor: "hover:opacity-90",
      url: `https://www.instagram.com/`,
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-background w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center">
              <LinkIcon className="w-10 h-10 text-primary" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-foreground leading-tight">
                Share Shop
              </h3>
              <p className="text-muted-foreground font-medium text-sm px-4">
                Share <span className="text-foreground font-bold">"{shopName}"</span> with your friends
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4 w-full">
              {shareLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleShare(link.url)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-12 h-12 ${link.color} ${link.hoverColor} text-white rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-black/5`}>
                    {link.icon}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{link.name}</span>
                </button>
              ))}
            </div>

            <div className="w-full pt-2">
              <div className="relative group">
                <input
                  type="text"
                  readOnly
                  value={url}
                  className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3.5 pr-12 text-xs font-medium text-muted-foreground focus:outline-none focus:ring-0"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background border border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-95"
                >
                  {copied ? (
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-[10px] font-black text-primary uppercase">Copied</span>
                    </div>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareShopModal;
