// src/types/blog.ts
export interface BlogPost {
  id: number;
  titre: string;
  description: string;
  date_publication: Date;
  thumbnail: string;
  categories: string[];
  featured?: boolean; // for large featured post
};

export interface Article {
  id: number;
  titre: string;
  description: string;
  summary?: string;
  contenu?: string;
  url_article?: string;
  thumbnail?: string;
  date_publication: string;
  categories: string[];// ISO string, e.g. "2025-01-01T00:00:00Z"
}

export interface TypeVulnerability {
  cwe_id: string,
  type_vul: string
}

export interface Article2 {
  id: number;
  title: string;
  link: string;
  description: string;
  content: string;
  summary: string;
  publication_date: string; // ISO date string
  categories: string[];
  source: string;
}

export interface Vulnerability {
  cve_id: string;
  severite: 'critical' | 'high' | 'medium' | 'low';
  date_publication: string; // ISO date string
  description_vuln: string;
  score_cvss: number;
  types_vuln: TypeVulnerability[]; // SQL injection, XSS, etc.
}

// ============ Source & Category Types ============
export interface Source {
  id: number;
  nom_source: string;
  flux_rss: string;
  active: boolean;
}

export interface Category {
  id: number;
  nom: string;
}

export interface AppUser {
  name: string;
  email: string;
  role: 'Admin' | 'User';
}

// Types pour l'UI
export interface Stats {
  totalArticles: number;
  criticalVulnerabilities: number;
  recentArticles: number;
  totalVulnerabilities: number;
}

export interface TrendData {
  date: string;
  articles: number;
  vulnerabilities: number;
}

export interface SeverityData {
  severity: string;
  count: number;
  color: string;
}

export interface CategoryData {
  category: string;
  count: number;
}

// Constants
export const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6'
} as const;

export type TimeRange = '7d' | '30d' | '90d';
export type FilterSeverity = 'all' | 'critical' | 'high' | 'medium' | 'low';
export type FilterSource = 'all' | 'NVD' | 'MITRE';