import React, { useState } from "react";
import Card from "../../components/ui/Card";
import Card3D from "../../components/ui/3DCard";
import Icon3D from "../../components/ui/3DIcon";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { api } from "../../utils/api";
import { MessageSquare, Send, MessageCircle, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Feedback() {
  const [msg, setMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [sent, setSent] = useState(false);

  const send = async () => {
    if (!msg.trim()) return;
    try {
      await api("/api/feedback", "POST", { 
        feedback: msg,
        rating: rating > 0 ? rating : null 
      });
      setMsg("");
      setRating(0);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err: any) {
      alert("Error sending feedback: " + err.message);
    }
  };

  return (
    <Card3D className="space-y-6">
      <div className="flex items-center gap-4">
        <Icon3D icon={<MessageCircle className="w-6 h-6" />} color="from-green-400 to-emerald-600" />
        <div>
          <h2 className="text-lg font-black uppercase tracking-tighter dark:text-white leading-none italic">
            Feedback Grid
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1">
            System Transmission
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 py-4">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
          Neural Satisfaction Rating
        </p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="transition-colors duration-200"
            >
              <Star
                className={`w-8 h-8 ${
                  (hover || rating) >= star
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-slate-300 dark:text-slate-700"
                }`}
              />
            </motion.button>
          ))}
        </div>
      </div>

      <textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Synchronize your feedback..."
        className="
          w-full h-40 px-4 py-3 rounded-2xl
          bg-white dark:bg-[#020617]
          text-slate-900 dark:text-white
          border border-slate-300 dark:border-white/10
          focus:ring-2 focus:ring-blue-500
          outline-none transition resize-none
        "
      />

      <Button onClick={send} disabled={!msg.trim()}>
        <span className="flex items-center justify-center gap-2">
          {sent ? "Transmission Successful" : "Execute Transmission"}
          {!sent && <Send className="w-4 h-4" />}
        </span>
      </Button>
    </Card3D>
  );
}
