import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Helper for tag colors
// Tag colors matching the design
export function getTagBg(tag: string) {
  const map: Record<string, string> = {
    Design: '#a78bfa20',
    Research: '#818cf820',
    Presentation: '#f472b620',
    Leadership: '#60a5fa20',
    Management: '#34d39920',
    Product: '#c084fc20',
    Frameworks: '#fbbf2420',
    Tools: '#10b98120',
    SaaS: '#06b6d420',
    Podcasts: '#f59e0b20',
    'Customer Success': '#ec489920',
  };
  return map[tag] || '#6b728020';
}

export function getTagText(tag: string) {
  const map: Record<string, string> = {
    Design: '#a78bfa',
    Research: '#818cf8',
    Presentation: '#f472b6',
    Leadership: '#60a5fa',
    Management: '#34d399',
    Product: '#c084fc',
    Frameworks: '#fbbf24',
    Tools: '#10b981',
    SaaS: '#06b6d4',
    Podcasts: '#f59e0b',
    'Customer Success': '#ec4899',
  };
  return map[tag] || '#9ca3af';
}


