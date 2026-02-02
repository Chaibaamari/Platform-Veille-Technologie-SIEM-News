import Navbar, { type NavItem } from "../NavBar/navbar-app";

const navLinks : NavItem[] = [
    { name: 'Articles', href: '/analyste/article' },
    { name: 'Vulnerabilités', href: '/analyste/vulnerabilities' },
    { name: 'Favoris', href: '/analyste/favoris' },
    { name: 'Dashboard', href: '/analyste/dashboard' },
];
interface AnalysteLayoutProps {
    children: React.ReactNode;
}
export default function AnalyticsLayout({ children }: AnalysteLayoutProps) {
    return (
        <div className="min-h-screen">
            {/* Your sidebar, navbar, etc. */}
            <Navbar data={navLinks}/>
            <main>
                {children}
            </main>
        </div>
    );
}