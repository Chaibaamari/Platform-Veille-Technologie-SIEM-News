import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: unknown; // or Error | string
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorState({
  title = 'Erreur de chargement',
  message = 'Une erreur est survenue lors du chargement des données.',
  error,
  onRetry = () => window.location.reload(),
  fullScreen = true,
}: ErrorStateProps) {
    const errorMessage =
        error instanceof Error
            ? error.message
            : typeof error === 'string'
                ? error
                : message;

    const containerClasses = fullScreen
        ? 'bg-zinc-900 flex items-center justify-center p-4 pb-20 '
        : 'py-12 flex items-center justify-center';

    return (
        <div className={containerClasses}>
            <div className="max-w-md w-full">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
                    {/* Icon */}
                    <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>

                    {/* Title */}
                    <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>

                    {/* Message */}
                    <p className="text-neutral-400 text-sm mb-6">{errorMessage}</p>

                    {/* Retry Button */}
                    <button
                        onClick={onRetry}
                        className="px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition bg-transparent border border-neutral-800 hover:bg-neutral-800 hover:border-violet-500 text-neutral-400 hover:text-white"
                    >
                        <RefreshCw className="w-5 h-5 text-violet-500" />
                        <span>Réessayer</span>
                    </button>
                </div>
            </div>
        </div>
    );
}