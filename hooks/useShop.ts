import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useShop = (id: string) => {
  return useQuery({
    queryKey: ['shop', id],
    queryFn: async () => {
      const response = await api.get(`/shops/${id}`);
      return response.data.data;
    },
    enabled: !!id && id !== 'undefined',
  });
};

export const useMyShop = () => {
  return useQuery({
    queryKey: ['my-shop'],
    queryFn: async () => {
      const response = await api.get('/shops/my-shop');
      return response.data.data;
    },
    retry: false, // Don't retry if shop not found (likely 404 means redirect to register)
  });
};

export const useShopProducts = (id: string) => {
  return useQuery({
    queryKey: ['shop-products', id],
    queryFn: async () => {
      const response = await api.get(`/products/shop/${id}`);
      return response.data.data;
    },
    enabled: !!id && id !== 'undefined',
  });
};

export const usePopularShops = () => {
  return useQuery({
    queryKey: ['popular-shops'],
    queryFn: async () => {
      const response = await api.get('/shops');
      return response.data.data;
    },
  });
};

export const useShopLists = (id: string, type: 'Followers' | 'Following') => {
  return useQuery({
    queryKey: ['shop-lists', id, type],
    queryFn: async () => {
      const endpoints = type === 'Followers' 
        ? [`/shops/${id}/followers`, `/users/followers/${id}`]
        : [`/shops/${id}/following`, `/users/following/${id}`];

      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint);
          if (response.data.success) {
            return response.data.data || (type === 'Followers' ? response.data.followers : response.data.following) || [];
          }
        } catch (err) {
          // Try next endpoint
        }
      }
      return [];
    },
    enabled: !!id && (type === 'Followers' || type === 'Following'),
  });
};

export const useFollowShop = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (shopId: string) => {
      const response = await api.post(`/shops/${shopId}/follow`);
      return response.data;
    },
    // Optimistic Update
    onMutate: async (shopId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['shop', shopId] });
      await queryClient.cancelQueries({ queryKey: ['popular-shops'] });

      // Snapshot the previous value
      const previousShop = queryClient.getQueryData(['shop', shopId]);
      const previousPopular = queryClient.getQueryData(['popular-shops']);

      // Optimistically update to the new value
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (currentUser) {
        queryClient.setQueryData(['shop', shopId], (old: any) => {
          if (!old) return old;
          const isFollowing = old.followers?.some((f: any) => String(f._id || f) === String(currentUser._id));
          return {
            ...old,
            followers: isFollowing 
              ? old.followers.filter((f: any) => String(f._id || f) !== String(currentUser._id))
              : [...(old.followers || []), currentUser._id],
            followersCount: isFollowing ? (old.followersCount || 1) - 1 : (old.followersCount || 0) + 1
          };
        });
      }

      return { previousShop, previousPopular };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, shopId, context: any) => {
      if (context?.previousShop) {
        queryClient.setQueryData(['shop', shopId], context.previousShop);
      }
      if (context?.previousPopular) {
        queryClient.setQueryData(['popular-shops'], context.previousPopular);
      }
    },
    // Always refetch after error or success:
    onSettled: (_, __, shopId) => {
      queryClient.invalidateQueries({ queryKey: ['shop', shopId] });
      queryClient.invalidateQueries({ queryKey: ['popular-shops'] });
    },
  });
};
