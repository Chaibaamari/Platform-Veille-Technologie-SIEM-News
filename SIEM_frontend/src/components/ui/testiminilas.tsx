import { ArrowRight, Star, Quote } from "lucide-react";
import ButtonHero from "./button-hero";

// Testimonials Section
const Testimonials = () => {
    const testimonials = [
        { 
            name: "Marie Dubois", 
            location: "Paris, France",
            role: "Directrice Cybersécurité",
            company: "TechSecure",
            avatar: "https://i.pravatar.cc/120?img=5",
            text: "La veille SIESM nous permet de rester à la pointe des menaces et des solutions en cybersécurité. Les analyses sont approfondies et toujours pertinentes pour notre secteur.",
            rating: 5
        },
        { 
            name: "Thomas Laurent", 
            location: "Lyon, France",
            role: "Responsable Innovation",
            company: "InnovateTech",
            avatar: "https://i.pravatar.cc/120?img=12",
            text: "Grâce aux rapports SIESM, nous anticipons les tendances technologiques et adaptons notre stratégie en conséquence. Un outil indispensable pour notre transformation digitale.",
            rating: 5
        },
        { 
            name: "Sophie Martin", 
            location: "Toulouse, France",
            role: "DSI",
            company: "AeroSpace Solutions",
            avatar: "https://i.pravatar.cc/120?img=9",
            text: "Les synthèses sectorielles sont claires, précises et nous font gagner un temps précieux. La qualité de l'information et la réactivité sont exceptionnelles.",
            rating: 5
        },
        { 
            name: "Alexandre Petit", 
            location: "Marseille, France",
            role: "Consultant IA",
            company: "AI Consulting",
            avatar: "https://i.pravatar.cc/120?img=15",
            text: "Une source incontournable pour suivre l'évolution de l'IA et son impact sur l'industrie. Les articles sont techniques mais accessibles, parfait pour nos clients.",
            rating: 5
        },
        { 
            name: "Julie Moreau", 
            location: "Nantes, France",
            role: "Chef de Projet Digital",
            company: "Digital Transform",
            avatar: "https://i.pravatar.cc/120?img=20",
            text: "La plateforme SIESM est devenue notre référence quotidienne. Les notifications personnalisées nous alertent sur les sujets qui nous intéressent vraiment.",
            rating: 5
        },
        { 
            name: "Pierre Bernard", 
            location: "Bordeaux, France",
            role: "Analyste Sécurité",
            company: "SecureNet",
            avatar: "https://i.pravatar.cc/120?img=33",
            text: "Excellente curation de contenu et analyses pertinentes. C'est notre outil principal pour la veille stratégique et technologique dans le domaine de la sécurité.",
            rating: 5
        },
    ];

    return (
        <section className="bg-zinc-900">
            {/* Header */}
            <div className="px-4 md:px-20 lg:px-40 py-16 md:py-28 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 border-b border-neutral-800">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg">
                        <Quote className="w-5 h-5 text-violet-500" />
                        <span className="text-white text-lg font-medium">
                            Ce que disent nos utilisateurs
                        </span>
                    </div>
                    <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                        Des Témoignages Authentiques
                    </h2>
                    <p className="mt-4 text-neutral-400 text-lg">
                        Découvrez comment SIESM transforme la veille stratégique
                    </p>
                </div>
                <ButtonHero variant="outline">
                    Tous les Témoignages
                    <ArrowRight className="w-6 h-6 text-violet-500" />
                </ButtonHero>
            </div>

            {/* Testimonials Grid */}
            <div className="px-4 md:px-20 lg:px-40 py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div 
                            key={i} 
                            className="group relative flex flex-col gap-6 p-8 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-neutral-800 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Quote className="w-16 h-16 text-violet-500" />
                            </div>

                            {/* Rating Stars */}
                            <div className="flex gap-1">
                                {[...Array(t.rating)].map((_, index) => (
                                    <Star 
                                        key={index} 
                                        className="w-5 h-5 fill-violet-500 text-violet-500" 
                                    />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <div className="relative z-10">
                                <p className="text-neutral-300 text-base leading-relaxed">
                                    "{t.text}"
                                </p>
                            </div>

                            {/* Author Info */}
                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-neutral-800">
                                <img 
                                    className="w-14 h-14 rounded-full object-cover border-2 border-violet-500/30 group-hover:border-violet-500 transition-colors" 
                                    src={t.avatar} 
                                    alt={t.name} 
                                />
                                <div className="flex-1">
                                    <div className="text-white text-lg font-semibold">
                                        {t.name}
                                    </div>
                                    <div className="text-violet-400 text-sm font-medium">
                                        {t.role}
                                    </div>
                                    <div className="text-neutral-500 text-sm">
                                        {t.company} • {t.location}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Section */}
            <div className="px-4 md:px-20 lg:px-40 py-12 border-t border-neutral-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-8 bg-zinc-900 rounded-2xl border border-neutral-800">
                        <div className="text-5xl font-bold text-violet-500 mb-2">10k+</div>
                        <div className="text-neutral-400 text-lg">Utilisateurs actifs</div>
                    </div>
                    <div className="text-center p-8 bg-zinc-900 rounded-2xl border border-neutral-800">
                        <div className="text-5xl font-bold text-violet-500 mb-2">4.9/5</div>
                        <div className="text-neutral-400 text-lg">Note moyenne</div>
                    </div>
                    <div className="text-center p-8 bg-zinc-900 rounded-2xl border border-neutral-800">
                        <div className="text-5xl font-bold text-violet-500 mb-2">98%</div>
                        <div className="text-neutral-400 text-lg">Satisfaction client</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;