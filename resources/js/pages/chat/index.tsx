import { Head, router, usePage } from '@inertiajs/react';
import {
    Hash,
    MessageSquare,
    MessagesSquare,
    Search,
    Send,
    ShieldCheck,
    Trash2,
    User as UserIcon,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';

type Colleague = {
    id: number;
    name: string;
    email: string;
    role: 'superadmin' | 'editor';
};

type Message = {
    id: number;
    user_id: number;
    recipient_id: number | null;
    message: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
};

type PageProps = {
    colleagues: Colleague[];
    activeRecipient: Colleague | null;
    messages: Message[];
    generalCount: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Chat Tim', href: '/chat' },
];

export default function ChatIndex() {
    const { colleagues, activeRecipient, messages: initialMessages, auth } = usePage<PageProps & { auth: { user: User } }>().props;
    const currentUser = auth.user;

    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [searchColleague, setSearchColleague] = useState('');
    const [isSending, setIsSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Sync messages when prop changes
    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages, activeRecipient?.id]);

    // Auto-scroll to bottom
    const scrollToBottom = (smooth = true) => {
        messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    };

    useEffect(() => {
        scrollToBottom(false);
    }, [activeRecipient?.id]);

    useEffect(() => {
        scrollToBottom(true);
    }, [messages.length]);

    // Polling for incoming new messages every 3.5 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            const lastId = messages.length > 0 ? messages[messages.length - 1].id : 0;
            const recipientParam = activeRecipient ? `&recipient_id=${activeRecipient.id}` : '';
            try {
                const res = await fetch(`/chat/messages?after_id=${lastId}${recipientParam}`, {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.messages && data.messages.length > 0) {
                        setMessages((prev) => {
                            const existingIds = new Set(prev.map((m) => m.id));
                            const uniqueIncoming = data.messages.filter((m: Message) => !existingIds.has(m.id));
                            return uniqueIncoming.length > 0 ? [...prev, ...uniqueIncoming] : prev;
                        });
                    }
                }
            } catch {
                // Ignore polling network blips
            }
        }, 3500);

        return () => clearInterval(interval);
    }, [messages, activeRecipient]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = newMessage.trim();
        if (!trimmed || isSending) return;

        setIsSending(true);

        try {
            // Get CSRF token
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    message: trimmed,
                    recipient_id: activeRecipient ? activeRecipient.id : null,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.message) {
                    setMessages((prev) => [...prev, result.message]);
                    setNewMessage('');
                    if (textareaRef.current) {
                        textareaRef.current.style.height = 'auto';
                    }
                }
            } else {
                // Fallback to Inertia router if JSON route rejected
                router.post(
                    '/chat',
                    {
                        message: trimmed,
                        recipient_id: activeRecipient ? activeRecipient.id : null,
                    },
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            setNewMessage('');
                        },
                    },
                );
            }
        } catch {
            // Fallback to router post
            router.post(
                '/chat',
                {
                    message: trimmed,
                    recipient_id: activeRecipient ? activeRecipient.id : null,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setNewMessage('');
                    },
                },
            );
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleDeleteMessage = (msgId: number) => {
        if (confirm('Hapus pesan ini?')) {
            router.delete(`/chat/${msgId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setMessages((prev) => prev.filter((m) => m.id !== msgId));
                },
            });
        }
    };

    const filteredColleagues = colleagues.filter(
        (c) =>
            c.name.toLowerCase().includes(searchColleague.toLowerCase()) ||
            c.email.toLowerCase().includes(searchColleague.toLowerCase()),
    );

    const formatMessageTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const formatMessageDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat Tim (Editor & Superadmin)" />

            <div className="flex h-[calc(100vh-8rem)] min-h-[550px] flex-1 overflow-hidden p-4 md:p-6">
                <div className="flex h-full w-full overflow-hidden rounded-2xl border border-sidebar-border/70 bg-card shadow-sm">
                    {/* Left Sidebar: Channels & Colleagues */}
                    <div className="flex w-72 shrink-0 flex-col border-r border-sidebar-border/70 bg-muted/20 md:w-80">
                        {/* Sidebar Header */}
                        <div className="border-b border-sidebar-border/70 p-4">
                            <div className="flex items-center gap-2">
                                <MessagesSquare className="h-5 w-5 text-purple-400" />
                                <h2 className="font-bold text-foreground">Chat Tim</h2>
                                <span className="ml-auto rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                                    Editor & Admin
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Komunikasi internal pengurus silsilah
                            </p>
                        </div>

                        {/* Search Input */}
                        <div className="p-3 border-b border-sidebar-border/60">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Cari editor / superadmin..."
                                    value={searchColleague}
                                    onChange={(e) => setSearchColleague(e.target.value)}
                                    className="w-full rounded-xl border border-sidebar-border/70 bg-background py-1.5 pl-8 pr-3 text-xs transition-colors focus:border-purple-500 focus:outline-hidden"
                                />
                            </div>
                        </div>

                        {/* Rooms & Contacts List */}
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {/* General Room */}
                            <button
                                onClick={() => router.get('/chat', {}, { preserveState: false })}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                                    !activeRecipient
                                        ? 'bg-purple-500/10 text-purple-400 font-semibold ring-1 ring-purple-500/20'
                                        : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                                }`}
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                                    <Hash className="h-5 w-5" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <span className="truncate">Forum Tim</span>
                                        <span className="text-[10px] text-muted-foreground">Grup</span>
                                    </div>
                                    <p className="truncate text-xs opacity-70">
                                        Diskusi umum seluruh editor
                                    </p>
                                </div>
                            </button>

                            <div className="pt-3 pb-1 px-3">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    Pesan Langsung ({filteredColleagues.length})
                                </span>
                            </div>

                            {filteredColleagues.map((colleague) => {
                                const isActive = activeRecipient?.id === colleague.id;
                                const isSuper = colleague.role === 'superadmin';

                                return (
                                    <button
                                        key={colleague.id}
                                        onClick={() =>
                                            router.get(`/chat?recipient_id=${colleague.id}`, {}, { preserveState: false })
                                        }
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-all ${
                                            isActive
                                                ? 'bg-purple-500/10 text-purple-400 font-semibold ring-1 ring-purple-500/20'
                                                : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                                        }`}
                                    >
                                        <div
                                            className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ${
                                                isSuper
                                                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                                                    : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                                            }`}
                                        >
                                            {colleague.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex items-center justify-between">
                                                <span className="truncate font-medium text-foreground">
                                                    {colleague.name}
                                                </span>
                                                <span
                                                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-medium ${
                                                        isSuper
                                                            ? 'bg-purple-500/15 text-purple-400'
                                                            : 'bg-emerald-500/15 text-emerald-400'
                                                    }`}
                                                >
                                                    {isSuper ? 'Admin' : 'Editor'}
                                                </span>
                                            </div>
                                            <p className="truncate text-[11px] text-muted-foreground">
                                                {colleague.email}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Main Chat Area */}
                    <div className="flex flex-1 flex-col overflow-hidden bg-background">
                        {/* Chat Header */}
                        <div className="flex items-center justify-between border-b border-sidebar-border/70 px-6 py-3.5 bg-muted/10">
                            <div className="flex items-center gap-3">
                                {activeRecipient ? (
                                    <>
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm ${
                                                activeRecipient.role === 'superadmin'
                                                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                                                    : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                                            }`}
                                        >
                                            {activeRecipient.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-foreground">
                                                    {activeRecipient.name}
                                                </h3>
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                        activeRecipient.role === 'superadmin'
                                                            ? 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20'
                                                            : 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                                                    }`}
                                                >
                                                    {activeRecipient.role === 'superadmin' ? 'Superadmin' : 'Editor'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {activeRecipient.email}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-foreground">
                                                    Forum Tim Editor & Superadmin
                                                </h3>
                                                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                                                    Publik Internal
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Semua editor dan admin dapat berdiskusi di sini
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Messages Thread */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                            {messages.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                                    <MessageSquare className="h-12 w-12 opacity-20 mb-3" />
                                    <h4 className="font-semibold text-foreground text-sm">Belum Ada Pesan</h4>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                                        Mulai percakapan dengan sesama rekan Editor atau Superadmin mengenai pembaruan silsilah.
                                    </p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMe = msg.user_id === currentUser.id;
                                    const isSuper = msg.user?.role === 'superadmin';
                                    const showDateHeader =
                                        index === 0 ||
                                        formatMessageDate(messages[index - 1].created_at) !==
                                            formatMessageDate(msg.created_at);

                                    return (
                                        <div key={msg.id} className="space-y-2">
                                            {showDateHeader && (
                                                <div className="flex justify-center my-3">
                                                    <span className="rounded-full bg-muted/60 px-3 py-1 text-[10px] font-medium text-muted-foreground border border-sidebar-border/40">
                                                        {formatMessageDate(msg.created_at)}
                                                    </span>
                                                </div>
                                            )}

                                            <div
                                                className={`group flex items-end gap-2.5 ${
                                                    isMe ? 'flex-row-reverse' : 'flex-row'
                                                }`}
                                            >
                                                {/* Avatar */}
                                                {!isMe && (
                                                    <div
                                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ${
                                                            isSuper
                                                                ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                                                                : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                                                        }`}
                                                        title={`${msg.user?.name} (${isSuper ? 'Superadmin' : 'Editor'})`}
                                                    >
                                                        {msg.user?.name ? msg.user.name.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                )}

                                                <div
                                                    className={`max-w-[75%] md:max-w-[65%] space-y-1 ${
                                                        isMe ? 'items-end' : 'items-start'
                                                    }`}
                                                >
                                                    {/* Sender info if group message & not me */}
                                                    {!isMe && !activeRecipient && (
                                                        <div className="flex items-center gap-1.5 pl-1">
                                                            <span className="text-xs font-semibold text-foreground">
                                                                {msg.user?.name}
                                                            </span>
                                                            <span
                                                                className={`rounded-full px-1.5 py-0.2 text-[9px] font-medium ${
                                                                    isSuper
                                                                        ? 'bg-purple-500/10 text-purple-400'
                                                                        : 'bg-emerald-500/10 text-emerald-400'
                                                                }`}
                                                            >
                                                                {isSuper ? 'Admin' : 'Editor'}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Message bubble */}
                                                    <div className="relative group/bubble">
                                                        <div
                                                            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-xs ${
                                                                isMe
                                                                    ? 'rounded-br-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-normal'
                                                                    : 'rounded-bl-xs border border-sidebar-border/70 bg-card text-foreground'
                                                            }`}
                                                        >
                                                            {msg.message}
                                                        </div>

                                                        {/* Delete button (only for sender or superadmin) */}
                                                        {(isMe || currentUser.role === 'superadmin') && (
                                                            <button
                                                                onClick={() => handleDeleteMessage(msg.id)}
                                                                className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover/bubble:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-red-400 ${
                                                                    isMe ? '-left-7' : '-right-7'
                                                                }`}
                                                                title="Hapus pesan"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Timestamp */}
                                                    <div
                                                        className={`flex items-center gap-1 px-1 text-[10px] text-muted-foreground ${
                                                            isMe ? 'justify-end' : 'justify-start'
                                                        }`}
                                                    >
                                                        <span>{formatMessageTime(msg.created_at)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input Box */}
                        <div className="border-t border-sidebar-border/70 bg-muted/20 p-4">
                            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                                <div className="relative flex-1">
                                    <textarea
                                        ref={textareaRef}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={`Tulis pesan untuk ${
                                            activeRecipient ? activeRecipient.name : 'forum tim'
                                        }... (Tekan Enter untuk kirim)`}
                                        rows={1}
                                        className="w-full resize-none rounded-xl border border-sidebar-border/70 bg-background px-4 py-3 text-sm transition-colors focus:border-purple-500 focus:outline-hidden max-h-32"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || isSending}
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white transition-all hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-600/20"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                            <p className="mt-1.5 text-[11px] text-muted-foreground pl-1">
                                Shift + Enter untuk baris baru. Pesan hanya dapat dibaca oleh role Editor & Superadmin.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
