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
  images?: string[];
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
    onMutate: async (productId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['products'] });
      await queryClient.cancelQueries({ queryKey: ['products-limited'] });
      await queryClient.cancelQueries({ queryKey: ['products-infinite'] });
      await queryClient.cancelQueries({ queryKey: ['featured-products'] });
      await queryClient.cancelQueries({ queryKey: ['product-feed'] });

      // Snapshot the previous values
      const previousProducts = queryClient.getQueryData(['products']);
      const previousFeed = queryClient.getQueryData(['product-feed']);

      // Determine if adding or removing
      const currentlyInWishlist = wishlistItems.some((item: Product) => item._id === productId);
      const action = currentlyInWishlist ? 'removed' : 'added';

      // Function to update product list
      const updateProductList = (old: any) => {
        if (!old) return old;
        // If it's an array (standard useQuery)
        if (Array.isArray(old)) {
          return old.map((p: any) => {
            if (p._id === productId || p.id === productId) {
              return {
                ...p,
                likesCount: action === 'added' ? (p.likesCount || 0) + 1 : Math.max(0, (p.likesCount || 0) - 1)
              };
            }
            return p;
          });
        }
        // If it's paginated data (useInfiniteQuery)
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data?.map((p: any) => {
                if (p._id === productId || p.id === productId) {
                  return {
                    ...p,
                    likesCount: action === 'added' ? (p.likesCount || 0) + 1 : Math.max(0, (p.likesCount || 0) - 1)
                  };
                }
                return p;
              })
            }))
          };
        }
        return old;
      };

      // Optimistically update all related queries
      queryClient.setQueriesData({ queryKey: ['products'] }, updateProductList);
      queryClient.setQueriesData({ queryKey: ['products-limited'] }, updateProductList);
      queryClient.setQueriesData({ queryKey: ['products-infinite'] }, updateProductList);
      queryClient.setQueriesData({ queryKey: ['featured-products'] }, updateProductList);
      queryClient.setQueriesData({ queryKey: ['product-feed'] }, updateProductList);

      return { previousProducts, previousFeed };
    },
    onError: (error: any, productId, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueriesData({ queryKey: ['products'] }, context.previousProducts);
      }
      if (context?.previousFeed) {
        queryClient.setQueriesData({ queryKey: ['product-feed'] }, context.previousFeed);
      }
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    },
    onSettled: () => {
      // Always refetch to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products-limited'] });
      queryClient.invalidateQueries({ queryKey: ['products-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      queryClient.invalidateQueries({ queryKey: ['product-feed'] });
    },
    onSuccess: (data) => {
      if (data.action === 'added') {
        toast.success("Added to wishlist");
      } else {
        toast.success("Removed from wishlist");
      }
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
