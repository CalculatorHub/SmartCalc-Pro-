import React from 'react';
import { Clock, History as HistoryIcon } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="min-h-screen text-white px-5 pt-8 pb-32 space-y-8">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
            <HistoryIcon className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">Legacy Feed</h1>
        </div>
        <p className="text-xs font-bold text-[#8fa3c7] uppercase tracking-widest">Temporal logs of your calculations</p>
      </div>

      <div className="premium-card p-10 py-16 rounded-[30px] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/5 shadow-inner">
          <Clock className="w-10 h-10 text-[#8fa3c7]/20" />
        </div>
        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Neutral State</h3>
        <p className="text-[10px] font-bold text-[#8fa3c7] mt-3 leading-relaxed max-w-[200px]">No historical data points detected in your local session cache.</p>
      </div>
    </div>
  );
}
