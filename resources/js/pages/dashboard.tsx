import { Head, usePage } from '@inertiajs/react';
import { LayoutGrid, Users, TreesIcon, Layers, TrendingUp } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, FamilyMember, FamilyTreeStats } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

function DashStatCard({
    icon: Icon,
    label,
    value,
    color,
}: {
    icon: React.ElementType;
    label: string;
    value: number | string;
    color: string;
}) {
    const colorClasses: Record<string, string> = {
        amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
        emerald: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
        sky: 'from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400',
        purple: 'from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-400',
    };

    return (
        <div
            className={`rounded-xl border bg-gradient-to-br p-6 transition-all duration-300 hover:scale-[1.02] ${colorClasses[color] || colorClasses.amber}`}
        >
            <Icon className="mb-3 h-7 w-7" />
            <p className="text-3xl font-bold text-foreground">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
    );
}

export default function Dashboard() {
    const { stats, recentMembers } = usePage<{
        stats?: FamilyTreeStats;
        recentMembers?: FamilyMember[];
    }>().props;

    const totalMembers = stats?.totalMembers ?? 0;
    const totalGenerations = stats?.totalGenerations ?? 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Selamat Datang di Dashboard 👋
                    </h2>
                    <p className="text-muted-foreground">
                        Kelola silsilah Keluarga Besar Bani Ali Dahlan dari sini.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <DashStatCard icon={Users} label="Total Anggota" value={totalMembers} color="amber" />
                    <DashStatCard icon={Layers} label="Total Generasi" value={totalGenerations} color="emerald" />
                    <DashStatCard icon={TreesIcon} label="Pohon Keluarga" value={totalMembers > 0 ? 'Aktif' : 'Kosong'} color="sky" />
                    <DashStatCard icon={TrendingUp} label="Status" value="Online" color="purple" />
                </div>

                {/* Quick Links */}
                <div className="grid gap-4 md:grid-cols-3">
                    <a
                        href="/family-members"
                        className="group flex items-center gap-4 rounded-xl border border-sidebar-border/70 p-6 transition-all duration-300 hover:border-amber-500/30 hover:bg-amber-500/5"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                            <Users className="h-6 w-6 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Kelola Anggota</h3>
                            <p className="text-sm text-muted-foreground">Tambah, edit, hapus anggota</p>
                        </div>
                    </a>
                    <a
                        href="/family-tree"
                        className="group flex items-center gap-4 rounded-xl border border-sidebar-border/70 p-6 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/5"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                            <TreesIcon className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Pohon Keluarga</h3>
                            <p className="text-sm text-muted-foreground">Lihat visualisasi pohon</p>
                        </div>
                    </a>
                    <a
                        href="/family-members/create"
                        className="group flex items-center gap-4 rounded-xl border border-sidebar-border/70 p-6 transition-all duration-300 hover:border-sky-500/30 hover:bg-sky-500/5"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10">
                            <LayoutGrid className="h-6 w-6 text-sky-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Tambah Anggota</h3>
                            <p className="text-sm text-muted-foreground">Daftarkan anggota baru</p>
                        </div>
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
