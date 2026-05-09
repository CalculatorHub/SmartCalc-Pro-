import React, { useState, useEffect } from "react";
import Card from "../../components/ui/Card";
import Card3D from "../../components/ui/3DCard";
import Icon3D from "../../components/ui/3DIcon";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { api } from "../../utils/api";
import { Lock, LogOut, Shield, MessageSquare, LayoutDashboard, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AdminDashboard from "./AdminDashboard";

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "feedback">("dashboard");
  const [feedback, setFeedback] = useState<any[]>([]);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const data = await api("/api/admin/feedback");
      setFeedback(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-2">
          Admin Terminal
        </h2>
        <button onClick={onLogout} className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 shadow shadow-blue-500/10 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-white/5 backdrop-blur-xl">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex-1 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 ${
            activeTab === "dashboard" ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg" : "opacity-50"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`flex-1 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 ${
            activeTab === "feedback" ? "bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg" : "opacity-50"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Feedback
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "dashboard" ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <AdminDashboard />
          </motion.div>
        ) : (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Card3D>
              <p className="text-sm opacity-60 mb-6">User transmissions access active.</p>
              <div className="space-y-4">
                {feedback.length === 0 ? (
                  <p className="text-center py-10 opacity-30 italic text-sm">No transmissions detected...</p>
                ) : (
                  feedback.map((f: any) => (
                    <div key={f.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-white/5 space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-sm font-medium leading-relaxed">{f.feedback}</p>
                        {f.rating && (
                          <div className="flex gap-0.5 shrink-0 pt-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className={`w-3 h-3 ${s <= f.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 dark:text-slate-800'}`} />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest opacity-40 pt-2 border-t border-slate-100 dark:border-white/5">
                        <span>ID: {f.id.slice(-6)}</span>
                        <span>{new Date(f.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card3D>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
