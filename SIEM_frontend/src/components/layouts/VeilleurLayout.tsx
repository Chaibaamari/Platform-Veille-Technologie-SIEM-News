// VeilleurLayout.tsx
import Navbar, { type NavItem } from "../NavBar/navbar-app";

const navLinks: NavItem[] = [
    { name: 'Sources', href: '/veilleur/sources' },
    { name: 'Articles', href: '/veilleur/article' },
    { name: 'Vulnérabilités', href: '/veilleur/vulnerabilities' },
    { name: 'Favoris', href: '/veilleur/favoris' },
    { name: 'Dashboard', href: '/veilleur/dashboard' },
];

interface VeilleurLayoutProps {
    children: React.ReactNode;
}

export default function VeilleurLayout({ children }: VeilleurLayoutProps) {
    return (
        <div className="min-h-screen">
            <Navbar data={navLinks} />
            <main>{children}</main>
        </div>
    );
}