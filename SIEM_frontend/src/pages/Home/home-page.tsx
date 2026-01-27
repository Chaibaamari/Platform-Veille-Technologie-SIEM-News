import Hero from '@/components/hero/hero-app';
import FeatureSection from '@/components/ui/feature-section';
import ResourcesSection from '@/components/ui/resouce-section';
import BlogSection from '@/components/ui/blog-section';
import Testimonials from '@/components/ui/testiminilas';
import CommunitySection from '@/components/ui/community-section';
import { useNavigate } from 'react-router-dom';
import { LogIn,Shield} from 'lucide-react';


export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="bg-slate-950 min-h-screen">
            {/* Header fixe en haut */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div 
                            className="flex items-center gap-3 cursor-pointer group" 
                            onClick={() => navigate('/')}
                        >
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/50 group-hover:shadow-indigo-900/80 transition-all group-hover:scale-105">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-white font-bold text-xl tracking-tight">
                                    CIEM Veille
                                </span>
                                <p className="text-xs text-slate-400 -mt-1">
                                    Système de Surveillance Médiatique
                                </p>
                            </div>
                            <span className="sm:hidden text-white font-bold text-lg">
                                CIEM
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
                                <span className="hidden md:inline">Se connecter</span>
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