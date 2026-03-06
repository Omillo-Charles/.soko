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
      if (!shopData || (typeof shopData === 'object' && !shopData.name && !shopData.id && !shopData._id)) {
        throw new Error("Shop not found");
      }

      // Map id to _id for backward compatibility
      if (shopData && shopData.id && !shopData._id) {
        shopData._id = shopData.id;
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
      const data = response.data.data;
      if (data && data.id && !data._id) {
        data._id = data.id;
      }
      return data;
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
      const data = response.data.data || [];
      return data.map((p: any) => ({
        ...p,
        _id: p.id || p._id || `prod-${Math.random()}`
      }));
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

      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const userId = userStr ? (() => { try { const u = JSON.parse(userStr); return u._id || u.id; } catch { return null; } })() : null;

      const toggleObj = (obj: any) => {
        if (!obj) return obj;
        const clone = { ...obj };
        const currentFollowing = Boolean(clone.isFollowing) || (Array.isArray(clone.followersList) && userId ? clone.followersList.some((f: any) => String(f._id || f) === String(userId)) : false);
        const nextFollowing = !currentFollowing;
        const count = Number(clone.followersCount ?? clone._count?.followers ?? 0);
        const nextCount = Math.max(0, count + (nextFollowing ? 1 : -1));
        clone.isFollowing = nextFollowing;
        clone.followersCount = nextCount;
        if (Array.isArray(clone.followersList) && userId) {
          if (nextFollowing) {
            clone.followersList = [...clone.followersList, userId];
          } else {
            clone.followersList = clone.followersList.filter((f: any) => String(f._id || f) !== String(userId));
          }
        }
        return clone;
      };

      // Optimistically update the specific shop entry
      queryClient.setQueryData(['shop', shopId], (old: any) => toggleObj(old));
      // Also, update any shop queries by handle that represent this shop
      queryClient.setQueriesData({ queryKey: ['shop'] }, (old: any, query: any) => {
        if (!old) return old;
        const key = query?.queryKey as any[];
        const idOrHandle = key?.[1];
        if (!idOrHandle) return old;
        // If the cached shop has matching id, update
        const cachedId = old._id || old.id;
        if (String(cachedId) === String(shopId)) {
          return toggleObj(old);
        }
        return old;
      });
      // Update popular shops list
      queryClient.setQueriesData({ queryKey: ['popular-shops'] }, (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map((s: any) => {
            const sid = s._id || s.id;
            if (String(sid) === String(shopId)) {
              return toggleObj(s);
            }
            return s;
          });
        }
        return old;
      });

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
    onSettled: () => {
      // Always refetch to ensure we have the correct server state
      queryClient.invalidateQueries({ queryKey: ['shop'] });
      queryClient.invalidateQueries({ queryKey: ['popular-shops'] });
      queryClient.invalidateQueries({ queryKey: ['my-shop'] });
      queryClient.invalidateQueries({ queryKey: ['user-me'] });
      queryClient.invalidateQueries({ queryKey: ['shop-lists'] });
    },
  });
};
