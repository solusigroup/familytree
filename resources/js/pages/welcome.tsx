import { Head, Link, usePage } from '@inertiajs/react';
import { TreesIcon, Users, Layers, LogIn, UserPlus, ChevronDown, Heart } from 'lucide-react';
import type { FamilyMember, FamilyTreeStats } from '@/types';

type WelcomeProps = {
    tree: FamilyMember[];
    stats: FamilyTreeStats;
};

function MiniTreeNode({ member, depth = 0 }: { member: FamilyMember; depth?: number }) {
    const hasChildren = member.children_recursive && member.children_recursive.length > 0;

    return (
        <div className="flex flex-col items-center">
            <div
                className={`relative rounded-xl border px-4 py-2 text-center transition-all duration-300 hover:scale-105 ${depth === 0
                        ? 'border-amber-400/50 bg-gradient-to-br from-amber-500/20 to-orange-500/20 shadow-lg shadow-amber-500/10'
                        : depth === 1
                            ? 'border-emerald-400/40 bg-gradient-to-br from-emerald-500/15 to-teal-500/15'
                            : 'border-sky-400/30 bg-gradient-to-br from-sky-500/10 to-blue-500/10'
                    }`}
            >
                <p className="text-sm font-semibold text-white">{member.name}</p>
                {member.spouses && member.spouses.length > 0 && (
                    <div className="flex flex-col gap-0.5 mt-1">
                        {member.spouses.map(spouse => (
                            <p key={spouse.id} className="flex items-center justify-center gap-1 text-[10px] text-white/70">
                                <Heart className="h-2.5 w-2.5 text-pink-400" /> {spouse.name}
                            </p>
                        ))}
                    </div>
                )}
            </div>
            {hasChildren && (
                <div className="flex flex-col items-center">
                    <div className="h-6 w-px bg-gradient-to-b from-white/30 to-white/10" />
                    <div className="flex gap-4">
                        {member.children_recursive!.slice(0, 3).map((child) => (
                            <MiniTreeNode key={child.id} member={child} depth={depth + 1} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

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
    const { tree, stats } = usePage<{ tree: FamilyMember[]; stats: FamilyTreeStats }>().props;
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
                                <Link
                                    href="/dashboard"
                                    className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
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

                {/* Tree Preview Section */}
                {tree.length > 0 && (
                    <section className="relative z-10 px-6 py-16">
                        <div className="mx-auto max-w-5xl">
                            <div className="mb-10 text-center">
                                <h2 className="mb-3 text-3xl font-bold text-white">Pohon Keluarga</h2>
                                <p className="text-white/50">Visualisasi silsilah dari generasi pertama</p>
                            </div>
                            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                                <div className="flex justify-center">
                                    <div className="flex flex-col items-center gap-6">
                                        {tree.map((root) => (
                                            <MiniTreeNode key={root.id} member={root} />
                                        ))}
                                    </div>
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
                            &copy; {new Date().getFullYear()} Silsilah Keluarga Bani Ali Dahlan. Dibuat dengan ❤️ oleh
                            <a
                                href="https://simpleakunting.biz.id/SolusiConsult.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/60 hover:text-white hover:underline transition-colors"
                            >
                                Kurniawan
                            </a>
                            untuk keluarga besar.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
