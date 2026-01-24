import BlogCard from "./BlogCard"
import { type Article } from "@/types/blog"

interface BlogGridProps {
    posts: Article[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
    if (!posts.length) return null;

    const featured = posts[0];
    const rightPosts = posts.slice(1, 3);
    const restPosts = posts.slice(3);

    return (
        <div className="flex flex-col gap-5 w-full">

            {/* Top section */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <BlogCard article={featured} large />

                <div className="grid grid-cols-2 gap-8 ">
                    {rightPosts.map((post) => (
                        <BlogCard key={post.id} article={post} />
                    ))}
                </div>
            </div>

            {/* Rest posts – full-width rows */}
            <div className="grid grid-cols-2 gap-8">
                {restPosts.map((post) => (
                    <BlogCard
                        key={post.id}
                        article={post}
                        variant="row"
                    />
                ))}
            </div>
        </div>
    );
}
