import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useProducts = (params?: any) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await api.get('/products', { params });
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useInfiniteProducts = (params?: any) => {
  return useInfiniteQuery({
    queryKey: ['products-infinite', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get('/products', { 
        params: { ...params, page: pageParam, limit: 12 } 
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination && lastPage.pagination.page < lastPage.pagination.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useMyProducts = () => {
  return useQuery({
    queryKey: ['my-products'],
    queryFn: async () => {
      const response = await api.get('/products/my-products');
      return response.data.data;
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      return response.data.data;
    },
    enabled: !!id && id !== 'undefined',
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useFeaturedProducts = (limit: number = 4) => {
  return useQuery({
    queryKey: ['featured-products', limit],
    queryFn: async () => {
      const response = await api.get('/products', { params: { limit } });
      return response.data.data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
