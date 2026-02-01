import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, apiMutation } from '@/api/client';

export type Category = {
    id: number;
    nom: string;
    description?: string;
};

export type UserCategoryPreference = {
    id: number;
    categorie: number;
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
        queryKey: ['user-categories-preferences'],
        queryFn: () => apiClient({ queryKey: ['user-categories-preferences'] }),
    });

    // Mettre à jour les catégories préférées
    const updatePreferencesMutation = useMutation({
        mutationFn: (categoryIds: number[]) =>
            apiMutation('user-categories-preferences/update/', {
                method: 'POST',
                body: JSON.stringify({ categories: categoryIds }),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-categories-preferences'] });
        },
    });

    const preferredCategoryIds = new Set(
        (preferencesQuery.data ?? []).map((pref: UserCategoryPreference) => pref.categorie)
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