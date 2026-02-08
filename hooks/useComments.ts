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
    onMutate: async ({ productId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['products'] });
      await queryClient.cancelQueries({ queryKey: ['products-limited'] });
      await queryClient.cancelQueries({ queryKey: ['products-infinite'] });
      await queryClient.cancelQueries({ queryKey: ['featured-products'] });
      await queryClient.cancelQueries({ queryKey: ['product-feed'] });

      // Snapshot previous values
      const previousProducts = queryClient.getQueryData(['products']);
      const previousFeed = queryClient.getQueryData(['product-feed']);

      // Update function
      const updateCommentCount = (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map((p: any) => {
            if (p._id === productId || p.id === productId) {
              return { ...p, commentsCount: (p.commentsCount || 0) + 1 };
            }
            return p;
          });
        }
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data?.map((p: any) => {
                if (p._id === productId || p.id === productId) {
                  return { ...p, commentsCount: (p.commentsCount || 0) + 1 };
                }
                return p;
              })
            }))
          };
        }
        return old;
      };

      // Optimistic updates
      queryClient.setQueriesData({ queryKey: ['products'] }, updateCommentCount);
      queryClient.setQueriesData({ queryKey: ['products-limited'] }, updateCommentCount);
      queryClient.setQueriesData({ queryKey: ['products-infinite'] }, updateCommentCount);
      queryClient.setQueriesData({ queryKey: ['featured-products'] }, updateCommentCount);
      queryClient.setQueriesData({ queryKey: ['product-feed'] }, updateCommentCount);

      return { previousProducts, previousFeed };
    },
    onError: (error: any, variables, context) => {
      // Rollback
      if (context?.previousProducts) {
        queryClient.setQueriesData({ queryKey: ['products'] }, context.previousProducts);
      }
      if (context?.previousFeed) {
        queryClient.setQueriesData({ queryKey: ['product-feed'] }, context.previousFeed);
      }
      toast.error(error.friendlyMessage || 'Failed to post comment');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products-limited'] });
      queryClient.invalidateQueries({ queryKey: ['products-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      queryClient.invalidateQueries({ queryKey: ['product-feed'] });
    },
    onSuccess: () => {
      toast.success('Comment posted successfully');
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
      queryClient.invalidateQueries({ queryKey: ['products-limited'] });
      queryClient.invalidateQueries({ queryKey: ['products-infinite'] });
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
