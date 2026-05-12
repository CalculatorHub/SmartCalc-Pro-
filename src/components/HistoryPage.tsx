import React from 'react';
import { Clock, History as HistoryIcon } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="px-5 pt-6 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <HistoryIcon className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-black italic tracking-tight uppercase">History</h1>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-2xl">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
          <Clock className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">No history yet</h3>
        <p className="text-[11px] text-gray-500 mt-2 font-medium">Your recent calculations will appear here after you use the protocols.</p>
      </div>
    </div>
  );
}
