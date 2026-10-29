/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standaloneCheck =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standaloneCheck);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (isStandalone || isDismissed || !deferredPrompt) {
    return null;
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border-b border-teal-500/30 px-3 py-1.5 flex items-center justify-between text-xs z-30">
      <div className="flex items-center gap-2">
        <Download className="w-3.5 h-3.5 text-teal-400" />
        <span className="text-slate-300 font-medium">Install Block Quest app for offline play</span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleInstall}
          className="px-2.5 py-0.5 rounded-md bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] transition-colors"
        >
          Install
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
