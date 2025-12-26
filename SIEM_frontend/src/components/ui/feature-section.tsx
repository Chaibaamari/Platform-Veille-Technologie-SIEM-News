const FeatureSection = () => {
    const features = [
        {
            title: "Future Technology Blog",
            description: "Stay informed with our blog section dedicated to future technology.",
            stats: [
                { label: "Quantity", value: "Over 1,000 articles" },
                { label: "Variety", value: "AI, robotics, biotech..." },
                { label: "Frequency", value: "Fresh content daily" },
                { label: "Authoritative", value: "Written by experts" }
            ]
        },
        {
            title: "Research Insights Blogs",
            description: "Dive deep into future technology concepts with our research section.",
            stats: [
                { label: "Depth", value: "500+ research articles" },
                { label: "Graphics", value: "Visual aids & infographics" },
                { label: "Trends", value: "Emerging tech trends" },
                { label: "Contributors", value: "Tech researchers" }
            ]
        }
    ];

    return (
        <section className="bg-zinc-900">
            <div className="px-40 py-28">
                <div className="flex flex-col gap-4">
                    <span className="px-2.5 py-1.5 bg-zinc-800 rounded text-white text-xl">Unlock the Power of</span>
                    <h2 className="text-6xl font-medium text-white">FutureTech Features</h2>
                </div>

                {features.map((feature, i) => (
                    <div key={i} className={`flex gap-20 py-20 ${i === 1 ? 'border-t' : ''} border-neutral-800`}>
                        <div className="w-129.75 flex flex-col gap-12">
                            <div className="w-20 h-20 bg-violet-600 rounded-lg" /> {/* Icon placeholder */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-4xl font-semibold text-white">{feature.title}</h3>
                                <p className="text-neutral-400 text-lg">{feature.description}</p>
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-7">
                            {feature.stats.map((stat) => (
                                <div key={stat.label} className="p-10 bg-zinc-900 rounded-xl border border-neutral-800">
                                    <div className="text-2xl font-medium text-white">{stat.label}</div>
                                    <div className="text-neutral-400 text-lg">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
export default FeatureSection;