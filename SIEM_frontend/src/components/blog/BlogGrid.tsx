import BlogCard from "./BlogCard"
import { type BlogPost } from "@/types/blog"

interface BlogGridProps {
    posts: BlogPost[];
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
                <BlogCard post={featured} large />

                <div className="grid grid-cols-2 gap-8 ">
                    {rightPosts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            </div>

            {/* Rest posts – full-width rows */}
            <div className="grid grid-cols-2 gap-8">
                {restPosts.map((post) => (
                    <BlogCard
                        key={post.id}
                        post={post}
                        variant="row"
                    />
                ))}
            </div>
        </div>
    );
}
