import { useForm } from '@inertiajs/react';
import { Check, Copy, Eye, EyeOff, KeyRound, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import type { User } from '@/types';

type ResetPasswordModalProps = {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
};

export default function ResetPasswordModal({ user, isOpen, onClose }: ResetPasswordModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        password: '',
        password_confirmation: '',
    });

    if (!isOpen || !user) return null;

    const handleClose = () => {
        reset();
        clearErrors();
        setShowPassword(false);
        setCopied(false);
        onClose();
    };

    const generateRandomPassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
        let generated = '';
        for (let i = 0; i < 12; i++) {
            generated += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setData({
            password: generated,
            password_confirmation: generated,
        });
        navigator.clipboard.writeText(generated);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/users/${user.id}/reset-password`, {
            onSuccess: () => {
                handleClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-sidebar-border/60">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                            <KeyRound className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Reset Password</h2>
                            <p className="text-xs text-muted-foreground">
                                Atur kata sandi baru untuk pengguna ini
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* User Info Box */}
                <div className="mt-4 rounded-xl bg-muted/40 p-3 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs">Pengguna:</span>
                        <span className="font-semibold text-foreground">{user.name}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-muted-foreground text-xs">Email:</span>
                        <span className="text-xs text-muted-foreground font-mono">{user.email}</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold text-foreground">
                                Password Baru (Min. 8 karakter)
                            </label>
                            <button
                                type="button"
                                onClick={generateRandomPassword}
                                className="flex items-center gap-1 text-[11px] font-medium text-amber-500 hover:text-amber-400"
                            >
                                <Sparkles className="h-3 w-3" />
                                Buat Acak & Salin
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Masukkan password baru..."
                                className="w-full rounded-xl border border-sidebar-border/70 bg-background py-2.5 pl-3.5 pr-10 text-sm transition-colors focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                        )}
                        {copied && (
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
                                <Check className="h-3 w-3" /> Password acak disalin ke papan klip!
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Konfirmasi Password Baru
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Ketik ulang password baru..."
                            className="w-full rounded-xl border border-sidebar-border/70 bg-background py-2.5 px-3.5 text-sm transition-colors focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                            required
                        />
                        {errors.password_confirmation && (
                            <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-sidebar-border/60">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-xl px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !data.password}
                            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                            <KeyRound className="h-3.5 w-3.5" />
                            {processing ? 'Menyimpan...' : 'Reset Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
