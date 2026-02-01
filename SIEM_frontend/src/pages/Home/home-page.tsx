import Hero from '@/components/hero/hero-app';
import FeatureSection from '@/components/ui/feature-section';
import ResourcesSection from '@/components/ui/resouce-section';
import BlogSection from '@/components/ui/blog-section';
import Testimonials from '@/components/ui/testiminilas';
import CommunitySection from '@/components/ui/community-section';
import { useNavigate } from 'react-router-dom';
import { LogIn} from 'lucide-react';
import SplashScreen from '@/components/layouts/SplashScreen';
import { useState } from 'react';



export const SIEMIcon = () => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        className="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Ligne de pouls */}
        <path 
            d="M3 12H7L9 6L11 18L13 9L15 12H21" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="animate-SIEM"
        />
        {/* Point lumineux */}
        <circle 
            cx="12" 
            cy="12" 
            r="2" 
            fill="currentColor"
            className="animate-ping"
        />
    </svg>
);
export default function HomePage() {
    const navigate = useNavigate();
    const [showSplash, setShowSplash] = useState(true);

    // Si le splash a déjà été montré dans cette session, ne pas le remontrer
    // Vous pouvez utiliser sessionStorage pour gérer cela
    const handleSplashComplete = () => {
        setShowSplash(false);
        sessionStorage.setItem('splashShown', 'true');
    };

    // Vérifier si le splash a déjà été montré
    useState(() => {
        const splashShown = sessionStorage.getItem('splashShown');
        if (splashShown) {
            setShowSplash(false);
        }
    });

    if (showSplash) {
        return <SplashScreen onComplete={handleSplashComplete} />;
    }

    return (
        <div className="bg-slate-950 min-h-screen">
            {/* Header fixe en haut */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
                    <div className="flex items-center justify-between">
                        <div 
                            className="flex items-center gap-3 cursor-pointer group" 
                            onClick={() => navigate('/')}
                        >
                            <div className="relative w-11 h-11 rounded-xl bg-linear-to-br from-violet-600 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-900/50 group-hover:shadow-violet-900/80 transition-all group-hover:scale-105">
                                <SIEMIcon />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-fuchsia-400 rounded-full animate-SIEM" />
                            </div>
                            <div className="hidden sm:block">
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-bold text-xl tracking-tight">
                                        SIEM<span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">News</span>
                                    </span>
                                </div>
                                <p className="text-xs text-neutral-400 -mt-1">
                                    Le Pouls de votre Secteur
                                </p>
                            </div>
                            <span className="sm:hidden text-white font-bold text-lg">
                                SIEM
                                <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">News</span>
                            </span>
                        </div>
                        {/* Boutons à droite - Desktop & Mobile */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Bouton Se connecter */}
                            <button
                                className="px-3 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-2.5 transition bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white hover:border-slate-600"
                                onClick={() => navigate('/login')}
                            >
                                <LogIn className="w-4 h-4" />
                                <span className="hidden md:inline cursor-pointer">Se connecter</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Spacer pour compenser le header fixe */}
            
            <Hero />
            <FeatureSection />
            <ResourcesSection />
            <BlogSection />
            <Testimonials />
            <CommunitySection />
        </div>
    );
}