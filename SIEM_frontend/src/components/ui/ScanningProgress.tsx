import { Loader2, Clock } from 'lucide-react';

type Props = {
  isScanning: boolean;
  progress: number;
  estimatedTime: number;
};

export default function ScanningProgress({ isScanning, progress, estimatedTime }: Props) {
  if (!isScanning) return null;

    return (
        <div className="mb-8 bg-linear-to-r from-slate-900 to-slate-800 rounded-xl border border-violet-500/30 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                    <div>
                        <h3 className="text-white font-semibold text-lg">Veille en cours...</h3>
                        <p className="text-slate-400 text-sm">Analyse des sources actives</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
                    <Clock className="w-4 h-4 text-violet-400" />
                    <span className="text-white font-medium">{estimatedTime} min restantes</span>
                </div>
            </div>

            <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-linear-to-r from-violet-500 to-purple-500 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="mt-2 text-right text-sm text-slate-400">{Math.round(progress)}% complété</div>
        </div>
    );
}