/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Newsletter.tsx
import { useState } from 'react';
import { CheckCircle, Loader2, AlertCircle, ArrowRight, Calendar, Heart, Badge, Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/stores/hooks';
import { useFavorites } from '@/hook/useFavorites';
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
    
    const { favorites, toggleFavorite, isFavorite } = useFavorites();
    const { role } = useAppSelector((state) => state.auth);

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
            {/* Favorite Articles Section */}
            <div className="py-16 px-4 border-t border-neutral-800">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-3">
                            <Heart className="w-8 h-8 text-violet-500 fill-violet-500" />
                            <h2 className="text-white text-3xl font-bold">
                                Articles favoris
                            </h2>
                            <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 rounded-full text-violet-400 text-sm font-medium">
                                {favorites.length}
                            </span>
                        </div>
                        <Link
                            to={`/${role}/article`}
                            className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition"
                        >
                            <span>Voir tous les articles</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Articles Grid */}
                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {favorites.slice(0, 6).map((article) => (
                                <div
                                    key={article.id}
                                    className="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-violet-500 transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <Link to={`/${role}/article/${article.id}`}>
                                            <img
                                                src={article.thumbnail || 'https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg'}
                                                alt={article.titre}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </Link>
                                        
                                        {/* Favorite Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleFavorite(article);
                                            }}
                                            className="absolute top-3 right-3 w-10 h-10 bg-neutral-900/80 backdrop-blur-sm border border-neutral-700 hover:border-red-500 rounded-full flex items-center justify-center transition-all group/heart"
                                        >
                                            <Heart
                                                className={`w-5 h-5 transition-all ${isFavorite(article.id)
                                                    ? 'text-red-500 fill-red-500'
                                                    : 'text-neutral-400 group-hover/heart:text-red-500'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-4">
                                        {/* Category */}
                                        <div className="flex flex-wrap mt-auto  justify-start items-start gap-2">
                                            {(article.categories || []).map((tag: string) => (
                                                <Badge
                                                    key={tag}
                                                    className="px-2.5 py-0.5 rounded-2xl text-sm font-medium"
                                                    style={{
                                                        backgroundColor: getTagBg(tag),
                                                        color: getTagText(tag),
                                                    }}
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        {/* Title */}
                                        <Link to={`/${role}/article/${article.id}`}>
                                            <h3 className="text-white text-xl font-semibold line-clamp-2 group-hover:text-violet-400 transition">
                                                {article.titre}
                                            </h3>
                                        </Link>

                                        {/* Description */}
                                        <p className="text-neutral-400 text-sm line-clamp-3">
                                            {article.contenu?.replace(/<[^>]*>/g, '') || 'Aucune description disponible'}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                                            <div className="flex items-center gap-2 text-neutral-500 text-sm">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {new Date(article.date_publication).toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <Link
                                                to={`/${role}/article/${article.id}`}
                                                className="flex items-center gap-1 text-violet-400 hover:text-violet-300 text-sm font-medium transition"
                                            >
                                                Lire
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Heart className="w-20 h-20 text-neutral-700 mx-auto mb-4" />
                            <h3 className="text-white text-xl font-semibold mb-2">
                                Aucun article favori
                            </h3>
                            <p className="text-neutral-400 mb-6">
                                Commencez à ajouter des articles à vos favoris en cliquant sur le cœur
                            </p>
                            <Link
                                to={`/${role}/article`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 hover:bg-violet-600 rounded-xl text-white font-medium transition"
                            >
                                Découvrir les articles
                                <ArrowRight className="w-5 h-5" />
                            </Link>
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