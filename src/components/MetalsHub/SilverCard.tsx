import React, { useState, useEffect } from 'react';
import { Coins, IndianRupee, Percent, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatIndianCurrency } from '../../lib/financeUtils';

interface PurityOption {
  label: string;
  value: number;
}

const PURITIES: PurityOption[] = [
  { label: '99.9%', value: 1.0 },
  { label: '92.5%', value: 0.925 },
];

export default function SilverCard() {
  const [weight, setWeight] = useState('');
  const [rate, setRate] = useState('');
  const [making, setMaking] = useState('');
  const [purity, setPurity] = useState(PURITIES[0]);
  const [hasInteracted, setHasInteracted] = useState({ weight: false, rate: false, making: false });

  // Load saved rate on mount
  useEffect(() => {
    const saved = localStorage.getItem('silverRate');
    if (saved) {
      setRate(saved);
    }
  }, []);

  // Save rate when changed
  useEffect(() => {
    if (rate) {
      localStorage.setItem('silverRate', rate);
    }
  }, [rate]);

  const [results, setResults] = useState({
    adjustedRate: 0,
    metalValue: 0,
    makingCharges: 0,
    totalPrice: 0,
    isValid: false
  });

  // Auto-calculation
  useEffect(() => {
    const W = parseFloat(weight);
    const R = parseFloat(rate);
    const M = parseFloat(making || '0');

    // Validation
    if (isNaN(W) || isNaN(R) || W <= 0 || R <= 0) {
      setResults(prev => ({ ...prev, isValid: false }));
      return;
    }

    const adjustedRate = R * purity.value;
    const metalValue = W * adjustedRate;
    const makingCharges = (metalValue * M) / 100;
    const total = metalValue + makingCharges;

    setResults({
      adjustedRate,
      metalValue,
      makingCharges,
      totalPrice: total,
      isValid: true
    });
  }, [weight, rate, making, purity]);

  const isFieldInvalid = (val: string, field: keyof typeof hasInteracted) => {
    return hasInteracted[field] && !val;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-6 backdrop-blur-xl shadow-lg" id="silver-valuation-card">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Manual Valuation</span>
        </div>
      </div>

      {/* Purity Tabs */}
      <div className="flex gap-2">
        {PURITIES.map((p) => (
          <button
            key={p.label}
            onClick={() => setPurity(p)}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              purity.label === p.label 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white/10 text-gray-400 hover:bg-white/15'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* Main Inputs Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Weight (g)</label>
            <input
              type="number"
              value={weight}
              placeholder="Weight (g)"
              onBlur={() => setHasInteracted(prev => ({ ...prev, weight: true }))}
              onChange={(e) => setWeight(e.target.value)}
              className={`w-full bg-white/10 text-white p-3 rounded-xl outline-none border transition-all ${
                isFieldInvalid(weight, 'weight') ? 'border-red-500/50 bg-red-500/10' : 'border-white/10'
              }`}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between px-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rate ₹/g</label>
            </div>
            <input
              type="number"
              value={rate}
              placeholder="Rate ₹"
              onBlur={() => setHasInteracted(prev => ({ ...prev, rate: true }))}
              onChange={(e) => setRate(e.target.value)}
              className={`w-full bg-white/10 text-white p-3 rounded-xl outline-none border transition-all ${
                isFieldInvalid(rate, 'rate') ? 'border-red-500/50 bg-red-500/10' : 'border-white/10'
              }`}
            />
          </div>
        </div>

        {/* Making Charges */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Making Charges (%)</label>
          <input
            type="number"
            value={making}
            placeholder="Making Charges %"
            onBlur={() => setHasInteracted(prev => ({ ...prev, making: true }))}
            onChange={(e) => setMaking(e.target.value)}
            className={`w-full bg-white/10 text-white p-3 rounded-xl outline-none border transition-all ${
              isFieldInvalid(making, 'making') ? 'border-red-500/50 bg-red-500/10' : 'border-white/10'
            }`}
          />
        </div>

        {/* Result Container */}
        <div className={`mt-4 bg-gradient-to-r from-blue-500/10 to-slate-500/10 border border-white/10 rounded-2xl p-5 text-center transition-all duration-500 ${results.isValid ? 'opacity-100 scale-100' : 'opacity-40 scale-[0.98]'}`}>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Total Valuation</div>
          <div className="text-2xl font-black text-blue-400 tracking-tight">
            {formatIndianCurrency(results.totalPrice, 2)}
          </div>
          {results.isValid && (
            <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <div className="flex flex-col text-left">
                <span className="text-gray-600">Adj. Rate</span>
                <span className="text-white">{formatIndianCurrency(results.adjustedRate, 2)}/g</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-gray-600">Making Val</span>
                <span className="text-white">+{formatIndianCurrency(results.makingCharges, 2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
