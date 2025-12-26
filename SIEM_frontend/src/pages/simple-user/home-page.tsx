import Hero from '@/components/hero/hero-app';
import FeatureSection from '@/components/ui/feature-section';
import ResourcesSection from '@/components/ui/resouce-section';
import BlogSection from '@/components/ui/blog-section';
import Testimonials from '@/components/ui/testiminilas';
import CommunitySection from '@/components/ui/community-section';


export default function HomePage() {
    return (
        <div className="bg-slate-950 min-h-screen">
            <Hero />
            <FeatureSection />
            <ResourcesSection />
            <BlogSection />
            <Testimonials />
            <CommunitySection />
        </div>
    );
}