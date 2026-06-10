import React, { useState, useEffect } from 'react';
import { 
  Percent, 
  RotateCcw, 
  Save, 
  Calendar, 
  Landmark, 
  TrendingUp, 
  Sliders, 
  Lightbulb,
  CheckCircle,
  Sparkles,
  Coins
} from 'lucide-react';
import { formatCurrency, cn } from '../utils';
import { HistoryItem } from '../types';

interface InterestCalcProps {
  initialMode?: 'simple' | 'compound' | 'compare';
  currency: string;
  onSaveHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
}

type Frequency = 'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'daily';

const FREQUENCY_MULTIPLIERS: Record<Frequency, number> = {
  annually: 1,
  'semi-annually': 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

export default function InterestCalc({ 
  initialMode = 'simple', 
  currency = '₹', 
  onSaveHistory 
}: InterestCalcProps) {
  // Mode tabs: we've removed 'compare' as per request, only 'simple' and 'compound' remain
  const [calcMode, setCalcMode] = useState<'simple' | 'compound'>(
    initialMode === 'compare' ? 'simple' : initialMode
  );

  // Sync calcMode if user toggles selection from the main dashboard cards
  useEffect(() => {
    if (initialMode === 'simple' || initialMode === 'compound') {
      setCalcMode(initialMode);
    }
  }, [initialMode]);
  
  // Base Parameters - Defaulted to 0 as per "Everytime input values with 0"
  const [principal, setPrincipal] = useState<number>(0);
  const [timeValue, setTimeValue] = useState<number>(0);
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [activeSlice, setActiveSlice] = useState<'principal' | 'interest' | null>(null);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Synced Rate States - Defaulted to 0 as per "Everytime input values with 0"
  // formula: 12% annual = ₹1 rupee/month per ₹100 principal
  // formula: 18% annual = ₹1.5 rupees/month per ₹100 principal
  const [annualRate, setAnnualRate] = useState<number>(0);
  const [rupeeRate, setRupeeRate] = useState<number>(0);

  // Date difference utility to yield highly precise years/months breakdown
  const calcDateDiff = (d1Str: string, d2Str: string) => {
    if (!d1Str || !d2Str) return null;
    const d1 = new Date(d1Str);
    const d2 = new Date(d2Str);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    if (d1 > d2) return { invalid: true };

    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalMonths = parseFloat((years * 12 + months + days / 30.4375).toFixed(2));
    const totalYears = parseFloat((totalMonths / 12).toFixed(2));

    return {
      years,
      months,
      days,
      totalDays: diffDays,
      totalMonths,
      totalYears,
      invalid: false
    };
  };

  const diffResult = calcDateDiff(startDate, endDate);

  // Sync date differences with duration inputs
  useEffect(() => {
    if (diffResult && !diffResult.invalid) {
      const calculatedVal = timeUnit === 'years' ? diffResult.totalYears : diffResult.totalMonths;
      setTimeValue(calculatedVal);
    } else {
      setTimeValue(0);
    }
  }, [startDate, endDate, timeUnit]);

  // Dynamically sync rate values
  const handleAnnualRateChange = (val: number) => {
    setAnnualRate(val);
    if (val === 0) {
      setRupeeRate(0);
    } else {
      setRupeeRate(parseFloat((val / 12).toFixed(4)));
    }
    setIsSaved(false);
  };

  const handleRupeeRateChange = (val: number) => {
    setRupeeRate(val);
    if (val === 0) {
      setAnnualRate(0);
    } else {
      setAnnualRate(parseFloat((val * 12).toFixed(2)));
    }
    setIsSaved(false);
  };

  // Reset parameters back to 0
  const handleReset = () => {
    setPrincipal(0);
    setTimeValue(0);
    setTimeUnit('years');
    setFrequency('monthly');
    setAnnualRate(0);
    setRupeeRate(0);
    setIsSaved(false);
    setStartDate('');
    setEndDate('');
  };

  // Traditional Popular Conversions presets
  const traditionalPresets = [
    { label: '50 Paise Rate', rRate: 0.5, aRate: 6.0, desc: 'Local rate of 0.5% per month' },
    { label: '₹1.00 Rupee Rate', rRate: 1.0, aRate: 12.0, desc: 'Traditional standard rate' },
    { label: '₹1.50 Rupee Rate', rRate: 1.5, aRate: 18.0, desc: 'Popular standard rural rate' },
    { label: '₹2.00 Rupees Rate', rRate: 2.0, aRate: 24.0, desc: 'High-risk or merchant rate' },
    { label: '₹3.00 Rupees Rate', rRate: 3.0, aRate: 36.0, desc: 'High-yield personal term' },
  ];

  // Duration in years (t)
  const t = timeUnit === 'years' ? timeValue : timeValue / 12;

  // -- SIMPLE INTEREST FORMULA --
  const simpleInterest = (principal * annualRate * t) / 100;
  const simpleTotal = principal + simpleInterest;
  const simpleMonthlyIncome = timeValue > 0 ? simpleInterest / (timeUnit === 'years' ? timeValue * 12 : timeValue) : 0;

  // -- COMPOUND INTEREST FORMULA --
  const n = FREQUENCY_MULTIPLIERS[frequency];
  const rCombined = annualRate / 100;
  // A = P * (1 + r/n)^(n*t)
  const compoundTotal = principal * Math.pow(1 + rCombined / n, n * t);
  const compoundInterest = compoundTotal - principal;
  const compoundMonthlyAverage = timeValue > 0 ? compoundInterest / (timeUnit === 'years' ? timeValue * 12 : timeValue) : 0;

  const currentTotal = calcMode === 'simple' ? simpleTotal : compoundTotal;
  const currentInterest = calcMode === 'simple' ? simpleInterest : compoundInterest;
  const principalPercent = currentTotal > 0 ? (principal / currentTotal) * 100 : 100;
  const interestPercent = currentTotal > 0 ? (currentInterest / currentTotal) * 100 : 0;

  // Growth graph coordinate generator (0-Division safe)
  const numSteps = Math.min(12, Math.ceil(timeUnit === 'years' ? timeValue : timeValue)) || 1;
  const points: { label: string; value: number }[] = [];
  
  for (let i = 0; i <= numSteps; i++) {
    const stepT = (t === 0 || numSteps === 0) ? 0 : (t / numSteps) * i;
    if (calcMode === 'simple') {
      const sInt = (principal * annualRate * stepT) / 100;
      points.push({
        label: timeUnit === 'years' ? `${i}y` : `${i}m`,
        value: principal + sInt,
      });
    } else {
      const cTot = principal * Math.pow(1 + rCombined / n, n * stepT);
      points.push({
        label: timeUnit === 'years' ? `${i}y` : `${i}m`,
        value: cTot,
      });
    }
  }

  // Draw smooth SVG path
  const svgWidth = 500;
  const svgHeight = 180;
  const paddingX = 35;
  const paddingY = 20;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  const maxVal = Math.max(...points.map(p => p.value)) || 1;
  const minVal = principal || 0;

  const getCoordinatesY = (val: number) => {
    if (maxVal === minVal) return paddingY + graphHeight;
    const pctY = (val - minVal) / (maxVal - minVal);
    return paddingY + graphHeight - pctY * graphHeight;
  };

  const getCoordinatesX = (idx: number) => {
    if (points.length <= 1) return paddingX + graphWidth / 2;
    return paddingX + (idx / (points.length - 1)) * graphWidth;
  };

  let linePath = '';
  let fillPath = '';

  if (points.length > 0) {
    const coords = points.map((p, idx) => ({ x: getCoordinatesX(idx), y: getCoordinatesY(p.value) }));
    linePath = `M ${coords[0].x} ${coords[0].y} ` + 
      coords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ');

    fillPath = `${linePath} L ${coords[coords.length - 1].x} ${svgHeight - paddingY} L ${coords[0].x} ${svgHeight - paddingY} Z`;
  }

  const handleSave = () => {
    const isComp = calcMode === 'compound';
    onSaveHistory({
      type: calcMode,
      title: isComp ? `Compound Interest (${frequency})` : 'Simple Interest',
      inputs: {
        principal,
        rate: annualRate,
        rupeeRate,
        timeValue,
        timeUnit,
        ...(startDate && endDate && { startDate, endDate }),
        ...(isComp && { frequency })
      },
      outputs: {
        interest: isComp ? compoundInterest : simpleInterest,
        totalAmount: isComp ? compoundTotal : simpleTotal,
        rupeeReturnNote: `Traditional Rupee interest rate of ${rupeeRate} per ₹100/month`
      },
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* SECTION HEADER BLOCK - Clean mode selection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-150/45 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-display flex items-center gap-2">
            <Landmark className="w-5.5 h-5.5 text-indigo-600" />
            Interest Calculator
          </h2>
          <p className="text-xs text-gray-450 mt-1 select-none font-medium">
            Dual Rate Conversion System (Annual % p.a. &amp; Local Monthly Rupee Rate)
          </p>
        </div>

        {/* Clean Selector for Simple and Compound. Compare mode removed completely */}
        <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-auto border border-gray-200/50 font-bold text-xs select-none shadow-3xs">
          <button
            type="button"
            onClick={() => {
              setCalcMode('simple');
              setIsSaved(false);
            }}
            className={cn(
              "px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1",
              calcMode === 'simple' ? "bg-white text-emerald-700 shadow-3xs border border-emerald-100" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <Percent className="w-3.5 h-3.5 text-emerald-500" />
            Simple Interest
          </button>
          <button
            type="button"
            onClick={() => {
              setCalcMode('compound');
              setIsSaved(false);
            }}
            className={cn(
              "px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1",
              calcMode === 'compound' ? "bg-white text-purple-700 shadow-3xs border border-purple-100" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
            Compound Interest
          </button>
        </div>
      </div>

      {/* DYNAMICS EXPLANATION FOR RATE CONVERSIONS */}
      <div className="bg-gradient-to-r from-indigo-50/50 to-emerald-50/50 border border-indigo-100/50 rounded-2xl p-4 flex gap-3 text-gray-700 text-xs shadow-3xs relative overflow-hidden">
        <Lightbulb className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1 z-10">
          <span className="font-bold text-indigo-950 text-sm">Traditional Conversions Integrated Directly:</span>
          <p className="opacity-90 leading-relaxed text-indigo-900">
            For local finance bookkeeping, interest is defined as <strong className="text-emerald-750 font-extrabold">Rupees per month for every ₹100 of principal</strong>. 
            Here, <strong className="text-slate-800 font-bold">12% Annual Rate (% p.a.) = ₹1.00 Rupee Rate</strong>, and <strong className="text-slate-800 font-bold">18% Annual Rate = ₹1.50 Rupee Rate</strong>. 
            Simply modify either field below, and the active conversion rate displays instantly inline.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: PARAMETERS FOR THE INDIVIDUAL SECTION */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-150/45 shadow-3xs space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              Configure {calcMode === 'simple' ? 'Simple' : 'Compound'} Parameters
            </h3>
            <button
              onClick={handleReset}
              className="text-gray-400 hover:text-indigo-600 text-xs flex items-center gap-1 font-bold cursor-pointer transition-colors"
              title="Reset parameters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Inputs to 0
            </button>
          </div>

          {/* 1. Principal Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center select-none">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Principal Amount</label>
              <span className="text-sm font-extrabold text-gray-800 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                {formatCurrency(principal, currency)}
              </span>
            </div>
            <div className="relative rounded-xl shadow-3xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm font-semibold">{currency}</span>
              </div>
              <input
                type="number"
                value={principal === 0 ? '' : principal}
                onChange={(e) => {
                  setPrincipal(Math.max(0, parseFloat(e.target.value) || 0));
                  setIsSaved(false);
                }}
                className="block w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-bold text-gray-850"
                placeholder="0"
              />
            </div>
          </div>

          {/* 2. Synced Rate Inputs inside the Section for User Interest (12% = 1 Rupee / 18% = 1.5 Rupees) */}
          <div className="space-y-3.5 p-4 rounded-2xl bg-gray-50/60 border border-gray-150/45">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide block">Rate &amp; Rupee Conversion Converter</span>
              <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-bold">
                12% = 1 Rupee | 18% = 1.5 Rupees
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Annual Percent Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 flex items-center gap-1 select-none">
                  <Percent className="w-3 h-3 text-indigo-500" />
                  Annual Rate (% p.a.)
                </label>
                <div className="relative rounded-lg shadow-3xs">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="120"
                    value={annualRate === 0 ? '' : annualRate}
                    onChange={(e) => {
                      const v = Math.max(0, parseFloat(e.target.value) || 0);
                      handleAnnualRateChange(v);
                    }}
                    className="block w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-extrabold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-indigo-950"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none">
                    <span className="text-[10px] text-gray-400 font-bold">%</span>
                  </div>
                </div>
              </div>

              {/* Monthly Rupee Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 select-none">
                  <Coins className="w-3 h-3 text-emerald-600" />
                  Monthly Rupee Rate
                </label>
                <div className="relative rounded-lg shadow-3xs">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={rupeeRate === 0 ? '' : rupeeRate}
                    onChange={(e) => {
                      const v = Math.max(0, parseFloat(e.target.value) || 0);
                      handleRupeeRateChange(v);
                    }}
                    className="block w-full pl-5 pr-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-extrabold focus:outline-none focus:ring-1 focus:ring-emerald-500 text-emerald-950"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                    <span className="text-[10px] text-emerald-500 font-bold">{currency}</span>
                  </div>
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <span className="text-[8px] text-gray-450 font-bold">/100 p.m.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro Conversion Indicator bar inside SI and CI */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-gray-150/40 text-center select-none font-medium">
              <p className="text-[11px] text-slate-700">
                👉 Conversion: <strong className="text-indigo-700">{annualRate}%</strong> Annual is exactly <strong className="text-emerald-700">{currency}{rupeeRate.toFixed(4)}</strong> Rupee Interest per ₹100/month
              </p>
            </div>

            {/* PRESETS */}
            <div className="space-y-1 select-none">
              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Presets</span>
              <div className="flex flex-wrap gap-1">
                {traditionalPresets.map((preset, idx) => {
                  const isActive = Math.abs(rupeeRate - preset.rRate) < 0.01;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        handleRupeeRateChange(preset.rRate);
                      }}
                      className={cn(
                        "px-2 py-0.5 rounded-md border text-[9px] font-bold cursor-pointer transition-all",
                        isActive 
                          ? "bg-slate-900 text-white border-slate-900" 
                          : "bg-white text-slate-600 border-gray-250/60 hover:bg-slate-50"
                      )}
                      title={preset.desc}
                    >
                      ₹{preset.rRate.toFixed(2)} ({preset.aRate}%)
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Duration */}
          <div className="space-y-3.5 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center select-none">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Time Duration</label>
              <div className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-bold">Computed from Dates</div>
            </div>

            <div className="space-y-3.5 p-4 rounded-2xl bg-indigo-50/20 border border-indigo-100/35">
              <div className="grid grid-cols-2 gap-3.5">
                {/* Start Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 flex items-center gap-1 select-none">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setIsSaved(false);
                    }}
                    className="block w-full px-2.5 py-1.5 bg-app-bg border border-app-border rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-app-text cursor-pointer"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-app-text-secondary flex items-center gap-1 select-none">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setIsSaved(false);
                    }}
                    className="block w-full px-2.5 py-1.5 bg-app-bg border border-app-border rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-app-text cursor-pointer"
                  />
                </div>
              </div>

              {/* Scaling switcher while in date mode */}
              <div className="flex items-center justify-between text-xs select-none bg-app-card p-2 rounded-xl border border-app-border">
                <span className="text-[10px] text-app-text-muted font-bold block">Render duration in:</span>
                <div className="flex bg-app-bg p-0.5 rounded-lg text-xs font-semibold border border-app-border">
                  <button
                    type="button"
                    onClick={() => {
                      setTimeUnit('years');
                      setIsSaved(false);
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition-all cursor-pointer text-[10px]",
                      timeUnit === 'years' ? "bg-app-card text-app-text shadow-3xs font-extrabold" : "text-app-text-muted hover:text-app-text"
                    )}
                  >
                    Years
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTimeUnit('months');
                      setIsSaved(false);
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition-all cursor-pointer text-[10px]",
                      timeUnit === 'months' ? "bg-app-card text-app-text shadow-3xs font-extrabold" : "text-app-text-muted hover:text-app-text"
                    )}
                  >
                    Months
                  </button>
                </div>
              </div>

              {/* Date diff statistics banner */}
              {diffResult && !diffResult.invalid && (
                <div className="bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20 text-[11px] text-app-text font-medium space-y-1">
                  <p className="flex items-center gap-1 font-bold text-indigo-500 dark:text-indigo-400">
                    <span>✓</span> Period Computed Successfully:
                  </p>
                  <p className="opacity-95 pl-3 text-app-text-secondary">
                    <strong>{diffResult.years}</strong> Years,{" "}
                    <strong>{diffResult.months}</strong> Months, and{" "}
                    <strong>{diffResult.days}</strong> Days
                  </p>
                  <p className="text-[10px] text-app-text-muted pl-3 pt-1 border-t border-indigo-500/10">
                    Equates to: <span className="bg-app-card px-1.5 py-0.5 rounded shadow-3xs font-extrabold text-indigo-500 dark:text-indigo-400">{timeValue} {timeUnit}</span> for formulas
                  </p>
                </div>
              )}

              {diffResult && diffResult.invalid && (
                <div className="bg-rose-500/10 text-rose-500 p-2.5 rounded-xl border border-rose-500/20 text-[10px] font-bold">
                  ⚠️ Error: End Date cannot be before Start Date! Please adjust values.
                </div>
              )}

              {(!startDate || !endDate) && (
                <div className="text-app-text-muted text-[10px] text-center p-3 border border-dashed border-app-border rounded-xl bg-app-bg select-none">
                  Select both Start and End Dates to compute duration automatically
                </div>
              )}
            </div>
          </div>

          {/* 4. Compound Frequency (Compound tab only) */}
          {calcMode === 'compound' && (
            <div className="space-y-2 pt-2 border-t border-app-border select-none">
              <label className="text-xs font-bold text-app-text-secondary uppercase tracking-wide flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
                Compounding Cycle
              </label>
              <div className="grid grid-cols-5 gap-1 bg-app-bg p-1 rounded-xl border border-app-border">
                {(['annually', 'semi-annually', 'quarterly', 'monthly', 'daily'] as Frequency[]).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => {
                      setFrequency(freq);
                      setIsSaved(false);
                    }}
                    className={cn(
                      "px-1 py-1 text-[9px] font-bold text-center transition-all cursor-pointer capitalize rounded-md",
                      frequency === freq
                        ? "bg-purple-600 text-white shadow-3xs"
                        : "text-app-text-muted hover:text-app-text"
                    )}
                  >
                    {freq.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: CALCULATION RESULTS + INDEPENDENT GRAPH */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* RESULTS SPECIFIC TO ACTIVE CALC MODE */}

          {/* SIMPLE INTEREST MODE UI */}
          {calcMode === 'simple' && (
            <div className="bg-app-card p-5 rounded-3xl border border-emerald-500/10 shadow-3xs space-y-4">
              <div className="flex items-center justify-between border-b border-app-border pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Simple Return Outputs</span>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaved || principal === 0}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 disabled:opacity-40 font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-3xs cursor-pointer select-none transition-all"
                >
                  <Save className="w-3 h-3" />
                  Save Calculation
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-500/5 p-3.5 rounded-2xl border border-emerald-500/10">
                  <span className="text-[10px] font-bold text-app-text-muted block uppercase">Simple Interest</span>
                  <span className="text-lg font-black text-emerald-500">{formatCurrency(simpleInterest, currency)}</span>
                </div>
                <div className="bg-emerald-500/5 p-3.5 rounded-2xl border border-emerald-500/10">
                  <span className="text-[10px] font-bold text-app-text-muted block uppercase">Total Balance</span>
                  <span className="text-lg font-black text-app-text">{formatCurrency(simpleTotal, currency)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-app-text-secondary bg-app-bg p-3 rounded-xl border border-app-border select-none">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">Estimated Return per Month:</span>
                  <span className="text-app-text font-extrabold">{formatCurrency(simpleMonthlyIncome, currency)}</span>
                </div>
                <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                  Linear Yield
                </span>
              </div>
            </div>
          )}

          {/* COMPOUND INTEREST MODE UI */}
          {calcMode === 'compound' && (
            <div className="bg-app-card p-5 rounded-3xl border border-purple-500/10 shadow-3xs space-y-4">
              <div className="flex items-center justify-between border-b border-app-border pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 tracking-wider capitalize">Compound Return ({frequency})</span>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaved || principal === 0}
                  className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 disabled:opacity-40 font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-3xs cursor-pointer select-none transition-all"
                >
                  <Save className="w-3 h-3" />
                  Save Calculation
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-500/5 p-3.5 rounded-2xl border border-purple-500/10">
                  <span className="text-[10px] font-bold text-app-text-muted block uppercase">Interest Accrued</span>
                  <span className="text-lg font-black text-purple-500">{formatCurrency(compoundInterest, currency)}</span>
                </div>
                <div className="bg-purple-500/5 p-3.5 rounded-2xl border border-purple-500/10">
                  <span className="text-[10px] font-bold text-app-text-muted block uppercase">Future Maturity Value</span>
                  <span className="text-lg font-black text-app-text">{formatCurrency(compoundTotal, currency)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-app-text-secondary bg-app-bg p-3 rounded-xl border border-app-border select-none">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">Average Yield per Month:</span>
                  <span className="text-app-text font-extrabold">{formatCurrency(compoundMonthlyAverage, currency)}</span>
                </div>
                <span className="text-purple-500 font-bold bg-purple-500/10 px-2 py-0.5 rounded text-[10px] uppercase">
                  Compounding Yield
                </span>
              </div>
            </div>
          )}

          {/* PROJECTED BALANCE OVERVIEW (DONUT CHART) */}
          <div className="bg-app-card p-5 rounded-3xl border border-app-border shadow-3xs space-y-4">
            <span className="text-xs font-bold text-app-text-secondary uppercase tracking-wider flex items-center gap-1.5 select-none font-display">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Projected Balance Overview
            </span>

            {/* Main Interactive card visualization */}
            <div className="p-5 bg-app-bg rounded-2xl border border-app-border shadow-xs flex flex-col sm:flex-row items-center justify-center gap-6">
              
              {/* Modern SVG Donut Ring with nested text */}
              <div className="relative w-44 h-44 flex items-center justify-center shrink-0 select-none">
                {/* SVG viewbox 176x176 fits perfectly with radius 70 & strokeWidth 18 */}
                <svg viewBox="0 0 176 176" className="w-full h-full transform -rotate-90 overflow-visible">
                  {/* Underlay / Background representing Principal Base portion */}
                  <circle
                    cx="88"
                    cy="88"
                    r="70"
                    fill="transparent"
                    stroke={activeSlice === 'principal' ? '#94A3B8' : 'var(--app-border)'}
                    strokeWidth={activeSlice === 'principal' ? '22' : '18'}
                    onMouseEnter={() => setActiveSlice('principal')}
                    onMouseLeave={() => setActiveSlice(null)}
                    onTouchStart={(e) => { e.preventDefault(); setActiveSlice('principal'); }}
                    onTouchEnd={() => setActiveSlice(null)}
                    className="cursor-pointer transition-all duration-300"
                  />
                  {/* Active segment representing accrued Interest Gain */}
                  {(calcMode === 'simple' ? simpleTotal : compoundTotal) > 0 && (
                    <circle
                      cx="88"
                      cy="88"
                      r="70"
                      fill="transparent"
                      stroke={activeSlice === 'interest' ? '#15803d' : '#1BA672'}
                      strokeWidth={activeSlice === 'interest' ? '22' : '18'}
                      strokeDasharray={439.82}
                      strokeDashoffset={
                        439.82 - 
                        (((calcMode === 'simple' ? simpleInterest : compoundInterest) / 
                          (calcMode === 'simple' ? simpleTotal : compoundTotal)) * 100 / 100) * 439.82
                      }
                      strokeLinecap="round"
                      onMouseEnter={() => setActiveSlice('interest')}
                      onMouseLeave={() => setActiveSlice(null)}
                      onTouchStart={(e) => { e.preventDefault(); setActiveSlice('interest'); }}
                      onTouchEnd={() => setActiveSlice(null)}
                      className="cursor-pointer transition-all"
                      style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s, stroke-width 0.2s' }}
                    />
                  )}
                </svg>

                {/* Inner center text labels - dynamic depending on hover */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
                  {activeSlice === null ? (
                    <>
                      <span className="text-[9px] font-black text-app-text-muted uppercase tracking-widest leading-none mb-1">
                        Total Value
                      </span>
                      <span className="text-sm md:text-base font-black text-app-text tracking-tight leading-none truncate max-w-[130px]" title={formatCurrency(calcMode === 'simple' ? simpleTotal : compoundTotal, currency)}>
                        {formatCurrency(calcMode === 'simple' ? simpleTotal : compoundTotal, currency)}
                      </span>
                      <span className="text-[8px] md:text-[9px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1.5 border border-emerald-500/20">
                        +{(((calcMode === 'simple' ? simpleInterest : compoundInterest) / Math.max(1, calcMode === 'simple' ? simpleTotal : compoundTotal)) * 100).toFixed(1)}% Gain
                      </span>
                    </>
                  ) : activeSlice === 'principal' ? (
                    <>
                      <span className="text-[9px] font-black text-app-text-muted uppercase tracking-widest leading-none mb-1">
                        Principal
                      </span>
                      <span className="text-sm md:text-base font-black text-app-text tracking-tight leading-none truncate max-w-[130px]">
                        {formatCurrency(principal, currency)}
                      </span>
                      <span className="text-[8px] md:text-[9px] font-extrabold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full mt-1.5 border border-blue-500/20">
                        {principalPercent.toFixed(1)}% Share
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">
                        Interest
                      </span>
                      <span className="text-sm md:text-base font-black text-emerald-500 tracking-tight leading-none truncate max-w-[130px]">
                        {formatCurrency(calcMode === 'simple' ? simpleInterest : compoundInterest, currency)}
                      </span>
                      <span className="text-[8px] md:text-[9px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1.5 border border-emerald-500/20">
                        {interestPercent.toFixed(1)}% Share
                      </span>
                    </>
                  )}
                </div>

                {/* Elegant Interactive Hover Tooltip Box */}
                {activeSlice && (
                  <div 
                    className={cn(
                      "absolute -top-14 z-10 text-slate-100 text-[11px] px-3 py-2 rounded-xl shadow-lg border flex flex-col items-center pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200 select-none min-w-[120px] text-center",
                      activeSlice === 'principal'
                        ? "bg-slate-900 border-slate-700/50"
                        : "bg-emerald-950 border-emerald-800/50"
                    )}
                  >
                    <span className={cn(
                      "font-black uppercase text-[8px] tracking-wider mb-0.5",
                      activeSlice === 'principal' ? "text-slate-400" : "text-emerald-300"
                    )}>
                      {activeSlice === 'principal' ? 'Principal Core' : 'Interest Accrued'}
                    </span>
                    <span className="font-extrabold font-mono text-xs">
                      {formatCurrency(activeSlice === 'principal' ? principal : (calcMode === 'simple' ? simpleInterest : compoundInterest), currency)}
                    </span>
                    <span className="text-[9px] opacity-90 mt-0.5 font-bold">
                      {activeSlice === 'principal' ? principalPercent.toFixed(1) : interestPercent.toFixed(1)}% slice
                    </span>
                    {/* Tooltip caret */}
                    <div className={cn(
                      "absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 rotate-45 border-r border-b",
                      activeSlice === 'principal'
                        ? "bg-slate-900 border-slate-700/50"
                        : "bg-emerald-950 border-emerald-800/50"
                    )} />
                  </div>
                )}
              </div>

              {/* Side Metric Cards & Gauge info */}
              <div className="flex-1 w-full space-y-3.5">
                <div className="grid grid-cols-1 select-none xs:grid-cols-2 gap-2.5">
                  
                  {/* Principal Base Widget */}
                  <div 
                    onMouseEnter={() => setActiveSlice('principal')}
                    onMouseLeave={() => setActiveSlice(null)}
                    onClick={() => setActiveSlice(activeSlice === 'principal' ? null : 'principal')}
                    className={cn(
                      "p-3 rounded-xl border flex flex-col cursor-pointer transition-all duration-200",
                      activeSlice === 'principal'
                        ? "bg-blue-500/10 border-blue-400/80 shadow-3xs scale-[1.02]"
                        : "bg-app-card border-app-border shadow-3xs hover:border-app-text-secondary/30"
                    )}
                  >
                    <span className="text-[10px] font-bold text-app-text-muted uppercase tracking-wider block mb-1">
                      Principal Base
                    </span>
                    <span className="text-sm font-black text-app-text">
                      {formatCurrency(principal, currency)}
                    </span>
                    <span className="text-[9px] text-app-text-muted font-bold mt-0.5">
                      {principalPercent.toFixed(1)}% of total
                    </span>
                  </div>

                  {/* Final Value Widget */}
                  <div 
                    onMouseEnter={() => setActiveSlice('interest')}
                    onMouseLeave={() => setActiveSlice(null)}
                    onClick={() => setActiveSlice(activeSlice === 'interest' ? null : 'interest')}
                    className={cn(
                      "p-3 rounded-xl border flex flex-col cursor-pointer transition-all duration-200",
                      activeSlice === 'interest'
                        ? "bg-emerald-500/10 border-emerald-400/80 shadow-3xs scale-[1.02]"
                        : "bg-app-card border-app-border shadow-3xs hover:border-app-text-secondary/30"
                    )}
                  >
                    <span className="text-[10px] font-bold text-[#1BA672] uppercase tracking-wider block mb-1">
                      Final Value
                    </span>
                    <span className="text-sm font-black text-emerald-500">
                      {formatCurrency(calcMode === 'simple' ? simpleTotal : compoundTotal, currency)}
                    </span>
                    <span className="text-[9px] text-emerald-500 font-bold mt-0.5">
                      Interest: {formatCurrency(calcMode === 'simple' ? simpleInterest : compoundInterest, currency)}
                    </span>
                  </div>

                </div>

                {/* Progress bar info for Percentage Gain Gauge */}
                <div className="space-y-1.5 bg-app-card p-3 rounded-xl border border-app-border shadow-3xs">
                  <div className="flex items-center justify-between text-xs select-none">
                    <span className="text-[9px] font-black uppercase text-app-text-muted tracking-wider">Interest Gain Ratio</span>
                    <span className="text-[10px] font-black text-emerald-500">
                      Interest Gain: {((calcMode === 'simple' ? simpleTotal : compoundTotal) > 0 
                        ? ((calcMode === 'simple' ? simpleInterest : compoundInterest) / (calcMode === 'simple' ? simpleTotal : compoundTotal)) * 100 
                        : 0).toFixed(1)}%
                    </span>
                  </div>
                  
                  {/* Custom progress segment tracking bar */}
                  <div className="h-2 w-full bg-app-bg rounded-lg overflow-hidden flex border border-app-border">
                    <div 
                      className="bg-[#1BA672] h-full transition-all duration-600 ease-out rounded-lg"
                      style={{ 
                        width: `${((calcMode === 'simple' ? simpleTotal : compoundTotal) > 0 
                          ? ((calcMode === 'simple' ? simpleInterest : compoundInterest) / (calcMode === 'simple' ? simpleTotal : compoundTotal)) * 100 
                          : 0)}%` 
                      }}
                    />
                  </div>

                  <p className="text-[9px] text-app-text-muted leading-relaxed font-semibold">
                    The total accrued yield represents cumulative interest earnings accumulated over {timeValue} {timeUnit}.
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* SAVING SUCCESS PROMPTER */}
          {isSaved && (
            <div className="bg-emerald-600 text-white rounded-xl p-3.5 flex items-center justify-center gap-2 text-xs font-bold select-none shadow-sm animate-bounce">
              <CheckCircle className="w-5 h-5 shrink-0" />
              Interest Record successfully saved to Your History Log!
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
