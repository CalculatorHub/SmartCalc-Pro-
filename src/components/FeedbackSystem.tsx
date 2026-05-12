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
            className="absolute inset-0 bg-gray-900/90 dark:bg-black/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
            <h4 className="text-xl font-bold text-white">Feedback Received!</h4>
            <p className="text-sm text-gray-400 mt-2">Thank you for helping us improve CalHub. Our team will review it shortly.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-xl">
          <MessageSquare className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Share Feedback</h3>
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-0.5">Help us evolve</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">Your Name (Optional)</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full h-12 bg-white/50 dark:bg-white/5 border border-white/20 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">Feedback Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full h-12 bg-white/50 dark:bg-white/5 border border-white/20 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 text-sm font-bold outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Suggestion</option>
              <option>Bug</option>
              <option>UI/UX</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">Your Message</label>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full bg-white/50 dark:bg-white/5 border border-white/20 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-[1.02] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Send className="w-4 h-4" />
          Submit Feedback
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
