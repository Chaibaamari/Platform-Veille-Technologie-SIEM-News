import { ArrowRight } from "lucide-react";
import ButtonHero from "./button-hero";

// Resources Section (Ebooks & Whitepapers)
const ResourcesSection = () => {
    const resources = [
        {
            title: "Ebooks",
            description: "Explore our collection of ebooks covering a wide spectrum of future technology topics.",
            downloads: "10k+ Users",
            total: "Over 100 ebooks",
            format: "PDF",
            button: "Download Ebooks Now"
        },
        {
            title: "Whitepapers",
            description: "Dive into comprehensive reports and analyses with our collection of whitepapers.",
            downloads: "10k+ Users",
            total: "Over 50 whitepapers",
            format: "PDF",
            button: "Download Whitepapers Now"
        }
    ];

    return (
        <section className="bg-zinc-900">
            <div className="px-40 py-28 flex items-center justify-between border-b border-neutral-800">
                <div className="max-w-2xl">
                    <span className="px-2.5 py-1.5 bg-zinc-800 rounded text-white text-xl">Your Gateway to In-Depth Information</span>
                    <h2 className="mt-4 text-6xl font-medium text-white">Unlock Valuable Knowledge with FutureTech's Resources</h2>
                </div>
                <ButtonHero variant="outline">
                    View All Resources
                    <ArrowRight className="w-6 h-6 text-violet-500" />
                </ButtonHero>
            </div>

            {resources.map((resource, i) => (
                <div key={i} className={`px-40 py-20 flex gap-20 ${i === 1 ? 'border-t' : ''} border-neutral-800`}>
                    <div className="flex flex-col gap-14">
                        <div className="flex flex-col gap-12">
                            <div className="w-20 h-20 bg-violet-600 rounded-lg" />
                            <div className="w-129.75 flex flex-col gap-4">
                                <h3 className="text-4xl font-semibold text-white">{resource.title}</h3>
                                <p className="text-neutral-400 text-xl">{resource.description}</p>
                            </div>
                            <ButtonHero variant="outline">
                                {resource.button}
                                <ArrowRight className="w-6 h-6 text-violet-500" />
                            </ButtonHero>
                        </div>
                        <div className="p-7 bg-zinc-900 rounded-xl border border-neutral-800 flex items-center gap-12">
                            <div className="flex flex-col gap-1">
                                <div className="text-neutral-400 text-lg">Downloaded By</div>
                                <div className="text-white text-2xl font-semibold">{resource.downloads}</div>
                            </div>
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((n) => (
                                    <img key={n} className="w-12 h-12 rounded-full border-2 border-slate-950" src="https://placehold.co/50x50" alt="user" />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-end gap-7">
                        <div className="flex items-center gap-5">
                            <div className="w-60 text-2xl font-semibold text-white">Topics Coverage</div>
                            <div className="flex-1 text-neutral-400 text-lg">
                                {resource.title === "Ebooks"
                                    ? "Topics include AI in education (25%), renewable energy (20%), healthcare (15%), space exploration (25%), and biotechnology (15%)."
                                    : "Whitepapers cover quantum computing (20%), AI ethics (15%), space mining (20%), AI in healthcare (15%), renewable energy (30%)."
                                }
                            </div>
                        </div>
                        <img className="h-80 rounded-xl object-cover" src="https://placehold.co/917x332" alt="chart" />
                        <div className="flex gap-5">
                            <div className="p-7 bg-zinc-900 rounded-xl border border-neutral-800 flex flex-col gap-1">
                                <div className="text-neutral-400 text-lg">Total {resource.title}</div>
                                <div className="text-white text-xl font-semibold">{resource.total}</div>
                            </div>
                            <div className="flex-1 p-7 bg-zinc-900 rounded-xl border border-neutral-800 flex items-center gap-5">
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className="text-neutral-400 text-lg">Download Formats</div>
                                    <div className="text-white text-xl font-semibold">{resource.format} format</div>
                                </div>
                                <ButtonHero variant="outline">Preview</ButtonHero>
                            </div>
                        </div>
                        <div className="p-7 bg-zinc-900 rounded-xl border border-neutral-800">
                            <div className="text-neutral-400 text-lg">Average Author Expertise</div>
                            <div className="text-white text-xl font-medium">
                                {resource.title === "Ebooks" ? "15 years" : "20 years"} of experience
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
};
export default ResourcesSection;