import React, { useState } from "react";
import Card3D from "../../components/ui/3DCard";
import Icon3D from "../../components/ui/3DIcon";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { api } from "../../utils/api";
import { ShieldAlert, Fingerprint } from "lucide-react";
import { motion } from "motion/react";

interface AdminAccessProps {
  onSuccess: (adminToken: string) => void;
  onCancel: () => void;
}

export default function AdminAccess({ onSuccess, onCancel }: AdminAccessProps) {
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api("/api/admin/step-up", "POST", { password: pass });
      if (res.adminToken) {
        localStorage.setItem("adminToken", res.adminToken);
        onSuccess(res.adminToken);
      }
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
              Neural Step-Up
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
              Identity Affirmation Required
            </p>
          </div>

          <div className="text-left space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Access Key</label>
            <Input 
              value={pass} 
              setValue={setPass} 
              type="password"
              placeholder="••••••••"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-pink-500 text-[10px] font-black uppercase tracking-widest">{error}</p>
          )}

          <div className="space-y-3">
            <Button onClick={handleVerify} disabled={loading}>
              {loading ? "VERIFYING..." : "GRANT TERMINAL ACCESS"}
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
