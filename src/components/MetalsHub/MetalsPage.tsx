import React from 'react';
import GoldCard from './GoldCard';
import SilverCard from './SilverCard';

export default function MetalsPage({ mode = 'gold' }: { mode?: 'gold' | 'silver' }) {
  return (
    <div className="min-h-screen text-white px-5 pt-8 pb-32 space-y-8 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">
          {mode === 'gold' ? 'Gold Protocol' : 'Silver Protocol'}
        </h1>
        <p className="text-xs font-bold text-[#8fa3c7] uppercase tracking-widest">
          {mode === 'gold' 
            ? 'Professional systems for gold valuation' 
            : 'Accurate metal price estimation nodes'}
        </p>
      </div>

      <div className="max-w-md mx-auto">
        {mode === 'gold' ? <GoldCard /> : <SilverCard />}
      </div>
    </div>
  );
}
