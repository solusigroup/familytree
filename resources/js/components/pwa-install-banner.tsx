import { useState } from 'react';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { PwaInstallDialog } from '@/components/pwa-install-dialog';
import { TreesIcon, Download, X } from 'lucide-react';

export function PwaInstallBanner() {
    const {
        isInstalled,
        isIosSafari,
        canInstall,
        isDismissed,
        triggerInstall,
        dismissPrompt,
        hasPrompt,
    } = usePwaInstall();

    const [dialogOpen, setDialogOpen] = useState(false);

    if (isInstalled || isDismissed || !canInstall) {
        return (
            <PwaInstallDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                isIosSafari={isIosSafari}
                hasPrompt={hasPrompt}
                onTriggerInstall={triggerInstall}
            />
        );
    }

    const handleClickInstall = async () => {
        if (hasPrompt) {
            const installed = await triggerInstall();
            if (!installed) {
                setDialogOpen(true);
            }
        } else {
            setDialogOpen(true);
        }
    };

    return (
        <>
            <aside
                aria-label="Pemasangan Aplikasi"
                className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom-5 duration-300"
            >
                <div className="flex items-center gap-3.5 rounded-2xl border border-amber-500/30 bg-slate-950/90 p-4 shadow-2xl shadow-amber-500/10 backdrop-blur-xl text-white">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-slate-950 shadow-md">
                        <TreesIcon className="size-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">
                            Pasang Bani Ali Dahlan
                        </h4>
                        <p className="text-xs text-white/70 line-clamp-1">
                            {isIosSafari
                                ? 'Tambahkan ke Layar Utama Safari'
                                : 'Akses silsilah lebih cepat tanpa browser'}
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                        <button
                            type="button"
                            onClick={handleClickInstall}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-md transition hover:scale-105 hover:shadow-amber-500/30"
                        >
                            <Download className="size-3.5" />
                            <span>Install</span>
                        </button>

                        <button
                            type="button"
                            onClick={dismissPrompt}
                            className="flex size-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition"
                            title="Tutup banner"
                            aria-label="Tutup banner"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>
            </aside>

            <PwaInstallDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                isIosSafari={isIosSafari}
                hasPrompt={hasPrompt}
                onTriggerInstall={triggerInstall}
            />
        </>
    );
}
