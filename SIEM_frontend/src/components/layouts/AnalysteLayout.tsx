import Navbar, { type NavItem } from "../NavBar/navbar-app";

const navLinks : NavItem[] = [
    { name: 'Articles', href: '/analyste/article' },
    { name: 'Dashboard', href: '/analyste/dashboard' },
    { name: 'Vulnerabilités', href: '/analyste/vulnerabilities' },
    { name: 'Favoris', href: '/analyste/favoris' },
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