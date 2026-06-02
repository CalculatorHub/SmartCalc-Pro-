import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, User, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Feedback {
  id: string;
  name: string;
  type: 'Bug' | 'Suggestion' | 'UI/UX';
  message: string;
  date: string;
  status: 'Pending' | 'Resolved';
}

export default function FeedbackSystem() {
  const [name, setName] = useState('');
  const [type, setType] = useState<'Bug' | 'Suggestion' | 'UI/UX'>('Suggestion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    const newFeedback: Feedback = {
      id: Date.now().toString(),
      name: name || 'Anonymous',
      type,
      message,
      date: new Date().toISOString(),
      status: 'Pending'
    };

    const existingFeedback = JSON.parse(localStorage.getItem('calhub_feedback') || '[]');
    localStorage.setItem('calhub_feedback', JSON.stringify([...existingFeedback, newFeedback]));

    setSubmitted(true);
    setTimeout(() => {
        setSubmitted(false);
        setName('');
        setMessage('');
    }, 3000);
  };

  return (
    <div className="bg-transparent rounded-2xl p-6 relative overflow-hidden" id="feedback-form-container">
      <AnimatePresence>
        {submitted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-950/90 backdrop-blur-md z-30 flex flex-col items-center justify-center text-center p-6 rounded-[22px]"
          >
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
            <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Sync Successful</h4>
            <p className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-widest mt-3 leading-relaxed">Pulse data captured. The core unit will analyze your input shortly.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
          <MessageSquare className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white tracking-tighter uppercase italic">Pulse Feed</h3>
          <p className="text-[9px] font-black text-[#8fa3c7] uppercase tracking-[0.3em] font-mono">Contribute to the evolution</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1 font-mono italic">Identity Hub</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8fa3c7] font-mono" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ANONYMOUS"
                className="w-full h-14 bg-white/5 border border-white/5 text-white rounded-2xl pl-12 pr-4 text-sm font-bold focus:border-blue-500/50 outline-none transition-all placeholder-gray-600 font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1 font-mono italic">Node Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full h-14 bg-white/5 border border-white/5 text-white rounded-2xl px-4 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer appearance-none focus:border-blue-500/50 font-mono"
            >
              <option>SUGGESTION</option>
              <option>BUG</option>
              <option>UI/UX</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1 font-mono italic">Inquiry Data</label>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Input transmission details..."
            rows={4}
            className="w-full bg-white/5 border border-white/5 text-white rounded-2xl p-5 text-sm font-bold focus:border-blue-500/50 outline-none transition-all placeholder-gray-600 resize-none font-mono"
          />
        </div>

        <button
          type="submit"
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 font-mono italic"
        >
          <Send className="w-4 h-4" />
          Broadcast Sync
        </button>
      </form>
      <div className="mt-6 flex items-start gap-2 text-orange-500 bg-orange-500/5 p-3 rounded-xl border border-orange-500/10">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <p className="text-[10px] font-bold uppercase tracking-wider leading-relaxed">
           Bugs Reported here are handled directly by the development team. 
        </p>
      </div>
    </div>
  );
}
