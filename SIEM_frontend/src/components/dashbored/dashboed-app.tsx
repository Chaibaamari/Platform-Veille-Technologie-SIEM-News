import React, { useState} from 'react';
import { AreaChart, Area, BarChart, Bar,  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, Database, Search, Download, Filter, FileText, Shield } from 'lucide-react';
import { COLORS,  type Article2, type CategoryData, type FilterSeverity, type SeverityData, type Stats, type TrendData, type Vulnerability2 } from '@/types/blog';
import StatCard from '@/components/hero/stat-card';

const Dashboard: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>('all');

    // Données simulées basées sur la nouvelle BDD
    const stats: Stats = {
        totalArticles: 1247,
        criticalVulnerabilities: 23,
        recentArticles: 45,
        totalVulnerabilities: 324
    };

    const trendsData: TrendData[] = [
        { date: '01 Dec', articles: 45, vulnerabilities: 12 },
        { date: '05 Dec', articles: 52, vulnerabilities: 15 },
        { date: '10 Dec', articles: 48, vulnerabilities: 18 },
        { date: '15 Dec', articles: 65, vulnerabilities: 21 },
        { date: '20 Dec', articles: 58, vulnerabilities: 17 },
    ];

    const severityData: SeverityData[] = [
        { severity: 'Critical', count: 23, color: COLORS.danger },
        { severity: 'High', count: 67, color: COLORS.warning },
        { severity: 'Medium', count: 145, color: COLORS.info },
        { severity: 'Low', count: 89, color: COLORS.success }
    ];

    const categoryData: CategoryData[] = [
        { category: 'Security', count: 324 },
        { category: 'Cloud', count: 256 },
        { category: 'IAM', count: 198 },
        { category: 'Compliance', count: 167 },
        { category: 'Best Practices', count: 302 }
    ];

    // Articles simulés
    const articlesData: Article2[] = [
        {
            id: 1,
            title: 'AWS IAM Identity Center – New Permission Model',
            link: 'https://example.com/article1',
            description: 'Latest updates to AWS IAM permission management',
            content: 'Full article content...',
            summary: 'AWS introduces new permission model for enhanced security',
            publication_date: '2025-12-20',
            categories: ['AWS', 'Security', 'IAM'],
            source: 'AWS Security Blog'
        },
        {
            id: 2,
            title: 'Zero Trust Architecture Implementation Guide',
            link: 'https://example.com/article2',
            description: 'Comprehensive guide to implementing Zero Trust',
            content: 'Full article content...',
            summary: 'Step-by-step guide for Zero Trust implementation',
            publication_date: '2025-12-19',
            categories: ['Security', 'Zero Trust', 'Best Practices'],
            source: 'Cloud Security Alliance'
        },
        {
            id: 3,
            title: 'GCP IAM Best Practices 2025',
            link: 'https://example.com/article3',
            description: 'Latest best practices for GCP IAM',
            content: 'Full article content...',
            summary: 'Updated GCP IAM security recommendations',
            publication_date: '2025-12-18',
            categories: ['GCP', 'IAM', 'Best Practices'],
            source: 'Google Cloud Blog'
        }
    ];

    // Vulnérabilités simulées
    const vulnerabilitiesData: Vulnerability2[] = [
        {
            id: 1,
            cve_id: 'CVE-2025-1234',
            severity: 'critical',
            published_date: '2025-12-19',
            description: 'Privilege escalation in AWS IAM service',
            cvss_score: 9.8,
            source: 'NVD',
            type: 'Privilege Escalation'
        },
        {
            id: 2,
            cve_id: 'CVE-2025-5678',
            severity: 'high',
            published_date: '2025-12-18',
            description: 'Azure AD authentication bypass vulnerability',
            cvss_score: 8.6,
            source: 'MITRE',
            type: 'Authentication Bypass'
        },
        {
            id: 3,
            cve_id: 'CVE-2025-9012',
            severity: 'high',
            published_date: '2025-12-17',
            description: 'GCP Service Account token exposure',
            cvss_score: 7.5,
            source: 'NVD',
            type: 'Information Disclosure'
        }
    ];

    const filteredVulnerabilities = vulnerabilitiesData.filter(v => {
        const matchSearch =
            v.cve_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchSeverity =
            filterSeverity === 'all' || v.severity === filterSeverity;

        return matchSearch && matchSeverity;
    });

    const getSeverityColor = (severity: string): string => {
        const colors: Record<string, string> = {
            critical: COLORS.danger,
            high: COLORS.warning,
            medium: COLORS.info,
            low: COLORS.success
        };
        return colors[severity.toLowerCase()] || COLORS.primary;
    };

    return (
        <div className=" mx-auto px-6 py-8 bg-zinc-900">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={<FileText className="w-6 h-6" />}
                    title="Total Articles"
                    value={stats.totalArticles}
                    change="+12.5%"
                    gradient="from-indigo-500 to-indigo-600"
                />
                <StatCard
                    icon={<AlertTriangle className="w-6 h-6" />}
                    title="Vulnérabilités Critiques"
                    value={stats.criticalVulnerabilities}
                    change="+4"
                    gradient="from-red-500 to-red-600"
                />
                <StatCard
                    icon={<Database className="w-6 h-6" />}
                    title="Articles Récents (7j)"
                    value={stats.recentArticles}
                    change="+8"
                    gradient="from-green-500 to-green-600"
                />
                <StatCard
                    icon={<Shield className="w-6 h-6" />}
                    title="Total Vulnérabilités"
                    value={stats.totalVulnerabilities}
                    change="-5"
                    gradient="from-orange-500 to-orange-600"
                />
            </div>

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
                        <BarChart data={categoryData}>
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
                        {articlesData.map((article) => (
                            <div
                                key={article.id}
                                className="border border-slate-700 rounded-lg p-4 hover:border-indigo-700 transition-all hover:shadow-md cursor-pointer"
                            >
                                <h4 className="font-medium mb-2 text-white">{article.title}</h4>
                                <p className="text-sm text-slate-400 mb-2">{article.summary}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {article.categories.map((cat, idx) => (
                                        <span key={idx} className="px-2 py-0.5 bg-indigo-900/30 text-indigo-300 text-xs rounded border border-indigo-700">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 mt-2">{article.source} • {article.publication_date}</p>
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
                        {filteredVulnerabilities.map((vuln) => (
                            <div key={vuln.id} className="border-l-4 border-red-500 pl-4 py-2 bg-slate-900/50 rounded-r">
                                <div className="flex items-start justify-between mb-1">
                                    <span className="font-mono text-sm font-semibold text-white">{vuln.cve_id}</span>
                                    <span className="px-2 py-1 bg-red-900/30 text-red-300 rounded text-xs font-bold border border-red-700">
                                        {vuln.cvss_score}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mb-2">{vuln.description}</p>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="px-2 py-0.5 rounded text-white font-medium"
                                            style={{ backgroundColor: getSeverityColor(vuln.severity) }}
                                        >
                                            {vuln.severity}
                                        </span>
                                        <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded">
                                            {vuln.type}
                                        </span>
                                    </div>
                                    <span className="text-slate-500">{vuln.source} • {vuln.published_date}</span>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {severityData.map((item) => (
                        <div key={item.severity} className="bg-slate-900/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-white">{item.severity}</span>
                                <span className="text-2xl font-bold text-white">{item.count}</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${(item.count / 324) * 100}%`,
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