// src/components/BlogHero.tsx

type BlogHeroProps = {
    title : string;
};

export default function BlogHero({title}: BlogHeroProps) {
    return (
        <section className="py-8 md:py-8 lg:py-8 w-[1440] flex flex-col justify-center items-center gap-12 bg-linear-to-b from-slate-950 to-zinc-900 ">
            <div className="mx-auto px-6">
                {/* Bordered container with huge title */}
                <div className="border-y border-white py-12 md:py-20 lg:py-20">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl xl:text-[220px] leading-none font-bold text-white tracking-tight">
                        {title}
                    </h1>
                </div>
            </div>
        </section>
    );
}