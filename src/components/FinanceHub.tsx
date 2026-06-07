import React, { useState, useEffect, useMemo } from 'react';
import { 
  Percent, IndianRupee, TrendingUp, Calculator, Tag, ArrowRightLeft, 
  PlusCircle, AlertCircle, Sparkles, HelpCircle, ArrowUpRight, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { annualToMonthlyRate, monthlyToAnnualRate, formatIndianCurrency, formatIndianShorthand } from '../lib/financeUtils';

/**
 * ⏳ GET HUMAN READABLE DURATION STRING BETWEEN TWO DATES
 */
const getDurationString = (startStr: string, endStr: string) => {
  if (!startStr || !endStr) return '';
  const s = new Date(startStr);
  const e = new Date(endStr);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return '';
  const diffMs = e.getTime() - s.getTime();
  if (diffMs <= 0) return 'End Date must be after Start Date';
  
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365.25);
  const remainingDays = totalDays - Math.floor(years * 365.25);
  const months = Math.floor(remainingDays / 30.43);
  const days = Math.round(remainingDays - Math.floor(months * 30.43));

  const parts = [];
  if (years > 0) parts.push(`${years} Yr${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} Mo${months > 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} Day${days > 1 ? 's' : ''}`);

  return parts.join(', ') || '0 Days';
};

/**
 * 🛠️ REUSABLE FLOATING VALIDATION INPUT COMPONENT
 */
interface ValidatedInputProps {
  label: string;
  value: string;
  setValue: (val: string) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  isInvalid: boolean;
  errorMessage?: string;
  type?: string;
}

const ValidatedInput = ({
  label,
  value,
  setValue,
  placeholder = "0.00",
  prefix,
  suffix,
  isInvalid,
  errorMessage = "Must be > 0",
  type = "number"
}: ValidatedInputProps) => {
  const [hasInteracted, setHasInteracted] = useState(false);

  return (
    <div className="space-y-2 relative">
      <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">{label}</label>
      <div className="relative">
        <AnimatePresence>
          {isInvalid && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              className="absolute z-30 bottom-full mb-3 left-0 right-0 p-3 bg-red-950/90 backdrop-blur-md border border-red-500/40 rounded-xl shadow-glow text-red-200"
            >
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-wider font-mono">{errorMessage}</span>
              </div>
              {/* Tiny decorative downward-pointing arrow */}
              <div className="absolute top-full left-5 -translate-y-1.5 w-3.5 h-3.5 flex items-center justify-center overflow-hidden pointer-events-none">
                <div className="w-2 h-2 bg-red-950/90 border-r border-b border-red-500/40 rotate-45 transform origin-center" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8fa3c7] font-bold text-xs select-none">
            {prefix}
          </span>
        )}
        
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onBlur={() => setHasInteracted(true)}
          onChange={(e) => setValue(e.target.value)}
          className={`w-full h-14 bg-white/5 text-white rounded-2xl px-4 text-sm font-bold focus:border-blue-500/50 outline-none border transition-all font-mono ${
            prefix ? 'pl-9' : ''
          } ${
            suffix ? 'pr-12' : ''
          } ${
            isInvalid 
              ? 'border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.25)]' 
              : (hasInteracted && !value ? 'border-red-500/50' : 'border-white/5 focus:border-blue-500/30')
          }`}
        />

        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-[#8fa3c7]/40 uppercase font-mono select-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * ⚡ METRIC CARD COMPONENT
 */
function SummaryMetricCard({ title, value, icon, description, badgeColor }: { 
  title: string; 
  value: string; 
  icon?: React.ReactNode; 
  description?: string;
  badgeColor?: string;
}) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="premium-card rounded-[22px] p-5 flex flex-col justify-between border-white/5 relative overflow-hidden font-mono text-left"
    >
      <div className="absolute top-[-10%] right-[-10%] w-16 h-16 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-black text-[#8fa3c7] uppercase tracking-[0.2em]">
            {title}
          </span>
          {icon && <span className={`p-1.5 rounded-lg text-xs ${badgeColor || 'bg-white/5 text-gray-400'}`}>{icon}</span>}
        </div>
        <h2 className="text-xl font-black text-white italic tracking-tighter truncate">
          {value}
        </h2>
      </div>
      {description && (
        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block mt-3">
          {description}
        </span>
      )}
    </motion.div>
  );
}

