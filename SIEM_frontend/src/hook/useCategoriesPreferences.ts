import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, apiMutation } from '@/api/client';

export type Category = {
    id_categorie: number;
    nom_categorie: string;
};

export type UserCategoryPreference = {
    id: number;
    categorie_nom?: string;
};

export function useCategoriesPreferences() {
    const queryClient = useQueryClient();

    // Récupérer toutes les catégories disponibles
    const categoriesQuery = useQuery({
        queryKey: ['categories'],
        queryFn: () => apiClient({ queryKey: ['categories'] }),
    });

    // Récupérer les catégories préférées de l'utilisateur
    const preferencesQuery = useQuery({
        queryKey: ['users/categories/followed'],
        queryFn: () => apiClient({ queryKey: ['users/categories/followed'] }),
    });

    // Mettre à jour les catégories préférées
    const updatePreferencesMutation = useMutation({
        mutationFn: (categoryIds: number[]) =>
            apiMutation('users/categories/followed/update/', {
                method: 'POST',
                body: JSON.stringify({ categories: categoryIds }),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users/categories/followed'] });
        },
    });

    const preferredCategoryIds = new Set(
        (preferencesQuery.data ?? []).map((pref: UserCategoryPreference) => pref.id)
    );

    return {
        categories: categoriesQuery.data ?? [],
        isLoadingCategories: categoriesQuery.isLoading,
        preferences: preferencesQuery.data ?? [],
        isLoadingPreferences: preferencesQuery.isLoading,
        preferredCategoryIds,
        updatePreferences: updatePreferencesMutation.mutate,
        isUpdating: updatePreferencesMutation.isPending,
        isCategoryPreferred: (categoryId: number) => preferredCategoryIds.has(categoryId),
    };
}