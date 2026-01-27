import { useState } from 'react';
import { Play, Loader2, ArrowRight } from 'lucide-react';
import { useSources } from '@/hook/useSource';
import SourceCreateDialog from '@/components/ui/SourceCreateDialog';
import ScanningProgress from '@/components/ui/ScanningProgress';
import SourcesStatsCards from '@/components/ui/SourcesStatsCards';
import SourceCard from '@/components/ui/SourceCard';


export default function VeilleurSourcesPage() {
  const {
    sources,
    isLoading,
    createSource,
    isCreating,
    toggleSource,
    deleteSource,
    triggerVeille,
    isTriggering,
  } = useSources();

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);

    const activeCount = sources.filter((s) => s.active).length;

    const handleCreateSource = (data: { name: string; url: string; type: string; active: boolean }) => {
        createSource({
            name: data.name,
            url: data.url,
            active: data.active,
        });
    };

    const handleTrigger = () => {
        // if (!confirm('Déclencher la veille sur toutes les sources actives ? (~20 min)')) return;
        setIsScanning(true);
        setScanProgress(0);
        setEstimatedTime(20);
        triggerVeille();

        // // Simulation
        // const total = 20 * 60 * 1000;
        // const start = Date.now();
        // const iv = setInterval(() => {
        //     const elapsed = Date.now() - start;
        //     const p = Math.min((elapsed / total) * 100, 100);
        //     setScanProgress(p);
        //     setEstimatedTime(Math.ceil((total - elapsed) / 60000));
        //     if (p >= 100) {
        //         clearInterval(iv);
        //         setIsScanning(false);
        //     }
        // }, 1000);
    };

    if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-white">Chargement...</div>;
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-950 to-zinc-900 ">

            <div className="w-full px-15 py-12">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Sources de Veille</h2>
                        <p className="text-slate-400">Gérez les sources d'information pour la veille automatique</p>
                    </div>
                    <div className="flex gap-3">                    
                        <button
                            onClick={handleTrigger}
                            disabled={isTriggering || isScanning || activeCount === 0}
                            className="px-6 py-4 rounded-xl flex items-center gap-2.5 transition bg-transparent border border-neutral-800 hover:bg-neutral-800 text-neutral-400"
                        >
                            {isScanning ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Scan en cours...
                                </>
                            ) : (
                                <>
                                    <Play className="mr-2 h-8 w-4" />
                                    Déclencher la veille
                                </>
                            )}
                            <ArrowRight className="w-6 h-6 text-violet-500" />
                        </button>

                        <SourceCreateDialog onCreate={handleCreateSource} isCreating={isCreating} />
                    </div>
                </div>

                <ScanningProgress isScanning={isScanning} progress={scanProgress} estimatedTime={estimatedTime} />

                <SourcesStatsCards sources={sources} />

                <div className="grid gap-4">
                    {sources.length === 0 ? (
                        <div className="rounded-xl border border-slate-700 bg-linear-to-r from-slate-900 to-slate-800 py-16 text-center">
                            <p className="text-lg text-slate-400">Aucune source configurée</p>
                            <p className="mt-2 text-sm text-slate-500">Ajoutez votre première source pour commencer</p>
                        </div>
                    ) : (
                        sources.map((source) => (
                            <SourceCard
                                key={source.id}
                                source={source}
                                onToggle={() => toggleSource({ id: source.id, active: !source.active })}
                                onDelete={() => {
                                    if (confirm('Supprimer cette source ?')) deleteSource(source.id);
                                }}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}