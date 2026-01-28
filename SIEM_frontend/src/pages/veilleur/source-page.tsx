import { useState } from 'react';
import { Play, Loader2, ArrowRight } from 'lucide-react';
import { useSources } from '@/hook/useSource';
import SourceCreateDialog from '@/components/ui/SourceCreateDialog';
import ScanningProgress from '@/components/ui/ScanningProgress';
import SourcesStatsCards from '@/components/ui/SourcesStatsCards';
import SourceCard from '@/components/ui/SourceCard';
import type { Source } from '@/types/blog';
import { apiClient } from '@/api/client';

type Progress = {
    percentage: number,
    message: string,
    is_running: boolean,
    step: string
}

export default function VeilleurSourcesPage() {
  const {
    sourcesData,
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
    const [scanningPhase, setScanningPhase] = useState<string>('');
    const [scanningMessage, setscanningMessage] = useState<string>('')

    const sources = sourcesData?.sources || []
    const activeCount = sources.filter((s: Source) => s.active).length;

    const [statusMessage, setStatusMessage] = useState<{
        type: 'success' | 'error' | null;
        text: string;
    }>({ type: null, text: '' });

    const clearStatusMessage = () =>setStatusMessage({ type: null, text: '' });

    const handleCreateSource = (data: { name: string; url: string; type: string; active: boolean }) => {
        createSource({
            nom_source: data.name,
            flux_rss: data.url,
            active: data.active,
        });
    };

    const handleTrigger = async () => {
        setIsScanning(true);
        setScanProgress(0);
        setScanningPhase("Starting...");
        
        await triggerVeille();

        const intervalId = setInterval(async () => {
        try {
            const progress: Progress = await apiClient({
                queryKey: ['veille/progress'],
            });

            setScanProgress(progress.percentage);
            setScanningPhase(progress.step);
            setIsScanning(progress.is_running);
            setscanningMessage(progress.message)

            console.log(progress)

            if (!progress.is_running) {
                clearInterval(intervalId);
                setStatusMessage({
                    type: 'success',
                    text: 'La veille s’est terminée avec succès',
                });
            }
            } catch (err) {
                console.error("Progress polling failed", err);
                clearInterval(intervalId);
                setIsScanning(false);

                setStatusMessage({
                    type: 'error',
                    text: "Une erreur est survenue pendant la veille",
                });
            }
        }, 4000);
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
                
                {statusMessage.type && (
                    <div
                        className={`mb-6 flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-sm ${
                        statusMessage.type === 'success'
                                ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700'
                                : 'bg-red-900/40 text-red-300 border border-red-700'
                    }`}>
                        {statusMessage.text}

                        <button
                            onClick={clearStatusMessage}
                            className="text-slate-400 hover:text-white transition"
                            aria-label="Fermer le message"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <ScanningProgress details={scanningMessage} isScanning={isScanning} progress={scanProgress} scanningPhase={scanningPhase}/>

                <SourcesStatsCards sources={sources} />

                <div className="grid gap-4">
                    {sources.length === 0 ? (
                        <div className="rounded-xl border border-slate-700 bg-linear-to-r from-slate-900 to-slate-800 py-16 text-center">
                            <p className="text-lg text-slate-400">Aucune source configurée</p>
                            <p className="mt-2 text-sm text-slate-500">Ajoutez votre première source pour commencer</p>
                        </div>
                    ) : (
                        sources.map((source: Source) => (
                            <SourceCard
                                key={source.id}
                                source={source}
                                onToggle={() => toggleSource({ id: source.id, active: !source.active })}
                                onDelete={() => {
                                    if (confirm('Supprimer cette source ?')) {console.log(source.id); deleteSource(source.id)};
                                }}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}