import React from 'react';
import GoldCard from './GoldCard';
import SilverCard from './SilverCard';

export default function MetalsPage({ mode = 'gold' }: { mode?: 'gold' | 'silver' }) {
  return (
    <div className="space-y-6 pb-28 pt-4 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {mode === 'gold' ? 'Gold Calculator' : 'Silver Calculator'}
        </h2>
        <p className="text-sm text-gray-400">
          {mode === 'gold' 
            ? 'Professional tools for gold valuation.' 
            : 'Accurate silver price estimation tools.'}
        </p>
      </div>

      <div className="max-w-md mx-auto">
        {mode === 'gold' ? <GoldCard /> : <SilverCard />}
      </div>
    </div>
  );
}
