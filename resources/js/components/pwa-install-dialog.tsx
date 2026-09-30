import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Share, PlusSquare, Smartphone, Monitor, CheckCircle2, TreesIcon, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface PwaInstallDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isIosSafari: boolean;
    hasPrompt: boolean;
    onTriggerInstall: () => Promise<boolean>;
}

export function PwaInstallDialog({
    open,
    onOpenChange,
    isIosSafari,
    hasPrompt,
    onTriggerInstall,
}: PwaInstallDialogProps) {
    const [activeTab, setActiveTab] = useState<'safari' | 'chrome'>(isIosSafari ? 'safari' : 'chrome');

    const handleInstallClick = async () => {
        if (hasPrompt) {
            const installed = await onTriggerInstall();
            if (installed) {
                onOpenChange(false);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-slate-900 border-white/10 text-white p-6 rounded-3xl shadow-2xl">
                <DialogHeader className="text-left space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/20 text-slate-950">
                            <TreesIcon className="size-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                                Pasang Aplikasi
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
                                    PWA
                                </span>
                            </DialogTitle>
                            <DialogDescription className="text-xs text-white/60">
                                Bani Ali Dahlan — Silsilah Keluarga Besar
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Platform switcher tabs */}
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-white/5 p-1 border border-white/10 text-xs font-semibold mt-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('safari')}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                            activeTab === 'safari'
                                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                                : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Smartphone className="size-3.5" />
                        Apple Safari (iOS / Mac)
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('chrome')}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                            activeTab === 'chrome'
                                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                                : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Monitor className="size-3.5" />
                        Google Chrome / Edge
                    </button>
                </div>

                {/* Tab content: Safari */}
                {activeTab === 'safari' && (
                    <div className="space-y-3 pt-2 text-sm">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                            <p className="text-xs font-medium text-amber-400 flex items-center gap-1.5">
                                <Sparkles className="size-3.5" />
                                Panduan Pasang di Safari (iPhone / iPad):
                            </p>

                            <ol className="space-y-3 text-xs leading-relaxed text-white/80">
                                <li className="flex items-start gap-2.5">
                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px]">
                                        1
                                    </span>
                                    <span>
                                        Ketuk tombol <strong className="text-white">Bagikan (Share)</strong>{' '}
                                        <Share className="inline size-3.5 text-sky-400 mx-0.5 -mt-0.5" /> di menu bawah (atau atas) browser Safari.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px]">
                                        2
                                    </span>
                                    <span>
                                        Gulir ke bawah dan pilih opsi{' '}
                                        <strong className="text-amber-400">"Tambah ke Layar Utama" (Add to Home Screen)</strong>{' '}
                                        <PlusSquare className="inline size-3.5 text-amber-400 mx-0.5 -mt-0.5" />.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px]">
                                        3
                                    </span>
                                    <span>
                                        Ketuk tombol <strong className="text-white">"Tambah" (Add)</strong> di pojok kanan atas.
                                    </span>
                                </li>
                            </ol>
                        </div>

                        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] text-amber-300 flex items-start gap-2">
                            <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-amber-400" />
                            <span>
                                Setelah terpasang, aplikasi akan muncul di layar utama iPhone/iPad tanpa bingkai URL browser dan siap diakses kapan pun!
                            </span>
                        </div>
                    </div>
                )}

                {/* Tab content: Chrome / Edge / Desktop */}
                {activeTab === 'chrome' && (
                    <div className="space-y-3 pt-2 text-sm">
                        {hasPrompt ? (
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center space-y-3">
                                <p className="text-xs text-white/80">
                                    Browser Chrome mendeteksi aplikasi ini siap dipasang secara langsung ke perangkat Anda.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleInstallClick}
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:shadow-amber-500/40 hover:scale-[1.02]"
                                >
                                    <TreesIcon className="size-4" />
                                    Install Bani Ali Dahlan Sekarang
                                </button>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                                <p className="text-xs font-medium text-amber-400 flex items-center gap-1.5">
                                    <Sparkles className="size-3.5" />
                                    Panduan Pasang di Chrome / Edge (Android / PC):
                                </p>
                                <ol className="space-y-2.5 text-xs leading-relaxed text-white/80">
                                    <li className="flex items-start gap-2">
                                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px]">
                                            1
                                        </span>
                                        <span>
                                            Ketuk ikon <strong className="text-white">titik tiga (⋮)</strong> di sudut kanan atas browser Chrome.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px]">
                                            2
                                        </span>
                                        <span>
                                            Pilih <strong className="text-amber-400">"Install Aplikasi"</strong> atau <strong className="text-amber-400">"Tambahkan ke Layar Utama"</strong>.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px]">
                                            3
                                        </span>
                                        <span>
                                            Klik tombol konfirmasi <strong className="text-white">Install</strong>.
                                        </span>
                                    </li>
                                </ol>
                            </div>
                        )}

                        <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-[11px] text-white/70 flex items-start gap-2">
                            <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-400" />
                            <span>
                                Pada Chrome Desktop (Windows/Mac), Anda juga dapat mengeklik ikon install di bilah alamat URL (Address Bar) di kanan atas.
                            </span>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
