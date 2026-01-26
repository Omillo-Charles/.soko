import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await api.get('/stats');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
