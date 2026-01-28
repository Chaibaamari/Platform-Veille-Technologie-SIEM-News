import Dashboard from "@/components/dashbored/dashboard-app";
import BlogHero from "@/components/hero/BlogHero";

const DashboardUSER: React.FC = () => {


    return (
        <div className="h-full w-full ">
            <BlogHero title="VIELLE"/>
            <Dashboard/>
        </div>
    );
};

export default DashboardUSER;