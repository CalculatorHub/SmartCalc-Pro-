import React, { useState } from "react";
import Card3D from "../../components/ui/3DCard";
import Icon3D from "../../components/ui/3DIcon";
import Button from "../../components/ui/MotionButton";
import { loginAdmin } from "../../services/authService";
import { ShieldAlert, LogIn } from "lucide-react";
import { motion } from "motion/react";

interface AdminAccessProps {
  onSuccess: (adminToken: string) => void;
  onCancel: () => void;
}

export default function AdminAccess({ onSuccess, onCancel }: AdminAccessProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await loginAdmin();
      onSuccess(user.uid);
    } catch (err: any) {
      setError(err.message || "Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-sm relative z-10"
      >
        <Card3D className="space-y-6 text-center shadow-2xl border-brand-500/30">
          <div className="flex justify-center">
            <Icon3D icon={<ShieldAlert className="w-8 h-8" />} color="from-brand-500 to-indigo-900" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
              Admin Access
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
              Identity Affirmation via Google
            </p>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-4">
            Security protocols active. Only authorized profiles can grant terminal access.
          </p>

          {error && (
            <p className="text-pink-500 text-[10px] font-black uppercase tracking-widest bg-pink-500/10 p-2 rounded-lg">{error}</p>
          )}

          <div className="space-y-3">
            <Button onClick={handleLogin} disabled={loading}>
              <span className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                {loading ? "AUTHENTICATING..." : "LOGIN WITH GOOGLE"}
              </span>
            </Button>
            <button 
              onClick={onCancel}
              className="w-full py-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition"
            >
              Cancel Access
            </button>
          </div>
        </Card3D>
      </motion.div>
    </div>
  );
}
