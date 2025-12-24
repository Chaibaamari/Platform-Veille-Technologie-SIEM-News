export type NormalizedRole = 'analytics' | 'simple_user' | string;

const ROLE_ALIASES: Record<string, NormalizedRole> = {
    'analytics': 'analytics',
    'analytic': 'analytics',
    'analyst': 'analytics',

    'simple_user': 'simple_user',
    'simple-user': 'simple_user',
    'user': 'simple_user',
    'simple user': 'simple_user',
};

const DASHBOARD_ROUTE_MAP: Record<NormalizedRole, string> = {
    analytics: '/analytics/dashboard',
    simple_user: '/simple_user/dashboard',
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
    if (!normalized) {
        return null;
    }

    return DASHBOARD_ROUTE_MAP[normalized] ?? null;
};