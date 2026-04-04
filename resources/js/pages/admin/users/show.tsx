import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    GitBranch,
    Mail,
    Plus,
    Shield,
    ShieldCheck,
    Trash2,
    TreePine,
    User as UserIcon,
    X,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, FamilyMember, User } from '@/types';

type BranchAssignment = {
    id: number;
    user_id: number;
    family_member_id: number;
    assigned_by: number | null;
    family_member: FamilyMember;
};

type TargetUser = User & {
    branch_assignments: BranchAssignment[];
    assigned_branches: FamilyMember[];
};

type PageProps = {
    targetUser: TargetUser;
    familyMembers: FamilyMember[];
    flash: { success?: string; error?: string };
};

const roleOptions = [
    { value: 'superadmin', label: 'Superadmin', icon: ShieldCheck, color: 'text-purple-400' },
    { value: 'editor', label: 'Editor', icon: GitBranch, color: 'text-emerald-400' },
    { value: 'pending', label: 'Pending', icon: UserIcon, color: 'text-amber-400' },
];

const statusLabels: Record<string, { text: string; class: string }> = {
    active: { text: 'Aktif', class: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30' },
    pending: { text: 'Menunggu', class: 'bg-amber-500/10 text-amber-400 ring-amber-500/30' },
    rejected: { text: 'Ditolak', class: 'bg-red-500/10 text-red-400 ring-red-500/30' },
};

export default function UsersShow() {
    const { targetUser, familyMembers, flash } = usePage<PageProps>().props;
    const [selectedBranch, setSelectedBranch] = useState('');
    const [searchBranch, setSearchBranch] = useState('');
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [newRole, setNewRole] = useState(targetUser.role);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kelola Pengguna', href: '/admin/users' },
        { title: targetUser.name, href: `/admin/users/${targetUser.id}` },
    ];

    const assignedBranchIds = targetUser.branch_assignments.map((a) => a.family_member_id);

    const availableBranches = familyMembers.filter(
        (m) =>
            !assignedBranchIds.includes(m.id) &&
            m.name.toLowerCase().includes(searchBranch.toLowerCase()),
    );

    const handleApprove = () => {
        if (confirm('Setujui user ini sebagai Editor?')) {
            router.post(`/admin/users/${targetUser.id}/approve`);
        }
    };

    const handleReject = () => {
        if (confirm('Tolak pendaftaran user ini?')) {
            router.post(`/admin/users/${targetUser.id}/reject`);
        }
    };

    const handleRoleChange = () => {
        router.put(`/admin/users/${targetUser.id}/role`, { role: newRole }, {
            onSuccess: () => setShowRoleModal(false),
        });
    };

    const handleAssignBranch = () => {
        if (!selectedBranch) return;
        router.post(`/admin/users/${targetUser.id}/assign-branch`, {
            family_member_id: parseInt(selectedBranch),
        }, {
            onSuccess: () => {
                setSelectedBranch('');
                setSearchBranch('');
            },
        });
    };

    const handleRemoveBranch = (familyMemberId: number, name: string) => {
        if (confirm(`Hapus assignment cabang "${name}"?`)) {
            router.delete(`/admin/users/${targetUser.id}/remove-branch`, {
                data: { family_member_id: familyMemberId },
            });
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const statusCfg = statusLabels[targetUser.status] || statusLabels.pending;
    const currentRole = roleOptions.find((r) => r.value === targetUser.role) || roleOptions[2];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${targetUser.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                        {flash.error}
                    </div>
                )}

                {/* Back Button */}
                <div>
                    <Link
                        href="/admin/users"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Daftar Pengguna
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* User Info Card */}
                    <div className="lg:col-span-1">
                        <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
                            <div className="bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent px-6 pt-8 pb-6">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-purple-500/30">
                                        {targetUser.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-center">
                                        <h2 className="text-xl font-bold text-foreground">{targetUser.name}</h2>
                                        <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                                            <Mail className="h-3.5 w-3.5" />
                                            {targetUser.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 px-6 py-5">
                                {/* Role */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Role</span>
                                    <button
                                        onClick={() => setShowRoleModal(true)}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-opacity hover:opacity-80 ${
                                            targetUser.role === 'superadmin'
                                                ? 'bg-purple-500/10 text-purple-400 ring-purple-500/20'
                                                : targetUser.role === 'editor'
                                                  ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
                                                  : 'bg-amber-500/10 text-amber-400 ring-amber-500/20'
                                        }`}
                                    >
                                        <currentRole.icon className="h-3 w-3" />
                                        {currentRole.label}
                                    </button>
                                </div>

                                {/* Status */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Status</span>
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${statusCfg.class}`}>
                                        {statusCfg.text}
                                    </span>
                                </div>

                                {/* Dates */}
                                <div className="space-y-2 border-t border-sidebar-border/50 pt-4">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Terdaftar</span>
                                        <span className="text-foreground">{formatDate(targetUser.created_at)}</span>
                                    </div>
                                    {targetUser.approved_at && (
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Disetujui</span>
                                            <span className="text-foreground">{formatDate(targetUser.approved_at)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Pending Actions */}
                                {targetUser.status === 'pending' && (
                                    <div className="flex gap-2 border-t border-sidebar-border/50 pt-4">
                                        <button
                                            onClick={handleApprove}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                                        >
                                            <Check className="h-4 w-4" />
                                            Setujui
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                            Tolak
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Branch Assignments Card */}
                    <div className="lg:col-span-2">
                        <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
                            <div className="border-b border-sidebar-border/70 bg-muted/30 px-6 py-4">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                                    <TreePine className="h-5 w-5 text-emerald-400" />
                                    Assignment Cabang Pohon Keluarga
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Tentukan cabang mana yang boleh dikelola oleh user ini.
                                    User hanya bisa mengedit anggota di dalam cabang yang di-assign.
                                </p>
                            </div>

                            <div className="p-6">
                                {/* Assign New Branch */}
                                {targetUser.status === 'active' && targetUser.role === 'editor' && (
                                    <div className="mb-6 rounded-xl border border-dashed border-sidebar-border/70 bg-muted/10 p-4">
                                        <h4 className="mb-3 text-sm font-semibold text-foreground">Assign Cabang Baru</h4>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <select
                                                    value={selectedBranch}
                                                    onChange={(e) => setSelectedBranch(e.target.value)}
                                                    className="w-full appearance-none rounded-lg border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm transition-colors focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                >
                                                    <option value="">Pilih anggota keluarga...</option>
                                                    {availableBranches.map((m) => (
                                                        <option key={m.id} value={m.id}>
                                                            {'  '.repeat((m.generation || 1) - 1)}
                                                            {m.name} (Gen {m.generation})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button
                                                onClick={handleAssignBranch}
                                                disabled={!selectedBranch}
                                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Assign
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Current Assignments */}
                                {targetUser.branch_assignments.length === 0 ? (
                                    <div className="flex flex-col items-center gap-3 py-12 text-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/30">
                                            <TreePine className="h-7 w-7 text-muted-foreground/50" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-muted-foreground">Belum ada cabang yang di-assign</p>
                                            <p className="mt-1 text-sm text-muted-foreground/70">
                                                {targetUser.status === 'pending'
                                                    ? 'Setujui user terlebih dahulu, lalu assign cabang.'
                                                    : 'Assign cabang agar user bisa mengelola anggota di cabang tersebut.'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {targetUser.branch_assignments.map((assignment) => (
                                            <div
                                                key={assignment.id}
                                                className="flex items-center justify-between rounded-xl border border-sidebar-border/50 bg-background px-4 py-3 transition-colors hover:bg-muted/10"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                                                        <GitBranch className="h-5 w-5 text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">
                                                            {assignment.family_member.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Generasi {assignment.family_member.generation}
                                                            {' · '}Termasuk semua keturunan
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveBranch(
                                                            assignment.family_member_id,
                                                            assignment.family_member.name,
                                                        )
                                                    }
                                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
                                                    title="Hapus assignment"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Role Change Modal */}
                {showRoleModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-sidebar-border/70 bg-background shadow-2xl">
                            <div className="border-b border-sidebar-border/70 px-6 py-4">
                                <h3 className="text-lg font-semibold text-foreground">Ubah Role User</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Pilih role baru untuk {targetUser.name}
                                </p>
                            </div>
                            <div className="space-y-2 p-6">
                                {roleOptions.map((role) => (
                                    <button
                                        key={role.value}
                                        onClick={() => setNewRole(role.value as typeof newRole)}
                                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                                            newRole === role.value
                                                ? 'border-purple-500/50 bg-purple-500/5 ring-1 ring-purple-500/20'
                                                : 'border-sidebar-border/50 hover:border-sidebar-border hover:bg-muted/20'
                                        }`}
                                    >
                                        <role.icon className={`h-5 w-5 ${role.color}`} />
                                        <span className="font-medium text-foreground">{role.label}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-end gap-3 border-t border-sidebar-border/70 px-6 py-4">
                                <button
                                    onClick={() => {
                                        setShowRoleModal(false);
                                        setNewRole(targetUser.role);
                                    }}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleRoleChange}
                                    className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-600"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
