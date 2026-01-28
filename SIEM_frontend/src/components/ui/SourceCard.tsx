import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2, CheckCircle, XCircle } from 'lucide-react';
import type { Source } from '@/types/blog';

type Props = {
  source: Source;
  onToggle: () => void;
  onDelete: () => void;
};

export default function SourceCard({ source, onToggle, onDelete }: Props) {
    return (
        <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-xl border border-slate-700 p-6 hover:border-violet-500/50 transition-all duration-300 shadow-lg hover:shadow-violet-500/10">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold text-lg">{source.nom_source}</h3>
                        {source.active ? (
                            <span className="flex items-center gap-1.5 text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Active</span>
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30">
                                <XCircle className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Inactive</span>
                            </span>
                        )}
                    </div>

                    <p className="text-slate-400 text-sm mb-3 truncate max-w-2xl" title={source.flux_rss}>
                        {source.flux_rss}
                    </p>

                </div>

                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggle}
                        className={source.active ? 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10' : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'}
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}