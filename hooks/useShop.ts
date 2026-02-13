import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useShop = (idOrHandle: string) => {
  return useQuery({
    queryKey: ['shop', idOrHandle],
    queryFn: async () => {
      // Check if it's a handle (starts with @)
      const endpoint = idOrHandle.startsWith('@') 
        ? `/shops/handle/${idOrHandle.substring(1)}` 
        : `/shops/${idOrHandle}`;
        
      const response = await api.get(endpoint);
      const shopData = response.data.data || response.data;
      
      // If the data is empty or missing name, it might be an unsuccessful response
      if (!shopData || (typeof shopData === 'object' && !shopData.name && !shopData._id)) {
        throw new Error("Shop not found");
      }
      
      return shopData;
    },
    enabled: !!idOrHandle && idOrHandle !== 'undefined',
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

export const useShopProducts = (idOrHandle: string, params?: { limit?: number; minPrice?: number; maxPrice?: number }) => {
  return useQuery({
    queryKey: ['shop-products', idOrHandle, params],
    queryFn: async () => {
      // Check if it's a handle (starts with @)
      const endpoint = idOrHandle.startsWith('@')
        ? `/products/shop/handle/${idOrHandle.substring(1)}`
        : `/products/shop/${idOrHandle}`;

      const response = await api.get(endpoint, {
        params: { limit: 20, ...params }
      });
      return response.data.data;
    },
    enabled: !!idOrHandle && idOrHandle !== 'undefined',
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

export const useShopLists = (idOrHandle: string, type: 'Followers' | 'Following') => {
  return useQuery({
    queryKey: ['shop-lists', idOrHandle, type],
    queryFn: async () => {
      const isHandle = idOrHandle.startsWith('@');
      const cleanHandle = isHandle ? idOrHandle.substring(1) : idOrHandle;

      const endpoints = type === 'Followers' 
        ? [
            isHandle ? `/shops/handle/${cleanHandle}/followers` : `/shops/${idOrHandle}/followers`,
            `/users/followers/${idOrHandle}`
          ]
        : [
            isHandle ? `/shops/handle/${cleanHandle}/following` : `/shops/${idOrHandle}/following`,
            `/users/following/${idOrHandle}`
          ];

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
    enabled: !!idOrHandle && (type === 'Followers' || type === 'Following'),
  });
};

export const useShopReviews = (idOrHandle: string) => {
  return useQuery({
    queryKey: ['shop-reviews', idOrHandle],
    queryFn: async () => {
      const endpoint = idOrHandle.startsWith('@')
        ? `/shops/handle/${idOrHandle.substring(1)}/reviews`
        : `/shops/${idOrHandle}/reviews`;
        
      const response = await api.get(endpoint);
      return response.data.data;
    },
    enabled: !!idOrHandle && idOrHandle !== 'undefined',
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
