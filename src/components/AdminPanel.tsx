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
    <div className="space-y-6 pb-28 pt-4 animate-in slide-in-from-bottom duration-300" id="admin-dashboard">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl text-white">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Feedback Hub</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              Admin Controller <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white dark:bg-white/5 p-2 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-wrap items-center gap-2" id="admin-filters">
        <div className="px-3 flex items-center gap-2 border-r border-gray-200 dark:border-white/10 mr-2">
           <Filter className="w-3.5 h-3.5 text-gray-400" />
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filter</span>
        </div>
        {['All', 'Bug', 'Suggestion', 'UI/UX'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === type 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {type}
          </button>
        ))}
        
        <div className="ml-auto pr-2">
            <button 
              onClick={clearAll}
              className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
            >
              Clear All
            </button>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredFeedback.length === 0 ? (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="h-40 flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800"
            >
               <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-2" />
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No feedback found</p>
            </motion.div>
          ) : (
            filteredFeedback.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-white/5 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      item.type === 'Bug' ? 'bg-red-50 text-red-600' : 
                      item.type === 'Suggestion' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{item.name}</h4>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="text-[10px] font-bold text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                        item.type === 'Bug' ? 'bg-red-50 text-red-600 border-red-100' : 
                        item.type === 'Suggestion' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => updateStatus(item.id, item.status === 'Resolved' ? 'Pending' : 'Resolved')}
                      className={`p-2 rounded-xl transition-all ${
                        item.status === 'Resolved' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50'
                      }`}
                      title={item.status === 'Resolved' ? 'Mark as Pending' : 'Mark as Resolved'}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteFeedback(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed italic">
                  "{item.message}"
                </div>

                <div className="flex items-center justify-between pt-2">
                   <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${item.status === 'Resolved' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {item.status}
                      </span>
                   </div>
                   <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 opacity-60">
                      ID: {item.id.slice(-6)}
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
