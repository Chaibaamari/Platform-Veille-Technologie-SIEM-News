import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, apiMutation } from '@/api/client';
import { useAppSelector } from '@/stores/hooks';

type NewSource = {
    nom_source: string,
    flux_rss: string,
    active: boolean
}

export function useSources() {
    const queryClient = useQueryClient();
    //const { user } = useAppSelector((state) => state.auth);

    const sourcesQuery = useQuery({
        queryKey: ['sources'],
        queryFn: () => apiClient({ queryKey: ['sources'] }),
    });

    const createMutation = useMutation({
        mutationFn: (newSource: NewSource) =>
            apiMutation('sources/add/', {
                method: 'POST',
                body: JSON.stringify({
                    ...newSource
                }),
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sources'] }),
    });

    const toggleMutation = useMutation({
        mutationFn: ({ id, active }: { id: number; active: boolean }) =>
            apiMutation(`sources/${id}/update/`, {
                method: 'PUT',
                body: JSON.stringify({ active }),
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sources'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => apiMutation(`sources/${id}/delete/`, { method: 'DELETE' }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sources'] }),
    });

    const triggerVeilleMutation = useMutation({
        mutationFn: () => apiClient({ queryKey: ['veille/trigger'] }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sources'] }), // ajouter article après veille
    });

    return {
        sourcesData: sourcesQuery.data ?? [],
        isLoading: sourcesQuery.isLoading,
        createSource: createMutation.mutate,
        isCreating: createMutation.isPending,
        toggleSource: toggleMutation.mutate,
        deleteSource: deleteMutation.mutate,
        triggerVeille: triggerVeilleMutation.mutate,
        isTriggering: triggerVeilleMutation.isPending,
    };
}