import { ArrowRight } from "lucide-react";

// Community Section
const CommunitySection = () => {
    return (
        <section className="bg-zinc-900 px-40 py-28 border-t border-neutral-800">
            <div className="flex items-center gap-20">
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-12 h-12 bg-violet-600 rounded" />
                    ))}
                </div>
                <div className="flex-1 flex flex-col gap-7">
                    <div className="flex flex-col gap-4">
                        <span className="px-2.5 py-1.5 bg-zinc-800 rounded text-white text-xl">Learn, Connect, and Innovate</span>
                        <h2 className="text-6xl font-medium text-white">Be Part of the Future Tech Revolution</h2>
                    </div>
                    <p className="text-zinc-500 text-lg">
                        Immerse yourself in the world of future technology. Explore our comprehensive resources, connect with fellow tech enthusiasts, and drive innovation.
                    </p>
                </div>
            </div>

            <div className="mt-24 grid grid-cols-3 gap-5">
                {["Resource Access", "Community Forum", "Tech Events"].map((title) => (
                    <div key={title} className="p-10 bg-zinc-900 rounded-xl border border-neutral-800 flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white text-xl font-semibold">{title}</h3>
                            <div className="p-3.5 bg-violet-600 rounded-full">
                                <ArrowRight className="w-6 h-6 text-zinc-900" />
                            </div>
                        </div>
                        <p className="text-neutral-400 text-lg">
                            {title === "Resource Access" && "Visitors can access a wide range of resources..."}
                            {title === "Community Forum" && "Join our active community forum..."}
                            {title === "Tech Events" && "Stay updated on upcoming tech events..."}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CommunitySection;