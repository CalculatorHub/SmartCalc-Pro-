import React, { useState, useEffect } from 'react';
import { Coins, Scale, Percent, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PurityOption {
  label: string;
  value: number;
}

const PURITIES: PurityOption[] = [
  { label: '24K', value: 1.0 },
  { label: '22K', value: 0.916 },
  { label: '18K', value: 0.75 },
];

export default function GoldCard() {
  const [weight, setWeight] = useState('');
  const [rate, setRate] = useState('');
  const [making, setMaking] = useState('');
  const [purity, setPurity] = useState(PURITIES[0]);
  const [error, setError] = useState('');
  const [hasInteracted, setHasInteracted] = useState({ weight: false, rate: false, making: false });

  const [results, setResults] = useState({
    adjustedRate: 0,
    goldValue: 0,
    makingCharges: 0,
    totalPrice: 0,
    isValid: false
  });

  const handleCalculate = () => {
    setHasInteracted({ weight: true, rate: true, making: true });
    
    if (!weight || !rate || !making) {
      setError('Please enter all required values');
      setResults(prev => ({ ...prev, isValid: false }));
      return;
    }

    const W = parseFloat(weight);
    const R = parseFloat(rate);
    const M = parseFloat(making);

    if (W <= 0 || R <= 0 || M < 0) {
      setError('Please enter valid positive values');
      setResults(prev => ({ ...prev, isValid: false }));
      return;
    }

    setError('');
    const adjustedRate = R * purity.value;
    const goldValue = W * adjustedRate;
    const makingCharges = (goldValue * M) / 100;
    const total = goldValue + makingCharges;

    setResults({
      adjustedRate,
      goldValue,
      makingCharges,
      totalPrice: total,
      isValid: true
    });
  };

  // Re-calculate if already valid when purity changes
  useEffect(() => {
    if (results.isValid) {
      handleCalculate();
    }
  }, [purity]);

  const isFieldInvalid = (val: string, field: keyof typeof hasInteracted) => {
    return hasInteracted[field] && !val;
  };

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl shadow-md p-5 border border-gray-200 dark:border-white/10 space-y-6" id="gold-valuation-card">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">METALLIC EVALUATION</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-orange-500" />
              Gold Valuation
            </h3>
            <span className="text-[7px] font-bold text-gray-400/50 uppercase tracking-[0.2em] mt-0.5">CRAFTED BY PATEL VAMSHIDHAR REDDY</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {PURITIES.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setPurity(p);
                // Trigger recalc if valid
                if (weight && rate && making) {
                  setError('');
                }
              }}
              className={`h-10 rounded-xl text-xs font-black transition-all ${
                purity.label === p.label 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'bg-gray-50 dark:bg-white/10 text-gray-500'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Weight (g)</label>
                <input
                    type="number"
                    value={weight}
                    placeholder="Enter weight"
                    onBlur={() => setHasInteracted(prev => ({ ...prev, weight: true }))}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (parseFloat(val) < 0) return;
                      setWeight(val);
                      setResults(prev => ({ ...prev, isValid: false }));
                    }}
                    autoComplete="off"
                    className={`w-full h-11 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none border transition-all ${
                      isFieldInvalid(weight, 'weight') ? 'border-red-500/50 bg-red-50/50 dark:bg-red-500/5' : 'border-transparent dark:border-white/10'
                    }`}
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{purity.label} Rate (₹)</label>
                <input
                    type="number"
                    value={rate}
                    placeholder="Enter rate"
                    onBlur={() => setHasInteracted(prev => ({ ...prev, rate: true }))}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (parseFloat(val) < 0) return;
                      setRate(val);
                      setResults(prev => ({ ...prev, isValid: false }));
                    }}
                    autoComplete="off"
                    className={`w-full h-11 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none border transition-all ${
                      isFieldInvalid(rate, 'rate') ? 'border-red-500/50 bg-red-50/50 dark:bg-red-500/5' : 'border-transparent dark:border-white/10'
                    }`}
                />
             </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Making (%)</label>
            <input
                type="number"
                value={making}
                placeholder="Enter making charges"
                onBlur={() => setHasInteracted(prev => ({ ...prev, making: true }))}
                onChange={(e) => {
                  const val = e.target.value;
                  if (parseFloat(val) < 0) return;
                  setMaking(val);
                  setResults(prev => ({ ...prev, isValid: false }));
                }}
                autoComplete="off"
                className={`w-full h-11 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none border transition-all ${
                  isFieldInvalid(making, 'making') ? 'border-red-500/50 bg-red-50/50 dark:bg-red-500/5' : 'border-transparent dark:border-white/10'
                }`}
            />
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="text-[10px] font-bold text-red-500 bg-red-500/10 p-2 rounded-lg text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-2 text-xs font-bold text-gray-500 dark:text-gray-400 border border-transparent dark:border-white/10 transition-opacity ${results.isValid ? 'opacity-100' : 'opacity-40'}`}>
           <div className="flex justify-between">
              <span>Adj. Rate</span>
              <span className="text-gray-900 dark:text-white">₹{results.isValid ? results.adjustedRate.toFixed(2) : '0.00'}/g</span>
           </div>
           <div className="flex justify-between">
              <span>Making Val</span>
              <span className="text-emerald-500">+{results.isValid ? `₹${results.makingCharges.toFixed(2)}` : '₹0.00'}</span>
           </div>
           <div className="pt-2 border-t border-gray-200 dark:border-white/10 flex justify-between items-baseline">
              <span className="text-[9px] uppercase tracking-widest text-orange-500">Total Price</span>
              <span className="text-xl font-black text-gray-900 dark:text-white">₹{results.isValid ? results.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}</span>
           </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={handleCalculate}
          disabled={!weight || !rate || !making}
          className={`w-full h-11 text-white text-sm font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
            (!weight || !rate || !making) 
              ? 'bg-gray-400 cursor-not-allowed grayscale' 
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
           <ArrowRight className="w-4 h-4" />
           CALCULATE
        </motion.button>
      </div>

    </div>
  );
}
