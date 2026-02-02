import Navbar, { type NavItem } from "../NavBar/navbar-app";

const navLinks: NavItem[] = [
    { name: 'Utilisateurs', href: '/admin/users' },
    { name: 'Articles', href: '/admin/article' },
    { name: 'Vulnérabilités', href: '/admin/vulnerabilities' },
    { name: 'Dashboard', href: '/admin/dashboard' }
];

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="min-h-screen">
            <Navbar data={navLinks} />
            <main>{children}</main>
        </div>
    );
}
