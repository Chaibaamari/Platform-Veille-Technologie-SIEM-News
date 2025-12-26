import Navbar, { type NavItem } from "../NavBar/navbar-app";

const navLinks : NavItem[] = [
    { name: 'Home', href: '/analytics/home' },
    { name: 'Article', href: '/analytics/article' },
    { name: 'Vulnerabilities', href: '/analytics/vulnerabilities' },
    { name: 'Dashbored', href: '/analytics/dashbored' },
    { name: 'Newsletter', href: '/analytics/newsletter' },
];
interface AnalyticsLayoutProps {
    children: React.ReactNode;
}
export default function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
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