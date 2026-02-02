import BlogPage from "@/components/blog";
import BlogPostsPage from "@/components/blog/BlogPostAll";
import BlogHero from "@/components/hero/BlogHero";

export default function Articles() {
    return (
        <div className="h-full w-full ">
            <BlogHero/>
            <BlogPage />
            <BlogPostsPage />
        </div>
    );
}