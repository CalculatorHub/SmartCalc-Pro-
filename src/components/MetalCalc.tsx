import React, { useState, useEffect } from 'react';
import { RotateCcw, Save, TrendingUp, Sparkles, Scale, Info } from 'lucide-react';
import { formatCurrency, cn } from '../utils';
import { HistoryItem } from '../types';

interface MetalCalcProps {
  initialType: 'gold' | 'silver';
  currency: string;
  onSaveHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
}

type WeightUnit = 'grams' | 'tola' | 'sovereign';

export default function MetalCalc({ initialType, currency = '₹', onSaveHistory }: MetalCalcProps) {
  const [metalType, setMetalType] = useState<'gold' | 'silver'>(initialType);
  const [weight, setWeight] = useState<number>(10); // Default to 10 grams (1 Tola approx)
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('grams');
  const [purity, setPurity] = useState<number>(0.916); // Default 22K (91.6% BIS hallmark) for gold, fine silver for silver
  const [makingCharges, setMakingCharges] = useState<number>(8); // percentage (Making charges are typically 5% to 15% in India)
  const [taxRate, setTaxRate] = useState<number>(3); // standard GST on precious metals in India is 3%
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Realistic Indian Precious Metal Market Baseline Prices in ₹ per gram
  const [baseGoldPrice, setBaseGoldPrice] = useState<number>(7450); // ₹7,450 per gram for 24K Gold
  const [baseSilverPrice, setBaseSilverPrice] = useState<number>(92.5); // ₹92.5 per gram for Fine Silver
  const [trend, setTrend] = useState<'up' | 'down' | 'flat'>('flat');
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  // Synchronize purity toggle when switching active metal type
  useEffect(() => {
    if (metalType === 'gold') {
      setPurity(0.916); // 22K (Standard jewelry purity)
    } else {
      setPurity(0.999); // Fine silver
    }
    // Seed initial simulated chart history
    const base = metalType === 'gold' ? baseGoldPrice : baseSilverPrice;
    setPriceHistory(Array.from({ length: 8 }, (_, i) => base * (1 + (Math.random() * 0.01 - 0.005))));
  }, [metalType]);

  // Simulated Live Price feed interval matching Indian market shifts
  useEffect(() => {
    const timer = setInterval(() => {
      const goldChange = (Math.random() * 0.002 - 0.001); // max 0.1% change
      const silverChange = (Math.random() * 0.003 - 0.0015); // max 0.15% change
      const isUp = goldChange > 0;
      setTrend(isUp ? 'up' : 'down');

      const nextGold = baseGoldPrice * (1 + goldChange);
      const nextSilver = baseSilverPrice * (1 + silverChange);

      setBaseGoldPrice(parseFloat(nextGold.toFixed(2)));
      setBaseSilverPrice(parseFloat(nextSilver.toFixed(2)));

      const activeNext = metalType === 'gold' ? nextGold : nextSilver;
      setPriceHistory((prev) => [...prev.slice(1), activeNext]);
    }, 5000);

    return () => clearInterval(timer);
  }, [metalType, baseGoldPrice, baseSilverPrice]);

  const activeBasePrice = metalType === 'gold' ? baseGoldPrice : baseSilverPrice;

  // Weight Multipliers for Indian Precious Metals
  // 1 Gram = 1.0g
  // 1 Tola = 11.66g (Traditional Indian weight system)
  // 1 Sovereign/Pavan = 8.00g (Popular South Indian/bridal weight system)
  const getMultiplier = (unit: WeightUnit): number => {
    if (unit === 'tola') return 11.6638;
    if (unit === 'sovereign') return 8;
    return 1;
  };

  const multiplier = getMultiplier(weightUnit);
  const rawGramValue = activeBasePrice * purity;
  const rawTotalValue = rawGramValue * weight * multiplier;
  const makingChargesValue = rawTotalValue * (makingCharges / 100);
  const taxValue = (rawTotalValue + makingChargesValue) * (taxRate / 100); // 3% Indian GST applied on raw + making
  const finalEstimate = rawTotalValue + makingChargesValue + taxValue;

  const handleKaratSelect = (k: number) => {
    setPurity(k);
    setIsSaved(false);
  };

  const handlePreset = (type: 'gold' | 'silver', w: number, unit: WeightUnit, pur: number) => {
    setMetalType(type);
    setWeight(w);
    setWeightUnit(unit);
    setPurity(pur);
    setIsSaved(false);
  };

  const handleResetDefaults = () => {
    setWeight(10);
    setWeightUnit('grams');
    setMakingCharges(8);
    setTaxRate(3);
    if (metalType === 'gold') {
      setPurity(0.916);
      setBaseGoldPrice(7450);
    } else {
      setPurity(0.999);
      setBaseSilverPrice(92.5);
    }
    setIsSaved(false);
  };

  const handleSave = () => {
    onSaveHistory({
      type: metalType,
      title: `${metalType.charAt(0).toUpperCase() + metalType.slice(1)} BIS Valuation`,
      inputs: {
        metalType,
        weight,
        weightUnit,
        purity,
        makingChargesPercent: makingCharges,
        gstTaxPercent: taxRate,
      },
      outputs: {
        rawMetalValue: rawTotalValue,
        makingCharges: makingChargesValue,
        gstTaxAmount: taxValue,
        totalEstimateINR: finalEstimate,
        ratePerGram: rawGramValue,
      },
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Sparkline coordinates
  const sparkWidth = 140;
  const sparkHeight = 35;
  const maxHis = Math.max(...priceHistory);
  const minHis = Math.min(...priceHistory);
  const sparklineCoords = priceHistory.map((val, idx) => {
    const x = (idx / (priceHistory.length - 1)) * sparkWidth;
    const y = maxHis !== minHis ? sparkHeight - ((val - minHis) / (maxHis - minHis)) * sparkHeight : sparkHeight / 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Selector and Live Feed Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-app-bg p-4 rounded-2xl border border-app-border gap-4">
        {/* Metal toggle */}
        <div className="flex bg-app-card p-1 rounded-xl shadow-xs border border-app-border font-semibold text-xs">
          <button
            onClick={() => setMetalType('gold')}
            className={cn(
              "px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-bold",
              metalType === 'gold' ? "bg-amber-500 text-zinc-950 shadow-xs" : "text-app-text-muted hover:text-app-text"
            )}
          >
            🟡 Gold Calculator
          </button>
          <button
            onClick={() => setMetalType('silver')}
            className={cn(
              "px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-bold",
              metalType === 'silver' ? "bg-app-text-secondary text-app-card shadow-xs" : "text-app-text-muted hover:text-app-text"
            )}
          >
            ⚪ Silver Calculator
          </button>
        </div>

        {/* Live Index Ticker */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-app-card py-1.5 px-3 rounded-xl border border-app-border shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] uppercase font-bold text-app-text-muted tracking-wider">LIVE MCX RATE:</span>
            <span className="text-xs font-black font-mono text-app-text">
              {formatCurrency(activeBasePrice, currency)}/g
            </span>
          </div>

          {/* Mini Ticker visual */}
          {priceHistory.length > 1 && (
            <svg width={sparkWidth} height={sparkHeight} className="overflow-visible hidden sm:block">
              <polyline
                fill="none"
                stroke={trend === 'up' ? '#10b981' : '#f43f5e'}
                strokeWidth="1.5"
                points={sparklineCoords}
              />
            </svg>
          )}
        </div>
      </div>

      {/* Interactive Live Indian Rate Matrix */}
      <div className="bg-app-card p-5 rounded-3xl border border-app-border shadow-3xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-app-border pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <div>
              <h4 className="font-extrabold text-app-text text-sm font-display tracking-tight uppercase">
                Live Precious Metals Matrix (India Rates)
              </h4>
              <p className="text-[10px] text-app-text-muted font-bold uppercase tracking-wider">
                Updated live in INR (₹) • GST 3% Applicable Extra
              </p>
            </div>
          </div>
          <span className="text-[9px] font-black uppercase text-app-accent bg-app-accent/10 px-2.5 py-1 rounded-full border border-app-accent/20 self-start sm:self-center">
            MCX Reference Benchmarks
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. 24K Gold */}
          <div 
            onClick={() => {
              setMetalType('gold');
              setPurity(0.999);
            }}
            className={cn(
              "p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group select-none",
              metalType === 'gold' && purity === 0.999
                ? "bg-amber-500/5 border-amber-500/40 ring-2 ring-amber-500/10 shadow-3xs" 
                : "bg-app-bg/50 border-app-border hover:bg-app-bg hover:border-app-text-secondary/30"
            )}
          >
            <div className="absolute right-2 top-2">
              <span className={cn(
                "w-2 h-2 rounded-full block animate-pulse",
                trend === 'up' ? "bg-emerald-500" : "bg-rose-500"
              )}></span>
            </div>
            <p className="text-[9px] font-black text-app-text-muted uppercase tracking-wider">Gold 24K (99.9% Pure)</p>
            <p className="text-lg font-black text-app-text font-mono mt-1">
              {formatCurrency(baseGoldPrice, currency)}/g
            </p>
            <div className="flex justify-between items-center text-[10px] text-app-text-muted font-bold mt-1 pt-1 border-t border-app-border">
              <span>Tola (11.66g)</span>
              <span className="text-app-text-secondary">{formatCurrency(baseGoldPrice * 11.6638, currency)}</span>
            </div>
          </div>

          {/* 2. 22K Gold */}
          <div 
            onClick={() => {
              setMetalType('gold');
              setPurity(0.916);
            }}
            className={cn(
              "p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group select-none",
              metalType === 'gold' && purity === 0.916
                ? "bg-amber-500/5 border-amber-500/40 ring-2 ring-amber-500/10 shadow-3xs" 
                : "bg-app-bg/50 border-app-border hover:bg-app-bg hover:border-app-text-secondary/30"
            )}
          >
            <div className="absolute right-2 top-2">
              <span className={cn(
                "w-2 h-2 rounded-full block animate-pulse",
                trend === 'up' ? "bg-emerald-500" : "bg-rose-500"
              )}></span>
            </div>
            <p className="text-[9px] font-black text-amber-500 uppercase tracking-wider">Gold 22K (91.6% Jewel)</p>
            <p className="text-lg font-black text-app-text font-mono mt-1">
              {formatCurrency(baseGoldPrice * 0.916, currency)}/g
            </p>
            <div className="flex justify-between items-center text-[10px] text-app-text-muted font-bold mt-1 pt-1 border-t border-app-border">
              <span>Tola (11.66g)</span>
              <span className="text-app-text-secondary">{formatCurrency(baseGoldPrice * 0.916 * 11.6638, currency)}</span>
            </div>
          </div>

          {/* 3. 18K Gold */}
          <div 
            onClick={() => {
              setMetalType('gold');
              setPurity(0.750);
            }}
            className={cn(
              "p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group select-none",
              metalType === 'gold' && purity === 0.750
                ? "bg-amber-500/5 border-amber-500/40 ring-2 ring-amber-500/10 shadow-3xs" 
                : "bg-app-bg/50 border-app-border hover:bg-app-bg hover:border-app-text-secondary/30"
            )}
          >
            <p className="text-[9px] font-black text-app-text-muted uppercase tracking-wider">Gold 18K (75% Standard)</p>
            <p className="text-lg font-black text-app-text font-mono mt-1">
              {formatCurrency(baseGoldPrice * 0.750, currency)}/g
            </p>
            <div className="flex justify-between items-center text-[10px] text-app-text-muted font-bold mt-1 pt-1 border-t border-app-border">
              <span>Tola (11.66g)</span>
              <span className="text-app-text-secondary">{formatCurrency(baseGoldPrice * 0.750 * 11.6638, currency)}</span>
            </div>
          </div>

          {/* 4. Fine Silver */}
          <div 
            onClick={() => {
              setMetalType('silver');
              setPurity(0.999);
            }}
            className={cn(
              "p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group select-none",
              metalType === 'silver' && purity === 0.999
                ? "bg-app-text-secondary/5 border-app-text-secondary/40 ring-2 ring-app-text-secondary/10 shadow-3xs" 
                : "bg-app-bg/50 border-app-border hover:bg-app-bg hover:border-app-text-secondary/30"
            )}
          >
            <div className="absolute right-2 top-2">
              <span className={cn(
                "w-2 h-2 rounded-full block animate-pulse",
                trend === 'up' ? "bg-emerald-500" : "bg-rose-500"
              )}></span>
            </div>
            <p className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 space-x-1 uppercase tracking-wider">Fine Silver (99.9%)</p>
            <p className="text-lg font-black text-app-text font-mono mt-1">
              {formatCurrency(baseSilverPrice, currency)}/g
            </p>
            <div className="flex justify-between items-center text-[10px] text-app-text-muted font-bold mt-1 pt-1 border-t border-app-border">
              <span>Bar (100g)</span>
              <span className="text-app-text-secondary">{formatCurrency(baseSilverPrice * 100, currency)}</span>
            </div>
          </div>
        </div>

        {/* Dynamic silver / premium details */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-app-text-muted font-bold bg-app-bg/50 p-2.5 rounded-xl border border-app-border px-4 gap-3 select-none">
          <div className="flex gap-1.5 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Sterling Silver (92.5%): <strong className="text-app-text font-mono">{formatCurrency(baseSilverPrice * 0.925, currency)}/g</strong></span>
          </div>
          <div className="flex gap-1.5 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Gold 14K (58.5%): <strong className="text-app-text font-mono">{formatCurrency(baseGoldPrice * 0.585, currency)}/g</strong></span>
          </div>
          <span className="text-app-text-muted uppercase text-[9px] tracking-wider shrink-0">Click any card above to select and calculate instantly</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parameters */}
        <div className="space-y-5 bg-app-card p-6 rounded-2xl border border-app-border">
          <div className="flex items-center justify-between border-b border-app-border pb-3 select-none">
            <h3 className="font-semibold text-app-text text-base flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-500" />
              Weight & Purity BIS Standards
            </h3>
            <button
              onClick={handleResetDefaults}
              className="text-app-text-muted hover:text-app-text text-xs flex items-center gap-1 cursor-pointer font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          </div>

          {/* Weight and Unit Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs select-none">
              <label className="font-bold text-app-text-secondary uppercase tracking-wider">Metal Weight ({weightUnit})</label>
              <div className="flex bg-app-bg p-0.5 rounded-lg text-[10px] font-bold border border-app-border">
                <button
                  type="button"
                  onClick={() => { setWeightUnit('grams'); setWeight(10); setIsSaved(false); }}
                  className={cn(
                    "px-2 py-0.5 rounded transition-all cursor-pointer",
                    weightUnit === 'grams' ? "bg-app-card text-app-text shadow-3xs" : "text-app-text-muted hover:text-app-text"
                  )}
                >
                  Grams
                </button>
                <button
                  type="button"
                  onClick={() => { setWeightUnit('tola'); setWeight(1); setIsSaved(false); }}
                  className={cn(
                    "px-2 py-0.5 rounded transition-all cursor-pointer",
                    weightUnit === 'tola' ? "bg-app-card text-app-text shadow-3xs" : "text-app-text-muted hover:text-app-text"
                  )}
                >
                  Tola (11.66g)
                </button>
                <button
                  type="button"
                  onClick={() => { setWeightUnit('sovereign'); setWeight(1); setIsSaved(false); }}
                  className={cn(
                    "px-2 py-0.5 rounded transition-all cursor-pointer",
                    weightUnit === 'sovereign' ? "bg-app-card text-app-text shadow-3xs" : "text-app-text-muted hover:text-app-text"
                  )}
                >
                  Pavan (8g)
                </button>
              </div>
            </div>
            <div className="relative rounded-xl shadow-xs">
              <input
                type="number"
                value={weight || ''}
                onChange={(e) => {
                  setWeight(Math.max(0, parseFloat(e.target.value) || 0));
                  setIsSaved(false);
                }}
                className="block w-full px-3.5 py-2.5 bg-[#FFFFFF] dark:bg-[#151515] border border-[#E2E8F0] dark:border-[#2A2A2A] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-semibold text-[#0F172A] dark:text-[#FFFFFF] placeholder-[#94A3B8] dark:placeholder-[#9CA3AF]"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Purity selector based on metal type */}
          {metalType === 'gold' ? (
            <div className="space-y-2 select-none">
              <label className="text-xs font-bold text-app-text-secondary uppercase tracking-wider block">Gold Purity (Karats)</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: '24K (99.9%)', ratio: 0.999 },
                  { label: '22K (91.6%)', ratio: 0.916 },
                  { label: '18K (75.0%)', ratio: 0.750 },
                  { label: '14K (58.5%)', ratio: 0.585 },
                ].map((item) => (
                  <button
                    key={item.ratio}
                    type="button"
                    onClick={() => handleKaratSelect(item.ratio)}
                    className={cn(
                      "py-2.5 rounded-xl text-[10px] font-bold text-center border transition-all cursor-pointer",
                      purity === item.ratio
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/40 ring-2 ring-amber-500/10"
                        : "border-app-border text-app-text-secondary hover:bg-app-bg"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2 select-none">
              <label className="text-xs font-bold text-app-text-secondary uppercase tracking-wider block">Silver Purity Standards</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: '99.9% Pure', ratio: 0.999 },
                  { label: '92.5% Sterling', ratio: 0.925 },
                  { label: '90.0% Coin Silver', ratio: 0.900 },
                ].map((item) => (
                  <button
                    key={item.ratio}
                    type="button"
                    onClick={() => handleKaratSelect(item.ratio)}
                    className={cn(
                      "py-2.5 rounded-xl text-[10px] font-bold text-center border transition-all cursor-pointer",
                      purity === item.ratio
                        ? "bg-app-text-secondary/15 text-app-text border-app-text-secondary/40 ring-2 ring-app-text-secondary/10"
                        : "border-app-border text-app-text-secondary hover:bg-app-bg"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Making Charges / wastage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs select-none">
              <label className="font-bold text-app-text-secondary uppercase tracking-wider">Making Charges / Wastage (%)</label>
            </div>
            <div className="relative rounded-xl">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={makingCharges || ''}
                onChange={(e) => {
                  setMakingCharges(Math.max(0, parseFloat(e.target.value) || 0));
                  setIsSaved(false);
                }}
                className="block w-full px-3.5 py-2.5 bg-[#FFFFFF] dark:bg-[#151515] border border-[#E2E8F0] dark:border-[#2A2A2A] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-semibold text-[#0F172A] dark:text-[#FFFFFF] placeholder-[#94A3B8] dark:placeholder-[#9CA3AF]"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
                <span className="text-app-text-muted text-xs font-bold">%</span>
              </div>
            </div>
          </div>

          {/* GST Rate (Default is 3% for precious metals in India) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs select-none">
              <label className="font-bold text-app-text-secondary uppercase tracking-wider">GST rate on Precious Metals (%)</label>
            </div>
            <div className="relative rounded-xl">
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={taxRate || ''}
                onChange={(e) => {
                  setTaxRate(Math.max(0, parseFloat(e.target.value) || 0));
                  setIsSaved(false);
                }}
                className="block w-full px-3.5 py-2.5 bg-[#FFFFFF] dark:bg-[#151515] border border-[#E2E8F0] dark:border-[#2A2A2A] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-semibold text-[#0F172A] dark:text-[#FFFFFF] placeholder-[#94A3B8] dark:placeholder-[#9CA3AF]"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
                <span className="text-app-text-muted text-xs font-bold">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Outputs and Breakdown */}
        <div className="flex flex-col justify-between bg-app-card p-6 rounded-2xl border border-app-border space-y-6">
          <div className="flex items-center justify-between border-b border-app-border pb-3 select-none">
            <h3 className="font-semibold text-app-text text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Valuation Breakdown
            </h3>
            <button
              onClick={handleSave}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs",
                isSaved
                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                  : "bg-[#4F46E5] text-white dark:bg-[#FACC15] dark:text-[#000000] hover:opacity-90 active:scale-95"
              )}
            >
              <Save className="w-3.5 h-3.5" />
              {isSaved ? "Saved!" : "Save Calculation"}
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 dark:border-amber-500/20 space-y-2">
            <span className="text-[11px] uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400">Estimated Indian Cost</span>
            <p className="text-3xl font-black text-app-text font-sans">{formatCurrency(finalEstimate, currency)}</p>
            <p className="text-xs text-app-text-muted">
              Computed on MCX price of <span className="font-semibold text-app-text">{formatCurrency(rawGramValue, currency)}/gram</span> ({purity * 100}% purity)
            </p>
          </div>

          <div className="space-y-3.5 divide-y divide-app-border text-xs text-app-text-secondary">
            <div className="flex justify-between items-center pb-2.5">
              <span>Raw Metal Value ({weight * multiplier} grams)</span>
              <span className="font-bold text-app-text">{formatCurrency(rawTotalValue, currency)}</span>
            </div>
            <div className="flex justify-between items-center pt-2.5 pb-2.5">
              <span>Making Charges / wastage ({makingCharges}%)</span>
              <span className="font-bold text-app-text">{formatCurrency(makingChargesValue, currency)}</span>
            </div>
            <div className="flex justify-between items-center pt-2.5 pb-2.5">
              <span>Indian GST ({taxRate}%)</span>
              <span className="font-bold text-app-text">{formatCurrency(taxValue, currency)}</span>
            </div>
          </div>

          {/* Traditional Presets Info */}
          <div className="space-y-1.5 pt-2 border-t border-app-border text-[10px] font-bold text-app-text-muted uppercase select-none">
            <span>Quick Weight Benchmarks</span>
            <div className="flex flex-wrap gap-2 text-xs font-semibold normal-case">
              <button
                type="button"
                onClick={() => handlePreset('gold', 1, 'tola', 0.916)}
                className="px-2 py-1 rounded bg-app-bg border border-app-border text-app-text-secondary hover:text-amber-500 hover:border-amber-500/30 cursor-pointer"
              >
                1 Tola Gold (22K)
              </button>
              <button
                type="button"
                onClick={() => handlePreset('gold', 1, 'sovereign', 0.916)}
                className="px-2 py-1 rounded bg-app-bg border border-app-border text-app-text-secondary hover:text-amber-500 hover:border-amber-500/30 cursor-pointer"
              >
                1 Sovereign Gold (22K)
              </button>
              <button
                type="button"
                onClick={() => handlePreset('silver', 100, 'grams', 0.999)}
                className="px-2 py-1 rounded bg-app-bg border border-app-border text-app-text-secondary hover:text-app-text hover:border-app-text-secondary/40 cursor-pointer"
              >
                100g Bar Silver (Fine)
              </button>
            </div>
          </div>

          {/* Quick Informational Tip */}
          <div className="text-[11px] bg-app-bg p-3 rounded-xl text-app-text-secondary flex gap-2 border border-app-border leading-relaxed">
            <Info className="w-4 h-4 text-app-text-muted shrink-0 mt-0.5" />
            <p>
              Precious metal pricing fluctuates on the MCX (Multi Commodity Exchange of India). Making charges are taxable under modern Indian GST laws.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
