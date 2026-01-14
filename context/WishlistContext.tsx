"use client";

import React, { createContext, useContext } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

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
  const queryClient = useQueryClient();

  const { data: wishlistData, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await api.get('/wishlist');
      return response.data.data;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
  });

  const wishlistItems = wishlistData?.products || [];

  const toggleMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.post('/wishlist/toggle', { productId });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      if (data.action === 'added') {
        toast.success("Added to wishlist");
      } else {
        toast.success("Removed from wishlist");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.delete(`/wishlist/${productId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success("Removed from wishlist");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  });

  const toggleWishlist = async (productId: string): Promise<'added' | 'removed' | null> => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Please login to manage your wishlist");
      return null;
    }

    try {
      const result = await toggleMutation.mutateAsync(productId);
      return result.action;
    } catch (error) {
      return null;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    await removeMutation.mutateAsync(productId);
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item: Product) => item._id === productId);
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
