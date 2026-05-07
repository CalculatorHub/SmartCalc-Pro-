/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { IndianRupee, Percent, RotateCcw, TrendingDown, Gift, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatNumber, vibrate } from '@/lib/utils';
import { CopyButton } from '../ui/CopyButton';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const calculations = useMemo(() => {
    const price = parseFloat(originalPrice) || 0;
    const mainDiscount = parseFloat(discountPercent) || 0;
    
    // Validate inputs for calculation
    if (price <= 0 || mainDiscount < 0 || mainDiscount > 100) {
      return { discountAmount: 0, totalSavings: 0, finalPrice: price };
    }

    const discountAmount = (price * mainDiscount) / 100;
    const totalSavings = discountAmount;
    const finalPrice = Math.max(0, price - totalSavings);
    
    return {
      discountAmount,
      totalSavings,
      finalPrice
    };
  }, [originalPrice, discountPercent]);

  const handleReset = () => {
    vibrate(15);
    setOriginalPrice('');
    setDiscountPercent('');
    setErrors({});
  };

  useEffect(() => {
    const newErrors: { [key: string]: string } = {};
    
    if (originalPrice !== '') {
      const price = parseFloat(originalPrice);
      if (isNaN(price)) {
        newErrors.price = 'Invalid amount entered';
      } else if (price < 0) {
        newErrors.price = 'Price cannot be negative';
      } else if (price === 0) {
        newErrors.price = 'Price must be greater than zero';
      }
    }

    if (discountPercent !== '') {
      const dPercent = parseFloat(discountPercent);
      if (isNaN(dPercent)) {
        newErrors.discount = 'Invalid percentage entered';
      } else if (dPercent < 0) {
        newErrors.discount = 'Discount cannot be negative';
      } else if (dPercent > 100) {
        newErrors.discount = 'Discount cannot exceed 100%';
      }
    }

    setErrors(newErrors);
  }, [originalPrice, discountPercent]);

  const hasAnyError = Object.keys(errors).length > 0;

  return (
    <Card className="w-full h-full border-none shadow-xl bg-card rounded-[2rem] overflow-hidden group transition-all duration-500 hover:shadow-2xl border border-theme">
      <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 z-20" />
      
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20">
            <TrendingDown className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
            FISCAL_REDUCTION
          </div>
        </div>
        <CardTitle className="text-3xl font-black mt-6 tracking-tighter uppercase italic text-primary">
          Discount <span className="text-blue-600">Calculator</span>
        </CardTitle>
        <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">
          Neural Net Pricing Optimizer
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 pt-4 space-y-8">
        {/* Original Price */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
              <IndianRupee className="h-3 w-3 text-blue-500" /> Original Price
            </Label>
          </div>
          <motion.div 
            animate={errors.price ? { x: [0, -4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <Input
              type="number"
              placeholder="0.00"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className={`h-14 bg-bg border-2 rounded-2xl pl-10 pr-6 font-black text-lg transition-all text-primary placeholder:text-muted-foreground/30 focus:ring-4 ${
                errors.price 
                  ? 'border-red-500 ring-red-500/20 bg-red-50/50 dark:bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]' 
                  : 'border-theme focus:border-blue-500 focus:ring-blue-500/10'
              }`}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
              <span className="font-black text-sm">₹</span>
            </div>
          </motion.div>
          <AnimatePresence>
            {errors.price && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border-2 border-red-500/20 rounded-2xl p-4 flex items-center gap-3 shadow-sm"
              >
                <div className="bg-red-600 p-1.5 rounded-lg shadow-lg shadow-red-500/40">
                  <AlertCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-red-700 dark:text-red-400">
                  {errors.price}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Discount Percentage */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
              <Percent className="h-3 w-3 text-blue-500" /> Discount Rate
            </Label>
          </div>
          <motion.div 
            animate={errors.discount ? { x: [0, -4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <Input
              type="number"
              placeholder="0"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className={`h-14 bg-bg border-2 rounded-2xl pl-12 pr-6 font-black text-lg transition-all text-primary placeholder:text-muted-foreground/30 focus:ring-4 ${
                errors.discount 
                  ? 'border-red-500 ring-red-500/20 bg-red-50/50 dark:bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]' 
                  : 'border-theme focus:border-blue-500 focus:ring-blue-500/10'
              }`}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
              <Percent className="h-4 w-4" />
            </div>
          </motion.div>
          <AnimatePresence>
            {errors.discount && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border-2 border-red-500/20 rounded-2xl p-4 flex items-center gap-3 shadow-sm"
              >
                <div className="bg-red-600 p-1.5 rounded-lg shadow-lg shadow-red-500/40">
                  <AlertCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-red-700 dark:text-red-400">
                  {errors.discount}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="grid grid-cols-3 gap-3">
            {[10, 20, 50].map((val) => (
              <button
                key={val}
                onClick={() => {
                  setDiscountPercent(val.toString());
                  vibrate(5);
                }}
                className={`rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 border-2 transition-all shadow-sm ${
                  discountPercent === val.toString() 
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-blue-500/10' 
                    : 'border-theme text-secondary hover:bg-muted/50'
                }`}
              >
                {val}%
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {originalPrice && !hasAnyError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-6 space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-[2rem] bg-emerald-500/10 border-2 border-emerald-500/20 text-center shadow-lg shadow-emerald-500/5">
                  <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Savings</p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">₹{formatNumber(calculations.totalSavings, 0)}</p>
                </div>
                <div className="p-5 rounded-[2rem] bg-muted/30 dark:bg-muted/10 border-2 border-theme text-center shadow-lg">
                  <p className="text-[9px] font-black text-secondary uppercase tracking-widest mb-1">Off %</p>
                  <p className="text-xl font-black text-primary tabular-nums">{discountPercent}%</p>
                </div>
              </div>

              <div className="relative p-8 rounded-[2.5rem] bg-emerald-600 dark:bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30 group-hover:scale-[1.02] transition-transform duration-500 border border-white/10">
                <div className="absolute top-6 right-6">
                  <CopyButton value={calculations.finalPrice} className="text-white hover:bg-white/20" label="Copy Final Price" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <Gift className="h-5 w-5 opacity-80" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Settlement Price</p>
                </div>
                <p className="text-4xl sm:text-5xl font-black tracking-tighter mb-4 tabular-nums italic">₹{formatNumber(calculations.finalPrice, 0)}</p>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl py-3 px-6 text-center w-full border border-white/10">
                  <p className="text-[11px] font-black uppercase tracking-widest">
                    You Saved ₹{formatNumber(calculations.totalSavings, 0)} 🎉
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full h-14 rounded-2xl text-secondary hover:text-blue-600 hover:bg-blue-500/10 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all border-2 border-transparent hover:border-blue-500/20"
        >
          <RotateCcw className="h-4 w-4" /> Purge Matrix Cache
        </button>
      </CardContent>
    </Card>
  );
}
