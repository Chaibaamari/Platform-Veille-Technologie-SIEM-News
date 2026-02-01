/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Newsletter.tsx
import { useState } from 'react';
import { CheckCircle, Loader2, AlertCircle,Check, Sparkles } from 'lucide-react';
import { getTagBg, getTagText } from '@/lib/utils';
import { useCategoriesPreferences } from '@/hook/useCategoriesPreferences';

export interface NewsletterFormData {
  email: string;
}

interface NewsletterProps {
  apiUrl?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function Newsletter({
  apiUrl = '/api/subscribe',
  onSuccess,
  onError,
}: NewsletterProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const {
        categories,
        isLoadingCategories,
        preferredCategoryIds,
        updatePreferences,
        isUpdating,
        // isCategoryPreferred,
    } = useCategoriesPreferences();

    useState(() => {
        setSelectedCategories(Array.from(preferredCategoryIds) as number[]);
    });
    
    const validateEmail = (email: string) => {
        return email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setStatus('error');
            setMessage('Veuillez entrer votre email');
            return;
        }

        if (!validateEmail(email)) {
            setStatus('error');
            setMessage('Veuillez entrer une adresse email valide');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Échec de l\'inscription');
            }

            setStatus('success');
            setMessage('Merci ! Vous êtes maintenant abonné.');
            setEmail('');
            onSuccess?.();
        } catch (err) {
            setStatus('error');
            setMessage(err instanceof Error ? err.message : 'Une erreur est survenue');
            onError?.(err instanceof Error ? err.message : 'Erreur inconnue');
        }
    };


    const toggleCategory = (categoryId: number) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    const handleSavePreferences = () => {
        updatePreferences(selectedCategories);
    };

    const hasChanges = JSON.stringify(selectedCategories.sort()) !==
        JSON.stringify(Array.from(preferredCategoryIds).sort());

    return (
        <div className="w-full bg-linear-to-b from-slate-950 to-zinc-900">

            {/* catégory favorite  */}
            <div className="py-16 px-4 border-t border-neutral-800">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Sparkles className="w-8 h-8 text-violet-500 fill-violet-500" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500 rounded-full animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-white text-3xl font-bold">
                                    Catégories préférées
                                </h2>
                                <p className="text-neutral-400 text-sm mt-1">
                                    Personnalisez votre fil d'actualités
                                </p>
                            </div>
                        </div>
                        
                        {hasChanges && (
                            <button
                                onClick={handleSavePreferences}
                                disabled={isUpdating}
                                className="px-6 py-3 bg-violet-500 hover:bg-violet-600 disabled:bg-violet-500/50 rounded-xl text-white font-medium transition-all flex items-center gap-2 shadow-lg shadow-violet-500/20"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Sauvegarder
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Categories Grid */}
                    {isLoadingCategories ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
                        </div>
                    ) : categories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {categories.map((category: any) => {
                                const isSelected = selectedCategories.includes(category.id);
                                const bgColor = getTagBg(category.nom);
                                const textColor = getTagText(category.nom);
                                
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => toggleCategory(category.id)}
                                        className={`
                                            relative group p-6 rounded-2xl border-2 transition-all duration-300
                                            ${isSelected 
                                                ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/20 scale-[1.02]' 
                                                : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700 hover:bg-neutral-800/50'
                                            }
                                        `}
                                    >
                                        {/* Selection Indicator */}
                                        <div className={`
                                            absolute top-3 right-3 w-6 h-6 rounded-full border-2 transition-all
                                            ${isSelected 
                                                ? 'bg-violet-500 border-violet-500' 
                                                : 'border-neutral-600 group-hover:border-neutral-500'
                                            }
                                            flex items-center justify-center
                                        `}>
                                            {isSelected && (
                                                <Check className="w-4 h-4 text-white" />
                                            )}
                                        </div>

                                        {/* Category Badge */}
                                        <div className="mb-4">
                                            <span
                                                className="inline-block px-4 py-2 rounded-lg text-sm font-semibold"
                                                style={{
                                                    backgroundColor: bgColor,
                                                    color: textColor,
                                                }}
                                            >
                                                {category.nom}
                                            </span>
                                        </div>

                                        {/* Category Description */}
                                        {category.description && (
                                            <p className="text-neutral-400 text-sm line-clamp-2">
                                                {category.description}
                                            </p>
                                        )}

                                        {/* Selection State Label */}
                                        <div className="mt-4 pt-4 border-t border-neutral-800">
                                            <span className={`
                                                text-xs font-medium transition-colors
                                                ${isSelected ? 'text-violet-400' : 'text-neutral-500'}
                                            `}>
                                                {isSelected ? '✓ Sélectionné' : 'Cliquer pour sélectionner'}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Sparkles className="w-20 h-20 text-neutral-700 mx-auto mb-4" />
                            <h3 className="text-white text-xl font-semibold mb-2">
                                Aucune catégorie disponible
                            </h3>
                            <p className="text-neutral-400">
                                Les catégories seront bientôt disponibles
                            </p>
                        </div>
                    )}

                    {/* Selection Summary */}
                    {selectedCategories.length > 0 && (
                        <div className="mt-8 p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-violet-500/10 rounded-full flex items-center justify-center">
                                        <Check className="w-6 h-6 text-violet-500" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">
                                            {selectedCategories.length} catégorie{selectedCategories.length > 1 ? 's' : ''} sélectionnée{selectedCategories.length > 1 ? 's' : ''}
                                        </p>
                                        <p className="text-neutral-400 text-sm">
                                            Votre fil sera personnalisé selon vos préférences
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Newsletter Section */}
            <div className="flex flex-col justify-start items-center gap-10 py-16 px-4">
                <div className="max-w-3xl flex flex-col justify-start items-center gap-6">
                    <div className="flex flex-col justify-start items-start gap-3">
                        <div className="text-center text-violet-500 text-base font-semibold leading-6 items-center w-full">
                            Newsletters
                        </div>
                        <div className="text-center text-white text-5xl font-semibold leading-tight">
                            Stories and interviews
                        </div>
                    </div>
                    <div className="text-center text-neutral-300 text-xl font-normal leading-8">
                        Subscribe to learn about new product features, the latest in technology, solutions, and updates.
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex justify-center items-start gap-4 flex-wrap max-w-2xl w-full"
                >
                    <div className="flex-1 min-w-70 flex flex-col justify-start items-start">
                        <div className="w-full flex flex-col justify-start items-start gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Entrez votre email"
                                className="w-full px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-300 text-gray-900 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                                disabled={status === 'loading'}
                            />
                            <div className="text-sm text-neutral-300 font-normal leading-5">
                                Nous prenons soin de vos données dans notre{' '}
                                <a href="/privacy" className="underline hover:text-violet-400 transition">
                                    politique de confidentialité
                                </a>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="px-6 py-3 bg-violet-500 rounded-lg shadow-sm flex justify-center items-center gap-2 text-white text-base font-medium hover:bg-violet-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Inscription...
                            </>
                        ) : (
                            'S\'abonner'
                        )}
                    </button>
                </form>

                {status === 'success' && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span>{message}</span>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        <span>{message}</span>
                    </div>
                )}
            </div>
        </div>
    );
}