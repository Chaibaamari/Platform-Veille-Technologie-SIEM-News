// src/pages/NotFound.tsx
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-950 to-zinc-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Number */}
                <div className="relative mb-8">
                    <h1 className="text-[200px] font-bold text-transparent bg-clip-text bg-linear-to-b from-violet-500/20 to-transparent leading-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-violet-500/10 border border-violet-500/30 rounded-full flex items-center justify-center">
                            <Search className="w-16 h-16 text-violet-500" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-3xl font-bold text-white">
                        Page introuvable
                    </h2>
                    <p className="text-neutral-400 text-lg max-w-md mx-auto">
                        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition bg-transparent border border-neutral-800 hover:bg-neutral-800 hover:border-violet-500 text-neutral-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5 text-violet-500" />
                        <span>Retour</span>
                    </button>
                    
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition bg-violet-500 hover:bg-violet-600 text-white"
                    >
                        <Home className="w-5 h-5" />
                        <span>Accueil</span>
                    </button>
                </div>

            </div>
        </div>
    );
}