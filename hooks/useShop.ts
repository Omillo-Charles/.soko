import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useShop = (id: string) => {
  return useQuery({
    queryKey: ['shop', id],
    queryFn: async () => {
      const response = await api.get(`/shops/${id}`);
      const shopData = response.data.data || response.data;
      
      // If the data is empty or missing name, it might be an unsuccessful response
      if (!shopData || (typeof shopData === 'object' && !shopData.name && !shopData._id)) {
        throw new Error("Shop not found");
      }
      
      return shopData;
    },
    enabled: !!id && id !== 'undefined',
    staleTime: 0, // Ensure we always get fresh data for profile
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

export const useShopProducts = (id: string, params?: { limit?: number; minPrice?: number; maxPrice?: number }) => {
  return useQuery({
    queryKey: ['shop-products', id, params],
    queryFn: async () => {
      const response = await api.get(`/products/shop/${id}`, {
        params: { limit: 20, ...params }
      });
      return response.data.data;
    },
    enabled: !!id && id !== 'undefined',
  });
};

export const usePopularShops = (limit?: number) => {
  return useQuery({
    queryKey: ['popular-shops', limit],
    queryFn: async () => {
      const response = await api.get('/shops', {
        params: { limit }
      });
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

export const useShopReviews = (id: string) => {
  return useQuery({
    queryKey: ['shop-reviews', id],
    queryFn: async () => {
      const response = await api.get(`/shops/${id}/reviews`);
      return response.data.data;
    },
    enabled: !!id && id !== 'undefined',
  });
};

export const useFollowShop = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (shopId: string) => {
      const response = await api.post(`/shops/${shopId}/follow`);
      return response.data;
    },
    // Snapshot the previous value
    onMutate: async (shopId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['shop', shopId] });
      await queryClient.cancelQueries({ queryKey: ['popular-shops'] });

      // Snapshot the previous values
      const previousShop = queryClient.getQueryData(['shop', shopId]);
      const previousPopular = queryClient.getQueryData(['popular-shops']);

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
    onSettled: (data, error, variables) => {
      // Always refetch to ensure we have the correct server state
      queryClient.invalidateQueries({ queryKey: ['shop'] });
      queryClient.invalidateQueries({ queryKey: ['popular-shops'] });
      queryClient.invalidateQueries({ queryKey: ['my-shop'] });
      queryClient.invalidateQueries({ queryKey: ['user-me'] });
      if (variables && variables !== 'undefined') {
        queryClient.invalidateQueries({ queryKey: ['shop-lists', variables] });
      }
    },
  });
};
