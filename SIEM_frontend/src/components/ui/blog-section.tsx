import { ArrowRight } from "lucide-react";
import BlogCard from "./blog-cart";
import ButtonHero from "./button-hero";

// Blog Section
const BlogSection = () => {
    const blogs = [
        {
            author: { 
                name: "Marc Dubois", 
                avatar: "https://i.pravatar.cc/80?img=12", 
                category: "Intelligence Artificielle" 
            },
            date: "12 Janvier 2025",
            title: "IA et automatisation : l'avenir du secteur industriel",
            description: "Comment l'intelligence artificielle transforme les processus industriels et optimise la production.",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
            views: "18.7k", 
            comments: "67", 
            likes: "340"
        },
        {
            author: { 
                name: "Alexandre Roux", 
                avatar: "https://i.pravatar.cc/80?img=33", 
                category: "Blockchain" 
            },
            date: "3 Janvier 2025",
            title: "Blockchain et traçabilité : applications industrielles",
            description: "Comment la blockchain améliore la transparence et la traçabilité dans les chaînes d'approvisionnement industrielles.",
            image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=500&fit=crop",
            views: "8.9k", 
            comments: "41", 
            likes: "195"
        },
    ];

    return (
        <section className="bg-zinc-900">
            <div className="px-40 py-28 flex items-center justify-between border-b border-neutral-800">
                <div className="max-w-2xl">
                    <span className="px-2.5 py-1.5 bg-zinc-800 rounded text-white text-xl">
                        Centre de Ressources et d'Expertise
                    </span>
                    <h2 className="mt-4 text-6xl font-medium text-white">
                        Explorez les Analyses Approfondies SIESM
                    </h2>
                </div>
                <ButtonHero variant="outline">
                    Tous les Articles
                    <ArrowRight className="w-6 h-6 text-violet-500" />
                </ButtonHero>
            </div>

            {/* Category Tabs */}
            <div className="px-40 py-12 border-b border-neutral-800 flex gap-5">
                {["Tous", "Cybersécurité", "Intelligence Artificielle", "Transformation Digitale", "Réglementation", "Innovation Tech", "Blockchain"].map((cat, i) => (
                    <button 
                        key={cat} 
                        className={`flex-1 px-6 py-7 rounded-lg border border-neutral-800 transition-colors ${i === 0 ? 'bg-violet-600 text-white' : 'text-neutral-400 hover:bg-zinc-800'}`}
                    >
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