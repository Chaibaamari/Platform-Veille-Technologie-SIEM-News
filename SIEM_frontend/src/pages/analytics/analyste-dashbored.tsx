import Dashboard from "@/components/dashbored/dashboed-app";
import BlogHero from "@/components/hero/BlogHero";

const DashboardUSER: React.FC = () => {

    // useQeury to fetch dashboard data can be added here

    return (
        <div className="h-full w-full ">
            <BlogHero/>
            <Dashboard />
        </div>
    );
};

export default DashboardUSER;