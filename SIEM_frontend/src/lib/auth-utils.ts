export type NormalizedRole = 'analyste' | 'simple_user' | "admin" | "veilleur" | string;

const ROLE_ALIASES: Record<string, NormalizedRole> = {
    'admin': 'admin',
    'administrator': 'admin',
    'administrateur': 'admin',

    // Veilleur
    'veilleur': 'veilleur',
    'watcher': 'veilleur',
    'monitor': 'veilleur',
    
    'analytics': 'analyste',
    'analytic': 'analyste',
    'analyste': 'analyste',

    'simple_user': 'simple_user',
    'simple-user': 'simple_user',
    'user': 'simple_user',
    'simple user': 'simple_user',
};

const DASHBOARD_ROUTE_MAP: Record<NormalizedRole, string> = {
    analyste: '/analyste/article',
    simple_user: '/simple_user/article',
    admin: '/admin/users',
    veilleur: '/veilleur/sources',
};

export const normalizeRole = (role?: string | null): NormalizedRole | null => {
    if (!role) return null;

    const value = role
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');

    if (ROLE_ALIASES[value]) {
        return ROLE_ALIASES[value];
    }

    const underscored = value
        .replace(/-/g, '_')
        .replace(/\s+/g, '_');

    if (ROLE_ALIASES[underscored]) {
        return ROLE_ALIASES[underscored];
    }

    return underscored;
};

export const getDashboardPathForRole = (role?: string | null): string | null => {
    const normalized = normalizeRole(role);
    console.log(normalized)
    if (!normalized) {
        return null;
    }

    return DASHBOARD_ROUTE_MAP[normalized] ?? null;
};