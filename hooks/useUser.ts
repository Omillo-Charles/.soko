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
          const userData = response.data.data;
          if (userData && userData.id && !userData._id) {
            userData._id = userData.id;
          }
          // Sync localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          return userData;
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
  const localUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const localUser = localUserStr ? JSON.parse(localUserStr) : null;
  if (localUser && localUser.id && !localUser._id) {
    localUser._id = localUser.id;
  }
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

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put('/users/update-password', data);
      return response.data;
    }
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.delete('/users/me', { data });
      return response.data;
    },
    onSuccess: () => {
      logout();
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
    error: error as any,
    logout,
    updateAccountType: updateAccountTypeMutation.mutateAsync,
    isUpdatingAccountType: updateAccountTypeMutation.isPending,
    updatePassword: updatePasswordMutation.mutateAsync,
    isUpdatingPassword: updatePasswordMutation.isPending,
    deleteAccount: deleteAccountMutation.mutateAsync,
    isDeletingAccount: deleteAccountMutation.isPending,
    refreshUser: () => queryClient.invalidateQueries({ queryKey: ['user-me'] })
  };
};
