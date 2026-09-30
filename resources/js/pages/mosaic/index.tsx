import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Edit3,
    HardDrive,
    Image as ImageIcon,
    Info,
    LayoutGrid,
    Plus,
    Search,
    Sparkles,
    Trash2,
    UploadCloud,
    X,
    ZoomIn,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type PhotoMosaic = {
    id: number;
    user_id: number;
    title: string | null;
    caption: string;
    image_path: string;
    thumbnail_path: string | null;
    image_url: string;
    thumbnail_url: string;
    original_filename: string | null;
    file_size: number;
    original_file_size: number;
    compression_ratio: number | null;
    width: number | null;
    height: number | null;
    taken_at: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
        role: string;
    };
};

type Stats = {
    total_photos: number;
    total_original_bytes: number;
    total_compressed_bytes: number;
    total_saved_bytes: number;
    percent_saved: number;
};

type PageProps = {
    mosaics: PhotoMosaic[];
    stats: Stats;
    canManage: boolean;
    currentUserId: number | null;
    isSuperadmin: boolean;
    flash: { success?: string; error?: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mozaik Foto', href: '/mosaic' },
];

function formatBytes(bytes: number, decimals = 1) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function MosaicIndex() {
    const { mosaics, stats, canManage, currentUserId, isSuperadmin, flash } = usePage<PageProps>().props;

    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'mosaic' | 'cards'>('mosaic');
    const [enlargedIndex, setEnlargedIndex] = useState<number | null>(null);

    // Upload Modal State
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // Edit Modal State
    const [editingMosaic, setEditingMosaic] = useState<PhotoMosaic | null>(null);

    const {
        data: uploadData,
        setData: setUploadData,
        post: postUpload,
        processing: uploadProcessing,
        errors: uploadErrors,
        reset: resetUpload,
    } = useForm({
        photos: [] as File[],
        caption: '',
        title: '',
        taken_at: '',
    });

    const {
        data: editData,
        setData: setEditData,
        put: putEdit,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        caption: '',
        title: '',
        taken_at: '',
    });

    const filteredMosaics = mosaics.filter(
        (m) =>
            m.caption.toLowerCase().includes(search.toLowerCase()) ||
            (m.title && m.title.toLowerCase().includes(search.toLowerCase())) ||
            m.user.name.toLowerCase().includes(search.toLowerCase()),
    );

    // Keyboard navigation for enlarged modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (enlargedIndex === null) return;
            if (e.key === 'Escape') setEnlargedIndex(null);
            if (e.key === 'ArrowLeft') {
                setEnlargedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredMosaics.length - 1));
            }
            if (e.key === 'ArrowRight') {
                setEnlargedIndex((prev) => (prev !== null && prev < filteredMosaics.length - 1 ? prev + 1 : 0));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enlargedIndex, filteredMosaics.length]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setUploadData('photos', filesArray);

            // Generate previews
            const urls = filesArray.map((file) => URL.createObjectURL(file));
            setPreviewUrls(urls);
        }
    };

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postUpload('/mosaic', {
            onSuccess: () => {
                setIsUploadOpen(false);
                resetUpload();
                setPreviewUrls([]);
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMosaic) return;

        putEdit(`/mosaic/${editingMosaic.id}`, {
            onSuccess: () => {
                setEditingMosaic(null);
                resetEdit();
            },
        });
    };

    const openEditModal = (mosaic: PhotoMosaic) => {
        setEditingMosaic(mosaic);
        setEditData({
            caption: mosaic.caption,
            title: mosaic.title || '',
            taken_at: mosaic.taken_at ? mosaic.taken_at.substring(0, 10) : '',
        });
    };

    const handleDelete = (mosaic: PhotoMosaic) => {
        if (confirm(`Yakin ingin menghapus foto "${mosaic.caption.substring(0, 30)}..."?`)) {
            router.delete(`/mosaic/${mosaic.id}`, {
                onSuccess: () => {
                    if (enlargedIndex !== null) setEnlargedIndex(null);
                },
            });
        }
    };

    const currentEnlarged = enlargedIndex !== null ? filteredMosaics[enlargedIndex] : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mozaik Foto Keluarga" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {flash.error}
                    </div>
                )}

                {/* Header & Compression Summary */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                                <LayoutGrid className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">Mozaik Foto Keluarga</h1>
                                <p className="text-xs text-muted-foreground">
                                    Dokumentasi memori keluarga dalam susunan mozaik berukuran 3cm x 3cm
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action & Stats Button */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Compression Savings Pill */}
                        <div className="flex items-center gap-2 rounded-xl border border-sidebar-border/70 bg-card px-3.5 py-2 text-xs shadow-xs">
                            <HardDrive className="h-4 w-4 text-emerald-400" />
                            <div>
                                <span className="font-semibold text-foreground">
                                    Hemat {stats.percent_saved}% Server
                                </span>
                                <span className="text-[11px] text-muted-foreground block">
                                    {formatBytes(stats.total_compressed_bytes)} / aslinya {formatBytes(stats.total_original_bytes)}
                                </span>
                            </div>
                        </div>

                        {/* Add Button for Editor / Superadmin */}
                        {canManage && (
                            <button
                                onClick={() => setIsUploadOpen(true)}
                                className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/20 transition-all hover:bg-amber-600"
                            >
                                <Plus className="h-4 w-4" />
                                Entry Foto Mozaik
                            </button>
                        )}
                    </div>
                </div>

                {/* Controls Bar: Search & View Mode Toggle */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Cari caption, judul, atau pengunggah..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-sidebar-border/70 bg-background py-2 pl-9 pr-3 text-xs transition-colors focus:border-amber-500 focus:outline-hidden"
                        />
                    </div>

                    <div className="flex items-center gap-1 rounded-xl border border-sidebar-border/70 bg-muted/20 p-1 self-end sm:self-auto">
                        <button
                            onClick={() => setViewMode('mosaic')}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                viewMode === 'mosaic'
                                    ? 'bg-background text-foreground shadow-xs font-semibold'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <LayoutGrid className="h-3.5 w-3.5 text-amber-500" />
                            Mozaik Padat (3cm x 3cm)
                        </button>
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                viewMode === 'cards'
                                    ? 'bg-background text-foreground shadow-xs font-semibold'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Info className="h-3.5 w-3.5 text-purple-400" />
                            Grid Detail
                        </button>
                    </div>
                </div>

                {/* Empty State */}
                {filteredMosaics.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-sidebar-border/70 bg-card/50 py-16 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
                            <ImageIcon className="h-8 w-8 opacity-60" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground">Belum Ada Foto Mozaik</h3>
                        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                            {canManage
                                ? 'Klik tombol "Entry Foto Mozaik" di atas untuk menambahkan foto pertama dengan kompresi otomatis.'
                                : 'Belum ada foto mozaik yang di-entry oleh editor.'}
                        </p>
                        {canManage && (
                            <button
                                onClick={() => setIsUploadOpen(true)}
                                className="mt-4 flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-600"
                            >
                                <Plus className="h-4 w-4" />
                                Entry Foto Sekarang
                            </button>
                        )}
                    </div>
                ) : viewMode === 'mosaic' ? (
                    /* ─────────────────────────────────────────────────────────────
                       MOSAIC TILE VIEW: Exact 3cm x 3cm tiles forming a photo wall!
                       CSS: width: '3cm', height: '3cm' (or w-[3cm] h-[3cm])
                       ───────────────────────────────────────────────────────────── */
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card/60 p-4 md:p-6 shadow-xs">
                        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground border-b border-sidebar-border/50 pb-2">
                            <span>
                                Menampilkan <strong className="text-foreground">{filteredMosaics.length}</strong> tile mozaik (ukuran fisik 3cm x 3cm)
                            </span>
                            <span className="text-[11px] italic">
                                Klik pada sembarang foto untuk memperbesar (enlarge) & baca caption
                            </span>
                        </div>

                        {/* Mosaic Grid with 3cm x 3cm tiles */}
                        <div
                            className="flex flex-wrap gap-1.5 justify-start items-center p-2 rounded-xl bg-muted/20 border border-sidebar-border/40"
                            style={{ minHeight: '3cm' }}
                        >
                            {filteredMosaics.map((mosaic, idx) => (
                                <div
                                    key={mosaic.id}
                                    onClick={() => setEnlargedIndex(idx)}
                                    title={`${mosaic.caption} - Diunggah oleh ${mosaic.user.name}`}
                                    style={{ width: '3cm', height: '3cm' }}
                                    className="group relative cursor-pointer overflow-hidden rounded-md border border-sidebar-border/80 bg-muted/40 shadow-xs transition-all duration-200 hover:scale-110 hover:z-20 hover:shadow-2xl hover:ring-2 hover:ring-amber-500"
                                >
                                    <img
                                        src={mosaic.thumbnail_url}
                                        alt={mosaic.caption}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                            // Fallback to full url if thumb error
                                            (e.target as HTMLImageElement).src = mosaic.image_url;
                                        }}
                                    />

                                    {/* Hover overlay with quick preview caption icon */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-1.5">
                                        <p className="text-[10px] text-white line-clamp-2 leading-tight font-medium drop-shadow-xs">
                                            {mosaic.caption}
                                        </p>
                                        <div className="flex items-center justify-between mt-1 text-[9px] text-amber-300">
                                            <span>Enlarge</span>
                                            <ZoomIn className="h-3 w-3" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* ─────────────────────────────────────────────────────────────
                       CARD VIEW: Grid with 3cm x 3cm tile + complete caption & stats
                       ───────────────────────────────────────────────────────────── */
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredMosaics.map((mosaic, idx) => (
                            <div
                                key={mosaic.id}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-sidebar-border/70 bg-card shadow-xs transition-all hover:shadow-md hover:border-amber-500/40"
                            >
                                {/* Tile header area */}
                                <div className="p-4 flex gap-3 items-start border-b border-sidebar-border/50 bg-muted/10">
                                    {/* 3cm x 3cm Tile */}
                                    <div
                                        onClick={() => setEnlargedIndex(idx)}
                                        style={{ width: '3cm', height: '3cm', minWidth: '3cm', minHeight: '3cm' }}
                                        className="relative cursor-pointer overflow-hidden rounded-lg border border-sidebar-border shadow-xs transition-transform group-hover:scale-105"
                                    >
                                        <img
                                            src={mosaic.thumbnail_url}
                                            alt={mosaic.caption}
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ZoomIn className="h-5 w-5 text-white" />
                                        </div>
                                    </div>

                                    {/* Quick info beside tile */}
                                    <div className="flex-1 min-w-0">
                                        {mosaic.title && (
                                            <h4 className="font-semibold text-foreground text-sm truncate">
                                                {mosaic.title}
                                            </h4>
                                        )}
                                        <p className="text-xs text-muted-foreground line-clamp-3 mt-1 leading-snug">
                                            {mosaic.caption}
                                        </p>
                                        {mosaic.compression_ratio && (
                                            <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                                                <Sparkles className="h-3 w-3" />
                                                Hemat {mosaic.compression_ratio}%
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Footer info & Actions */}
                                <div className="flex items-center justify-between p-3 text-[11px] text-muted-foreground mt-auto">
                                    <div className="truncate">
                                        <span>Oleh: <strong className="text-foreground">{mosaic.user.name}</strong></span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setEnlargedIndex(idx)}
                                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                            title="Perbesar foto"
                                        >
                                            <ZoomIn className="h-4 w-4" />
                                        </button>
                                        {(isSuperadmin || currentUserId === mosaic.user_id) && (
                                            <>
                                                <button
                                                    onClick={() => openEditModal(mosaic)}
                                                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    title="Edit keterangan"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(mosaic)}
                                                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                                                    title="Hapus foto"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ─────────────────────────────────────────────────────────────
                ENLARGE / LIGHTBOX MODAL
                Allows viewing high-res compressed photo + full caption + navigation
               ───────────────────────────────────────────────────────────── */}
            {currentEnlarged && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-6 backdrop-blur-md">
                    {/* Close button */}
                    <button
                        onClick={() => setEnlargedIndex(null)}
                        className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                        title="Tutup (Esc)"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Prev button */}
                    <button
                        onClick={() =>
                            setEnlargedIndex((prev) =>
                                prev !== null && prev > 0 ? prev - 1 : filteredMosaics.length - 1,
                            )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                        title="Foto sebelumnya (Panah Kiri)"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>

                    {/* Next button */}
                    <button
                        onClick={() =>
                            setEnlargedIndex((prev) =>
                                prev !== null && prev < filteredMosaics.length - 1 ? prev + 1 : 0,
                            )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                        title="Foto berikutnya (Panah Kanan)"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Enlarge Content Container */}
                    <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-card border border-sidebar-border/60 shadow-2xl">
                        {/* High-Resolution Image Area */}
                        <div className="relative flex max-h-[68vh] min-h-[300px] flex-1 items-center justify-center overflow-hidden bg-black/80">
                            <img
                                src={currentEnlarged.image_url}
                                alt={currentEnlarged.caption}
                                className="max-h-[68vh] w-auto max-w-full object-contain"
                            />
                        </div>

                        {/* Caption & Metadata Footer */}
                        <div className="border-t border-sidebar-border/70 bg-card p-5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1.5 flex-1">
                                    {currentEnlarged.title && (
                                        <h3 className="text-lg font-bold text-foreground">
                                            {currentEnlarged.title}
                                        </h3>
                                    )}
                                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                                        {currentEnlarged.caption}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-muted-foreground">
                                        <span>
                                            Di-entry oleh: <strong className="text-foreground">{currentEnlarged.user.name}</strong> ({currentEnlarged.user.role})
                                        </span>
                                        {currentEnlarged.taken_at && (
                                            <span>• Tanggal foto: {new Date(currentEnlarged.taken_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        )}
                                        <span>
                                            • {enlargedIndex! + 1} dari {filteredMosaics.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Compression Stats & Actions */}
                                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
                                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-right">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                                            <Sparkles className="h-3.5 w-3.5" />
                                            Hemat {currentEnlarged.compression_ratio ?? 0}%
                                        </div>
                                        <div className="text-[11px] text-muted-foreground mt-0.5">
                                            {formatBytes(currentEnlarged.file_size)} (asli {formatBytes(currentEnlarged.original_file_size)})
                                        </div>
                                    </div>

                                    {/* Action buttons if owner or superadmin */}
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={currentEnlarged.image_url}
                                            download={currentEnlarged.original_filename || 'mozaik-foto.webp'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 rounded-lg border border-sidebar-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                                        >
                                            <Download className="h-3.5 w-3.5" />
                                            Unduh
                                        </a>

                                        {(isSuperadmin || currentUserId === currentEnlarged.user_id) && (
                                            <>
                                                <button
                                                    onClick={() => openEditModal(currentEnlarged)}
                                                    className="flex items-center gap-1.5 rounded-lg border border-sidebar-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                                                >
                                                    <Edit3 className="h-3.5 w-3.5" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(currentEnlarged)}
                                                    className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Hapus
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                UPLOAD MODAL (Entry Foto Mozaik oleh Editor / Superadmin)
                With auto-compression and caption
               ───────────────────────────────────────────────────────────── */}
            {isUploadOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
                    <div className="w-full max-w-xl rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-sidebar-border/60">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                                    <UploadCloud className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-foreground">Entry Foto Mozaik</h2>
                                    <p className="text-xs text-muted-foreground">
                                        Foto akan dikompresi otomatis & dijadikan tile mozaik 3cm x 3cm
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setIsUploadOpen(false);
                                    resetUpload();
                                    setPreviewUrls([]);
                                }}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleUploadSubmit} className="mt-5 space-y-4">
                            {/* File Upload Box */}
                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    Pilih File Foto (Bisa pilih beberapa sekaligus)
                                </label>
                                <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sidebar-border/80 bg-muted/20 p-6 transition-colors hover:border-amber-500/50">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        required
                                    />
                                    <UploadCloud className="h-8 w-8 text-amber-500 mb-2 opacity-80" />
                                    <p className="text-xs font-medium text-foreground text-center">
                                        Klik atau seret file foto ke area ini
                                    </p>
                                    <p className="text-[11px] text-muted-foreground mt-1">
                                        JPG, PNG, WebP (akan dikompresi & dipotong untuk tile 3cm x 3cm)
                                    </p>
                                </div>
                                {uploadErrors.photos && (
                                    <p className="mt-1 text-xs text-red-500">{uploadErrors.photos}</p>
                                )}
                            </div>

                            {/* Previews */}
                            {previewUrls.length > 0 && (
                                <div>
                                    <span className="text-xs text-muted-foreground">
                                        {previewUrls.length} foto dipilih (pratinjau tile 3cm):
                                    </span>
                                    <div className="mt-2 flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                                        {previewUrls.map((url, i) => (
                                            <div
                                                key={i}
                                                style={{ width: '3cm', height: '3cm' }}
                                                className="overflow-hidden rounded-md border border-amber-500/40 shadow-xs"
                                            >
                                                <img src={url} alt="Preview" className="h-full w-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Caption (Wajib) */}
                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    Caption / Keterangan Foto <span className="text-amber-500">*</span>
                                </label>
                                <textarea
                                    value={uploadData.caption}
                                    onChange={(e) => setUploadData('caption', e.target.value)}
                                    placeholder="Ceritakan momen atau keterangan foto ini..."
                                    rows={3}
                                    className="w-full rounded-xl border border-sidebar-border/70 bg-background p-3 text-sm transition-colors focus:border-amber-500 focus:outline-hidden"
                                    required
                                />
                                {uploadErrors.caption && (
                                    <p className="mt-1 text-xs text-red-500">{uploadErrors.caption}</p>
                                )}
                            </div>

                            {/* Optional Title & Date */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                                        Judul Foto (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={uploadData.title}
                                        onChange={(e) => setUploadData('title', e.target.value)}
                                        placeholder="Contoh: Reuni Akbar 2026"
                                        className="w-full rounded-xl border border-sidebar-border/70 bg-background py-2 px-3 text-sm transition-colors focus:border-amber-500 focus:outline-hidden"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                                        Tanggal Diambil (Opsional)
                                    </label>
                                    <input
                                        type="date"
                                        value={uploadData.taken_at}
                                        onChange={(e) => setUploadData('taken_at', e.target.value)}
                                        className="w-full rounded-xl border border-sidebar-border/70 bg-background py-2 px-3 text-sm transition-colors focus:border-amber-500 focus:outline-hidden"
                                    />
                                </div>
                            </div>

                            {/* Compression notice */}
                            <div className="rounded-xl bg-amber-500/10 p-3 text-xs text-amber-500 flex items-start gap-2">
                                <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                                <span>
                                    <strong>Kompresi Cerdas Otomatis:</strong> Gambar akan diperkecil dan dikompresi ke format WebP berkualitas tinggi sehingga kapasitas server tetap awet dan hemat memori.
                                </span>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-sidebar-border/60">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsUploadOpen(false);
                                        resetUpload();
                                        setPreviewUrls([]);
                                    }}
                                    className="rounded-xl px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploadProcessing || uploadData.photos.length === 0 || !uploadData.caption.trim()}
                                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-amber-500/20 hover:bg-amber-600 disabled:opacity-50"
                                >
                                    <UploadCloud className="h-4 w-4" />
                                    {uploadProcessing ? 'Mengompresi & Menyimpan...' : 'Upload & Kompresi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                EDIT CAPTION MODAL
               ───────────────────────────────────────────────────────────── */}
            {editingMosaic && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-sidebar-border/60">
                            <h2 className="text-base font-bold text-foreground">Edit Keterangan Foto</h2>
                            <button
                                onClick={() => setEditingMosaic(null)}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    Judul (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={editData.title}
                                    onChange={(e) => setEditData('title', e.target.value)}
                                    className="w-full rounded-xl border border-sidebar-border/70 bg-background py-2 px-3 text-sm focus:border-amber-500 focus:outline-hidden"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    Caption / Keterangan <span className="text-amber-500">*</span>
                                </label>
                                <textarea
                                    value={editData.caption}
                                    onChange={(e) => setEditData('caption', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-xl border border-sidebar-border/70 bg-background p-3 text-sm focus:border-amber-500 focus:outline-hidden"
                                    required
                                />
                                {editErrors.caption && (
                                    <p className="mt-1 text-xs text-red-500">{editErrors.caption}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    Tanggal Foto (Opsional)
                                </label>
                                <input
                                    type="date"
                                    value={editData.taken_at}
                                    onChange={(e) => setEditData('taken_at', e.target.value)}
                                    className="w-full rounded-xl border border-sidebar-border/70 bg-background py-2 px-3 text-sm focus:border-amber-500 focus:outline-hidden"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-sidebar-border/60">
                                <button
                                    type="button"
                                    onClick={() => setEditingMosaic(null)}
                                    className="rounded-xl px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing || !editData.caption.trim()}
                                    className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
                                >
                                    {editProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
