// src/pages/blog/index.tsx
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import BlogGrid from './BlogGrid';
import BlogGridSkeleton from '../ui/SkeletonCard';
import { ChevronDown, FileSpreadsheet, FileText, Loader2} from 'lucide-react';
import { useState } from 'react';
import { useReports } from '@/hook/useReport';
import { ErrorState } from '../ui/ErrorState';

export default function BlogPage() {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [days, setDays] = useState<number>(30)

    const { data, isLoading, error, isError } = useQuery({
        queryKey: ["articles/"],
        queryFn: apiClient,
        staleTime: 5000
    });

    const { generateReport, isGenerating } = useReports();

    const handleGenerateReport = (format: 'pdf' | 'excel', days: number) => {
        setIsDropdownOpen(false);
        generateReport(
            { format, days }
        );
    };
    

    if (isLoading) {
        return (
            <div className="w-full bg-zinc-900">
                <section className="py-16 px-20 w-full self-stretch">
                    <h3 className=" text-white text-2xl font-semibold leading-8">
                        Recent blog posts
                    </h3>
                    <div className="mx-auto px-34">
                        <BlogGridSkeleton />
                    </div>
                </section>
            </div>
        );
    }
    
    if (isError) {
            return (
                <ErrorState
                    title="Erreur lors du chargement des articles"
                    error={error}
                />
            );
    }
    
    const posts = data.articles || [];
    return (
        <div className="w-full bg-zinc-900">
            <section className="py-16 w-full self-stretch">
                <div className="mx-auto px-34">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className=" text-white text-2xl font-semibold leading-8">
                            Recent blog posts
                        </h3>
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                disabled={isGenerating}
                                className="px-6 py-3 rounded-xl flex items-center gap-2 transition bg-transparent border border-neutral-800 hover:bg-neutral-800 hover:border-violet-500 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
                                        <span>Génération...</span>
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-5 h-5 text-violet-500" />
                                        <span>Générer un rapport</span>
                                        <ChevronDown className={`w-4 h-4 text-violet-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && !isGenerating && (
                                <div className="absolute top-full mt-2 right-0 w-56 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl overflow-hidden z-10">
                                    
                                    {/* Input for number of days */}
                                    <div className="px-4 py-3">
                                        <label className="block text-xs text-neutral-500 mb-1" htmlFor="lastNDays">
                                            Générer le rapport des N derniers jours
                                        </label>
                                        <input
                                            id="lastNDays"
                                            type="number"
                                            min={1}
                                            max={365}
                                            value={days} // `days` comes from useState
                                            onChange={(e) => setDays(Number(e.target.value))}
                                            className="
                                            w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200
                                            focus:outline-none focus:border-red-500
                                            appearance-none
                                            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>

                                    <div className="h-px bg-neutral-800"></div>

                                    {/* PDF button */}
                                    <button
                                    onClick={() => handleGenerateReport('pdf', days)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-800 transition text-left text-neutral-300 hover:text-white"
                                    >
                                    <FileText className="w-5 h-5 text-red-500" />
                                    <div>
                                        <div className="font-medium">Format PDF</div>
                                        <div className="text-xs text-neutral-500">Document imprimable</div>
                                    </div>
                                    </button>

                                    <div className="h-px bg-neutral-800"></div>

                                    {/* Excel button */}
                                    <button
                                    onClick={() => handleGenerateReport('excel', days)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-800 transition text-left text-neutral-300 hover:text-white"
                                    >
                                    <FileSpreadsheet className="w-5 h-5 text-green-500" />
                                    <div>
                                        <div className="font-medium">Format Excel</div>
                                        <div className="text-xs text-neutral-500">Tableau de données</div>
                                    </div>
                                    </button>
                                </div>
                                )}

                        </div>
                    </div>
                    {/* Afficher le contenu */}
                    {!isLoading && !error && (
                        <BlogGrid posts={posts} />
                    )}
                </div>
            </section>
        </div>
    );
}
