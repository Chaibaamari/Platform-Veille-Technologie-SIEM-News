import { ArrowRight } from "lucide-react";
import BlogCard from "./blog-cart";
import ButtonHero from "./button-hero";

// Blog Section
const BlogSection = () => {
    const blogs = [
        {
            author: { name: "John Techson", avatar: "https://placehold.co/80x80", category: "Quantum Computing" },
            date: "October 15, 2023",
            title: "The Quantum Leap in Computing",
            description: "Explore the revolution in quantum computing, its applications, and its potential impact on various industries.",
            views: "24.5k", comments: "50", likes: "20"
        },
        // Add more...
    ];

    return (
        <section className="bg-zinc-900">
            <div className="px-40 py-28 flex items-center justify-between border-b border-neutral-800">
                <div className="max-w-2xl">
                    <span className="px-2.5 py-1.5 bg-zinc-800 rounded text-white text-xl">A Knowledge Treasure Trove</span>
                    <h2 className="mt-4 text-6xl font-medium text-white">Explore FutureTech's In-Depth Blog Posts</h2>
                </div>
                <ButtonHero variant="outline">
                    View All Blogs
                    <ArrowRight className="w-6 h-6 text-violet-500" />
                </ButtonHero>
            </div>

            {/* Category Tabs */}
            <div className="px-40 py-12 border-b border-neutral-800 flex gap-5">
                {["All", "Quantum Computing", "AI Ethics", "Space Exploration", "Biotechnology", "Renewable Energy"].map((cat, i) => (
                    <button key={cat} className={`flex-1 px-6 py-7 rounded-lg border border-neutral-800 ${i === 0 ? 'bg-zinc-900 text-white' : 'text-neutral-400'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            <div className="px-40">
                {blogs.map((blog, i) => <BlogCard key={i} {...blog} />)}
            </div>
        </section>
    );
};
export default BlogSection;