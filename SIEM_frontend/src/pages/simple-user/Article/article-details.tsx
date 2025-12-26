/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import { apiClient } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { getTagBg, getTagText } from '@/lib/utils';

export default function ArticleDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // const { data: article, isLoading, error } = useQuery({
    //     queryKey: ['articles', id],
    //     // queryKey: [`article/${id}`],
    //     queryFn: () => apiClient({ queryKey: [`articles/${id}`] }),
    //     // queryFn: () => apiClient,
    //     enabled: !!id,
    // });

    const { data: articles ,isLoading, error } = useQuery({
        queryKey: ['articles'],
        queryFn: () => apiClient({ queryKey: ['/articles'] }),
    });

    const article = articles?.find((a: any) => a.id_article === Number(id));

    const recommendedArticles = articles
    .filter((a: any) => a.id_article !== Number(id))
    .slice(0, 6);

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
                        </div>

                        <img
                            className="self-stretch h-96 object-cover rounded-lg"
                            src={article.thumbnail || 'https://placehold.co/778x426'}
                            alt={article.titre_article}
                        />

                        <div className="self-stretch flex flex-col gap-6 text-neutral-300 text-xl font-normal space-y-5 leading-6">
                            {/* Render content – assuming contenu_article is the full text */}
                            <p>{article.contenu_article}</p>
                            <p>{article.description_article}</p>
                            <p className='leading-8'>{article.summary_article}</p>

                            {/* If your content has multiple paragraphs, you could split by \n\n */}
                            {/* {article.contenu_article?.split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                         ))} */}

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