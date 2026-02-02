/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Newsletter.tsx
import { useState, useEffect } from 'react';
import { Loader2,Check, Sparkles } from 'lucide-react';
import { getTagBg, getTagText } from '@/lib/utils';
import { useCategoriesPreferences } from '@/hook/useCategoriesPreferences';

export default function Newsletter() {
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const {
        categories,
        isLoadingCategories,
        preferredCategoryIds,
        updatePreferences,
        isUpdating,
        // isCategoryPreferred,
    } = useCategoriesPreferences();

    const categoriesList = categories.categories

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

    useEffect(() => {
        const prefArray = Array.from(preferredCategoryIds) as number[];
        // Only update if different from current state
        if (
            prefArray.length !== selectedCategories.length ||
            !prefArray.every((id, idx) => id === selectedCategories[idx])
        ) {
            setSelectedCategories(prefArray);
        }
    }, [categoriesList]);


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
                    ) : categoriesList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {categoriesList.map((category: any) => {
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
        </div>
    );
}