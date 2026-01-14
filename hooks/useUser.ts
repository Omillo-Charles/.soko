import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useUser = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user-me'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (!token) return null;
      
      try {
        const response = await api.get('/users/me');
        if (response.data.success) {
          // Sync localStorage
          localStorage.setItem('user', JSON.stringify(response.data.data));
          return response.data.data;
        }
        return null;
      } catch (err) {
        // If 401, the interceptor handles logout
        return null;
      }
    },
    // Only run if we have a token
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  // Local fallback for immediate UI (e.g. during initial load)
  const localUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const updateAccountTypeMutation = useMutation({
    mutationFn: async (accountType: 'buyer' | 'seller') => {
      const response = await api.put('/users/update-account-type', { accountType });
      return response.data.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user-me'], updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  });

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    queryClient.setQueryData(['user-me'], null);
    queryClient.invalidateQueries();
  };

  return { 
    user: user || localUser, 
    token, 
    isLoading: isLoading && !localUser, // Only "loading" if we don't even have local data
    error,
    logout,
    updateAccountType: updateAccountTypeMutation.mutateAsync,
    isUpdatingAccountType: updateAccountTypeMutation.isPending,
    refreshUser: () => queryClient.invalidateQueries({ queryKey: ['user-me'] })
  };
};
