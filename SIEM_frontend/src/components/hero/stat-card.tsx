interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  change: string;
  gradient: string;
};

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, gradient }) => {
    return (
        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold mb-2 text-white">{value.toLocaleString()}</h3>
                    <div className="flex items-center gap-1">
                        <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {change}
                        </span>
                        <span className="text-xs text-slate-500">vs mois dernier</span>
                    </div>
                </div>
                <div className={`bg-linear-to-br ${gradient} p-3 rounded-xl text-white`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;