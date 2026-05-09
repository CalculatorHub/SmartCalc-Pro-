import React, { useState } from "react";
import Card3D from "../../components/ui/3DCard";
import Icon3D from "../../components/ui/3DIcon";
import Button from "../../components/ui/MotionButton";
import { loginAdmin, loginAdminPassword } from "../../services/authService";
import { ShieldAlert, LogIn, Fingerprint } from "lucide-react";
import Input from "../../components/ui/MotionInput";
import { useAdminStore } from "../../store/adminStore";
import { motion } from "motion/react";

interface AdminAccessProps {
  onSuccess: (adminToken: string) => void;
  onCancel: () => void;
}

export default function AdminAccess({ onSuccess, onCancel }: AdminAccessProps) {
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const verifyPassword = useAdminStore((s) => s.verifyPassword);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await loginAdmin();
      verifyPassword();
      onSuccess(user.uid);
    } catch (err: any) {
      setError(err.message || "Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    setLoading(true);
    setError("");
    try {
      loginAdminPassword(pass);
      await loginAnonymously();
      verifyPassword();
      onSuccess("password-admin");
    } catch (err: any) {
      setError(err.message);
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

          <div className="text-left space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">Access Key</label>
            <Input 
              value={pass} 
              setValue={setPass} 
              type="password"
              placeholder="••••••••"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-pink-500 text-[10px] font-black uppercase tracking-widest bg-pink-500/10 p-2 rounded-lg">{error}</p>
          )}

          <div className="space-y-3">
            <Button onClick={handlePasswordLogin} disabled={loading || !pass.trim()}>
              <span className="flex items-center justify-center gap-2">
                <Fingerprint className="w-4 h-4" />
                {loading ? "VERIFYING..." : "GRANT ACCESS"}
              </span>
            </Button>
            
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-white/5"></div></div>
              <div className="relative flex justify-center text-[8px] font-black uppercase tracking-widest"><span className="bg-white dark:bg-slate-900 px-2 text-slate-400">OR</span></div>
            </div>

            <Button onClick={handleGoogleLogin} disabled={loading} className="bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/5">
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
