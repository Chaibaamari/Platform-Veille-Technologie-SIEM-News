import React, { useState} from 'react';
import { AreaChart, Area, BarChart, Bar,  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, Database, Search, Download, Filter, FileText, Shield } from 'lucide-react';
import { COLORS, type FilterSeverity, type SeverityData, type Vulnerability } from '@/types/blog';
import StatCard from '@/components/hero/stat-card';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

interface Article {
    id_article: number,
    titre_article: string,
    categories_noms: string[],
    date_publication: string,
    description_article: string,
    source: string
}

const Dashboard: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>('all');

    // useQeury to fetch dashboard data
    const { data } = useQuery({
        queryKey: ["stats/"],
        queryFn: apiClient,
        staleTime: 5000
    });

    console.log(data)


    // Données simulées basées sur la nouvelle BDD
    const stats = data
    const trendsData = data?.trendsData

    const severityData = data?.severityData

    // Articles simulés
    const articlesData = data?.recentArticlesData;

    // Vulnérabilités simulées
    const vulnerabilitiesData = data?.recentVulnerabilitiesData

    const getSeverityColor = (severity: string): string => {
        const colors: Record<string, string> = {
            critical: COLORS.danger,
            high: COLORS.warning,
            medium: COLORS.info,
            low: COLORS.success
        };
        return colors[severity.toLowerCase()] || COLORS.primary;
    };

    function truncate(text: string, maxLength: number) {
        if (!text) return "";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    }

    return (
        <div className=" mx-auto px-6 py-8 bg-zinc-900">
            {/* Stats Cards */}
            {
                stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={<FileText className="w-6 h-6" />}
                            title="Total Articles"
                            value={stats?.totalArticles || 0}
                            change="+12.5%"
                            gradient="from-indigo-500 to-indigo-600"
                        />
                        <StatCard
                            icon={<Database className="w-6 h-6" />}
                            title="Articles Récents (7j)"
                            value={stats?.recentArticles || 0}
                            change="+8"
                            gradient="from-green-500 to-green-600"
                        />
                        <StatCard
                            icon={<Shield className="w-6 h-6" />}
                            title="Total Vulnérabilités"
                            value={stats?.totalVulnerabilities || 0}
                            change="-5"
                            gradient="from-orange-500 to-orange-600"
                        />
                        <StatCard
                            icon={<AlertTriangle className="w-6 h-6" />}
                            title="Vulnérabilités Critiques"
                            value={stats?.criticalVulnerabilities || 0}
                            change="+4"
                            gradient="from-red-500 to-red-600"
                        />
                    </div>
                )
            }

            {/* Search and Filters */}
            <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher des articles ou CVE..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
          
                    <div className="flex gap-3">
                        <select
                            value={filterSeverity}
                            onChange={(e) => setFilterSeverity(e.target.value as FilterSeverity)}
                            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="all">Toutes sévérités</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>

                        <button className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Trends Chart */}
                <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                        Tendances Articles & Vulnérabilités
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={trendsData}>
                            <defs>
                                <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorVulnerabilities" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="date" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                    color: '#e2e8f0'
                                }}
                            />
                            <Legend />
                            <Area type="monotone" dataKey="articles" stroke="#6366f1" fill="url(#colorArticles)" strokeWidth={2} />
                            <Area type="monotone" dataKey="vulnerabilities" stroke="#ef4444" fill="url(#colorVulnerabilities)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                        <Filter className="w-5 h-5 text-indigo-500" />
                        Distribution par Catégorie
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats?.categoriesRepartition || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="category" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                    color: '#e2e8f0'
                                }}
                            />
                            <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Articles */}
                <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        Articles Récents
                    </h3>
                    <div className="space-y-3">
                        {articlesData?.map((article: Article) => (
                            <div
                                key={article.id_article}
                                className="border border-slate-700 rounded-lg p-4 hover:border-indigo-700 transition-all hover:shadow-md cursor-pointer"
                            >
                                <h4 className="font-medium mb-2 text-white">{article.titre_article}</h4>
                                <p className="text-sm text-slate-400 mb-2">{truncate(article.description_article, 100)}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {article.categories_noms.map((cat, idx) => (
                                        <span key={idx} className="px-2 py-0.5 bg-indigo-900/30 text-indigo-300 text-xs rounded border border-indigo-700">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 mt-2">{article.source} • {article.date_publication}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Vulnerabilities */}
                <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Vulnérabilités Récentes
                    </h3>
                    <div className="space-y-3">
                        {vulnerabilitiesData?.map((vuln: Vulnerability) => (
                            <div key={vuln.cve_id} className="border-l-4 border-red-500 pl-4 py-2 bg-slate-900/50 rounded-r pr-2">
                                <div className="flex items-start justify-between mb-1">
                                    <span className="font-mono text-sm font-semibold text-white">{vuln.cve_id}</span>
                                    <span className="px-2 py-1 bg-red-900/30 text-red-300 rounded text-xs font-bold border border-red-700">
                                        {vuln.score_cvss}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mb-2">{truncate(vuln.description_vuln, 100)}</p>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="px-2 py-0.5 rounded text-white font-medium"
                                            style={{ backgroundColor: getSeverityColor(vuln.severite) }}
                                        >
                                            {vuln.severite}
                                        </span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {
                                                vuln.types_vuln.map((type_vul, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded">
                                                        {truncate(type_vul.type_vul, 30)}
                                                    </span>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <span className="text-slate-500">{vuln.date_publication}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Severity Distribution */}
            <div className="mt-6 bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                    <Shield className="w-5 h-5 text-indigo-500" />
                    Distribution des Sévérités
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {severityData?.map((item: SeverityData) => (
                        <div key={item.severity} className="bg-slate-900/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-white">{item.severity}</span>
                                <span className="text-2xl font-bold text-white">{item.count}</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${(item.count / data.totalVulnerabilities) * 100}%`,
                                        backgroundColor: item.color
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;