import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, apiMutation } from '@/api/client';
import { useAppSelector } from '@/stores/hooks';
import type { Source } from '@/types/blog';



type NewSource = Omit<Source, 'id' | 'last_check' | 'created_by'>;

export function useSources() {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);

    const sourcesQuery = useQuery<Source[]>({
        queryKey: ['sources'],
        queryFn: () => apiClient({ queryKey: ['sources'] }),
    });

    const createMutation = useMutation({
        mutationFn: (newSource: NewSource) =>
            apiMutation('sources', {
                method: 'POST',
                body: JSON.stringify({
                    ...newSource,
                    last_check: new Date().toISOString(),
                    created_by: user?.id,
                }),
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sources'] }),
    });

    const toggleMutation = useMutation({
        mutationFn: ({ id, active }: { id: number; active: boolean }) =>
            apiMutation(`sources/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ active }),
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sources'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => apiMutation(`sources/${id}`, { method: 'DELETE' }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sources'] }),
    });

    const triggerVeilleMutation = useMutation({
        mutationFn: () => apiClient({ queryKey: ['veille/trigger'] }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sources'] }), // ajouter article après veille
    });

    return {
        sources: sourcesQuery.data ?? [],
        isLoading: sourcesQuery.isLoading,
        createSource: createMutation.mutate,
        isCreating: createMutation.isPending,
        toggleSource: toggleMutation.mutate,
        deleteSource: deleteMutation.mutate,
        triggerVeille: triggerVeilleMutation.mutate,
        isTriggering: triggerVeilleMutation.isPending,
    };
}