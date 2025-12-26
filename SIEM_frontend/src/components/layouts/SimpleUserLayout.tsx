import Navbar, { type NavItem } from "../NavBar/navbar-app";


const navLinks : NavItem[] = [
    { name: 'Home', href: '/simple_user/home' },
    { name: 'Article', href: '/simple_user/article' },
    { name: 'Vulnerabilities', href: '/simple_user/vulnerabilities' },
    { name: 'Dashbored', href: '/simple_user/dashbored' },
    { name: 'Newsletter', href: '/simple_user/newsletter' },
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