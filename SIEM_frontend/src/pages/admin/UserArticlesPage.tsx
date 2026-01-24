/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, apiMutation } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Settings } from 'lucide-react';
import BlogHero from '@/components/hero/BlogHero';
import { Badge } from '@/components/ui/badge';
import { getTagBg, getTagText } from '@/lib/utils';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/stores/hooks';

interface Article {
  id_article: number;
  titre_article: string;
  description_article: string;
  tags: string[];
  date_publication: string;
  thumbnail: string;
}

export default function UserArticlesPage() {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Fetch current user
  const { data: currentUser } = useQuery({
    queryKey: ['users', user?.id],
    queryFn: () => apiClient({ queryKey: [`users/${user?.id}`] }),
    enabled: !!user?.id
  });

  // Fetch articles
  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => apiClient({ queryKey: ['articles'] })
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient({ queryKey: ['categories'] })
  });

  // Update favorite categories mutation
  const updateFavoritesMutation = useMutation({
    mutationFn: async (favoriteCategories: string[]) => {
      return apiMutation(`users/${user?.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ favorite_categories: favoriteCategories })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', user?.id] });
      setIsSettingsOpen(false);
    }
  });

  // Initialize selected categories from user data
  useState(() => {
    if (currentUser?.favorite_categories) {
      setSelectedCategories(currentUser.favorite_categories);
    }
  });

  const handleToggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleSaveFavorites = () => {
    updateFavoritesMutation.mutate(selectedCategories);
  };

  const openSettings = () => {
    setSelectedCategories(currentUser?.favorite_categories || []);
    setIsSettingsOpen(true);
  };

  // Filter articles
  const filteredArticles = articles?.filter((article: Article) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'favorites') {
      return article.tags?.some(tag => currentUser?.favorite_categories?.includes(tag));
    }
    return article.tags?.includes(filterCategory);
  });

  if (articlesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  const favoriteArticles = articles?.filter((a: Article) => 
    a.tags?.some(tag => currentUser?.favorite_categories?.includes(tag))
  ).length || 0;

    return (
        <div className="min-h-screen bg-slate-950">
            <BlogHero title="MES ARTICLES" />
      
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Consulter les Articles</h2>
                        <p className="text-slate-400 mt-1">
                            Parcourez les articles et gérez vos catégories favorites
                        </p>
                    </div>
          
                    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openSettings} className="bg-indigo-600 hover:bg-indigo-700">
                                <Settings className="w-4 h-4 mr-2" />
                                Catégories Favorites
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 text-white border-slate-700">
                            <DialogHeader>
                                <DialogTitle>Gérer mes catégories favorites</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    Sélectionnez vos catégories préférées pour un accès rapide
                                </DialogDescription>
                            </DialogHeader>
              
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {categories?.map((cat: any) => {
                                        const isSelected = selectedCategories.includes(cat.name);
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleToggleCategory(cat.name)}
                                                className={`p-3 rounded-lg border-2 transition-all ${isSelected
                                                        ? 'border-indigo-500 bg-indigo-500/20'
                                                        : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <Badge
                                                        className="px-2 py-1 text-xs font-medium"
                                                        style={{
                                                            backgroundColor: getTagBg(cat.name),
                                                            color: getTagText(cat.name),
                                                        }}
                                                    >
                                                        {cat.name}
                                                    </Badge>
                                                    {isSelected && (
                                                        <Heart className="w-4 h-4 text-red-400 fill-current" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                                    <div className="text-xs text-slate-400 mb-2">
                                        {selectedCategories.length} catégorie(s) sélectionnée(s)
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCategories.map(cat => (
                                            <Badge
                                                key={cat}
                                                className="px-2 py-1 text-xs font-medium"
                                                style={{
                                                    backgroundColor: getTagBg(cat),
                                                    color: getTagText(cat),
                                                }}
                                            >
                                                {cat}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
              
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleSaveFavorites}
                                    disabled={updateFavoritesMutation.isPending}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {updateFavoritesMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters */}
                <div className="bg-slate-900 rounded-xl border border-slate-700 p-4 mb-6">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-slate-400 text-sm font-medium">Filtrer par :</span>
                        <button
                            onClick={() => setFilterCategory('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterCategory === 'all'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            Tous les articles
                        </button>
                        <button
                            onClick={() => setFilterCategory('favorites')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${filterCategory === 'favorites'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            <Heart className="w-4 h-4" />
                            Mes favoris
                        </button>
                        <div className="h-6 w-px bg-slate-700"></div>
                        {categories?.map((cat: any) => (
                            <button
                                key={cat.id}
                                onClick={() => setFilterCategory(cat.name)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterCategory === cat.name
                                        ? 'ring-2 ring-offset-2 ring-offset-slate-900'
                                        : 'hover:opacity-80'
                                    }`}
                                style={{
                                    backgroundColor: filterCategory === cat.name ? getTagBg(cat.name) : getTagBg(cat.name) + '40',
                                    color: getTagText(cat.name),
                                    ...(filterCategory === cat.name && { ringColor: getTagText(cat.name) })
                                }}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles?.map((article: Article) => (
                        <Link
                            key={article.id_article}
                            to={`/user/article/${article.id_article}`}
                            className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden hover:border-indigo-500 transition group"
                        >
                            <img
                                src={article.thumbnail || 'https://placehold.co/400x200'}
                                alt={article.titre_article}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-xs">
                                        {format(new Date(article.date_publication), 'dd MMM yyyy')}
                                    </span>
                                    {article.tags?.some(tag => currentUser?.favorite_categories?.includes(tag)) && (
                                        <Heart className="w-4 h-4 text-red-400 fill-current" />
                                    )}
                                </div>
                
                                <h3 className="text-white font-semibold text-lg line-clamp-2 group-hover:text-indigo-400 transition">
                                    {article.titre_article}
                                </h3>
                
                                <p className="text-slate-400 text-sm line-clamp-2">
                                    {article.description_article}
                                </p>
                
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                    {article.tags?.map((tag: string) => (
                                        <Badge
                                            key={tag}
                                            className="px-2 py-0.5 text-xs font-medium"
                                            style={{
                                                backgroundColor: getTagBg(tag),
                                                color: getTagText(tag),
                                            }}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredArticles?.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-slate-500 text-lg">Aucun article trouvé</div>
                        <p className="text-slate-600 text-sm mt-2">
                            Essayez de changer les filtres ou ajoutez des catégories favorites
                        </p>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mt-12">
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                        <div className="text-slate-400 text-sm">Total Articles</div>
                        <div className="text-white text-3xl font-bold mt-2">{articles?.length || 0}</div>
                    </div>
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                        <div className="text-slate-400 text-sm">Articles Favoris</div>
                        <div className="text-red-400 text-3xl font-bold mt-2">{favoriteArticles}</div>
                    </div>
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                        <div className="text-slate-400 text-sm">Catégories Favorites</div>
                        <div className="text-indigo-400 text-3xl font-bold mt-2">
                            {currentUser?.favorite_categories?.length || 0}
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                        <div className="text-slate-400 text-sm">Articles Affichés</div>
                        <div className="text-green-400 text-3xl font-bold mt-2">{filteredArticles?.length || 0}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
