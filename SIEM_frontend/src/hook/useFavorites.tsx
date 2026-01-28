/* eslint-disable react-refresh/only-export-components */
// src/contexts/FavoritesContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Article } from '@/types/blog';

interface FavoritesContextType {
    favorites: Article[];
    addFavorite: (article: Article) => void;
    removeFavorite: (articleId: number) => void;
    isFavorite: (articleId: number) => boolean;
    toggleFavorite: (article: Article) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<Article[]>(() => {
        const stored = localStorage.getItem('favorites');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (error) {
                console.error('Erreur lors du chargement des favoris:', error);
            }
        }
        return [];
    });

    // Sauvegarder dans localStorage à chaque changement
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = (article: Article) => {
        setFavorites((prev) => {
            // Éviter les doublons
            if (prev.some((fav) => fav.id === article.id)) {
                return prev;
            }
            return [...prev, article];
        });
    };

    const removeFavorite = (articleId: number) => {
        setFavorites((prev) => prev.filter((fav) => fav.id !== articleId));
    };

    const isFavorite = (articleId: number) => {
        return favorites.some((fav) => fav.id === articleId);
    };

    const toggleFavorite = (article: Article) => {
        if (isFavorite(article.id)) {
            removeFavorite(article.id);
        } else {
            addFavorite(article);
        }
    };

    // TypeScript files with JSX must have .tsx extension
    // Please rename this file to useFavorites.tsx for JSX to work
    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites doit être utilisé dans un FavoritesProvider');
    }
    return context;
}