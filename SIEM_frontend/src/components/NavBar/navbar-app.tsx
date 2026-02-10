// src/components/Navbar.tsx
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react'; // Optional: for logout icon and mobile menu
import { useAppDispatch } from '@/stores/hooks';
import { logout } from '@/stores/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { memo, useState } from 'react';
import { SIEMIcon } from '@/pages/Home/home-page';

export type NavItem = {
    id?: number;
    name: string;
    href: string;
};


type Props = {
    data?: NavItem[];
};

const Navbar: React.FC<Props> = memo(({ data }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login', { replace: true });
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="w-full bg-slate-950 ">
            <nav className="mx-auto max-w-7xl px-6 py-7"> {/* Responsive container */}
                <div className="flex items-center justify-between">
                    {/* Logo / Brand */}
                    {/* <Link to="/" className="text-2xl font-semibold text-white  transition-colors">
                        News Collector
                    </Link> */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        // onClick={() => navigate('/')}
                    >
                        <div className="relative w-11 h-11 rounded-xl bg-linear-to-br from-violet-600 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-900/50 group-hover:shadow-violet-900/80 transition-all group-hover:scale-105">
                            <SIEMIcon />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-fuchsia-400 rounded-full animate-SIEM" />
                        </div>
                        <div className="hidden sm:block">
                            <div className="flex items-center gap-2">
                                <span className="text-white font-bold text-xl tracking-tight">
                                    CIEM<span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">News</span>
                                </span>
                            </div>
                        </div>
                        <span className="sm:hidden text-white font-bold text-lg">
                            CIEM
                            <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">News</span>
                        </span>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {data?.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`text-xl font-normal text-white transition-colors ${isActive(link.href)
                                    ? 'text-white font-bold'
                                    : 'underline-offset-5 hover:underline text-white font-normal'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 rounded-full bg-white px-6 py-3 text-[#090D1F] cursor-pointer"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="text-base font-medium">Déconnecter</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button (Optional - you can expand later) */}
                    <button className="md:hidden text-gray-900" onClick={() => setMobileMenuOpen(true)}>
                        <Menu className="h-7 w-7" />
                    </button>
                    {/* Mobile Navbar - Visible only on small screens */}
                    {mobileMenuOpen && (
                        <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center bg-[#090D1F]">
                            <div className="flex w-96 flex-col items-center gap-14 px-8 text-center">
                                {/* Logo / Name */}
                                <div className="text-2xl font-semibold text-white">News Collector</div>

                                {/* Navigation Links */}
                                <nav className="flex flex-col items-center gap-8">
                                    {data?.map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`text-lg font-normal transition-colors ${isActive(link.href)
                                                ? 'text-white font-medium'
                                                : 'text-gray-300 hover:text-white'
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}

                                    {/* Logout Button - Matches your design exactly */}
                                    <button
                                        onClick={handleLogout}
                                        className="mt-6 inline-flex items-center gap-4 rounded-[29px] bg-white px-6 py-3 text-[#090D1F] font-medium transition hover:bg-gray-200"
                                    >
                                        <div className="relative h-6 w-6">
                                            {/* Outer circle */}
                                            <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-slate-950 opacity-0" />
                                            {/* Inner icon layers - matching your SVG exactly */}
                                            <div className="absolute left-[1] top-[1] h-5 w-5 rounded-full bg-slate-950" />
                                            <div className="absolute left-[4.75px] top-[4.75px] h-3.5 w-3.5 rounded-full bg-white" />
                                        </div>
                                        <span>Logout</span>
                                    </button>
                                </nav>
                            </div>

                            {/* Optional: Close button in top corner */}
                            <button
                                onClick={() => navigate(-1)} // or close modal if used differently
                                className="absolute right-8 top-8 text-white/70 hover:text-white"
                            >
                                <X className="h-8 w-8" />
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
});

export default Navbar;