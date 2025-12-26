import { ArrowRight } from "lucide-react";
import ButtonHero from "./button-hero";

// Testimonials Section
const Testimonials = () => {
    const testimonials = [
        { name: "Sarah Thompson", location: "San Francisco, USA", text: "The ebooks on AI in education have been a game-changer..." },
        // Add more...
    ];

    return (
        <section className="bg-zinc-900">
            <div className="px-40 py-28 flex items-center justify-between border-b border-neutral-800">
                <div>
                    <span className="px-2.5 py-1.5 bg-zinc-800 rounded text-white text-xl">What Our Readers Say</span>
                    <h2 className="mt-4 text-6xl font-medium text-white">Real Words from Real Readers</h2>
                </div>
                <ButtonHero variant="outline">
                    View All Testimonials
                    <ArrowRight className="w-6 h-6 text-violet-500" />
                </ButtonHero>
            </div>

            <div className="px-40 grid grid-cols-3 gap-12 py-20">
                {testimonials.map((t, i) => (
                    <div key={i} className="flex flex-col items-center gap-10">
                        <div className="flex items-center gap-3">
                            <img className="w-14 h-14 rounded-full" src="https://placehold.co/60x60" alt={t.name} />
                            <div>
                                <div className="text-white text-xl font-medium">{t.name}</div>
                                <div className="text-stone-500 text-lg">{t.location}</div>
                            </div>
                        </div>
                        <div className="text-center px-7 py-7 bg-zinc-900 rounded-xl border border-neutral-800">
                            <p className="text-white text-lg">{t.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
export default Testimonials;