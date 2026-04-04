import { Head, Link, router } from '@inertiajs/react';
import { Clock, LogOut, ShieldAlert } from 'lucide-react';

export default function PendingApproval() {
    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="Menunggu Persetujuan" />
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
                <div className="w-full max-w-md">
                    {/* Card */}
                    <div className="overflow-hidden rounded-2xl border border-amber-500/20 bg-slate-800/60 shadow-2xl shadow-amber-500/5 backdrop-blur-xl">
                        {/* Header */}
                        <div className="flex flex-col items-center gap-4 bg-gradient-to-b from-amber-500/10 to-transparent px-8 pt-10 pb-6">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 ring-2 ring-amber-500/30">
                                <Clock className="h-10 w-10 text-amber-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">Menunggu Persetujuan</h1>
                        </div>

                        {/* Body */}
                        <div className="space-y-5 px-8 pb-8">
                            <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4">
                                <div className="flex items-start gap-3">
                                    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                                    <div className="text-sm leading-relaxed text-slate-300">
                                        <p className="mb-2">
                                            Akun Anda telah berhasil didaftarkan, namun memerlukan{' '}
                                            <span className="font-semibold text-amber-400">persetujuan administrator</span>{' '}
                                            sebelum dapat mengakses seluruh fitur.
                                        </p>
                                        <p className="text-slate-400">
                                            Silakan hubungi administrator untuk mempercepat proses persetujuan.
                                            Setelah disetujui, Anda akan dapat mengelola data pohon keluarga sesuai
                                            cabang yang ditentukan.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status indicator */}
                            <div className="flex items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3">
                                <div className="relative flex h-3 w-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
                                </div>
                                <span className="text-sm font-medium text-slate-300">Status: Menunggu Persetujuan</span>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 pt-2">
                                <Link
                                    href="/"
                                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40"
                                >
                                    Lihat Pohon Keluarga (Read-Only)
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Keluar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
