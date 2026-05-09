import React, { useState, useEffect } from "react";
import Card from "../../components/ui/MotionCard";
import Card3D from "../../components/ui/3DCard";
import Icon3D from "../../components/ui/3DIcon";
import Button from "../../components/ui/MotionButton";
import { logoutAdmin } from "../../services/authService";
import { subscribeToFeedback, removeFeedback, updateFeedbackStatus } from "../../services/feedbackService";
import { auth } from "../../lib/firebase";
import { LogOut, MessageSquare, LayoutDashboard, Star, Trash2, Download, Filter, Edit2, Check, X, ShieldAlert, CheckSquare, Square, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AdminDashboard from "./AdminDashboard";

import { useAdminStore } from "../../store/adminStore";

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "feedback">("dashboard");
  const [feedback, setFeedback] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const ADMIN_EMAIL = "webistehosting@gmail.com";
  const isPasswordVerified = useAdminStore((s) => s.isPasswordVerified);
  const isGoogleAdmin = auth.currentUser && auth.currentUser.email === ADMIN_EMAIL;

  if (!isGoogleAdmin && !isPasswordVerified) {
    return (
      <Card3D className="text-center py-20">
        <ShieldAlert className="w-16 h-16 mx-auto text-pink-500 mb-4" />
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Access Denied</h2>
        <p className="opacity-50 text-sm">Your profile is not authorized for terminal access.</p>
        <Button onClick={onLogout} className="mt-6">Return to Grid</Button>
      </Card3D>
    );
  }

  useEffect(() => {
    if (activeTab === "feedback" && auth.currentUser) {
      const unsub = subscribeToFeedback((data) => {
        setFeedback(data);
      });
      return () => unsub();
    }
  }, [activeTab]);

  const filtered = filter === "All" 
    ? feedback 
    : feedback.filter(f => f.type === filter);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(f => f.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Purge ${selectedIds.size} selected transmissions?`)) return;
    setBulkLoading(true);
    try {
      await Promise.all(Array.from(selectedIds).map((id: string) => removeFeedback(id)));
      setSelectedIds(new Set());
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkMarkRead = async () => {
    setBulkLoading(true);
    try {
      await Promise.all(Array.from(selectedIds).map((id: string) => 
        updateFeedbackStatus(id, { status: 'read' })
      ));
      setSelectedIds(new Set());
    } finally {
      setBulkLoading(false);
    }
  };

  const handlePurgeAll = async () => {
    if (!confirm("CRITICAL: This will permanently delete ALL transmissions in the database. Proceed?")) return;
    setBulkLoading(true);
    try {
      await Promise.all(feedback.map(f => removeFeedback(f.id)));
      setSelectedIds(new Set());
    } finally {
      setBulkLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = "Type,Rating,Message,Date\n";
    const rows = filtered.map(f => 
      `${f.type},${f.rating || 0},"${f.message.replace(/"/g, '""')}",${f.createdAt?.toDate().toLocaleString() || "N/A"}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SmartCal_Feedback_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Permanently purge this transmission?")) {
      await removeFeedback(id);
    }
  };

  const handleEditInit = (f: any) => {
    setEditingId(f.id);
    setEditVal(f.message);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      await updateFeedbackStatus(editingId, { message: editVal });
      setEditingId(null);
    } catch (err: any) {
      alert("Update failed: " + err.message);
    }
  };

  const handleLogoutWithAuth = async () => {
    await logoutAdmin();
    useAdminStore.getState().logoutAdmin();
    onLogout();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-2">
          Admin Terminal
        </h2>
        <button onClick={handleLogoutWithAuth} className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 shadow shadow-blue-500/10 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
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
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500"
                >
                  {selectedIds.size === filtered.length && filtered.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  {selectedIds.size === filtered.length && filtered.length > 0 ? "DESELECT ALL" : "SELECT ALL"}
                </button>

                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-white/5 overflow-x-auto no-scrollbar">
                  {["All", "Bug", "UI/UX", "Improvement", "Suggestion"].map(t => (
                    <button
                      key={t}
                      onClick={() => {
                        setFilter(t);
                        setSelectedIds(new Set());
                      }}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        filter === t ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400" : "opacity-40"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <AnimatePresence>
                  {selectedIds.size > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-2"
                    >
                      <button 
                        onClick={handleBulkMarkRead}
                        disabled={bulkLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                      >
                        <Eye className="w-4 h-4" /> Read ({selectedIds.size})
                      </button>
                      <button 
                        onClick={handleBulkDelete}
                        disabled={bulkLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-xl shadow-lg shadow-pink-500/20 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" /> Delete ({selectedIds.size})
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button 
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20 transition-all font-black text-[10px] uppercase tracking-widest"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <button 
                  onClick={handlePurgeAll}
                  disabled={bulkLoading || feedback.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 rounded-xl border border-pink-500/20 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-30"
                >
                  <Trash2 className="w-4 h-4" /> Purge All
                </button>
              </div>
            </div>

            <Card3D>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm opacity-60">Firestore data streams active.</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Feed
                </div>
              </div>

              <div className="space-y-4">
                {filtered.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
                    <MessageSquare className="w-12 h-12 mx-auto opacity-10 mb-4" />
                    <p className="opacity-30 italic text-sm">No transmissions detected under current filter.</p>
                  </div>
                ) : (
                  filtered.map((f: any) => (
                    <motion.div 
                      layout
                      key={f.id} 
                      className={`p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border space-y-4 hover:shadow-md transition-shadow relative group ${
                        selectedIds.has(f.id) ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-200 dark:border-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <button 
                            onClick={() => toggleSelect(f.id)}
                            className={`mt-1.5 p-1 rounded-md transition-colors ${
                              selectedIds.has(f.id) ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700 hover:text-slate-400'
                            }`}
                          >
                            {selectedIds.has(f.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                          </button>
                          
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {f.status === 'read' && (
                                <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded text-[8px] font-black uppercase">READ</span>
                              )}
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                              f.type === 'Bug' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                              f.type === 'UI/UX' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                              'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            }`}>
                              {f.type}
                            </span>
                            {f.rating && (
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <Star key={s} className={`w-2.5 h-2.5 ${s <= f.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 dark:text-slate-800'}`} />
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {editingId === f.id ? (
                            <div className="space-y-2">
                              <textarea 
                                value={editVal}
                                onChange={(e) => setEditVal(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl text-sm border border-slate-200 dark:border-white/10 outline-none"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button onClick={handleSaveEdit} className="p-2 rounded-lg bg-emerald-500 text-white"><Check className="w-4 h-4" /></button>
                                <button onClick={() => setEditingId(null)} className="p-2 rounded-lg bg-slate-500 text-white"><X className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm font-medium leading-relaxed dark:text-slate-200">{f.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditInit(f)}
                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(f.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest opacity-40 pt-3 border-t border-slate-100 dark:border-white/5">
                        <div className="flex gap-3">
                          <span>ID: {f.id.slice(-6)}</span>
                          {f.userId && <span>User: {f.userId}</span>}
                          {f.browser && <span className="hidden sm:inline">Agent: {f.browser} / {f.os}</span>}
                        </div>
                        <span>{f.createdAt?.toDate().toLocaleString() || "Pending..."}</span>
                      </div>
                    </motion.div>
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
