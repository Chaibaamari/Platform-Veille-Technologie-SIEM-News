import { ArrowRight, BookOpen, FileText, TrendingUp, Newspaper } from "lucide-react";
import ButtonHero from "./button-hero";

// Resources Section (Ebooks & Whitepapers)
const ResourcesSection = () => {
    const resources = [
        {
            title: "Rapports d'Analyse",
            description: "Explorez notre collection de rapports détaillés couvrant les tendances du secteur SIESM.",
            downloads: "5k+ Utilisateurs",
            total: "Plus de 50 rapports",
            format: "PDF",
            button: "Télécharger les Rapports",
            icon: FileText,
            iconBg: "bg-violet-600",
            // Image de dashboard/analytics
            chartImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=400&fit=crop",
            topics: "Les rapports couvrent : Cybersécurité (25%), IA & Innovation (20%), Transformations digitales (15%), Réglementation (25%), Technologies émergentes (15%).",
            expertise: "12 ans",
            color: "violet"
        },
        {
            title: "Synthèses Sectorielles",
            description: "Accédez à des analyses approfondies et des synthèses complètes du secteur.",
            downloads: "8k+ Utilisateurs",
            total: "Plus de 80 synthèses",
            format: "PDF",
            button: "Télécharger les Synthèses",
            icon: BookOpen,
            iconBg: "bg-blue-600",
            // Image de news/articles
            chartImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&h=400&fit=crop",
            topics: "Les synthèses incluent : Tendances marché (20%), Veille concurrentielle (15%), Innovation SIESM (20%), Études de cas (15%), Prospective sectorielle (30%).",
            expertise: "15 ans",
            color: "blue"
        }
    ];

    // Images d'utilisateurs réalistes (vous pouvez remplacer par vos propres images)
    const userAvatars = [
        "https://i.pravatar.cc/100?img=1",
        "https://i.pravatar.cc/100?img=2",
        "https://i.pravatar.cc/100?img=3",
        "https://i.pravatar.cc/100?img=4"
    ];

    return (
        <section className="bg-zinc-900">
            {/* Header Section */}
            <div className="px-4 md:px-20 lg:px-40 py-16 md:py-28 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 border-b border-neutral-800">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-violet-500" />
                        <span className="text-white text-lg font-medium">
                            Votre Portail d'Information Stratégique
                        </span>
                    </div>
                    <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                        Accédez aux Ressources Clés du Secteur SIESM
                    </h2>
                    <p className="mt-4 text-neutral-400 text-lg">
                        Documentations, analyses et rapports pour rester à la pointe de l'information
                    </p>
                </div>
                <ButtonHero variant="outline">
                    Voir Toutes les Ressources
                    <ArrowRight className="w-6 h-6 text-violet-500" />
                </ButtonHero>
            </div>

            {/* Resources Cards */}
            {resources.map((resource, i) => {
                const Icon = resource.icon;
                return (
                    <div 
                        key={i} 
                        className={`px-4 md:px-20 lg:px-40 py-12 md:py-20 flex flex-col xl:flex-row gap-10 xl:gap-20 ${
                            i === 1 ? 'border-t' : ''
                        } border-neutral-800`}
                    >
                        {/* Left Column */}
                        <div className="flex flex-col gap-10 xl:w-1/3">
                            <div className="flex flex-col gap-12">
                                {/* Icon */}
                                <div className={`w-20 h-20 ${resource.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
                                    <Icon className="w-10 h-10 text-white" />
                                </div>

                                {/* Title & Description */}
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-3xl md:text-4xl font-bold text-white">
                                        {resource.title}
                                    </h3>
                                    <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
                                        {resource.description}
                                    </p>
                                </div>

                                {/* CTA Button */}
                                <ButtonHero variant="outline">
                                    {resource.button}
                                    <ArrowRight className="w-6 h-6 text-violet-500" />
                                </ButtonHero>
                            </div>

                            {/* Download Stats */}
                            <div className="p-6 md:p-7 bg-zinc-900 rounded-2xl border border-neutral-800 flex items-center gap-8 md:gap-12 shadow-lg">
                                <div className="flex flex-col gap-1">
                                    <div className="text-neutral-400 text-base md:text-lg">
                                        Téléchargé par
                                    </div>
                                    <div className="text-white text-xl md:text-2xl font-bold">
                                        {resource.downloads}
                                    </div>
                                </div>
                                <div className="flex -space-x-3">
                                    {userAvatars.map((avatar, n) => (
                                        <img 
                                            key={n} 
                                            className="w-11 h-11 md:w-12 md:h-12 rounded-full border-2 border-slate-950 object-cover" 
                                            src={avatar} 
                                            alt={`Utilisateur ${n + 1}`} 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex-1 flex flex-col justify-end gap-7">
                            {/* Topics Coverage */}
                            <div className="flex flex-col md:flex-row items-start gap-5">
                                <div className="w-full md:w-60 text-xl md:text-2xl font-bold text-white">
                                    Couverture Thématique
                                </div>
                                <div className="flex-1 text-neutral-400 text-base md:text-lg leading-relaxed">
                                    {resource.topics}
                                </div>
                            </div>

                            {/* Chart/Visual */}
                            <div className="relative overflow-hidden rounded-2xl group">
                                <img 
                                    className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105" 
                                    src={resource.chartImage} 
                                    alt="Statistiques et analyses" 
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-linear-to-t from-zinc-900/80 to-transparent" />
                                
                                {/* Stats overlay */}
                                <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                                    <div className="flex-1 px-4 py-3 bg-black/60 backdrop-blur-sm rounded-lg border border-neutral-700">
                                        <div className="text-neutral-300 text-sm">Articles analysés</div>
                                        <div className="text-white text-lg font-bold">10k+</div>
                                    </div>
                                    <div className="flex-1 px-4 py-3 bg-black/60 backdrop-blur-sm rounded-lg border border-neutral-700">
                                        <div className="text-neutral-300 text-sm">Sources</div>
                                        <div className="text-white text-lg font-bold">50+</div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Total Resources */}
                                <div className="p-6 md:p-7 bg-zinc-900 rounded-2xl border border-neutral-800 flex flex-col gap-2 hover:border-violet-500/50 transition-colors">
                                    <div className="text-neutral-400 text-base md:text-lg">
                                        Total {resource.title}
                                    </div>
                                    <div className="text-white text-xl md:text-2xl font-bold">
                                        {resource.total}
                                    </div>
                                </div>

                                {/* Download Format */}
                                <div className="p-6 md:p-7 bg-zinc-900 rounded-2xl border border-neutral-800 flex items-center gap-5 hover:border-violet-500/50 transition-colors">
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="text-neutral-400 text-base md:text-lg">
                                            Formats Disponibles
                                        </div>
                                        <div className="text-white text-xl md:text-2xl font-bold">
                                            {resource.format}
                                        </div>
                                    </div>
                                    <ButtonHero variant="outline" className="whitespace-nowrap">
                                        Aperçu
                                    </ButtonHero>
                                </div>
                            </div>

                            {/* Expertise */}
                            <div className="p-6 md:p-7 bg-linear-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-neutral-800 hover:border-violet-500/50 transition-colors">
                                <div className="flex items-center gap-3 mb-2">
                                    <Newspaper className="w-5 h-5 text-violet-500" />
                                    <div className="text-neutral-400 text-base md:text-lg">
                                        Expertise Moyenne des Analystes
                                    </div>
                                </div>
                                <div className="text-white text-xl md:text-2xl font-bold">
                                    {resource.expertise} d'expérience
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
};

export default ResourcesSection;