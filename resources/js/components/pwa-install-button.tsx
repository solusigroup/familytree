import { useState } from 'react';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { PwaInstallDialog } from '@/components/pwa-install-dialog';
import { Download } from 'lucide-react';

interface PwaInstallButtonProps {
    className?: string;
    variant?: 'header' | 'sidebar' | 'pill';
}

export function PwaInstallButton({
    className = '',
    variant = 'header',
}: PwaInstallButtonProps) {
    const {
        isInstalled,
        isIosSafari,
        triggerInstall,
        hasPrompt,
    } = usePwaInstall();

    const [dialogOpen, setDialogOpen] = useState(false);

    // If already installed in standalone mode, do not show
    if (isInstalled) {
        return null;
    }

    const handleClick = async () => {
        if (hasPrompt) {
            const installed = await triggerInstall();
            if (!installed) {
                setDialogOpen(true);
            }
        } else {
            setDialogOpen(true);
        }
    };

    let buttonClasses = className;
    if (!className) {
        if (variant === 'header') {
            buttonClasses =
                'flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 transition-all hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-amber-200';
        } else if (variant === 'sidebar') {
            buttonClasses =
                'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-amber-400 hover:bg-amber-500/10 transition';
        } else if (variant === 'pill') {
            buttonClasses =
                'inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md transition hover:scale-105 hover:shadow-amber-500/30';
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                className={buttonClasses}
                title="Pasang aplikasi di Chrome / Safari"
            >
                <Download className="size-4 shrink-0 text-amber-400" />
                <span>Install Aplikasi</span>
            </button>

            <PwaInstallDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                isIosSafari={isIosSafari}
                hasPrompt={hasPrompt}
                onTriggerInstall={triggerInstall}
            />
        </>
    );
}
