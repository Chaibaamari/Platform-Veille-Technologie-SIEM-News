import Navbar from "../NavBar/navbar-app";


interface AnalyticsLayoutProps {
    children: React.ReactNode;
}
export default function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Your sidebar, navbar, etc. */}
            <Navbar />
            <main className="p-6">
                {children}
            </main>
        </div>
    );
}