/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useMutation } from '@tanstack/react-query';
import { loginSuccess, setLoading } from '@/stores/slices/authSlice';
import { getDashboardPathForRole, normalizeRole } from '@/lib/auth-utils';
import { authApi } from '@/api/auth';
import { Lock, Mail, Shield } from 'lucide-react';

// const sanitizeRedirectPath = (path?: string | null) => {
//     if (!path) return null;
//     if (path === '/unauthorized' || path === '/login' || path === '/') {
//         return null;
//     }
//     return path;
// };

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const { isAuthenticated, role , isLoading:loading } = useAppSelector((state) => state.auth);

    const loginMutation = useMutation({
        
        mutationFn: authApi.login,
        onMutate: () => {
            dispatch(setLoading(true));
            setError('');
        },
        onSuccess: async (data) => {
            // Store token first so the next API call can use it
            localStorage.setItem('auth_token', data.token);
            // Get user permissions after successful login
            // try {
            //     const fallbackPath = sanitizeRedirectPath(localStorage.getItem('post_login_redirect'));

            //     const userRole = normalizeRole(data.user.roles[0]?.name) || '';
            //     const dashboardPath = getDashboardPathForRole(userRole);
            //     const statePath = sanitizeRedirectPath(location.state?.from?.pathname);

            //     dispatch(loginSuccess({
            //         token: data.token,
            //         user: {
            //             id: data.user.id,
            //             name: data.user.name,
            //             email: data.user.email,
            //         },
            //         role: userRole,
            //     }));
        
            //     // Navigate to role-based dashboard
            //     const from = fallbackPath || statePath || dashboardPath || '/';
            //     localStorage.removeItem('post_login_redirect');
            //     navigate(from, { replace: true });
            // } catch (err) {
            //     console.error('Failed to fetch permissions:', err);
        
            //     // Even if permissions fail, we can still log in with basic info
            //     const fallbackPath = sanitizeRedirectPath(localStorage.getItem('post_login_redirect'));
            //     const userRole = normalizeRole(data.user.roles[0]?.name) || '';
            //     const dashboardPath = getDashboardPathForRole(userRole);
            //     const statePath = sanitizeRedirectPath(location.state?.from?.pathname);

            //     dispatch(loginSuccess({
            //         token: data.token,
            //         user: {
            //             id: data.user.id,
            //             name: data.user.name,
            //             email: data.user.email,
            //         },
            //         role: userRole,
            //     }));
        
            //     // Navigate to role-based dashboard
            //     const from = fallbackPath || statePath || dashboardPath || '/';
            //     localStorage.removeItem('post_login_redirect');
            //     navigate(from, { replace: true });
        
            //     // Show a warning but don't prevent login
            //     console.warn('Permissions could not be loaded, continuing with basic access');
            // }
            const userRoleRaw = data.user.roles[0]?.name || '';
            const userRole = normalizeRole(userRoleRaw) || '';
            // const dashboardPath = getDashboardPathForRole(userRole);

            // const fallbackPath = sanitizeRedirectPath(localStorage.getItem('post_login_redirect'));
            // const statePath = sanitizeRedirectPath(location.state?.from?.pathname);
            // const redirectTo = fallbackPath || statePath || dashboardPath || '/';

  // Dispatch the login success
            dispatch(loginSuccess({
                token: data.token,
                user: {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                },
                role: userRole,
            }));

            localStorage.removeItem('post_login_redirect');

  // THIS IS THE KEY FIX: Wait one tick before navigating
            // setTimeout(() => {
            //     navigate(redirectTo, { replace: true });
            // }, 100); // 100ms is enough — no flash, smooth
            return navigate(`${role}/`, { replace: true });
        },
        onError: (error: any) => {
            dispatch(setLoading(false));
            setError(error.message || 'Login failed');
        },
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        loginMutation.mutate({ email, password });
    };

  // Redirect if already authenticated
    if (isAuthenticated && role) {
    const normalizedRole = normalizeRole(role);
    const dashboardPath = getDashboardPathForRole(normalizedRole);
    const targetPath = location.state?.from?.pathname || dashboardPath;

    if (targetPath && targetPath !== location.pathname) {
        return <Navigate to={targetPath} replace />;
    }
    };

    return (
        // <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 p-8">
                {/* <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to News Collector System
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your credentials to access your dashboard
                    </p>
                </div> */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl mb-4">
                        <Shield className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        CIEM Veille Dashboard
                    </h1>
                    <p className="text-slate-400">
                        Cloud Infrastructure Entitlement Management
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                Email address
                            </label>
                            <div className='relative'>
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className='relative'>
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        {/* <Button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            Sign in
                        </Button> */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Connexion...
                                </span>
                            ) : (
                                'Se connecter'
                            )}
                        </button>
                    </div>
                </form>

                <div className='className="mt-8 text-center text-sm text-slate-500'>
                    "email": "user@example.com","email": "analytics@example.com",
                    "password": "password123",
                </div>
                <div className="mt-8 text-center text-sm text-slate-500">
                    <p>© 2025 CIEM Veille Dashboard. Tous droits réservés.</p>
                </div>
            </div>
        </div>
    );
}
