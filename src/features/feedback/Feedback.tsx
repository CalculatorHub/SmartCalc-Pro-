import React, { useState } from "react";
import Card3D from "../../components/ui/3DCard";
import Icon3D from "../../components/ui/3DIcon";
import Button from "../../components/ui/MotionButton";
import { submitFeedback } from "../../services/feedbackService";
import { MessageSquare, Send, MessageCircle, Star, Info, Check } from "lucide-react";
import { motion } from "motion/react";

export default function Feedback() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("Improvement");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const validate = (val: string) => {
    if (val.length > 0 && val.length < 10) return "Message too short (min 10 chars)";
    if (val.length > 5000) return "Message too long (max 5000 chars)";
    return "";
  };

  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return "Other";
  };

  const getOSInfo = () => {
    const appVersion = navigator.appVersion;
    if (appVersion.includes("Win")) return "Windows";
    if (appVersion.includes("Mac")) return "MacOS";
    if (appVersion.includes("X11")) return "UNIX";
    if (appVersion.includes("Linux")) return "Linux";
    return "Other";
  };

  const getAnonymousId = () => {
    let id = localStorage.getItem("anon_id");
    if (!id) {
      id = "user_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("anon_id", id);
    }
    return id;
  };

  const send = async () => {
    const validationError = validate(msg);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await submitFeedback({ 
        name: name,
        message: msg,
        type: type,
        rating: rating,
        userId: getAnonymousId(),
        browser: getBrowserInfo(),
        os: getOSInfo()
      });
      setMsg("");
      setName("");
      setSent(true);
      setError("");
      setTimeout(() => setSent(false), 3000);
    } catch (err: any) {
      setError("Transmission failure: " + err.message);
    }
  };

  if (sent) {
    return (
      <Card3D className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/50"
        >
          <Check className="w-10 h-10" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic italic">Transmission Sent</h2>
          <p className="opacity-50 text-xs font-bold uppercase tracking-widest mt-2">Data successfully synchronized with the cloud.</p>
        </div>
        <Button onClick={() => setSent(false)}>Send Another Message</Button>
      </Card3D>
    );
  }

  return (
    <Card3D className="space-y-6">
      <div className="flex items-center gap-4">
        <Icon3D icon={<MessageCircle className="w-6 h-6" />} color="from-green-400 to-emerald-600" />
        <div>
          <h2 className="text-lg font-black uppercase tracking-tighter dark:text-white leading-none italic">
            Feedback Hub
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1">
            Secure Firestore Transmission
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-1">Your Identity (Optional)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ghost User #749..."
            className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#020617] text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-1">Category</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#020617] text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 outline-none appearance-none"
            >
              <option value="Bug">Bug Report</option>
              <option value="UI/UX">UI/UX Feedback</option>
              <option value="Improvement">Improvement</option>
              <option value="Suggestion">General Suggestion</option>
            </select>
          </div>

          <div className="space-y-2 flex flex-col items-center justify-end pb-1">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
              Rating
            </p>
            <div className="flex gap-1">
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
                    className={`w-6 h-6 ${
                      (hover || rating) >= star
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <textarea
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
            setError(validate(e.target.value));
          }}
          placeholder="Synchronize your message..."
          className={`
            w-full h-32 px-4 py-3 rounded-2xl
            bg-white dark:bg-[#020617]
            text-slate-900 dark:text-white
            border ${error ? 'border-pink-500' : 'border-slate-300 dark:border-white/10'}
            focus:ring-2 ${error ? 'focus:ring-pink-500' : 'focus:ring-emerald-500'}
            outline-none transition resize-none
          `}
        />
        {error && (
          <p className="text-[10px] font-black uppercase tracking-widest text-pink-500 px-1 italic">
            {error}
          </p>
        )}
      </div>

      <Button onClick={send} disabled={!!error || !msg.trim()}>
        <span className="flex items-center justify-center gap-2">
          {sent ? "Transmission Successful" : "Execute Submission"}
          {!sent && <Send className="w-4 h-4" />}
        </span>
      </Button>
    </Card3D>
  );
}
