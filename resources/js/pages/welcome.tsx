import { Head, Link, usePage } from '@inertiajs/react';
import { TreesIcon, Users, Layers, LogIn, UserPlus, ChevronDown, BookOpen } from 'lucide-react';
import type { FamilyTreeStats } from '@/types';

type WelcomeProps = {
    stats: FamilyTreeStats;
};


function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number | string }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
                <Icon className="mb-3 h-8 w-8 text-amber-400" />
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="mt-1 text-sm text-white/60">{label}</p>
            </div>
        </div>
    );
}

export default function Welcome() {
    const { stats } = usePage<{ stats: FamilyTreeStats }>().props;
    const { auth } = usePage<{ auth?: { user?: { id: number } } }>().props;
    const isLoggedIn = !!auth?.user;

    return (
        <>
            <Head title="Silsilah Keluarga Bani Ali Dahlan" />

            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                {/* Decorative background elements */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/5 blur-3xl" />
                </div>

                {/* Navigation */}
                <nav className="relative z-10 border-b border-white/5 bg-white/5 backdrop-blur-md">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
                                <TreesIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">Bani Ali Dahlan</h1>
                                <p className="text-xs text-white/50">Silsilah Keluarga</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {isLoggedIn ? (
                                <>
                                    <a
                                        href="/panduan.html"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white"
                                    >
                                        <BookOpen className="h-4 w-4" />
                                        Panduan
                                    </a>
                                    <Link
                                        href="/dashboard"
                                        className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40"
                                    >
                                        Dashboard
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <a
                                        href="/panduan.html"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white"
                                    >
                                        <BookOpen className="h-4 w-4" />
                                        Panduan
                                    </a>
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative z-10 px-6 pt-20 pb-16">
                    <div className="mx-auto max-w-7xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1.5">
                            <TreesIcon className="h-4 w-4 text-amber-400" />
                            <span className="text-sm font-medium text-amber-300">Silsilah Keluarga Digital</span>
                        </div>
                        <h1 className="mb-6 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-5xl leading-tight font-extrabold tracking-tight text-transparent md:text-7xl">
                            Keluarga Besar
                            <br />
                            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                                Bani Ali Dahlan
                            </span>
                        </h1>
                        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/60">
                            Menjaga dan melestarikan silsilah keluarga besar Bani Ali Dahlan secara digital.
                            Menghubungkan generasi demi generasi dalam satu pohon keluarga yang komprehensif.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            {!isLoggedIn && (
                                <>
                                    <Link
                                        href="/register"
                                        className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40"
                                    >
                                        Bergabung Sekarang
                                        <ChevronDown className="h-5 w-5 rotate-[-90deg] transition-transform group-hover:translate-x-1" />
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-8 py-4 text-lg font-medium text-white/80 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white"
                                    >
                                        Masuk
                                    </Link>
                                </>
                            )}
                            {isLoggedIn && (
                                <Link
                                    href="/family-tree"
                                    className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40"
                                >
                                    Lihat Pohon Keluarga
                                    <ChevronDown className="h-5 w-5 rotate-[-90deg] transition-transform group-hover:translate-x-1" />
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="relative z-10 px-6 py-16">
                    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
                        <StatCard icon={Users} label="Anggota Keluarga" value={stats.totalMembers} />
                        <StatCard icon={Layers} label="Generasi" value={stats.totalGenerations} />
                        <StatCard icon={TreesIcon} label="Status" value="Aktif" />
                    </div>
                </section>

                {/* CTA Section - Login to see full tree */}
                {!isLoggedIn && (
                    <section className="relative z-10 px-6 py-16">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-sm">
                                <TreesIcon className="mx-auto mb-4 h-12 w-12 text-amber-400" />
                                <h2 className="mb-3 text-3xl font-bold text-white">Lihat Pohon Keluarga</h2>
                                <p className="mb-6 text-white/50">Masuk atau daftar untuk melihat silsilah lengkap keluarga besar Bani Ali Dahlan.</p>
                                <div className="flex items-center justify-center gap-4">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-8 py-3 text-base font-medium text-white/80 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white"
                                    >
                                        <LogIn className="h-5 w-5" />
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40"
                                    >
                                        <UserPlus className="h-5 w-5" />
                                        Daftar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* About Section */}
                <section className="relative z-10 px-6 py-16">
                    <div className="mx-auto max-w-4xl">
                        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-10 backdrop-blur-sm">
                            <h2 className="mb-6 text-3xl font-bold text-white">Tentang Bani Ali Dahlan</h2>
                            <div className="space-y-4 text-lg leading-relaxed text-white/60">
                                <p>
                                    Keluarga besar Bani Ali Dahlan merupakan salah satu keluarga yang memiliki sejarah
                                    panjang dan kaya akan tradisi. Didirikan oleh Ali Dahlan, keluarga ini telah
                                    berkembang hingga beberapa generasi.
                                </p>
                                <p>
                                    Aplikasi silsilah digital ini dibuat untuk menjaga hubungan antar anggota keluarga,
                                    mendokumentasikan sejarah keluarga, dan memastikan generasi mendatang dapat mengenal
                                    akar dan silsilah mereka.
                                </p>
                            </div>
                            <div className="mt-8 grid gap-4 md:grid-cols-2">
                                <div className="rounded-xl border border-white/5 bg-white/5 p-5">
                                    <h3 className="mb-2 font-semibold text-amber-400">Visi</h3>
                                    <p className="text-sm text-white/60">
                                        Menyatukan dan mempererat tali silaturahmi keluarga besar Bani Ali Dahlan
                                        melalui platform digital yang mudah diakses.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-white/5 bg-white/5 p-5">
                                    <h3 className="mb-2 font-semibold text-emerald-400">Misi</h3>
                                    <p className="text-sm text-white/60">
                                        Mendokumentasikan silsilah keluarga secara lengkap dan akurat, serta menyediakan
                                        sarana komunikasi antar anggota keluarga.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative z-10 border-t border-white/5 bg-white/[0.02] px-6 py-8">
                    <div className="mx-auto max-w-7xl text-center">
                        <div className="mb-4 flex items-center justify-center gap-2">
                            <TreesIcon className="h-5 w-5 text-amber-400" />
                            <span className="font-semibold text-white">Bani Ali Dahlan</span>
                        </div>
                        <p className="text-sm text-white/40">
                            &copy; {new Date().getFullYear()} Silsilah Keluarga Bani Ali Dahlan. Dibuat dengan ❤️ oleh{' '}
                            <a
                                href="https://simpleakunting.biz.id/SolusiConsult.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/60 hover:text-white hover:underline transition-colors"
                            >
                                Kurniawan
                            </a>
                            {' '}untuk keluarga besar.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
