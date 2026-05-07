import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Scale, 
  RefreshCcw, 
  TrendingUp,
  Coins,
  ChevronRight,
  Info,
  Zap,
  Check,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatNumber, vibrate } from '@/lib/utils';
import { CopyButton } from './ui/CopyButton';

type Purity = '24K' | '22K' | '18K';
type Unit = 'g' | 'kg';

const PURITY_FACTORS: Record<Purity, number> = {
  '24K': 1.0,
  '22K': 0.916,
  '18K': 0.75
};

interface GoldPriceCalculatorProps {
  initialRate?: number;
  onSave?: (data: { weight: string; unit: string; purity: string; rate: number; totalPrice: number }) => void;
}

export const GoldPriceCalculator: React.FC<GoldPriceCalculatorProps> = ({ initialRate = 0, onSave }) => {
  const [weight, setWeight] = useState<string>('');
  const [unit, setUnit] = useState<Unit>('g');
  const [purity, setPurity] = useState<Purity>('22K');
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
    const purityFactor = PURITY_FACTORS[purity];

    const basePrice = weightInGrams * r * purityFactor;
    const makingCharges = basePrice * (mPercent / 100);
    const totalPrice = basePrice + makingCharges;

    return {
      basePrice,
      makingCharges,
      totalPrice,
      isValid: w > 0 && r > 0
    };
  }, [weight, unit, purity, rate, makingPercent]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const copyToClipboard = () => {
    const text = `Gold Calculation:\nWeight: ${weight}${unit}\nPurity: ${purity}\nRate: ₹${rate}/g\nMaking: ${makingPercent}%\nTotal: ${formatCurrency(results.totalPrice)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    vibrate(15);
    setWeight('');
    setUnit('g');
    setPurity('22K');
    setRate('');
    setMakingPercent('');
  };

  return (
    <div className="max-w-xl mx-auto px-4 pb-24 pt-4">
      <div className="bg-card rounded-3xl shadow-xl border border-theme p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Metallic Evaluation Hub</p>
          <h2 className="text-3xl font-black text-primary tracking-tighter uppercase italic leading-none">Gold Valuation</h2>
        </div>

        {/* Weight Unit Selector */}
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
                    vibrate(5);
                  }}
                  className={`h-12 rounded-2xl border-2 transition-all duration-500 text-[11px] font-black uppercase tracking-widest ${
                    active 
                      ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-600/20' 
                      : 'border-theme text-secondary bg-bg hover:bg-muted/50'
                  }`}
                >
                  {u === 'g' ? 'Grams' : 'Kilograms'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div className="relative">
            <Label htmlFor="gold-weight" className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1.5 block ml-1">Weight</Label>
            <Input
              id="gold-weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="h-14 px-6 rounded-2xl border-2 border-theme bg-bg text-primary focus:border-amber-500 font-black text-lg transition-all duration-500 placeholder:text-muted-foreground/30"
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Label htmlFor="gold-rate" className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1.5 block ml-1">Rate (₹/g)</Label>
              <Input
                id="gold-rate"
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="0"
                className="h-14 px-6 rounded-2xl border-2 border-theme bg-bg text-primary focus:border-amber-500 font-black text-lg transition-all duration-500 placeholder:text-muted-foreground/30"
              />
            </div>
            <div className="relative">
              <Label htmlFor="gold-making" className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1.5 block ml-1">Making (%)</Label>
              <Input
                id="gold-making"
                type="number"
                value={makingPercent}
                onChange={(e) => setMakingPercent(e.target.value)}
                placeholder="0"
                className="h-14 px-6 rounded-2xl border-2 border-theme bg-bg text-primary focus:border-amber-500 font-black text-lg transition-all duration-500 placeholder:text-muted-foreground/30"
              />
            </div>
          </div>
        </div>

        {/* Purity Selector */}
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-secondary block ml-1">Purity Standard</Label>
          <div className="grid grid-cols-3 gap-3">
            {(['24K', '22K', '18K'] as Purity[]).map((p) => {
              const active = purity === p;
              return (
                <button
                  key={p}
                  onClick={() => {
                    setPurity(p);
                    vibrate(5);
                  }}
                  className={`h-12 rounded-2xl border-2 transition-all duration-500 text-[11px] font-black uppercase tracking-widest ${
                    active 
                      ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' 
                      : 'border-theme text-secondary bg-bg hover:bg-muted/50'
                  }`}
                >
                  {p}
                </button>
              );
            })}
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
              <div className="absolute top-4 right-4">
                <CopyButton value={results.totalPrice} label="Copy Gold Value" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Total Asset Value</p>
              <h2 className="text-4xl font-black text-primary tabular-nums tracking-tighter leading-none">
                ₹{formatNumber(results.totalPrice, 0)}
              </h2>
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
              onClick={() => onSave({ weight, unit, purity, rate: parseFloat(rate), totalPrice: results.totalPrice })}
              disabled={!results.isValid}
              className="w-full h-12 rounded-xl bg-amber-600 text-white font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all duration-500 disabled:opacity-50"
            >
              Archive Evaluation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
