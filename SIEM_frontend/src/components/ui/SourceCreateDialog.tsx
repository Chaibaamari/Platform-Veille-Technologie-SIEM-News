import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Link2, Tag, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

type Props = {
    onCreate: (data: { name: string; url: string; type: string; active: boolean }) => void;
    isCreating: boolean;
};

export default function SourceCreateDialog({ onCreate, isCreating }: Props) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: '',
        url: '',
        type: 'RSS',
        active: true,
    });

    const canSubmit = !!form.name.trim() && !!form.url.trim();

    const handleSubmit = () => {
        if (!canSubmit) return;
        onCreate(form);
        setForm({ name: '', url: '', type: 'RSS', active: true });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="px-6 py-4 rounded-xl flex items-center gap-2.5 transition bg-transparent border border-neutral-800 hover:bg-neutral-800 text-neutral-400">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une source
                </button>
            </DialogTrigger>

            <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700/50 shadow-2xl max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        Nouvelle source de veille
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-base">
                        Configurez une nouvelle source RSS, API ou Web pour enrichir votre veille
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-6">
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-violet-400" />
                            Nom de la source
                        </label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                            placeholder="Ex: TechCrunch, Le Monde Tech..."
                        />
                    </div>

                    {/* URL Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <Link2 className="w-4 h-4 text-violet-400" />
                            URL de la source
                        </label>
                        <input
                            type="url"
                            value={form.url}
                            onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                            placeholder="https://techcrunch.com/feed/"
                        />
                    </div>

                    {/* Type Select */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-violet-400" />
                            Type de source
                        </label>
                        <Select value={form.type} onValueChange={(value) => setForm((p) => ({ ...p, type: value }))}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-12 focus:ring-2 focus:ring-violet-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem value="RSS" className="text-white hover:bg-slate-700 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                        RSS Feed
                                    </div>
                                </SelectItem>
                                <SelectItem value="API" className="text-white hover:bg-slate-700 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                        API
                                    </div>
                                </SelectItem>
                                <SelectItem value="WEB" className="text-white hover:bg-slate-700 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                        Web Scraping
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Active Checkbox */}
                    <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <input
                            type="checkbox"
                            id="active"
                            checked={form.active}
                            onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                            className="w-5 h-5 text-violet-600 bg-slate-800 border-slate-600 rounded focus:ring-2 focus:ring-violet-500 cursor-pointer"
                        />
                        <label htmlFor="active" className="text-sm text-slate-300 cursor-pointer select-none">
                            <span className="font-semibold">Activer immédiatement</span>
                            <span className="block text-xs text-slate-500 mt-0.5">
                                La source sera incluse dans les prochaines veilles
                            </span>
                        </label>
                    </div>
                </div>

                <DialogFooter className="gap-3">
                    <button
                        onClick={() => setOpen(false)}
                        className="px-6 py-4 rounded-xl flex items-center gap-2 transition bg-transparent border border-neutral-600  text-neutral-300 cursor-pointer"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit || isCreating}
                        className="px-6 py-4 rounded-xl flex items-center gap-2 transition bg-transparent border border-neutral-600  text-neutral-300 cursor-pointer"
                    >
                        {isCreating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Création...
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter la source
                            </>
                        )}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

