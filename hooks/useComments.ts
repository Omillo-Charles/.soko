import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useComments = (productId?: string) => {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery({
    queryKey: ['comments', productId],
    queryFn: async () => {
      const response = await api.get(`/comments/product/${productId}`);
      return response.data.data;
    },
    enabled: !!productId,
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({ productId, content }: { productId: string; content: string }) => {
      const response = await api.post('/comments', { productId, content });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      toast.success('Comment posted successfully');
    },
    onError: (error: any) => {
      toast.error(error.friendlyMessage || 'Failed to post comment');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await api.delete(`/comments/${commentId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      toast.success('Comment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.friendlyMessage || 'Failed to delete comment');
    },
  });

  return {
    comments: commentsQuery.data || [],
    isLoading: commentsQuery.isLoading,
    isError: commentsQuery.isError,
    createComment: createCommentMutation.mutate,
    isPosting: createCommentMutation.isPending,
    deleteComment: deleteCommentMutation.mutate,
    isDeleting: deleteCommentMutation.isPending,
  };
};
