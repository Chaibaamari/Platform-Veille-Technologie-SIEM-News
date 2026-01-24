import type { Source } from "@/types/blog";

type Props = {
  sources: Source[];
};

export default function SourcesStatsCards({ sources }: Props) {
  const total = sources.length;
  const active = sources.filter(s => s.active).length;
  const inactive = total - active;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
                <div className="text-slate-400 text-sm font-medium">Total Sources</div>
                <div className="text-white text-3xl font-bold mt-2">{total}</div>
            </div>
            <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-xl border border-green-500/20 p-6 shadow-lg">
                <div className="text-slate-400 text-sm font-medium">Sources Actives</div>
                <div className="text-green-400 text-3xl font-bold mt-2">{active}</div>
            </div>
            <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-xl border border-red-500/20 p-6 shadow-lg">
                <div className="text-slate-400 text-sm font-medium">Sources Inactives</div>
                <div className="text-red-400 text-3xl font-bold mt-2">{inactive}</div>
            </div>
        </div>
    );
}