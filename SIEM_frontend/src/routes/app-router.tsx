// src/routes/AppRoutes.tsx (or wherever you keep your routes)

import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAppSelector } from '@/stores/hooks';
import { LoadingSpinner } from '@/components/Error/loading-spinner';
import { getDashboardPathForRole, normalizeRole } from '@/lib/auth-utils';
import Footer from '@/components/Footer/app-footer';
import Dashboard from '@/components/dashbored/dashboed-app';

// Lazy load components for code splitting
const Login = lazy(() => import('@/pages/auth/auth'));

// Admin routes
const AdminLayout = lazy(() => import('@/components/layouts/AdminLayout'));
const AdminUsersPage = lazy(() => import('@/pages/admin/users-page'));

// Veilleur routes
const VeilleurLayout = lazy(() => import('@/components/layouts/VeilleurLayout'));
const VeilleurSourcesPage = lazy(() => import('@/pages/veilleur/source-page'));

// Analytics routes
const AnalyticsLayout = lazy(() => import('@/components/layouts/AnalyticsLayout'));
const AnalyticsDashboard = lazy(() => import('@/pages/simple-user/dashbored'));

// Simple User routes
const SimpleUserLayout = lazy(() => import('@/components/layouts/SimpleUserLayout'));
const SimpleUserArticles = lazy(() => import('@/pages/simple-user/Article/article'));
const ArticleDetail = lazy(() => import('@/pages/simple-user/Article/article-details'));
const VulnerabilitiesPage = lazy(() => import('@/pages/simple-user/Vulnerability/vulnerabilities-page'));
const VulnerabilityDetail = lazy(() => import('@/pages/simple-user/Vulnerability/vulnerability-detail'));
const HomePage = lazy(() => import('@/pages/simple-user/home-page'));
const NewsletterPage = lazy(() => import('@/pages/simple-user/newslatter'));

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

                
                {/* Admin Routes */}
                <Route
                    path="/admin/*"
                    element={
                        <RoleGuard allowedRoles={['admin']}>
                            <AdminLayout>
                                <Routes>
                                    <Route path="users" element={<AdminUsersPage />} />
                                    <Route path="home" element={<HomePage />} />
                                    <Route path="dashboard" element={<Dashboard />} />
                                    <Route path="article" element={<SimpleUserArticles />} />
                                    <Route path="article/:id" element={<ArticleDetail />} />
                                    <Route path="vulnerabilities" element={<VulnerabilitiesPage />} />
                                    <Route path="vulnerabilities/:id" element={<VulnerabilityDetail />} />
                                    <Route path="newsletter" element={<NewsletterPage />} />
                                    <Route path="*" element={<Navigate to="/admin/users" replace />} />
                                </Routes>
                                <Footer />
                            </AdminLayout>
                        </RoleGuard>
                    }
                /> 
                {/* Analytics Routes */}
                <Route
                    path="/analytics/*"
                    element={
                        <RoleGuard allowedRoles={['analytics']}>
                            <AnalyticsLayout>
                                <Routes>
                                    <Route path="dashboard" element={<AnalyticsDashboard />} />
                                    {/* Add more analytics pages here later */}
                                    <Route path="article" element={<SimpleUserArticles />} />
                                    {/* Add more simple user pages here later */}
                                    <Route path="dashboard" element={<AnalyticsDashboard />} />
                                    <Route path="article/:id" element={<ArticleDetail />} />
                                    <Route path="vulnerabilities" element={<VulnerabilitiesPage />} />
                                    <Route path="vulnerabilities/:id" element={<VulnerabilityDetail />} />
                                    <Route path="home" element={<HomePage />} />
                                    <Route path="newsletter" element={<NewsletterPage />} />
                                    <Route path="*" element={<Navigate to="/analytics/dashboard" replace />} />
                                </Routes>
                                <Footer />
                            </AnalyticsLayout>
                        </RoleGuard>
                    }
                />

                {/* Veilleur Routes */}
                <Route
                    path="/veilleur/*"
                    element={
                        <RoleGuard allowedRoles={['veilleur']}>
                            <VeilleurLayout>
                                <Routes>
                                    <Route path="sources" element={<VeilleurSourcesPage />} />
                                    <Route path="home" element={<HomePage />} />
                                    <Route path="dashboard" element={<Dashboard />} />
                                    <Route path="article" element={<SimpleUserArticles />} />
                                    <Route path="article/:id" element={<ArticleDetail />} />
                                    <Route path="vulnerabilities" element={<VulnerabilitiesPage />} />
                                    <Route path="vulnerabilities/:id" element={<VulnerabilityDetail />} />
                                    <Route path="newsletter" element={<NewsletterPage />} />
                                    <Route path="*" element={<Navigate to="/veilleur/sources" replace />} />
                                </Routes>
                                <Footer />
                            </VeilleurLayout>
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
                                    <Route path="dashboard" element={<AnalyticsDashboard />} />
                                    <Route path="article/:id" element={<ArticleDetail />} />
                                    <Route path="vulnerabilities" element={<VulnerabilitiesPage />} />
                                    <Route path="vulnerabilities/:id" element={<VulnerabilityDetail />} />
                                    <Route path="newsletter" element={<NewsletterPage />} />
                                    <Route path="home" element={<HomePage />} />
                                    <Route path="*" element={<Navigate to="/simple_user/dashboard" replace />} />
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