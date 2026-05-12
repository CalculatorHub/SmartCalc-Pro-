import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Wifi, WifiOff } from 'lucide-react';

export default function DownloadAppButton() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleAction = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    } else if (window.self !== window.top) {
      // If in iframe and not installable, suggest opening in new tab
      window.open(window.location.href, '_blank');
    }
  };

  // Remove the null return so the button is always visible
  // if (!isInstallable && !deferredPrompt) return null;

  const isIframe = window.self !== window.top;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {/* Status Dot */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
          <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]'}`} />
          <span className="text-[8px] font-black uppercase tracking-[0.1em] text-gray-400">
            {isOnline ? 'ONLINE' : 'OFFLINE MODE'}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAction}
          disabled={!isInstallable && !isIframe}
          className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white shadow-lg shadow-blue-500/20 rounded-full transition-all duration-300 group ring-2 ring-blue-500/50 ${(!isInstallable && !isIframe) ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
        >
          <Download className="w-4 h-4 text-white group-hover:animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isInstallable ? 'Install Now' : (isIframe ? 'Open to Install' : 'Install App')}
          </span>
        </motion.button>
      </div>
      
      {isIframe && (
        <p className="text-[9px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest opacity-80 pl-1">
          * Open in new tab or phone browser to install
        </p>
      )}
    </div>
  );
}
