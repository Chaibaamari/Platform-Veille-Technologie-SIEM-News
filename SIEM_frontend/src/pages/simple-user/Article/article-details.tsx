/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Check, ChevronDown, ChevronLeft, Heart, Tag } from 'lucide-react';
import { apiClient, apiMutation } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { getTagBg, getTagText } from '@/lib/utils';
import { useState } from 'react';
import { queryClient } from '@/main';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAppSelector } from '@/stores/hooks';
import BlogHero from '@/components/hero/BlogHero';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { useFavorites } from '@/hook/useFavorites';

export default function ArticleDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { role } = useAppSelector((state) => state.auth);
    const { toggleFavorite, isFavorite } = useFavorites();

    

    const { data: article, isLoading, error , isError } = useQuery({
        queryKey: ['articles', id],
        queryFn: () => apiClient({ queryKey: [`articles/${id}`] }),
        enabled: !!id,
    });

    const { data: articles } = useQuery({
        queryKey: ['articles'],
        queryFn: () => apiClient({ queryKey: ['articles'] })
    });

    const { data: fetched_categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => apiClient({ queryKey: ['categories'] })
    });

    const categories = fetched_categories?.['categories']

    const [openPopover, setOpenPopover] = useState(false);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    

    const recommendedArticles = articles?.articles
        ?.filter((a: any) => a.id !== Number(id))
        .slice(0, 9) || [];
    
    const updateCategoriesMutation = useMutation({
        mutationFn: (selectedIds: number[]) => {
            const payload = {
                id: Number(id),
                category_ids: selectedIds,
            };
            return apiMutation(`articles/${id}/categories`, {
                method: 'POST',
                body: JSON.stringify(payload),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['article-categories', id] });
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            setOpenPopover(false);
        },
        onError: (err) => {
            console.error('Erreur lors de la sauvegarde des catégories:', err);
        },
    });

    const toggleCategory = (catId: number) => {
        setSelectedCategoryIds((prev) =>
            prev.includes(catId)
                ? prev.filter((id) => id !== catId)
                : [...prev, catId]
        );
    };

    const handleSave = () => {
        console.log('Saving categories:', selectedCategoryIds);
        // updateCategoriesMutation.mutate(selectedCategoryIds);
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-zinc-900">
                <BlogHero />
                <LoadingState title="Chargement des articles" />;
            </div>
        );
            }
        
            if (isError) {
                return (
                    <div className="w-full min-h-screen bg-zinc-900">
                        <BlogHero />
                        <ErrorState
                            title="Erreur lors du chargement des articles"
                            error={error}
                        />
                    </div>
                );
    }

    return (
        <div className="w-full max-w-[1216] mx-auto px-8 py-12 flex flex-col gap-8 bg-linear-to-b from-slate-950 to-zinc-900">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className='lg:col-span-2 flex flex-col gap-8'>
                    {/* Back button */}
                
                    <button
                        onClick={() => navigate(`/${role}/article`)}
                        className="flex items-center gap-2 text-violet-400 hover:text-violet-300"
                    >
                        <ChevronLeft size={20} /> Back to all posts
                    </button>

                    <div className="self-stretch flex flex-col justify-start items-start gap-8">
                        <div className="text-violet-700 text-sm font-semibold leading-5">
                            {format(new Date(article.date_publication), 'EEEE, d MMM yyyy')}
                        </div>

                        <div className="self-stretch flex justify-start items-start gap-4">
                            <h1 className="flex-1 text-white text-4xl font-bold leading-10">
                                {article.titre}
                            </h1>
                            <button
                                onClick={() => toggleFavorite(article)}
                                className={`px-4 py-3 rounded-xl flex items-center gap-2 transition border ${isFavorite(article.id)
                                        ? 'bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500/20'
                                        : 'bg-transparent border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:border-violet-500 hover:text-white'
                                    }`}
                            >
                                <Heart
                                    className={`w-5 h-5 transition ${isFavorite(article.id) ? 'fill-red-500' : ''
                                        }`}
                                />
                                <span>{isFavorite(article.id) ? 'Enregistré' : 'Enregistrer'}</span>
                            </button>

                            {/* Category Button with Popover */}
                            <Popover open={openPopover} onOpenChange={setOpenPopover}>
                                <PopoverTrigger asChild>
                                    <button className="px-6 py-3 rounded-xl flex items-center gap-2 transition bg-transparent border border-neutral-800 hover:bg-neutral-800 hover:border-violet-500 text-neutral-400 hover:text-white">
                                        <Tag className="w-5 h-5 text-violet-500" />
                                        <span>Categories</span>
                                        <ChevronDown className={`w-4 h-4 text-violet-500 transition-transform ${openPopover ? 'rotate-180' : ''}`} />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-80 p-4 bg-slate-900 border border-slate-700 shadow-xl"
                                    align="end"
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                                            <h3 className="text-white font-semibold">Manage Categories</h3>
                                            <span className="text-xs text-neutral-400">
                                                {selectedCategoryIds.length} selected
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                                            {categories && categories.map((category: any) => {
                                                const isSelected = selectedCategoryIds.includes(category.id);
                                                
                                                return (
                                                    <button
                                                        key={category.id}
                                                        onClick={() => toggleCategory(category.id)}
                                                        className={`
                                                            flex items-center justify-between px-3 py-2.5 rounded-lg 
                                                            transition-all duration-200
                                                            ${isSelected
                                                                ? 'bg-violet-500/20 border border-violet-500/50'
                                                                : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800'
                                                            }
                                                        `}
                                                    >
                                                        <span className={`font-medium ${isSelected ? 'text-violet-300' : 'text-neutral-300'}`}>
                                                            {category.nom}
                                                        </span>
                                                        {isSelected && (
                                                            <Check size={18} className="text-violet-400" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        
                                        <div className="flex gap-2 border-t border-slate-700 pt-3">
                                            <button
                                                onClick={() => setOpenPopover(false)}
                                                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-neutral-300 font-medium transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                disabled={updateCategoriesMutation.isPending}
                                                className="flex-1 px-4 py-2 bg-violet-500 hover:bg-violet-600 disabled:bg-violet-500/50 rounded-lg text-white font-medium transition-colors"
                                            >
                                                {updateCategoriesMutation.isPending ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <img
                            className="self-stretch h-96 object-cover rounded-lg"
                            src={article.thumbnail || 'https://placehold.co/778x426'}
                            alt={article.titre}
                        />

                        <div className="self-stretch flex flex-col gap-6 text-neutral-300 text-xl font-normal space-y-5 leading-6">
                            {/* Render content */}
                            {article.contenu && (
                                <div
                                    className="prose prose-invert prose-lg max-w-none
                                            [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mb-4 [&>h3]:mt-8
                                            [&>h3]:pb-3 [&>h3]:border-b [&>h3]:border-violet-500/30
                                            [&>h3]:bg-linear-to-r [&>h3]:from-violet-500/10 [&>h3]:to-transparent
                                            [&>h3]:px-4 [&>h3]:py-3 [&>h3]:rounded-lg [&>h3]:-ml-4
                                            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mt-4 [&>ul>li]:text-neutral-300 [&>ul>li]:leading-relaxed [&>ul>li]:mb-2
                                            [&>p]:text-neutral-300 [&>p]:leading-relaxed [&>p]:mb-4"
                                    dangerouslySetInnerHTML={{ __html: article.contenu }}
                                />
                            )}

                            
                            {article.summary && (
                                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                    <h4 className="text-violet-400 font-semibold text-lg mb-3">Résumé</h4>
                                    <div
                                        className="text-neutral-300 leading-8"
                                        dangerouslySetInnerHTML={{ __html: article.summary }}
                                    />
                                </div>
                            )}


                            {/* Add your tags */}
                            <div className="flex flex-wrap mt-auto  justify-start items-start gap-2">
                                {(article.categoroes || []).map((tag: string) => (
                                    <Badge
                                        key={tag}
                                        className="px-2.5 py-0.5 rounded-2xl text-sm font-medium"
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
                    </div>

                </div>
                <section className="hidden lg:block lg:col-span-1">
                    <div>
                        {/* <div className="sticky top-24"> */}
                        <h3 className="text-white text-2xl font-semibold mb-8">Recommended for you</h3>

                        <div className="flex flex-col gap-8">
                            {recommendedArticles.map((rec: any) => (
                                <Link
                                    key={rec.id}
                                    to={`/${role}/article/${rec.id}`}
                                    className="group flex gap-4 hover:opacity-90 transition-opacity"
                                >
                                    <img
                                        className="w-32 h-24 object-cover rounded-lg shrink-0"
                                        src={rec.thumbnail || 'https://placehold.co/128x96'}
                                        alt={rec.titre}
                                    />
                                    <div className="flex flex-col justify-between">
                                        <h4 className="text-white text-lg font-medium line-clamp-2 group-hover:text-violet-300 transition-colors">
                                            {rec.titre}
                                        </h4>
                                        <p className="text-neutral-400 text-sm mt-2">
                                            {format(new Date(rec.date_publication), 'd MMM yyyy')}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {recommendedArticles.length === 0 && (
                            <p className="text-neutral-500">No recommendations yet.</p>
                        )}
                    </div>
                </section>
            </div>
            
        </div>
    );
}