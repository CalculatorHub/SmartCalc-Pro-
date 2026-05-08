import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import jsPDF from "jspdf";
import { Lock, TrendingUp, Download, Table, FileJson, LogOut, ChevronRight, Activity, Database, AlertCircle } from "lucide-react";

interface FinanceRecord {
  id: string;
  type: string;
  inputs: any;
  result: number;
  createdAt: string;
}

export default function AdminPanel({ setIsAdmin }: { setIsAdmin: (val: boolean) => void }) {
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);
  const [data, setData] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "admin", password }),
    });

    if (res.ok) {
      setLogged(true);
      setIsAdmin(true);
      loadData();
    } else {
      setError("INTEGRITY_CHECK_FAILED: Invalid Credentials");
    }
  };

  const loadData = async () => {
    setLoading(true);
    const res = await fetch("/api/finance");
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  /* 🔐 LOGIN UI */
  if (!logged) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 flex items-center justify-center min-h-[80vh]"
      >
        <div className="w-full max-w-sm rounded-[2.5rem] p-8 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl shadow-2xl text-center space-y-6 border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
            <Lock className="w-10 h-10 text-white" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Admin Portal</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 dark:text-white/40">Secure Neural Interface Access</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              placeholder="ENTER ACCESS KEY"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-center font-black tracking-[0.3em] uppercase text-sm"
              autoFocus
            />

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 justify-center text-rose-500 text-[10px] font-black uppercase tracking-widest"
                >
                  <AlertCircle className="w-3 h-3" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={login} 
              className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95 transition-all"
            >
              UNLOCK ACCESS
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  /* 📊 EXPORT CSV */
  const exportCSV = () => {
    const headers = ["Type", "Result", "Timestamp"];
    const rows = data.map(d => `${d.type},${d.result},${d.createdAt}`);
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `finance_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  /* 📄 EXPORT PDF */
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("SMARTCALPRO+ FINANCE REPORT", 10, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 30);
    
    data.forEach((d, i) => {
      const y = 45 + i * 15;
      doc.text(`${i + 1}. ${d.type} - RESULT: ₹ ${d.result}`, 15, y);
      doc.text(`   Date: ${new Date(d.createdAt).toLocaleDateString()}`, 15, y + 5);
      if (y > 270) doc.addPage();
    });
    doc.save("finance_records.pdf");
  };

  /* 📊 CHART DATA */
  const chartData = [...data].reverse().map((d, i) => ({
    name: i + 1,
    value: parseFloat(d.result.toString()),
    type: d.type
  }));

  return (
    <div className="p-4 space-y-6 pb-24 max-w-lg mx-auto">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2.5rem] p-6 bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-300" />
              Admin Analytics
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Neural Network Supervision</p>
          </div>
          <button 
            onClick={() => { setLogged(false); setIsAdmin(false); }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-8 flex gap-8 relative z-10">
          <Stat label="Total Cycles" value={data.length} />
          <Stat label="Pulse Status" value="ACTIVE" />
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      </motion.div>

      {/* 📊 CHART */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-finance p-8 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="title-finance flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Growth Matrix
          </h2>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Value Trend</span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
              <XAxis dataKey="name" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: 'none', 
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#60a5fa' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* EXPORT OPTIONS */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={exportCSV} className="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-white/40 dark:bg-white/5 border border-white/20 shadow-lg hover:scale-[1.02] transition-all group">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
            <Table className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Export CSV</span>
        </button>
        <button onClick={exportPDF} className="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-white/40 dark:bg-white/5 border border-white/20 shadow-lg hover:scale-[1.02] transition-all group">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
            <Download className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Export PDF</span>
        </button>
      </div>

      {/* RECENT DATA FEED */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <Database className="w-4 h-4 text-blue-500" />
          <h2 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">System Record Log</h2>
        </div>
        
        <div className="space-y-3">
          {data.slice(0, 5).map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-finance p-5 flex justify-between items-center bg-white/40 dark:bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all border-l-4 border-l-blue-500"
            >
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-40">{item.type}</p>
                <div className="flex items-center gap-2">
                   <p className="text-lg font-black text-slate-800 dark:text-white tracking-tighter">₹ {item.result.toLocaleString('en-IN')}</p>
                   <ChevronRight className="w-3 h-3 opacity-20" />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold opacity-30">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[9px] font-black uppercase tracking-widest opacity-50 leading-none">{label}</p>
      <p className="text-2xl font-black tracking-tighter">{value}</p>
    </div>
  );
}
