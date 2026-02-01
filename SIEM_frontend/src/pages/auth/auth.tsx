/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { useMutation } from '@tanstack/react-query';
import { loginSuccess, setLoading } from '@/stores/slices/authSlice';
import { getDashboardPathForRole, normalizeRole } from '@/lib/auth-utils';
import { authApi } from '@/api/auth';
import { Lock, Mail, Shield, Eye, EyeOff } from 'lucide-react';


// Icône PulseNews
const PulseIcon = ({ className }: { className?: string }) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path 
            d="M3 12H7L9 6L11 18L13 9L15 12H21" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
);
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const dispatch = useAppDispatch();
    const { isAuthenticated, role, isLoading: loading } = useAppSelector((state) => state.auth);

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onMutate: () => {
            dispatch(setLoading(true));
            setError('');
        },
        onSuccess: async (data) => {
            localStorage.setItem('auth_token', data.tokens['access']);
            
            const userRoleRaw = data.user['role_utilisateur'] || '';
            const userRole = normalizeRole(userRoleRaw) || '';

            dispatch(loginSuccess({
                token: data.tokens['access'],
                user: {
                    id: data.user.id_utilisateur,
                    name: data.user.nom_utilisateur,
                    email: data.user.email_utilisateur,
                },
                role: userRole,
            }));

            localStorage.removeItem('post_login_redirect');
            return navigate(`${role}/`, { replace: true });
        },
        onError: (error: any) => {
            dispatch(setLoading(false));
            setError(error.message || 'Échec de la connexion');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Veuillez remplir tous les champs');
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
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex">
            {/* Left Side - Hero Image Section */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* linear Overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-indigo-600/20 to-purple-600/20 z-10"></div>
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-linear(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                {/* Main Image */}
                <div className="relative z-20 w-full h-full flex items-center justify-center p-12">
                    <div className="max-w-2xl">
                        {/* You can replace this with an actual image */}
                        <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl p-1 shadow-2xl">
                            <div className="bg-slate-900/90 rounded-3xl p-8">
                                <div className="space-y-6">
                                    {/* Icon/Logo Area */}
                                    <div className="flex items-center justify-center">
                                        <div className="bg-linear-to-br from-violet-600 to-fuchsia-600 p-6 rounded-2xl relative">
                                            <PulseIcon className="w-16 h-16 text-white" />
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-fuchsia-400 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Title */}
                                    <h2 className="text-4xl font-bold text-white text-center">
                                        Veille Stratégique SIEM
                                    </h2>
                                    
                                    {/* Description */}
                                    <p className="text-slate-300 text-center text-lg leading-relaxed">
                                        Système Intelligent d'Exploitation et de Surveillance Médiatique
                                    </p>
                                    
                                    {/* Features */}
                                    <div className="space-y-4 pt-6">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-indigo-500/20 p-2 rounded-lg mt-1">
                                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">Surveillance en temps réel</h3>
                                                <p className="text-slate-400 text-sm">Collecte et analyse automatique des actualités</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <div className="bg-purple-500/20 p-2 rounded-lg mt-1">
                                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">Analyse intelligente</h3>
                                                <p className="text-slate-400 text-sm">Traitement avancé des informations médiatiques</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <div className="bg-indigo-500/20 p-2 rounded-lg mt-1">
                                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">Sécurité renforcée</h3>
                                                <p className="text-slate-400 text-sm">Protection des données et accès contrôlé</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl mb-4">
                            <Shield className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            CIEM Veille Dashboard
                        </h1>
                        <p className="text-slate-400 text-sm sm:text-base">
                            Système de Veille Médiatique
                        </p>
                    </div>

                    {/* Desktop Logo */}
                    <div className="hidden lg:block text-center">
                        <div className="inline-flex items-center justify-center bg-linear-to-br from-violet-600 to-fuchsia-600 p-4 rounded-2xl mb-4 relative">
                            <PulseIcon className="w-12 h-12 text-white" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-fuchsia-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    {/* Login Form */}
                    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                        Adresse email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                            placeholder="exemple@ciem.dz"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                        Mot de passe
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="space-y-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-indigo-500/30"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Connexion en cours...
                                        </span>
                                    ) : (
                                        'Se connecter'
                                    )}
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/forgot-password')}
                                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                                    >
                                        Mot de passe oublié ?
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm text-slate-500">
                        <p>© 2025 CIEM Veille Dashboard. Tous droits réservés.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}