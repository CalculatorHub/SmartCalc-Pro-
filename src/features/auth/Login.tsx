import React, { useState } from "react";
import Card3D from "../../components/ui/3DCard";
import Icon3D from "../../components/ui/3DIcon";
import Input from "../../components/ui/MotionInput";
import Button from "../../components/ui/MotionButton";
import { api } from "../../utils/api";
import { Lock, Cpu } from "lucide-react";
import { motion } from "motion/react";

interface LoginProps {
  onLogin: (token: string, role: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api("/api/admin/login", "POST", { username, password });
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", "admin");
        onLogin(res.token, "admin");
      }
    } catch (err: any) {
      setError(err.message || "Access Denied");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <Card3D className="space-y-8 text-center">
          <div className="flex justify-center">
            <Icon3D icon={<Cpu className="w-8 h-8" />} color="from-blue-600 to-indigo-900" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white">
              NEURAL GATE
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
              Biometric Verification Required
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-left space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Identifier</label>
              <input 
                className="input"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="USER_ID"
              />
            </div>
            <div className="text-left space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Access Key</label>
              <input 
                className="input"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-pink-500 text-[10px] font-black uppercase tracking-widest"
            >
              {error}
            </motion.p>
          )}

          <button className="btn" onClick={handleLogin} disabled={loading}>
            {loading ? "VERIFYING..." : "UNLATCH TERMINAL"}
          </button>

          <p className="text-[10px] opacity-30 font-medium">
            Authorized Personnel Only. Terminal usage is monitored.
          </p>
        </Card3D>
      </motion.div>
    </div>
  );
}
