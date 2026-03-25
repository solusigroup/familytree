import { Head, Link } from '@inertiajs/react';
import { ScrollText, ArrowLeft, ArrowRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface LogData {
    id: number;
    log_name: string;
    description: string;
    subject_type: string;
    subject_id: number;
    causer: string;
    properties: {
        attributes?: Record<string, any>;
        old?: Record<string, any>;
    };
    created_at: string;
}

interface PaginationData {
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface ActivityLogsPageProps {
    logs: LogData[];
    pagination: PaginationData;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Log Aktivitas', href: '/activity-logs' },
];

export default function ActivityLogs({ logs, pagination }: ActivityLogsPageProps) {
    const renderActionBadge = (action: string) => {
        switch (action.toLowerCase()) {
            case 'created':
                return <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">Dibuat</span>;
            case 'updated':
                return <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500 ring-1 ring-inset ring-blue-500/20">Diubah</span>;
            case 'deleted':
                return <span className="inline-flex items-center rounded-md bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500 ring-1 ring-inset ring-red-500/20">Dihapus</span>;
            default:
                return <span className="inline-flex items-center rounded-md bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-500 ring-1 ring-inset ring-gray-500/20">{action}</span>;
        }
    };

    const renderChangedAttributes = (log: LogData) => {
        if (!log.properties.attributes && !log.properties.old) return <span className="text-muted-foreground">-</span>;
        
        return (
            <div className="space-y-1 text-xs">
                {log.properties.attributes && (
                    <div className="rounded-md bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                        <span className="font-semibold block mb-1">Data Baru:</span>
                        <pre className="whitespace-pre-wrap font-mono text-[10px] m-0 bg-transparent">
                            {JSON.stringify(log.properties.attributes, null, 2)}
                        </pre>
                    </div>
                )}
                {log.properties.old && (
                    <div className="rounded-md bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400 mt-1">
                        <span className="font-semibold block mb-1">Data Lama:</span>
                        <pre className="whitespace-pre-wrap font-mono text-[10px] m-0 bg-transparent">
                            {JSON.stringify(log.properties.old, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Log Aktivitas" />
            <div className="flex h-full flex-1 flex-col justify-center space-y-6 p-6">
                <div className="flex w-full items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Log Aktivitas Sistem</h2>
                        <p className="text-sm text-muted-foreground">Melacak semua perubahan data pada aplikasi.</p>
                    </div>
                </div>

                <div className="flex-1 rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
                    <div className="relative w-full overflow-auto flex-1">
                        <table className="w-full caption-bottom text-sm max-w-full">
                            <thead className="[&_tr]:border-b bg-muted/50 border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[150px]">Waktu</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[150px]">Oleh User</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[120px]">Aksi</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[150px]">Modul / ID</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Detail Perubahan</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center align-middle text-muted-foreground h-24">
                                            Tidak ada aktivitas yang tercatat.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium text-xs">{log.created_at}</td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{log.causer}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {renderActionBadge(log.description)}
                                            </td>
                                            <td className="p-4 align-middle text-xs">
                                                <span className="font-semibold">{log.subject_type || 'Custom'}</span>
                                                {log.subject_id && <span className="text-muted-foreground"> #{log.subject_id}</span>}
                                            </td>
                                            <td className="p-4 align-middle max-w-[300px]">
                                                {renderChangedAttributes(log)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="border-t px-4 py-4 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Halaman <span className="font-medium text-foreground">{pagination.current_page}</span> dari <span className="font-medium text-foreground">{pagination.last_page}</span> (Total: {pagination.total} log)
                            </div>
                            <div className="flex gap-1">
                                {pagination.links.map((link, i) => {
                                    if (link.url === null) {
                                        return (
                                            <div key={i} className="flex items-center justify-center p-2 text-sm text-muted-foreground opacity-50" dangerouslySetInnerHTML={{ __html: link.label.replace('&laquo; Sebelumnya', '<').replace('Berikutnya &raquo;', '>') }} />
                                        );
                                    }
                                    return (
                                        <Link 
                                            key={i} 
                                            href={link.url}
                                            preserveScroll
                                            className={`flex items-center justify-center rounded-md px-3 py-1 text-sm transition-colors ${link.active ? 'bg-primary text-primary-foreground font-medium shadow' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label.replace('&laquo; Sebelumnya', 'Prev').replace('Berikutnya &raquo;', 'Next') }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
