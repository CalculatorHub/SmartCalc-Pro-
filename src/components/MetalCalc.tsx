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
      const change = (Math.random() * 0.004 - 0.002); // max 0.2% change
      const isUp = change > 0;
      setTrend(isUp ? 'up' : 'down');

      if (metalType === 'gold') {
        const nextPrice = baseGoldPrice * (1 + change);
        setBaseGoldPrice(parseFloat(nextPrice.toFixed(2)));
        setPriceHistory((prev) => [...prev.slice(1), nextPrice]);
      } else {
        const nextPrice = baseSilverPrice * (1 + change);
        setBaseSilverPrice(parseFloat(nextPrice.toFixed(2)));
        setPriceHistory((prev) => [...prev.slice(1), nextPrice]);
      }
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
    <div className="space-y-6">
      {/* Selector and Live Feed Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 gap-4">
        {/* Metal toggle */}
        <div className="flex bg-white p-1 rounded-xl shadow-xs border border-gray-100 font-semibold text-xs">
          <button
            onClick={() => setMetalType('gold')}
            className={cn(
              "px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5",
              metalType === 'gold' ? "bg-amber-500 text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
            )}
          >
            🟡 Gold Calculator
          </button>
          <button
            onClick={() => setMetalType('silver')}
            className={cn(
              "px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5",
              metalType === 'silver' ? "bg-slate-450 text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
            )}
          >
            ⚪ Silver Calculator
          </button>
        </div>

        {/* Live Index Ticker */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white py-1.5 px-3 rounded-xl border border-gray-150 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">LIVE MCX RATE:</span>
            <span className="text-xs font-black font-mono text-gray-800">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parameters */}
        <div className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-semibold text-gray-800 text-base flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-500" />
              Weight & Purity BIS Standards
            </h3>
            <button
              onClick={handleResetDefaults}
              className="text-gray-400 hover:text-gray-600 text-xs flex items-center gap-1 cursor-pointer font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          </div>

          {/* Weight and Unit Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-gray-500 uppercase tracking-wider">Metal Weight ({weightUnit})</label>
              <div className="flex bg-gray-100 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => { setWeightUnit('grams'); setWeight(10); setIsSaved(false); }}
                  className={cn(
                    "px-2 py-0.5 rounded transition-all cursor-pointer",
                    weightUnit === 'grams' ? "bg-white text-gray-800 shadow-xs" : "text-gray-500 hover:text-gray-800"
                  )}
                >
                  Grams
                </button>
                <button
                  type="button"
                  onClick={() => { setWeightUnit('tola'); setWeight(1); setIsSaved(false); }}
                  className={cn(
                    "px-2 py-0.5 rounded transition-all cursor-pointer",
                    weightUnit === 'tola' ? "bg-white text-gray-800 shadow-xs" : "text-gray-500 hover:text-gray-800"
                  )}
                >
                  Tola (11.66g)
                </button>
                <button
                  type="button"
                  onClick={() => { setWeightUnit('sovereign'); setWeight(1); setIsSaved(false); }}
                  className={cn(
                    "px-2 py-0.5 rounded transition-all cursor-pointer",
                    weightUnit === 'sovereign' ? "bg-white text-gray-800 shadow-xs" : "text-gray-500 hover:text-gray-800"
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
                className="block w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-semibold"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Purity selector based on metal type */}
          {metalType === 'gold' ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Gold Purity (Karats)</label>
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
                        ? "bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-500/10"
                        : "border-gray-200 text-gray-600 hover:bg-gray-55"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Silver Purity Standards</label>
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
                        ? "bg-slate-100 text-slate-800 border-slate-300 ring-2 ring-slate-450/10"
                        : "border-gray-200 text-gray-600 hover:bg-gray-55"
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
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-gray-500 uppercase tracking-wider">Making Charges / Wastage (%)</label>
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
                className="block w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-semibold"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xs font-bold">%</span>
              </div>
            </div>
          </div>

          {/* GST Rate (Default is 3% for precious metals in India) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-gray-500 uppercase tracking-wider">GST rate on Precious Metals (%)</label>
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
                className="block w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-semibold"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xs font-bold">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Outputs and Breakdown */}
        <div className="flex flex-col justify-between bg-white p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Valuation Breakdown
            </h3>
            <button
              onClick={handleSave}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs",
                isSaved
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : metalType === 'gold'
                    ? "bg-amber-500 text-white hover:bg-amber-600 active:scale-95"
                    : "bg-slate-600 text-white hover:bg-slate-700 active:scale-95"
              )}
            >
              <Save className="w-3.5 h-3.5" />
              {isSaved ? "Saved!" : "Save Calculation"}
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/10 to-amber-50/30 border border-amber-50/50 space-y-2">
            <span className="text-[11px] uppercase font-bold tracking-widest text-amber-700">Estimated Indian Cost</span>
            <p className="text-3xl font-black text-gray-900 font-sans">{formatCurrency(finalEstimate, currency)}</p>
            <p className="text-xs text-gray-400">
              Computed on MCX price of <span className="font-semibold text-gray-600">{formatCurrency(rawGramValue, currency)}/gram</span> ({purity * 100}% purity)
            </p>
          </div>

          <div className="space-y-3.5 divide-y divide-gray-50 text-xs text-gray-650">
            <div className="flex justify-between items-center pb-2.5">
              <span>Raw Metal Value ({weight * multiplier} grams)</span>
              <span className="font-bold text-gray-800">{formatCurrency(rawTotalValue, currency)}</span>
            </div>
            <div className="flex justify-between items-center pt-2.5 pb-2.5">
              <span>Making Charges / wastage ({makingCharges}%)</span>
              <span className="font-bold text-gray-800">{formatCurrency(makingChargesValue, currency)}</span>
            </div>
            <div className="flex justify-between items-center pt-2.5 pb-2.5">
              <span>Indian GST ({taxRate}%)</span>
              <span className="font-bold text-gray-800">{formatCurrency(taxValue, currency)}</span>
            </div>
          </div>

          {/* Traditional Presets Info */}
          <div className="space-y-1.5 pt-1 border-t border-gray-50 text-[10px] font-bold text-gray-450 uppercase">
            <span>Quick Weight Benchmarks</span>
            <div className="flex flex-wrap gap-2 text-xs font-semibold normal-case">
              <button
                type="button"
                onClick={() => handlePreset('gold', 1, 'tola', 0.916)}
                className="px-2 py-1 rounded bg-slate-50 border border-gray-150 text-gray-600 hover:text-amber-700 hover:border-amber-200 cursor-pointer"
              >
                1 Tola Gold (22K)
              </button>
              <button
                type="button"
                onClick={() => handlePreset('gold', 1, 'sovereign', 0.916)}
                className="px-2 py-1 rounded bg-slate-50 border border-gray-150 text-gray-600 hover:text-amber-700 hover:border-amber-200 cursor-pointer"
              >
                1 Sovereign Gold (22K)
              </button>
              <button
                type="button"
                onClick={() => handlePreset('silver', 100, 'grams', 0.999)}
                className="px-2 py-1 rounded bg-slate-50 border border-gray-150 text-gray-600 hover:text-slate-800 hover:border-slate-350 cursor-pointer"
              >
                100g Bar Silver (Fine)
              </button>
            </div>
          </div>

          {/* Quick Informational Tip */}
          <div className="text-[11px] bg-slate-50 p-3 rounded-xl text-gray-500 flex gap-2 border border-gray-150">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Precious metal pricing fluctuates on the MCX (Multi Commodity Exchange of India). Making charges are taxable under modern Indian GST laws.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
