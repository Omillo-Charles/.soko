"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  shop?: {
    name: string;
  };
}

interface WishlistContextType {
  wishlistItems: Product[];
  isLoading: boolean;
  toggleWishlist: (productId: string) => Promise<'added' | 'removed' | null>;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

  const fetchWishlist = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setWishlistItems([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/wishlist`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setWishlistItems(data.data.products || []);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const toggleWishlist = async (productId: string): Promise<'added' | 'removed' | null> => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Please login to manage your wishlist");
      return null;
    }

    try {
      const response = await fetch(`${apiUrl}/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      const data = await response.json();
      if (data.success) {
        setWishlistItems(data.data.products || []);
        if (data.action === 'added') {
          toast.success("Added to wishlist");
        } else {
          toast.success("Removed from wishlist");
        }
        return data.action;
      } else {
        toast.error(data.message || data.error || "Failed to update wishlist");
        return null;
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("An error occurred. Please try again.");
      return null;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await fetch(`${apiUrl}/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setWishlistItems(data.data.products || []);
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove item");
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      isLoading, 
      toggleWishlist, 
      isInWishlist,
      removeFromWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
