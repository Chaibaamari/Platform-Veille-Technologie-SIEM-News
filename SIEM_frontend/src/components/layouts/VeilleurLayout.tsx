// VeilleurLayout.tsx
import Navbar, { type NavItem } from "../NavBar/navbar-app";

const navLinks: NavItem[] = [
    { name: 'Dashboard', href: '/veilleur/dashboard' },
    { name: 'Articles', href: '/veilleur/article' },
    { name: 'Vulnérabilités', href: '/veilleur/vulnerabilities' },
    { name: 'Sources', href: '/veilleur/sources' },
    { name: 'Newsletter', href: '/veilleur/newsletter' },
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