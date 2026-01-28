import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  title?: string;
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({
    title = 'Chargement en cours',
    message = 'Veuillez patienter...',
    fullScreen = true,
}: LoadingStateProps) {
    const containerClasses = fullScreen
        ? 'bg-zinc-900 min-h-screen flex items-center justify-center'
        : 'flex items-center justify-center py-12';

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
                <div className="text-center">
                    <h3 className="text-white text-lg font-semibold">{title}</h3>
                    <p className="text-neutral-400 text-sm mt-1">{message}</p>
                </div>
            </div>
        </div>
    );
}