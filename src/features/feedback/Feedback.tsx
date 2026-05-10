import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Star, Send, ShieldCheck, Heart, Sparkles } from "lucide-react";
import Card3D from "../../components/ui/3DCard";
import Icon3D from "../../components/ui/3DIcon";
import Button from "../../components/ui/MotionButton";
import { submitFeedback } from "../../services/feedbackService";

export default function Feedback() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("Suggestion");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await submitFeedback({ 
        name: name.trim() || "Anonymous", 
        message, 
        type, 
        rating 
      });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
      setName("");
      setMessage("");
      setRating(5);
    } catch (err) {
      console.error(err);
      alert("Transmission failure. Check terminal logs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 px-4 overflow-x-hidden">
      <div className="text-center space-y-4">
        <Icon3D icon={<MessageSquare className="w-8 h-8 text-white" />} color="from-emerald-400 to-teal-600" />
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
          Feedback <span className="text-emerald-500">Hub</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium"> help us calibrate the perfect experience.</p>
      </div>

      <Card3D>
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-12 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Transmission Received</h2>
                <p className="text-slate-500 text-sm">Your intelligence has been logs. Thank you.</p>
              </div>
              <Button onClick={() => setIsSuccess(false)}>Send Another</Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Identity</label>
                    <input
                      type="text"
                      placeholder="Name (Optional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Module</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
                    >
                      <option value="Suggestion">💡 Suggestion</option>
                      <option value="Bug">🐞 Bug Report</option>
                      <option value="UI/UX">🎨 UI/UX</option>
                      <option value="Improvement">🚀 Improvement</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Calibraton Rating ({rating}/5)</label>
                  <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className={`transition-all ${s <= rating ? 'scale-110' : 'scale-90 grayscale opacity-30 hover:grayscale-0 hover:opacity-100'}`}
                      >
                        <Star className={`w-8 h-8 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400 dark:text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Message</label>
                  <textarea
                    required
                    placeholder="Describe your experience or report an issue..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-2xl shadow-xl shadow-emerald-500/20 font-black tracking-widest uppercase text-xs"
                >
                  <div className="flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {isSubmitting ? "Transmitting..." : "Send Feedback"}
                  </div>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <ShieldCheck className="w-3 h-3" />
                Secured Encryption Active
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </Card3D>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-white/10 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-pink-500/10">
            <Heart className="w-4 h-4 text-pink-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Community</p>
            <p className="text-xs font-bold">1.2k Submissions</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-white/10 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10">
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Improvements</p>
            <p className="text-xs font-bold">42 Implemented</p>
          </div>
        </div>
      </div>
    </div>
  );
}
