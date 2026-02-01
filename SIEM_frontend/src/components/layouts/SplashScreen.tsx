// src/components/SplashScreen.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Icône personnalisée SIEMNews
const SIEMIcon = ({ className }: { className?: string }) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <motion.path 
            d="M3 12H7L9 6L11 18L13 9L15 12H21" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.circle 
            cx="12" 
            cy="12" 
            r="2" 
            fill="currentColor"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 1, delay: 0.5, times: [0, 0.6, 1] }}
        />
    </svg>
);

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Durée totale de l'animation (3 secondes)
        const timer = setTimeout(() => {
            setShow(false);
            // Petite pause avant d'appeler onComplete pour permettre l'animation de sortie
            setTimeout(onComplete, 500);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-100 flex items-center justify-center bg-linear-to-br from-zinc-950 via-violet-950/20 to-zinc-950"
                >
                    {/* Cercles d'arrière-plan animés */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl"
                            animate={{
                                scale: [1.2, 1, 1.2],
                                opacity: [0.2, 0.4, 0.2],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5
                            }}
                        />
                    </div>

                    {/* Contenu central */}
                    <div className="relative flex flex-col items-center gap-8">
                        {/* Logo avec animation */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ 
                                duration: 1, 
                                ease: "easeOut",
                                type: "spring",
                                stiffness: 200,
                                damping: 15
                            }}
                            className="relative"
                        >
                            <div className="w-32 h-32 rounded-3xl bg-linear-to-br from-violet-600 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-2xl shadow-violet-900/50">
                                <SIEMIcon className="w-20 h-20 text-white" />
                                
                                {/* Point animé */}
                                <motion.div
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-fuchsia-400 rounded-full"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [1, 0.7, 1],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>

                            {/* Anneaux pulsants */}
                            <motion.div
                                className="absolute inset-0 rounded-3xl border-2 border-violet-500/30"
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.5, 0, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                }}
                            />
                            <motion.div
                                className="absolute inset-0 rounded-3xl border-2 border-fuchsia-500/30"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 0, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeOut",
                                    delay: 0.5
                                }}
                            />
                        </motion.div>

                        {/* Nom de l'app */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <h1 className="text-5xl font-bold text-white tracking-tight">
                                SIEM<span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">News</span>
                            </h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 1 }}
                                className="text-neutral-400 text-lg"
                            >
                                Le Pouls de votre Secteur
                            </motion.p>
                        </motion.div>

                        {/* Barre de chargement */}
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "200px" }}
                            transition={{ duration: 0.5, delay: 1.5 }}
                            className="h-1 bg-neutral-800 rounded-full overflow-hidden"
                        >
                            <motion.div
                                className="h-full bg-linear-to-r from-violet-600 to-fuchsia-600 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, delay: 1.5, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}