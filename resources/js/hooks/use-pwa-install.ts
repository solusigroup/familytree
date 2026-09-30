import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePwaInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState<boolean>(false);
    const [isIosSafari, setIsIosSafari] = useState<boolean>(false);
    const [isDismissed, setIsDismissed] = useState<boolean>(false);

    useEffect(() => {
        // Check if already in standalone mode
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
            document.referrer.includes('android-app://');

        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        // Check if user previously dismissed prompt within the last 7 days
        const dismissedAt = localStorage.getItem('pwa_install_dismissed_at');
        if (dismissedAt) {
            const timePassed = Date.now() - parseInt(dismissedAt, 10);
            if (timePassed < 7 * 24 * 60 * 60 * 1000) {
                setIsDismissed(true);
            }
        }

        // Detect iOS Safari
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIos = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: boolean }).MSStream;
        const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios|edgios/.test(userAgent);

        if (isIos && isSafari && !isStandalone) {
            setIsIosSafari(true);
        }

        // Listen for Chrome / Chromium beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
            localStorage.removeItem('pwa_install_dismissed_at');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const triggerInstall = async (): Promise<boolean> => {
        if (!deferredPrompt) {
            return false;
        }

        try {
            await deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            if (choiceResult.outcome === 'accepted') {
                setIsInstalled(true);
                setDeferredPrompt(null);
                return true;
            }
        } catch (err) {
            console.error('Error triggering PWA install prompt:', err);
        }

        return false;
    };

    const dismissPrompt = () => {
        setIsDismissed(true);
        localStorage.setItem('pwa_install_dismissed_at', Date.now().toString());
    };

    const canInstall = !isInstalled && (!!deferredPrompt || isIosSafari);

    return {
        isInstalled,
        isIosSafari,
        canInstall,
        isDismissed,
        triggerInstall,
        dismissPrompt,
        hasPrompt: !!deferredPrompt,
    };
}
