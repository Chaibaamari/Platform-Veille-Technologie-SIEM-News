// src/routes/AppRoutes.tsx (or wherever you keep your routes)

import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAppSelector } from '@/stores/hooks';
import { LoadingSpinner } from '@/components/Error/loading-spinner';
import { getDashboardPathForRole, normalizeRole } from '@/lib/auth-utils';
import Footer from '@/components/Footer/app-footer';

// Lazy load components for code splitting
const Login = lazy(() => import('@/pages/auth/auth'));

// Analytics routes
const AnalyticsLayout = lazy(() => import('@/components/layouts/AnalyticsLayout'));
const AnalyticsDashboard = lazy(() => import('@/pages/analytics/dashbored'));

// Simple User routes
const SimpleUserLayout = lazy(() => import('@/components/layouts/SimpleUserLayout'));
const SimpleUserArticles = lazy(() => import('@/pages/simple-user/Article/article'));
const ArticleDetail = lazy(() => import('@/pages/simple-user/Article/article-details'));
const VulnerabilitiesPage = lazy(() => import('@/pages/simple-user/Vulnerability/vulnerabilities-page'));
const VulnerabilityDetail = lazy(() => import('@/pages/simple-user/Vulnerability/vulnerability-detail'));

// Default dashboard redirect based on role
const DashboardRedirect = () => {
    const { role } = useAppSelector((state) => state.auth);

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    const normalizedRole = normalizeRole(role);
    const targetRoute = getDashboardPathForRole(normalizedRole);

    if (!targetRoute) {
        return <Navigate to="/login" replace />;
    }

    return <Navigate to={targetRoute} replace />;
};


export default function AppRoutes() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

                {/* Root redirect to role-based dashboard */}
                <Route path="/" element={<DashboardRedirect />} />
                <Route path="/dashboard" element={<DashboardRedirect />} />

                {/* Analytics Routes */}
                <Route
                    path="/analytics/*"
                    element={
                        <RoleGuard allowedRoles={['analytics']}>
                            <AnalyticsLayout>
                                <Routes>
                                    <Route path="dashboard" element={<AnalyticsDashboard />} />
                                    {/* Add more analytics pages here later */}
                                    <Route path="*" element={<Navigate to="/analytics/dashboard" replace />} />
                                </Routes>
                            </AnalyticsLayout>
                        </RoleGuard>
                    }
                />

                {/* Simple User Routes */}
                <Route
                    path="/simple_user/*"
                    element={
                        <RoleGuard allowedRoles={['simple_user']}>
                            <SimpleUserLayout>
                                <Routes>
                                    <Route path="article" element={<SimpleUserArticles />} />
                                    {/* Add more simple user pages here later */}
                                    <Route path="article/:id" element={<ArticleDetail />} />
                                    <Route path="/vulnerabilities" element={<VulnerabilitiesPage />} />
                                    <Route path="vulnerabilities/:id" element={<VulnerabilityDetail />} />
                                    <Route path="*" element={<Navigate to="/simple_user/dashboard" replace />} />
                                    {/* <Route path="/vulnerabilities/:id" element={<VulnerabilityDetail />} /> */}
                                </Routes>
                                <Footer />
                            </SimpleUserLayout>
                        </RoleGuard>
                    }
                />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}