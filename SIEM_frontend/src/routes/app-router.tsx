// src/routes/AppRoutes.tsx (or wherever you keep your routes)

import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAppSelector } from '@/stores/hooks';
import { LoadingSpinner } from '@/components/Error/loading-spinner';
import { getDashboardPathForRole, normalizeRole } from '@/lib/auth-utils';
import Footer from '@/components/Footer/app-footer';
import NotFound from '@/pages/404/NotFound';

// Lazy load components for code splitting
const Login = lazy(() => import('@/pages/auth/auth'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));

// Admin routes
const AdminLayout = lazy(() => import('@/components/layouts/AdminLayout'));
const AdminUsersPage = lazy(() => import('@/pages/admin/users-page'));

// Veilleur routes
const VeilleurLayout = lazy(() => import('@/components/layouts/VeilleurLayout'));
const VeilleurSourcesPage = lazy(() => import('@/pages/veilleur/source-page'));

// Analytics routes
const AnalysteLayout = lazy(() => import('@/components/layouts/AnalysteLayout'));

// Simple User routes
const Dashboard = lazy(() => import('@/pages/simple-user/dashboard'));
const SimpleUserLayout = lazy(() => import('@/components/layouts/SimpleUserLayout'));
const SimpleUserArticles = lazy(() => import('@/pages/simple-user/Article/article'));
const ArticleDetail = lazy(() => import('@/pages/simple-user/Article/article-details'));
const VulnerabilitiesPage = lazy(() => import('@/pages/simple-user/Vulnerability/vulnerabilities-page'));
const VulnerabilityDetail = lazy(() => import('@/pages/simple-user/Vulnerability/vulnerability-detail'));
const HomePage = lazy(() => import('@/pages/Home/home-page'));
const FavoritesPage = lazy(() => import('@/pages/simple-user/favorites'));

// Default dashboard redirect based on role
const DashboardRedirect = () => {
    const { role } = useAppSelector((state) => state.auth);

    if (!role) {
        return <Navigate to="/home" replace />;
    }

    const normalizedRole = normalizeRole(role);
    const targetRoute = getDashboardPathForRole(normalizedRole);

    if (!targetRoute) {
        return <Navigate to="/home" replace />;
    }

    return <Navigate to={targetRoute} replace />;
};


export default function AppRoutes() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                {/* Public routes */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* <Route path="/unauthorized" element={<NotFound />} /> */}

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
                                    <Route path="dashboard" element={<Dashboard />} />
                                    <Route path="article" element={<SimpleUserArticles />} />
                                    <Route path="article/:id" element={<ArticleDetail />} />
                                    <Route path="vulnerabilities" element={<VulnerabilitiesPage />} />
                                    <Route path="vulnerabilities/:id" element={<VulnerabilityDetail />} />
                                    <Route path="favoris" element={<FavoritesPage />} />
                                    <Route path="*" element={<NotFound />}  />
                                </Routes>
                                <Footer />
                            </AdminLayout>
                        </RoleGuard>
                    }
                /> 
                {/* Analytics Routes */}
                <Route
                    path="/analyste/*"
                    element={
                        <RoleGuard allowedRoles={['analyste']}>
                            <AnalysteLayout>
                                <Routes>
                                    <Route path="dashboard" element={<Dashboard />} />
                                    <Route path="article" element={<SimpleUserArticles />} />
                                    <Route path="dashboard" element={<Dashboard />} />
                                    <Route path="article/:id" element={<ArticleDetail />} />
                                    <Route path="vulnerabilities" element={<VulnerabilitiesPage />} />
                                    <Route path="vulnerabilities/:id" element={<VulnerabilityDetail />} />
                                    <Route path="favoris" element={<FavoritesPage />} />
                                    <Route path="*" element={<NotFound />}  />
                                </Routes>
                                <Footer />
                            </AnalysteLayout>
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
                                    <Route path="dashboard" element={<Dashboard />} />
                                    <Route path="article" element={<SimpleUserArticles />} />
                                    <Route path="article/:id" element={<ArticleDetail />} />
                                    <Route path="vulnerabilities" element={<VulnerabilitiesPage />} />
                                    <Route path="vulnerabilities/:id" element={<VulnerabilityDetail />} />
                                    <Route path="sources" element={<VeilleurSourcesPage />} />
                                    <Route path="favoris" element={<FavoritesPage />} />
                                    <Route path="*" element={<NotFound />}  />
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
                                    <Route path="dashboard" element={<Dashboard />} />
                                    <Route path="article/:id" element={<ArticleDetail />} />
                                    <Route path="vulnerabilities" element={<VulnerabilitiesPage />} />
                                    <Route path="vulnerabilities/:id" element={<VulnerabilityDetail />} />
                                    <Route path="favoris" element={<FavoritesPage />} />
                                    <Route path="*" element={<NotFound />}  />
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