import React, { useState } from 'react';
import { Route, Gauge } from 'lucide-react';

interface DistanceEconomyCardProps {
  distance: string;
  setDistance: (val: string) => void;
  mileage: string;
  setMileage: (val: string) => void;
}

export default function DistanceEconomyCard({ distance, setDistance, mileage, setMileage }: DistanceEconomyCardProps) {
  const [hasInteracted, setHasInteracted] = useState({ distance: false, mileage: false });

  return (
    <div className="bg-white dark:bg-white/5 p-5 rounded-2xl shadow-md border border-gray-200 dark:border-white/10 space-y-4" id="distance-economy-card">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
          <Route className="w-5 h-5 text-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight italic">Distance & Economy</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Distance (KM)</label>
          <div className="relative">
             <Route className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input
                type="number"
                value={distance}
                placeholder="Enter distance"
                onBlur={() => setHasInteracted(prev => ({ ...prev, distance: true }))}
                onChange={(e) => {
                  const val = e.target.value;
                  if (parseFloat(val) < 0) return;
                  setDistance(val);
                }}
                autoComplete="off"
                className={`w-full h-12 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none border transition-all ${
                  hasInteracted.distance && !distance ? 'border-red-500/50 bg-red-50/50 dark:bg-red-500/5' : 'border-transparent dark:border-white/10'
                }`}
             />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Avg. Mileage (KMPL)</label>
          <div className="relative">
             <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input
                type="number"
                value={mileage}
                placeholder="Enter mileage"
                onBlur={() => setHasInteracted(prev => ({ ...prev, mileage: true }))}
                onChange={(e) => {
                  const val = e.target.value;
                  if (parseFloat(val) < 0) return;
                  setMileage(val);
                }}
                autoComplete="off"
                className={`w-full h-12 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none border transition-all ${
                  hasInteracted.mileage && !mileage ? 'border-red-500/50 bg-red-50/50 dark:bg-red-500/5' : 'border-transparent dark:border-white/10'
                }`}
             />
          </div>
        </div>
      </div>
    </div>
  );
}
