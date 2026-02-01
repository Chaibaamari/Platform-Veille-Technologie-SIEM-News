import Navbar, { type NavItem } from "../NavBar/navbar-app";


const navLinks : NavItem[] = [
    { name: 'Dashbored', href: '/simple_user/dashbored' },
    { name: 'Article', href: '/simple_user/article' },
    { name: 'Vulnerabilities', href: '/simple_user/vulnerabilities' },
    { name: 'Favoris', href: '/simple_user/favoris' },
];
// src/components/layouts/SimpleUserLayout.tsx
interface SimpleUserLayoutProps {
    children: React.ReactNode;
}
export default function SimpleUserLayout({ children }: SimpleUserLayoutProps) {
    return (
        <div className="w-full min-h-screen">
            <Navbar data={navLinks}/>
            <main>
                {children}
            </main>
        </div>
    );
}