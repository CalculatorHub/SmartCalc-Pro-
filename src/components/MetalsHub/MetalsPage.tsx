import React from 'react';
import GoldCard from './GoldCard';
import SilverCard from './SilverCard';
import { Coins } from 'lucide-react';

export default function MetalsPage() {
  return (
    <div className="space-y-6 pb-28 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500" id="metals-page">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-2">
          <Coins className="w-8 h-8 text-yellow-500" />
          Gold
        </h2>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Gold & metal calculations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GoldCard />
        <SilverCard />
      </div>
    </div>
  );
}