/**
 * 💸 DISCOUNT CALCULATOR COMPONENT
 */
const DiscountCalculatorComponent = () => {
  const [price, setPrice] = useState('');
  const [discountPct, setDiscountPct] = useState('');

  // Input Validation States
  const isPriceInvalid = price !== '' && parseFloat(price) <= 0;
  const isDiscountInvalid = discountPct !== '' && parseFloat(discountPct) <= 0;

  const discountAmount = useMemo(() => {
    if (isPriceInvalid || isDiscountInvalid || !price || !discountPct) return 0;
    const p = parseFloat(price);
    const d = parseFloat(discountPct);
    return (p * d) / 100;
  }, [price, discountPct, isPriceInvalid, isDiscountInvalid]);

  const finalPrice = useMemo(() => {
    if (isPriceInvalid || !price) return 0;
    const p = parseFloat(price);
    return p - discountAmount;
  }, [price, discountAmount, isPriceInvalid]);

  const isValid = price && discountPct && !isPriceInvalid && !isDiscountInvalid;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card rounded-[22px] p-6 space-y-6"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Tag className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">Discount Calculator</h3>
          <p className="text-[9px] text-gray-400">Instantly evaluate savings and retail markdown values</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ValidatedInput
          label="Price"
          value={price}
          setValue={setPrice}
          prefix="₹"
          placeholder="0.00"
          isInvalid={isPriceInvalid}
          errorMessage="Price must be > 0"
        />

        <ValidatedInput
          label="Discount"
          value={discountPct}
          setValue={setDiscountPct}
          suffix="%"
          placeholder="0"
          isInvalid={isDiscountInvalid}
          errorMessage="Discount must be > 0"
        />
      </div>

      <AnimatePresence mode="wait">
        {isValid && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 rounded-[22px] p-5 text-center font-mono mt-4"
          >
            <div className="space-y-1">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.22em]">Final Retail Price</p>
              <p className="font-black text-white text-3xl tracking-tighter">
                {formatIndianCurrency(finalPrice)}
              </p>
              {discountAmount > 0 && (
                <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest mt-2">
                  🎉 Total Saved {formatIndianCurrency(discountAmount)}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * 🔄 RATE ↔ RUPEES SMART CONVERTER
 */
const RateConverterComponent = () => {
  const [mode, setMode] = useState<'pctToRs' | 'rsToPct'>('pctToRs');
  const [inputVal, setInputVal] = useState('');
  const [result, setResult] = useState<{ value: string; unit: string } | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const isInputInvalid = inputVal !== '' && parseFloat(inputVal) <= 0;

  useEffect(() => {
    if (!inputVal || isInputInvalid) {
      setResult(null);
      return;
    }
    const val = parseFloat(inputVal);
    if (isNaN(val)) {
      setResult(null);
      return;
    }
    if (mode === 'pctToRs') {
      const rs = annualToMonthlyRate(val);
      if (rs < 1) {
        setResult({ value: (rs * 100).toFixed(0), unit: 'Paise/month/₹100' });
      } else {
        setResult({ value: rs.toFixed(2), unit: 'Rupees/month/₹100' });
      }
    } else {
      const pct = monthlyToAnnualRate(val);
      setResult({ value: pct.toFixed(2), unit: 'Annual %' });
    }
  }, [inputVal, mode, isInputInvalid]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card rounded-[22px] p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">Traditional Converter</h3>
            <p className="text-[9px] text-gray-400">Swap between bank interest (%) & rural rate (Paise/Rs/Month)</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setMode(prev => prev === 'pctToRs' ? 'rsToPct' : 'pctToRs');
            setInputVal('');
          }}
          className="text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-2 bg-white/5 hover:bg-white/10 active:scale-95 text-[#8fa3c7] hover:text-white rounded-xl border border-white/5 font-mono cursor-pointer transition-all"
        >
          {mode === 'pctToRs' ? 'Rs/M' : 'Pct/A'}
        </button>
      </div>

      <div className="space-y-4">
        <ValidatedInput
          label={mode === 'pctToRs' ? 'Annual Percentage Rate' : 'Rural Monthly Rate'}
          value={inputVal}
          setValue={setInputVal}
          prefix={mode === 'pctToRs' ? '%' : '₹'}
          placeholder="0.00"
          isInvalid={isInputInvalid}
          errorMessage="Enter a strictly positive rate"
        />

        <AnimatePresence mode="wait">
          {result && (
            <motion.div 
              key={result.value + result.unit}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-5 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/15 rounded-[22px] flex flex-col items-center justify-center gap-3 text-center font-mono"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">Equant Equivalent</span>
                <div className="flex items-baseline justify-center gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-white tracking-tighter">
                    {mode === 'rsToPct' ? '' : (parseFloat(result.value) >= 1 ? '₹' : '')}
                    {result.value}
                  </span>
                  <span className="text-[10px] font-bold text-blue-300">{result.unit}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function FinanceHub() {
  // Shared States initialized empty
  const [principalStr, setPrincipalStr] = useState('');
  const [rateStr, setRateStr] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interestType, setInterestType] = useState<'SI' | 'CI'>('CI');

  // Input Validation Checkers
  const isPrincipalInvalid = principalStr !== '' && parseFloat(principalStr) <= 0;
  const isRateInvalid = rateStr !== '' && parseFloat(rateStr) <= 0;
  const isDatesInvalid = useMemo(() => {
    if (!startDate || !endDate) return false;
    return new Date(endDate) <= new Date(startDate);
  }, [startDate, endDate]);

  // Real-time calculation variables
  const calculations = useMemo(() => {
    // Sanitize numeric inputs gracefully
    const P = isPrincipalInvalid ? 0 : (parseFloat(principalStr) || 0);
    const R = isRateInvalid ? 0 : (parseFloat(rateStr) || 0);

    let CalculatedYears = 0;
    if (startDate && endDate && !isDatesInvalid) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diffMs = e.getTime() - s.getTime();
      CalculatedYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    }

    const Y = CalculatedYears > 0 ? CalculatedYears : 0;

    let totalAmount = 0;
    let interest = 0;

    if (P > 0 && R > 0 && Y > 0) {
      if (interestType === 'CI') {
        totalAmount = P * Math.pow(1 + R / 100, Y);
        interest = totalAmount - P;
      } else {
        interest = (P * R * Y) / 100;
        totalAmount = P + interest;
      }
    } else {
      totalAmount = P;
      interest = 0;
    }

    // Secondary calculation weight
    const siReturns = (P * R * Y) / 100;
    const ciReturns = P * Math.pow(1 + R / 100, Y) - P;
    const compoundingDifference = Math.max(ciReturns - siReturns, 0);

    return {
      principal: P,
      interest: Math.round(interest),
      totalAmount: Math.round(totalAmount),
      compoundingDifference: Math.round(compoundingDifference),
      years: Y
    };
  }, [principalStr, rateStr, startDate, endDate, interestType, isPrincipalInvalid, isRateInvalid, isDatesInvalid]);

  return (
    <div className="min-h-screen text-white px-5 pt-8 pb-32 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="space-y-1.5 flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-500 shrink-0" />
            Finance Hub
          </h1>
          <p className="text-xs font-bold text-[#8fa3c7] uppercase tracking-widest">
            Smart systems for capital & asset optimization
          </p>
        </div>
      </div>

      {/* 🔄 RATE ↔ RUPEES SMART CONVERTER (FIRST DETAILED COMPONENT) */}
      <RateConverterComponent />

      {/* 📊 INTEREST CALCULATOR ZONE (SECOND) */}
      <div className="space-y-8">
        
        {/* 📊 CORE CALCULATOR COMPACT BOARD */}
        <div className="premium-card rounded-[22px] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">Interest Calculator</h3>
                <p className="text-[9px] text-gray-400">Model capital projection metrics in compound or simple structures</p>
              </div>
            </div>
            
            {/* Simple and Compound Switch inside the Interest Planner */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 select-none shrink-0 font-mono">
              <button 
                onClick={() => setInterestType('SI')} 
                className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all cursor-pointer ${
                  interestType === 'SI' ? 'bg-blue-600 text-white shadow-glow-sm' : 'text-[#8fa3c7] hover:text-white'
                }`}
              >
                S.I
              </button>
              <button 
                onClick={() => setInterestType('CI')} 
                className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all cursor-pointer ${
                  interestType === 'CI' ? 'bg-blue-600 text-white shadow-glow-sm' : 'text-[#8fa3c7] hover:text-white'
                }`}
              >
                C.I
              </button>
            </div>
          </div>

          {/* Dynamic Parameter Settings Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <ValidatedInput
              label="Principal (₹)"
              value={principalStr}
              setValue={setPrincipalStr}
              prefix="₹"
              placeholder="Capital"
              isInvalid={isPrincipalInvalid}
              errorMessage="Principal must be > 0"
            />

            <ValidatedInput
              label="Rate (%)"
              value={rateStr}
              setValue={setRateStr}
              suffix="%"
              placeholder="Rate"
              isInvalid={isRateInvalid}
              errorMessage="Interest rate must be > 0"
            />

            <ValidatedInput
              label="Start Date"
              value={startDate}
              setValue={setStartDate}
              placeholder="YYYY-MM-DD"
              isInvalid={false}
              type="date"
            />

            <ValidatedInput
              label="End Date"
              value={endDate}
              setValue={setEndDate}
              placeholder="YYYY-MM-DD"
              isInvalid={isDatesInvalid}
              errorMessage="End Date must be after Start Date"
              type="date"
            />
          </div>

          {/* Computed Duration Info Panel */}
          {startDate && endDate && !isDatesInvalid && (
            <div className="text-[10px] bg-white/5 px-4 py-2 rounded-xl text-center border border-white/5 font-mono font-bold tracking-wider uppercase text-blue-400">
              Computed Duration: {getDurationString(startDate, endDate)} ({calculations.years.toFixed(2)} Years)
            </div>
          )}
        </div>

        {/* 📊 DYNAMIC SUMMARY METRICS DASHBOARD */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryMetricCard 
            title="Principal Asset" 
            value={formatIndianCurrency(calculations.principal)} 
            description="Total Registered Capital"
            icon={<IndianRupee className="w-3.5 h-3.5" />}
            badgeColor="bg-blue-500/10 text-blue-400 border border-blue-500/10"
          />
          <SummaryMetricCard 
            title="Compound Returns" 
            value={formatIndianCurrency(calculations.interest)} 
            description="Sum Interest Earned"
            icon={<ArrowUpRight className="w-3.5 h-3.5" />}
            badgeColor="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
          />
          <SummaryMetricCard 
            title="Projected Value" 
            value={formatIndianCurrency(calculations.totalAmount)} 
            description="Capitalization Total"
            icon={<Calculator className="w-3.5 h-3.5" />}
            badgeColor="bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
          />
        </div>

      </div>

      {/* 💸 DISCOUNT CALCULATOR (LAST DETAILED COMPONENT) */}
      <DiscountCalculatorComponent />

    </div>
  );
}
