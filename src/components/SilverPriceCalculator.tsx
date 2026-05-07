import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Scale, 
  RefreshCcw, 
  Copy, 
  Check,
  ChevronRight,
  Info,
  Zap,
  CircleDot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatNumber, vibrate } from '@/lib/utils';
import { CopyButton } from './ui/CopyButton';

type Unit = 'g' | 'kg';

interface SilverPriceCalculatorProps {
  initialRate?: number;
  onSave?: (data: { weight: string; unit: string; rate: number; totalPrice: number; gstPrice: number }) => void;
}

export const SilverPriceCalculator: React.FC<SilverPriceCalculatorProps> = ({ initialRate = 0, onSave }) => {
  const [weight, setWeight] = useState<string>('');
  const [unit, setUnit] = useState<Unit>('g');
  const [rate, setRate] = useState<string>('');
  const [makingPercent, setMakingPercent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialRate && initialRate > 0) {
      setRate(initialRate.toString());
    }
  }, [initialRate]);

  const results = useMemo(() => {
    const w = parseFloat(weight) || 0;
    const weightInGrams = unit === 'kg' ? w * 1000 : w;
    const r = parseFloat(rate) || 0;
    const mPercent = parseFloat(makingPercent) || 0;
    const GST_RATE = 0.03; // 3% GST

    const basePrice = weightInGrams * r;
    const makingCharges = basePrice * (mPercent / 100);
    const subtotal = basePrice + makingCharges;
    const gstPrice = subtotal * GST_RATE;
    const totalPrice = subtotal + gstPrice;

    return {
      basePrice,
      makingCharges,
      gstPrice,
      totalPrice,
      isValid: w > 0 && r > 0
    };
  }, [weight, unit, rate, makingPercent]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const copyToClipboard = () => {
    const text = `Silver Calculation:\nWeight: ${weight}${unit}\nRate: ₹${rate}/g\nMaking: ${makingPercent}%\nTotal: ${formatCurrency(results.totalPrice)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setWeight('');
    setUnit('g');
    setRate('');
    setMakingPercent('');
  };

  return (
    <div className="max-w-xl mx-auto px-4 pb-24 pt-4">
      <div className="bg-card rounded-3xl shadow-xl border border-theme p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Metallic Evaluation Hub</p>
          <h2 className="text-3xl font-black text-primary tracking-tighter uppercase italic leading-none">Silver Valuation</h2>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-secondary block ml-1">Weight Unit</Label>
          <div className="grid grid-cols-2 gap-3">
            {(['g', 'kg'] as Unit[]).map((u) => {
              const active = unit === u;
              return (
                <button
                  key={u}
                  onClick={() => {
                    setUnit(u);
                  }}
                  className={`h-12 rounded-2xl border-2 transition-all duration-500 text-[11px] font-black uppercase tracking-widest ${
                    active 
                      ? 'bg-zinc-600 border-zinc-500 text-white shadow-lg shadow-zinc-600/20' 
                      : 'border-theme text-secondary bg-bg hover:bg-muted/50'
                  }`}
                >
                  {u === 'g' ? 'Grams' : 'Kilograms'}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Label htmlFor="silver-weight" className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1.5 block ml-1">Weight</Label>
            <Input
              id="silver-weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="h-14 px-6 rounded-2xl border-2 border-theme bg-bg text-primary focus:border-zinc-500 font-black text-lg transition-all duration-500 placeholder:text-muted-foreground/30"
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Label htmlFor="silver-rate" className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1.5 block ml-1">Rate (₹/g)</Label>
              <Input
                id="silver-rate"
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="0"
                className="h-14 px-6 rounded-2xl border-2 border-theme bg-bg text-primary focus:border-zinc-500 font-black text-lg transition-all duration-500 placeholder:text-muted-foreground/30"
              />
            </div>
            <div className="relative">
              <Label htmlFor="silver-making" className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1.5 block ml-1">Making (%)</Label>
              <Input
                id="silver-making"
                type="number"
                value={makingPercent}
                onChange={(e) => setMakingPercent(e.target.value)}
                placeholder="0"
                className="h-14 px-6 rounded-2xl border-2 border-theme bg-bg text-primary focus:border-zinc-500 font-black text-lg transition-all duration-500 placeholder:text-muted-foreground/30"
              />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {results.isValid ? (
            <motion.div 
              key={results.totalPrice}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-muted/30 dark:bg-muted/10 rounded-3xl p-8 text-center border-2 border-theme overflow-hidden"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Total Asset Value</p>
              <h2 className="text-4xl font-black text-primary tabular-nums tracking-tighter leading-none mb-4">
                ₹{formatNumber(results.totalPrice, 0)}
              </h2>
              <div className="flex justify-center gap-6 text-[10px] text-secondary font-black uppercase tracking-widest">
                <span>Base: ₹{formatNumber(results.basePrice, 0)}</span>
                <span>GST: ₹{formatNumber(results.gstPrice, 0)}</span>
              </div>
            </motion.div>
          ) : (
            <div className="bg-muted/20 dark:bg-muted/5 rounded-3xl p-10 text-center border-2 border-dashed border-theme">
               <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Enter evaluation parameters</p>
            </div>
          )}
        </AnimatePresence>

        <div className="space-y-3 pt-4">
          <button 
            onClick={copyToClipboard}
            disabled={!results.isValid}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[12px] tracking-widest active:scale-95 transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            {copied ? 'Captured' : 'Export Synthesis'}
          </button>
          
          <button 
            onClick={reset}
            className="w-full h-14 rounded-2xl border-2 border-theme text-secondary font-black uppercase text-[12px] tracking-widest active:scale-95 transition-all duration-500 flex items-center justify-center gap-3 bg-bg hover:bg-muted/50"
          >
            <RefreshCcw className="h-5 w-5" />
            Reset Matrix
          </button>

          {onSave && (
            <button
              onClick={() => onSave({ weight, unit, rate: parseFloat(rate), totalPrice: results.totalPrice, gstPrice: results.gstPrice })}
              disabled={!results.isValid}
              className="w-full h-12 rounded-xl bg-zinc-600 text-white font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all duration-500 disabled:opacity-50"
            >
              Archive Appraisal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
