import BlogPage from "@/components/blog";
import BlogPostsPage from "@/components/blog/BlogPostAll";
import BlogHero from "@/components/hero/BlogHero";

export default function Articls() {
    return (
        <div className="h-full w-full">
            <BlogHero title="SIEM NEWS"/>
            <BlogPage />
            <BlogPostsPage />
        </div>
    );
}