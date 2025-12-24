// src/types/blog.ts
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  tags: string[];
  featured?: boolean; // for large featured post
};

export interface Article {
  id_article: number;
  titre_article: string;
  description_article: string;
  summary_article?: string;
  contenu_article?: string;
  url_article?: string;
  thumbnail?: string;
  date_publication: string;
  tags: string[];// ISO string, e.g. "2025-01-01T00:00:00Z"
}

export interface Vulnerability {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  date?: string; // optional
}