import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Info, X, Calendar, MapPin, Heart, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { TreeNode } from '@/components/tree-node';
import type { BreadcrumbItem, FamilyMember } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pohon Keluarga', href: '/family-tree' },
];

export default function FamilyTree() {
    const { tree } = usePage<{ tree: FamilyMember[] }>().props;
    const [zoom, setZoom] = useState(1);
    const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 2.5));
    const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.3));
    const handleReset = () => {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
    };

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (e.button !== 0) return;
            setIsDragging(true);
            setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
        },
        [offset],
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!isDragging) return;
            setOffset({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        },
        [isDragging, dragStart],
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom((z) => Math.min(Math.max(z + delta, 0.3), 2.5));
    }, []);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pohon Keluarga" />
            <div className="relative flex h-full flex-1 flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between border-b border-sidebar-border/70 px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border/70 transition-colors hover:bg-muted"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <h2 className="text-lg font-bold">Pohon Keluarga Bani Ali Dahlan</h2>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleZoomOut}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border/70 transition-colors hover:bg-muted"
                            title="Zoom Out"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </button>
                        <span className="min-w-[4rem] text-center text-sm text-muted-foreground">
                            {Math.round(zoom * 100)}%
                        </span>
                        <button
                            onClick={handleZoomIn}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border/70 transition-colors hover:bg-muted"
                            title="Zoom In"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border/70 transition-colors hover:bg-muted"
                            title="Reset"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => {
                                containerRef.current?.requestFullscreen();
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border/70 transition-colors hover:bg-muted"
                            title="Fullscreen"
                        >
                            <Maximize2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Tree Canvas */}
                <div
                    ref={containerRef}
                    className="relative flex-1 cursor-grab overflow-hidden bg-gradient-to-br from-background to-muted/20 active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                >
                    {/* Grid pattern */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle, currentColor 1px, transparent 1px)',
                            backgroundSize: '24px 24px',
                        }}
                    />

                    <div
                        className="absolute inset-0 flex items-start justify-center pt-12 transition-transform"
                        style={{
                            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                            transformOrigin: 'top center',
                        }}
                    >
                        {tree.length === 0 ? (
                            <div className="text-center">
                                <p className="text-lg text-muted-foreground">Belum ada data pohon keluarga.</p>
                                <Link
                                    href="/family-members/create"
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white"
                                >
                                    Tambah Anggota Pertama
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-8 pb-20">
                                {tree.map((root) => (
                                    <TreeNode
                                        key={root.id}
                                        member={root}
                                        onNodeClick={(m) => setSelectedMember(m)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Member Detail Panel */}
                {selectedMember && (
                    <div className="absolute right-0 top-0 bottom-0 z-20 w-80 border-l border-sidebar-border/70 bg-background/95 backdrop-blur-md">
                        <div className="flex h-full flex-col">
                            <div className="flex items-center justify-between border-b border-sidebar-border/70 p-4">
                                <h3 className="flex items-center gap-2 font-semibold">
                                    <Info className="h-4 w-4 text-amber-400" />
                                    Detail
                                </h3>
                                <button
                                    onClick={() => setSelectedMember(null)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {/* Avatar */}
                                <div className="flex flex-col items-center py-4">
                                    <div
                                        className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white ${
                                            selectedMember.gender === 'male'
                                                ? 'bg-gradient-to-br from-sky-500 to-blue-600'
                                                : 'bg-gradient-to-br from-pink-500 to-rose-600'
                                        }`}
                                    >
                                        {selectedMember.name.charAt(0)}
                                    </div>
                                    <h4 className="mt-3 text-lg font-bold">{selectedMember.name}</h4>
                                    <span
                                        className={`mt-1 inline-flex rounded-full px-3 py-0.5 text-xs font-medium ${
                                            selectedMember.gender === 'male'
                                                ? 'bg-sky-500/10 text-sky-400'
                                                : 'bg-pink-500/10 text-pink-400'
                                        }`}
                                    >
                                        {selectedMember.gender === 'male' ? 'Laki-laki' : 'Perempuan'} · Gen{' '}
                                        {selectedMember.generation}
                                    </span>
                                </div>

                                {/* Info items */}
                                <div className="space-y-3">
                                    {selectedMember.birth_place && (
                                        <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3 text-sm">
                                            <MapPin className="h-4 w-4 shrink-0 text-amber-400" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Tempat Lahir</p>
                                                <p className="font-medium">{selectedMember.birth_place}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedMember.birth_date && (
                                        <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3 text-sm">
                                            <Calendar className="h-4 w-4 shrink-0 text-emerald-400" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Tanggal Lahir</p>
                                                <p className="font-medium">{formatDate(selectedMember.birth_date)}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedMember.death_date && (
                                        <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3 text-sm">
                                            <Calendar className="h-4 w-4 shrink-0 text-red-400" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Tanggal Wafat</p>
                                                <p className="font-medium">{formatDate(selectedMember.death_date)}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedMember.spouse_name && (
                                        <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3 text-sm">
                                            <Heart className="h-4 w-4 shrink-0 text-pink-400" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Pasangan</p>
                                                <p className="font-medium">{selectedMember.spouse_name}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {selectedMember.bio && (
                                    <div className="rounded-lg border border-sidebar-border/50 p-3">
                                        <p className="mb-1 text-xs font-semibold text-muted-foreground">Biografi</p>
                                        <p className="text-sm leading-relaxed">{selectedMember.bio}</p>
                                    </div>
                                )}

                                <Link
                                    href={`/family-members/${selectedMember.id}`}
                                    className="block w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-amber-500/25"
                                >
                                    Lihat Detail Lengkap
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
