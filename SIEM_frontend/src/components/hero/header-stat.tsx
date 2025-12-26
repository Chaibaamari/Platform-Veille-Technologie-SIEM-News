import React from 'react';
import { Shield, Bell, RefreshCw, LogOut } from 'lucide-react';
import type { TimeRange } from '@/types/blog';

interface HeaderProps {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  onLogout: () => void;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ timeRange, setTimeRange, onLogout, userName = 'Utilisateur' }) => {
    return (
        <header className="sticky top-0 z-50  border-b border-slate-700 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-linear-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                CIEM Veille Dashboard
                            </h1>
                            <p className="text-xs text-slate-400">Cloud Infrastructure Entitlement Management</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                            className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="7d">7 jours</option>
                            <option value="30d">30 jours</option>
                            <option value="90d">90 jours</option>
                        </select>
            
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-300">
                            <Bell className="w-5 h-5" />
                        </button>
            
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-300">
                            <RefreshCw className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-700 rounded-lg">
                            <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm text-white hidden md:block">{userName}</span>
                        </div>
            
                        <button
                            onClick={onLogout}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-300 hover:text-red-400"
                            title="Se déconnecter"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;