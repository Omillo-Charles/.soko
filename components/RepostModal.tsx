"use client";

import React, { useEffect, useRef } from "react";
import { Repeat, ShoppingCart } from "lucide-react";

interface RepostModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
}

export const RepostModal: React.FC<RepostModalProps> = ({
  isOpen,
  onClose,
  position,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="absolute z-50 bg-background border border-border rounded-2xl shadow-xl w-48 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="p-2">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors">
          <Repeat className="w-4 h-4" />
          Repost
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors">
          <ShoppingCart className="w-4 h-4" />
          Resell
        </button>
      </div>
    </div>
  );
};
