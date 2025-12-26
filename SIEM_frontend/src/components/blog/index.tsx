// src/pages/blog/index.tsx
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import BlogGrid from './BlogGrid';

export default function BlogPage() {
    // const [page, setPage] = useState(1);

    const { data, isLoading, error } = useQuery({
        queryKey: ["posts"],
        queryFn: apiClient,
        staleTime: 5000
    });

    if (isLoading) return <div className="text-center py-20 text-white">Loading posts...</div>;
    if (error) return <div className="text-center py-20 text-red-400">Error loading posts</div>;

    const posts = data || [];

    return (
        <div className="w-full bg-zinc-900 ">
            <section className="py-16 w-full self-stretch">
                <div className="mx-auto px-34">
                    <h3 className=" self-stretch text-white text-2xl font-semibold  leading-8">Recent blog posts</h3>
                    <BlogGrid posts={posts} />
                </div>
            </section>
        </div>
    );
}
