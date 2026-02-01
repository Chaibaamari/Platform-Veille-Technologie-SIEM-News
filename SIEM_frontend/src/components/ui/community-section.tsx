import { ArrowRight, BookOpen, Users, Calendar, FileText, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Community Section
type ColorKey = 'violet' | 'blue' | 'emerald';

const CommunitySection = () => {
    const navigate = useNavigate();
    const features: Array<{ title: string; icon: typeof BookOpen; description: string; color: ColorKey }> = [
        {
            title: "Accès aux Ressources",
            icon: BookOpen,
            description: "Accédez à une vaste bibliothèque de rapports, synthèses et analyses sectorielles SIESM. Restez informé des dernières tendances et innovations.",
            color: "violet"
        },
        {
            title: "Forum Communautaire",
            icon: Users,
            description: "Rejoignez notre communauté d'experts SIESM. Échangez, partagez vos insights et collaborez avec des professionnels du secteur.",
            color: "blue"
        },
        {
            title: "Événements Tech",
            icon: Calendar,
            description: "Participez à nos webinaires, conférences et workshops exclusifs. Networking et formation continue garantis.",
            color: "emerald"
        }
    ];

    // Images réelles pour la grille (tech, data, innovation)
    const communityImages = [
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop", // Team working
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop", // Business meeting
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200&h=200&fit=crop", // Collaboration
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&h=200&fit=crop", // Remote work
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=200&h=200&fit=crop", // Team discussion
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop", // Startup team
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop", // Professional woman
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop", // Tech work
    ];

    return (
        <section className="bg-zinc-900 px-4 md:px-20 lg:px-40 py-16 md:py-28 border-t border-neutral-800">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20">
                {/* Images Grid */}
                <div className="grid grid-cols-4 gap-3 lg:gap-4">
                    {communityImages.map((img, i) => (
                        <div 
                            key={i} 
                            className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden group cursor-pointer"
                        >
                            <img 
                                src={img} 
                                alt={`Communauté ${i + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ))}
                </div>

                {/* Text Content */}
                <div className="flex-1 flex flex-col gap-6 lg:gap-7">
                    <div className="flex flex-col gap-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg w-fit">
                            <TrendingUp className="w-5 h-5 text-violet-500" />
                            <span className="text-white text-base md:text-lg font-medium">
                                Apprenez, Connectez, Innovez
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                            Rejoignez la Révolution SIESM
                        </h2>
                    </div>
                    <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
                        Plongez dans l'univers de la veille technologique et sectorielle. Explorez nos ressources complètes, 
                        connectez-vous avec des experts du domaine, et stimulez l'innovation dans votre organisation.
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-6 mt-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-violet-600/10 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6 text-violet-500" />
                            </div>
                            <div>
                                <div className="text-white text-xl font-bold">10k+</div>
                                <div className="text-neutral-500 text-sm">Membres actifs</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-white text-xl font-bold">500+</div>
                                <div className="text-neutral-500 text-sm">Ressources</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-600/10 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-white text-xl font-bold">50+</div>
                                <div className="text-neutral-500 text-sm">Événements/an</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {features.map((feature) => {
                    const Icon = feature.icon;
                    const colorClasses: Record<ColorKey, {
                        bg: string;
                        border: string;
                        iconBg: string;
                        iconColor: string;
                        hoverBorder: string;
                    }> = {
                        violet: {
                            bg: 'bg-violet-600',
                            border: 'border-violet-500/30',
                            iconBg: 'bg-violet-600/10',
                            iconColor: 'text-violet-500',
                            hoverBorder: 'hover:border-violet-500/50'
                        },
                        blue: {
                            bg: 'bg-blue-600',
                            border: 'border-blue-500/30',
                            iconBg: 'bg-blue-600/10',
                            iconColor: 'text-blue-500',
                            hoverBorder: 'hover:border-blue-500/50'
                        },
                        emerald: {
                            bg: 'bg-emerald-600',
                            border: 'border-emerald-500/30',
                            iconBg: 'bg-emerald-600/10',
                            iconColor: 'text-emerald-500',
                            hoverBorder: 'hover:border-emerald-500/50'
                        }
                    };
                    const currentColorClasses = colorClasses[feature.color];

                    return (
                        <div 
                            key={feature.title} 
                            className={`group p-8 md:p-10 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border ${currentColorClasses.border} ${currentColorClasses.hoverBorder} transition-all duration-300 hover:shadow-xl hover:shadow-${feature.color}-500/10 flex flex-col gap-6`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className={`w-14 h-14 ${currentColorClasses.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`w-7 h-7 ${currentColorClasses.iconColor}`} />
                                </div>
                                <div className={`p-3 ${currentColorClasses.bg} rounded-full group-hover:rotate-45 transition-transform duration-300 cursor-pointer`}>
                                    <ArrowRight className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-white text-xl md:text-2xl font-bold">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
                                {feature.description}
                            </p>

                            {/* CTA Link */}
                            <button className={`mt-auto flex items-center gap-2 ${currentColorClasses.iconColor} hover:gap-3 transition-all font-medium group-hover:underline`}>
                                <span>En savoir plus</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Call to Action */}
            <div className="mt-16 md:mt-20 p-8 md:p-12 bg-linear-to-r from-violet-600/10 to-blue-600/10 rounded-3xl border border-violet-500/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1">
                        <h3 className="text-white text-2xl md:text-3xl font-bold mb-3">
                            Prêt à transformer votre veille stratégique ?
                        </h3>
                        <p className="text-neutral-400 text-lg">
                            Rejoignez plus de 10 000 professionnels qui font confiance à SIESM
                        </p>
                    </div>
                    <button
                        className=" cursor-pointer px-8 py-4 bg-violet-600 hover:bg-violet-700 rounded-xl text-white font-semibold transition-all flex items-center gap-3 group shadow-lg shadow-violet-600/30"
                        onClick={() => navigate('/login')}
                    >
                        <span>Commencer maintenant</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CommunitySection;