import React from 'react';
import { Calculator } from 'lucide-react';

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#020617] rounded-full shadow-sm" />
      </div>
      <div className="flex flex-col -space-y-1">
        <h1 className="text-xl font-black italic tracking-tighter text-white">
          CAL<span className="text-blue-500">HUB</span>
        </h1>
        <span className="text-[7px] font-black text-gray-500 uppercase tracking-[0.4em]">FINANCIAL PROTOCOL</span>
      </div>
    </div>
  );
}
