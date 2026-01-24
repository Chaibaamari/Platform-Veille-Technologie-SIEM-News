// components/BlogPostsPage.tsx
import { apiClient } from '@/api/client';
import type { Article } from '@/types/blog';
// import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { getTagBg, getTagText } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/stores/hooks';

// interface ApiResponse {
//   data: Article[];
//   total: number;
//   currentPage: number;
//   totalPages: number;
//   limit: number;
// }

// const PAGE_SIZE = 6;

export default function BlogPostsPage() {
    // const {
    //     data,
    //     isLoading,
    //     isError,
    //     error,
    //     fetchNextPage,
    //     fetchPreviousPage,
    //     hasNextPage,
    //     hasPreviousPage,
    //     isFetchingNextPage,
    //     isFetchingPreviousPage,
    // } = useInfiniteQuery<ApiResponse>({
    //     queryKey: ['articles'],
    //     queryFn: ({ pageParam = 1 }) =>
    //         apiClient({
    //             queryKey: [`articles?page=${pageParam}&limit=${PAGE_SIZE}`],
    //             // queryKey: [`/articles?page=${pageParam}&limit=${PAGE_SIZE}`],
    //         }),
    //     initialPageParam: 1,
    //     getNextPageParam: (lastPage) =>
    //         lastPage.currentPage < lastPage.totalPages
    //             ? lastPage.currentPage + 1
    //             : undefined,
    //     getPreviousPageParam: (firstPage) =>
    //         firstPage.currentPage > 1 ? firstPage.currentPage - 1 : undefined,
    //     staleTime: 5000,
    // });
    const { data, isLoading, error , isError } = useQuery({
        queryKey: ["articles/"],
        queryFn: apiClient,
        staleTime: 5000
    });
    const { role } = useAppSelector((state) => state.auth);
    

    if (isLoading) return <div className="text-center py-20 text-white">Loading posts...</div>;
    if (isError) return <div className="text-center py-20 text-red-400">Error: {(error as Error)?.message}</div>;

    // const allArticles = data?.pages.flatMap((page) => page.data) ?? [];
    const allArticles = data?.articles
        ?.slice(10) || [];
    // const currentPage = data?.pagination.page ?? 1;
    // const totalPages = data?.pagination.total_pages ?? 1;

    //Helper to generate page numbers for display
    // const getPageNumbers = () => {
    //     const pages = [];
    //     if (totalPages <= 7) {
    //         for (let i = 1; i <= totalPages; i++) pages.push(i);
    //     } else {
    //         if (currentPage <= 4) {
    //             pages.push(1, 2, 3, 4, 5, '...', totalPages);
    //         } else if (currentPage >= totalPages - 3) {
    //             pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    //         } else {
    //             pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    //         }
    //     }
    //     return pages;
    // };

    
    return (
        <div className="w-[1280] px-8 flex flex-col justify-start items-center gap-7 bg-zinc-900">
            <div className="w-[1216] flex flex-col justify-start items-start gap-8">
                <h3 className="self-stretch text-white text-2xl font-semibold  leading-8">
                    All blog posts
                </h3>

                <div className="self-stretch flex flex-col justify-start items-start gap-12">
                    {allArticles.length === 0 ? (
                        <p className="text-neutral-300">No posts found.</p>
                    ) : (
                        <>
                            {Array.from({ length: Math.ceil(allArticles.length / 3) }).map((_, rowIndex) => {
                                const start = rowIndex * 3;
                                const rowArticles = allArticles.slice(start, start + 3);

                                return (
                                    <div
                                        key={rowIndex}
                                        className="self-stretch flex justify-center items-start gap-8"
                                    >
                                        {rowArticles.map((article: Article) => (
                                            <Link
                                                to={`/${role}/article/${article.id}`}
                                                key={article.id}
                                                className="flex-1 flex flex-col justify-start items-start gap-8"
                                            >
                                                <img
                                                    className="self-stretch h-60 relative object-cover"
                                                    src={article.thumbnail || 'https://placehold.co/384x240'}
                                                    alt={article.titre}
                                                />
                                                <div className="self-stretch flex flex-col justify-start items-start gap-6">
                                                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                                                        <div className="text-violet-700 text-sm font-semibold  leading-5">
                                                            {format(new Date(article.date_publication), 'EEEE, d MMM yyyy')}
                                                        </div>
                                                        <div className="self-stretch flex justify-start items-start gap-4">
                                                            <h2 className="flex-1 text-white text-2xl font-semibold  leading-8 line-clamp-1">
                                                                {article.titre}
                                                            </h2>
                                                            <img
                                                                src="/images/arrow-up-right.svg"
                                                                alt="arrow"
                                                                className="w-5 h-5 mt-1"
                                                            />
                                                        </div>
                                                        <div className="text-neutral-300 text-base font-normal  leading-6 line-clamp-2">
                                                            {article.description || article.summary}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap mt-auto  justify-start items-start gap-2">
                                                        {(article.categories || []).map((tag: string) => (
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
                                            </Link>
                                        ))}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="self-stretch h-16 pt-5 border-t border-gray-200/30 flex justify-between items-center">
                <button
                    // onClick={() => fetchPreviousPage()}
                    // disabled={!hasPreviousPage || isFetchingPreviousPage}
                    className="flex items-center gap-2 text-zinc-100 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                </button>

                {/* <div className="flex items-center gap-0.5">
                    {getPageNumbers().map((page, i) =>
                        page === '...' ? (
                            <div
                                key={`ellipsis-${i}`}
                                className="w-10 h-10 flex items-center justify-center text-zinc-100 text-sm"
                            >
                                ...
                            </div>
                        ) : (
                            <button
                                key={page}
                                onClick={() => {
                                    const targetPage = page as number;
                                    if (targetPage > currentPage) {
                                        // Jump forward – fetch until we reach it (simple way)
                                        for (let p = currentPage + 1; p <= targetPage; p++) {
                                            fetchNextPage();
                                        }
                                    } else if (targetPage < currentPage) {
                                        // Can't easily go back with infinite query unless refetching
                                        window.location.reload(); // or implement refetch with page param
                                    }
                                }}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${page === currentPage
                                        ? 'bg-purple-50 text-neutral-900'
                                        : 'text-zinc-100 hover:bg-white/10'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div> */}

                <button
                    // onClick={() => fetchNextPage()}
                    // disabled={!hasNextPage || isFetchingNextPage}
                    className="flex items-center gap-2 text-zinc-100 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    Next
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}