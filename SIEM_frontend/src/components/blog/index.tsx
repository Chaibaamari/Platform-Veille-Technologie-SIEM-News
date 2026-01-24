// src/pages/blog/index.tsx
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import BlogGrid from './BlogGrid';
import BlogGridSkeleton from '../ui/SkeletonCard';

export default function BlogPage() {

    const { data, isLoading, error } = useQuery({
        queryKey: ["articles/"],
        queryFn: apiClient,
        staleTime: 5000
    });

    if (isLoading) return <div className="text-center py-20 text-white">Loading posts...</div>;
    if (error) return <div className="text-center py-20 text-red-400">Error loading posts</div>;

    const posts = data.articles || [];
    return (
        <div className="w-full bg-zinc-900">
            <section className="py-16 w-full self-stretch">
                <div className="mx-auto px-34">
                    <h3 className="self-stretch text-white text-2xl font-semibold leading-8">
                        Recent blog posts
                    </h3>
                    
                    {/* Afficher le loader pendant le chargement */}
                    {isLoading && <BlogGridSkeleton />}
                    
                    {/* Afficher l'erreur */}
                    {error && (
                        <div className="text-center py-20">
                            <div className="text-red-400 text-lg font-semibold">
                                Error loading posts
                            </div>
                            <p className="text-neutral-400 mt-2">
                                Please try again later
                            </p>
                        </div>
                    )}
                    
                    {/* Afficher le contenu */}
                    {!isLoading && !error && (
                        <BlogGrid posts={posts} />
                    )}
                </div>
            </section>
        </div>
    );
}
