/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Check, ChevronLeft, Tag } from 'lucide-react';
import { apiClient, apiMutation } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { getTagBg, getTagText } from '@/lib/utils';
import { useState } from 'react';
import { queryClient } from '@/main';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


const FAKE_CATEGORIES = [
  { id_category: 1, nom_category: "Technologie" },
  { id_category: 2, nom_category: "Développement" },
  { id_category: 3, nom_category: "Design" },
  { id_category: 4, nom_category: "Productivité" },
  { id_category: 5, nom_category: "Inspiration" },
  { id_category: 6, nom_category: "Tutoriels" },
]; 

export default function ArticleDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: articles, isLoading, error } = useQuery({
        queryKey: ['articles', id],
        // queryKey: [`article/${id}`],
        queryFn: () => apiClient({ queryKey: [`articles/${id}`] }),
        // queryFn: () => apiClient,
        enabled: !!id,
    });

    // const { data: articles ,isLoading, error } = useQuery({
    //     queryKey: ['/articles/'],
    //     queryFn: () => apiClient({ queryKey: ['/articles'] }),
    // });

    const [openPopover, setOpenPopover] = useState(false);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

    const article = articles?.find((a: any) => a.id_article === Number(id));

        // Initialize selected categories when article loads
    // useEffect(() => {
    //     if (article?.categories) {
    //         const categoryIds = article.categories.map((cat: any) => cat.id_category);
    //         setSelectedCategoryIds(categoryIds);
    //     }
    // }, [article]);

    const recommendedArticles = articles
        ?.filter((a: any) => a.id_article !== Number(id))
        .slice(0, 6) || [];
    
    const updateCategoriesMutation = useMutation({
        mutationFn: (selectedIds: number[]) => {
            const payload = {
                id_article: Number(id),
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

    if (isLoading) return <div className="text-white text-center py-20">Loading...</div>;
    if (error || !article)
    return <div className="text-red-400 text-center py-20">Article not found</div>;

    return (
        <div className="w-full max-w-[1216] mx-auto px-8 py-12 flex flex-col gap-8 bg-linear-to-b from-slate-950 to-zinc-900">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className='lg:col-span-2 flex flex-col gap-8'>
                    {/* Back button */}
                
                    <button
                        onClick={() => navigate("/simple_user/article")}
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
                                {article.titre_article}
                            </h1>

                            {/* Category Button with Popover */}
                            <Popover open={openPopover} onOpenChange={setOpenPopover}>
                                <PopoverTrigger asChild>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 rounded-lg text-violet-400 hover:text-violet-300 transition-colors">
                                        <Tag size={18} />
                                        <span className="font-medium">Categories</span>
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
                                            {FAKE_CATEGORIES.map((category) => {
                                                const isSelected = selectedCategoryIds.includes(category.id_category);
                                                
                                                return (
                                                    <button
                                                        key={category.id_category}
                                                        onClick={() => toggleCategory(category.id_category)}
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
                                                            {category.nom_category}
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
                            alt={article.titre_article}
                        />

                        <div className="self-stretch flex flex-col gap-6 text-neutral-300 text-xl font-normal space-y-5 leading-6">
                            {/* Render content */}
                            {article.contenu_article && (
                                <p className="text-neutral-300 text-lg leading-relaxed">
                                    {article.contenu_article}
                                </p>
                            )}
                            
                            {/* Render HTML description with enhanced structure */}
                            {/* {article.description_article && (
                                <div className="flex flex-col gap-8">
                                    <div
                                        className="prose prose-invert prose-lg max-w-none
                                                [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mb-4 [&>h3]:mt-8 [&>h3]:first:mt-0
                                                [&>h3]:pb-3 [&>h3]:border-b [&>h3]:border-violet-500/30
                                                [&>h3]:bg-gradient-to-r [&>h3]:from-violet-500/10 [&>h3]:to-transparent
                                                [&>h3]:px-4 [&>h3]:py-3 [&>h3]:rounded-lg [&>h3]:-ml-4
                                                [&>ul]:list-none [&>ul]:pl-0 [&>ul]:space-y-3 [&>ul]:mt-4
                                                [&>ul>li]:text-neutral-300 [&>ul>li]:leading-relaxed [&>ul>li]:text-base
                                                [&>ul>li]:pl-6 [&>ul>li]:relative [&>ul>li]:py-2
                                                [&>ul>li]:before:content-['▪'] [&>ul>li]:before:absolute [&>ul>li]:before:left-0
                                                [&>ul>li]:before:text-violet-400 [&>ul>li]:before:font-bold [&>ul>li]:before:text-xl
                                                [&>p]:text-neutral-300 [&>p]:leading-relaxed [&>p]:mb-4"
                                        dangerouslySetInnerHTML={{ __html: article.description_article }}
                                    />
                                </div>
                            )} */}
                            {article.summary_article && (
                                <div className="flex flex-col gap-8">
                                    <div
                                        className="prose prose-invert prose-lg max-w-none
                                                [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mb-4 [&>h3]:mt-8 [&>h3]:first:mt-0
                                                [&>h3]:pb-3 [&>h3]:border-b [&>h3]:border-violet-500/30
                                                [&>h3]:bg-linear-to-r [&>h3]:from-violet-500/10 [&>h3]:to-transparent
                                                [&>h3]:px-4 [&>h3]:py-3 [&>h3]:rounded-lg [&>h3]:-ml-4
                                                [&>ul]:list-none [&>ul]:pl-0 [&>ul]:space-y-3 [&>ul]:mt-4
                                                [&>ul>li]:text-neutral-300 [&>ul>li]:leading-relaxed [&>ul>li]:text-base
                                                [&>ul>li]:pl-6 [&>ul>li]:relative [&>ul>li]:py-2
                                                [&>ul>li]:before:content-['▪'] [&>ul>li]:before:absolute [&>ul>li]:before:left-0
                                                [&>ul>li]:before:text-violet-400 [&>ul>li]:before:font-bold [&>ul>li]:before:text-xl
                                                [&>p]:text-neutral-300 [&>p]:leading-relaxed [&>p]:mb-4"
                                        dangerouslySetInnerHTML={{ __html: article.summary_article }}
                                    />
                                </div>
                            )}
                            
                            {article.description_article && (
                                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                    <h4 className="text-violet-400 font-semibold text-lg mb-3">Description</h4>
                                    <p className="text-neutral-300 leading-8">{article.description_article}</p>
                                </div>
                            )}

                            {/* Add your tags */}
                            <div className="flex flex-wrap mt-auto  justify-start items-start gap-2">
                                {(article.tags || []).map((tag: string) => (
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

                        {/* Newsletter section */}
                        <div className="flex flex-col items-center gap-10 w-full">
                            <div className="flex flex-col items-center gap-6">
                                <div className="text-violet-500 text-base font-semibold">Newsletters</div>
                                <h2 className="text-white text-5xl font-semibold leading-15 text-center">
                                    Stories and interviews
                                </h2>
                                <p className="w-full max-w-[768] text-neutral-300 text-xl text-center">
                                    Subscribe to learn about new product features, the latest in technology, solutions, and updates.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-96 px-4 py-3 bg-white rounded-lg border border-gray-300 text-gray-500"
                                />
                                <button className="px-5 py-3 bg-violet-500 rounded-lg text-white font-medium">
                                    Subscribe
                                </button>
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
                                    key={rec.id_article}
                                    to={`/simple_user/article/${rec.id_article}`}
                                    className="group flex gap-4 hover:opacity-90 transition-opacity"
                                >
                                    <img
                                        className="w-32 h-24 object-cover rounded-lg shrink-0"
                                        src={rec.thumbnail || 'https://placehold.co/128x96'}
                                        alt={rec.titre_article}
                                    />
                                    <div className="flex flex-col justify-between">
                                        <h4 className="text-white text-lg font-medium line-clamp-2 group-hover:text-violet-300 transition-colors">
                                            {rec.titre_article}
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
