import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download } from "lucide-react";

export default function InstallPWA() {
  const [prompt, setPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = () => {
    if (prompt) {
      prompt.prompt();
      prompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          setPrompt(null);
        }
      });
    }
  };

  return (
    <AnimatePresence>
      {prompt && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          whileTap={{ scale: 0.95 }}
          onClick={install}
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg font-semibold flex items-center justify-center gap-2"
          id="install-pwa-button"
        >
          <Download className="w-5 h-5" />
          Install App
        </motion.button>
      )}
    </AnimatePresence>
  );
}
