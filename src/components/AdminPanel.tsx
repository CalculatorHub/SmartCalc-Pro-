import React, { useState, useEffect } from 'react';
import { 
  Lock, LayoutDashboard, Trash2, CheckCircle, 
  Clock, Filter, MessageSquare, LogOut, ChevronRight, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Feedback {
  id: string;
  name: string;
  type: 'Bug' | 'Suggestion' | 'UI/UX';
  message: string;
  date: string;
  status: 'Pending' | 'Resolved';
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [filterType, setFilterType] = useState<string>('All');

  const ADMIN_PASSWORD = 'Patel@9488'; // User can change this locally

  useEffect(() => {
    const isAdmin = localStorage.getItem('calhub_admin_auth') === 'true';
    if (isAdmin) setIsAuthenticated(true);
    
    loadFeedback();
  }, []);

  const loadFeedback = () => {
    const data = JSON.parse(localStorage.getItem('calhub_feedback') || '[]');
    setFeedback(data);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('calhub_admin_auth', 'true');
      setError('');
    } else {
      setError('Incorrect Password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('calhub_admin_auth');
  };

  const updateStatus = (id: string, status: 'Pending' | 'Resolved') => {
    const updated = feedback.map(f => f.id === id ? { ...f, status } : f);
    setFeedback(updated);
    localStorage.setItem('calhub_feedback', JSON.stringify(updated));
  };

  const deleteFeedback = (id: string) => {
    const updated = feedback.filter(f => f.id !== id);
    setFeedback(updated);
    localStorage.setItem('calhub_feedback', JSON.stringify(updated));
  };

  const clearAll = () => {
    if (window.confirm('Delete all feedback entries?')) {
      setFeedback([]);
      localStorage.removeItem('calhub_feedback');
    }
  };

  const filteredFeedback = feedback.filter(f => filterType === 'All' || f.type === filterType);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6" id="admin-login-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-white dark:bg-white/5 p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-white/10 text-center space-y-6"
        >
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Admin Portal</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Authorized Access Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="off"
                className="w-full h-12 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none border border-transparent dark:border-white/10 transition-all placeholder-gray-500"
              />
            </div>
            {error && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{error}</p>}
            <button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
            >
              Enter Portal
            </button>
          </form>
          
          <p className="text-[10px] text-gray-400 font-medium whitespace-pre">Access restricted. Use authorized credentials.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-5 pt-8 pb-32 space-y-8" id="admin-dashboard">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Control Room</h2>
            <div className="text-[9px] font-black text-[#8fa3c7] uppercase tracking-[0.3em] flex items-center gap-2">
              System Active <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-[#8fa3c7] hover:text-red-500 transition-all border border-white/5 active:scale-90"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="premium-card p-3 rounded-[22px] flex items-center gap-2 overflow-x-auto no-scrollbar" id="admin-filters">
        <div className="px-4 flex items-center gap-2 border-r border-white/10 shrink-0">
           <Filter className="w-4 h-4 text-blue-500" />
           <span className="text-[10px] font-black text-[#8fa3c7] uppercase tracking-widest font-mono">Filter</span>
        </div>
        {['All', 'Bug', 'Suggestion', 'UI/UX'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 font-mono ${
              filterType === type 
                ? 'bg-blue-600 text-white shadow-glow/20 ring-4 ring-blue-500/10' 
                : 'text-[#8fa3c7] hover:bg-white/5'
            }`}
          >
            {type}
          </button>
        ))}
        
        <div className="ml-auto pr-3">
            <button 
              onClick={clearAll}
              className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em] italic hover:scale-105 active:scale-95 transition-all"
            >
              Purge All
            </button>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredFeedback.length === 0 ? (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="h-60 flex flex-col items-center justify-center text-center p-10 bg-white/5 rounded-[30px] border-2 border-dashed border-white/5"
            >
               <MessageSquare className="w-12 h-12 text-[#8fa3c7]/20 mb-4" />
               <p className="text-[10px] font-black text-[#8fa3c7] uppercase tracking-[0.4em] italic">Zero entries detected</p>
            </motion.div>
          ) : (
            filteredFeedback.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="premium-card p-6 rounded-[25px] space-y-5 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl border ${
                      item.type === 'Bug' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                      item.type === 'Suggestion' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-[13px] font-black text-white uppercase tracking-tight italic">{item.name}</h4>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <span className="text-[9px] font-bold text-[#8fa3c7] font-mono">{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-[0.3em] px-2 py-0.5 rounded-full border ${
                        item.type === 'Bug' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                        item.type === 'Suggestion' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateStatus(item.id, item.status === 'Resolved' ? 'Pending' : 'Resolved')}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all border ${
                        item.status === 'Resolved' 
                        ? 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30 shadow-glow-sm' 
                        : 'text-[#8fa3c7] bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                      title={item.status === 'Resolved' ? 'Mark as Pending' : 'Mark as Resolved'}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteFeedback(item.id)}
                      className="w-10 h-10 flex items-center justify-center text-[#8fa3c7] bg-white/5 border border-white/5 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 p-5 rounded-2xl text-[11px] text-gray-300 font-bold leading-relaxed italic border border-white/5 font-mono">
                  "{item.message}"
                </div>

                <div className="flex items-center justify-between pt-2">
                   <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#8fa3c7]" />
                      <span className={`text-[9px] font-black uppercase tracking-[0.3em] font-mono ${item.status === 'Resolved' ? 'text-emerald-400' : 'text-amber-500'}`}>
                        {item.status}
                      </span>
                   </div>
                   <div className="text-[8px] font-black text-[#8fa3c7]/30 uppercase font-mono italic">
                      Entry Trace: {item.id.slice(-8)}
                   </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
