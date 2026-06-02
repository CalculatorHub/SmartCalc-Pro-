import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Percent, IndianRupee, TrendingUp, Calculator, Tag, ArrowRightLeft, 
  History, PlusCircle, Zap, ShieldCheck, Download, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { annualToMonthlyRate, monthlyToAnnualRate, getMonthsBetween, numberToIndianWords, formatIndianCurrency, formatIndianShorthand } from '../lib/financeUtils';
import { exportToCSV, exportToPDF } from '../lib/exportUtils';

/**
 * RATE ↔ RUPEES SMART CONVERTER
 */
const RateConverter = () => {
  const [mode, setMode] = useState<'pctToRs' | 'rsToPct'>('pctToRs');
  const [inputVal, setInputVal] = useState('');
  const [result, setResult] = useState<{ value: string; unit: string } | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!inputVal) {
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
        setResult({ value: (rs * 100).toFixed(0), unit: 'Paise/month' });
      } else {
        setResult({ value: rs.toFixed(2), unit: 'Rupees/month' });
      }
    } else {
      const pct = monthlyToAnnualRate(val);
      setResult({ value: pct.toFixed(2), unit: 'Annual %' });
    }
  }, [inputVal, mode]);

  const saveToHistory = () => {
    if (!result || !inputVal) return;
    const entry = {
      id: Date.now(),
      type: mode === 'pctToRs' ? 'Pct to Rs' : 'Rs to Pct',
      input: `${inputVal}${mode === 'pctToRs' ? '%' : '₹'}`,
      output: `${result.value} ${result.unit}`,
      date: new Date().toLocaleTimeString()
    };
    setHistory(prev => [entry, ...prev].slice(0, 10));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card rounded-[22px] p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest">
          <ArrowRightLeft className="w-5 h-5 text-blue-500" />
          Smart Converter
        </h3>
        <button 
          onClick={() => {
            setMode(prev => prev === 'pctToRs' ? 'rsToPct' : 'pctToRs');
            setInputVal('');
          }}
          className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-white/5 text-[#8fa3c7] rounded-xl border border-white/5 font-mono"
        >
          {mode === 'pctToRs' ? 'Rs/M' : 'Pct/A'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">
            {mode === 'pctToRs' ? 'Annual Percentage (%)' : 'Monthly Rate (₹/100)'}
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8fa3c7]">
              {mode === 'pctToRs' ? <Percent className="w-4 h-4" /> : <IndianRupee className="w-4 h-4" />}
            </div>
            <input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onBlur={() => setHasInteracted(true)}
              placeholder="0.00"
              className={`w-full h-14 bg-white/5 text-white rounded-2xl pl-12 pr-4 text-sm font-bold outline-none border transition-all placeholder-gray-600 font-mono ${
                hasInteracted && !inputVal ? 'border-red-500/50' : 'border-white/5 focus:border-blue-500/50'
              }`}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div 
              key={result.value + result.unit}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-[22px] flex flex-col items-center justify-center gap-4 text-center font-mono"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Converted result</span>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-3xl font-black text-white tracking-tighter">
                    {mode === 'rsToPct' ? '' : (parseFloat(result.value) >= 1 && result.unit.includes('Rupees') ? '₹' : '')}
                    {result.value}
                  </span>
                  <span className="text-xs font-bold text-blue-300/60">{result.unit}</span>
                </div>
              </div>
              <button 
                onClick={saveToHistory}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa3c7] rounded-xl border border-white/5 font-mono"
              >
                <PlusCircle className="w-4 h-4 text-blue-500" />
                Capture Log
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/**
 * INTEREST CALCULATOR & BAR CHART
 */
const InterestCalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState<'SI' | 'CI'>('SI');
  const [isCalculated, setIsCalculated] = useState(false);
  const [hasInteracted, setHasInteracted] = useState({ principal: false, rate: false });

  const stats = useMemo(() => {
    if (!principal || !rate || !startDate || !endDate) return null;
    const totalMonths = getMonthsBetween(startDate, endDate);
    if (totalMonths <= 0) return null;
    
    const T = totalMonths / 12;
    const P = parseFloat(principal);
    const R = parseFloat(rate);
    
    let totalInterest = 0;
    let totalAmount = 0;
    const chartData = [];

    if (type === 'SI') {
      totalInterest = (P * R * T) / 100;
      totalAmount = P + totalInterest;
      const step = totalMonths > 24 ? 12 : 1;
      for (let i = step; i <= totalMonths; i += step) {
        chartData.push({ label: totalMonths > 24 ? `Y${i/12}` : `M${i}`, amount: Math.round(P + (P * R * (i/12)) / 100) });
      }
    } else {
      totalAmount = P * Math.pow(1 + R / 100, T);
      totalInterest = totalAmount - P;
      const step = totalMonths > 24 ? 12 : 1;
      for (let i = step; i <= totalMonths; i += step) {
        chartData.push({ label: totalMonths > 24 ? `Y${i/12}` : `M${i}`, amount: Math.round(P * Math.pow(1 + R / 100, i/12)) });
      }
    }

    return { totalInterest: Math.round(totalInterest), totalAmount: Math.round(totalAmount), chartData };
  }, [principal, rate, startDate, endDate, type]);

  const handleCalculate = () => {
    setHasInteracted({ principal: true, rate: true });
    if (!principal || !rate || !startDate || !endDate) return;
    setIsCalculated(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card rounded-[22px] p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest">
          <Calculator className="w-5 h-5 text-blue-500" />
          Interest Calculator
        </h3>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          <button onClick={() => setType('SI')} className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${type === 'SI' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>S.I</button>
          <button onClick={() => setType('CI')} className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${type === 'CI' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>C.I</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">Principal Amount (₹)</label>
          <input
            type="number"
            value={principal}
            placeholder="0.00"
            onChange={(e) => { setPrincipal(e.target.value); setIsCalculated(false); }}
            onBlur={() => setHasInteracted(prev => ({ ...prev, principal: true }))}
            className={`w-full h-14 bg-white/5 text-white rounded-2xl px-4 text-sm font-bold focus:border-blue-500/50 outline-none border transition-all font-mono ${
              hasInteracted.principal && !principal ? 'border-red-500/50' : 'border-white/5'
            }`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">Interest Rate (%)</label>
            <input
              type="number"
              value={rate}
              placeholder="0.00"
              onChange={(e) => { setRate(e.target.value); setIsCalculated(false); }}
              onBlur={() => setHasInteracted(prev => ({ ...prev, rate: true }))}
              className={`w-full h-14 bg-white/5 text-white rounded-2xl px-4 text-sm font-bold focus:border-blue-500/50 outline-none border transition-all font-mono ${
                hasInteracted.rate && !rate ? 'border-red-500/50' : 'border-white/5'
              }`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setIsCalculated(false); }} className="w-full h-14 bg-white/5 text-white rounded-2xl px-4 text-sm font-bold border border-white/5 outline-none focus:border-blue-500/50" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">End Date</label>
          <input type="date" value={endDate} min={startDate} onChange={(e) => { setEndDate(e.target.value); setIsCalculated(false); }} className="w-full h-14 bg-white/5 text-white rounded-2xl px-4 text-sm font-bold border border-white/5 outline-none focus:border-blue-500/50" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <button 
          onClick={handleCalculate}
          className={`w-full h-14 text-white text-sm font-black uppercase tracking-[0.2em] rounded-2zl shadow-lg flex items-center justify-center gap-3 ${
            !principal || !rate || !startDate || !endDate ? 'bg-white/5 text-gray-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
          }`}
        >
           <Calculator className="w-5 h-5" />
           Execute Calculation
        </button>

        <div className={`grid grid-cols-2 gap-4 transition-all duration-300 ${isCalculated ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-2 grayscale'}`}>
          <div className="bg-white/5 border border-white/5 p-5 rounded-[22px] text-center font-mono">
            <p className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-widest mb-1">Interest</p>
            <p className="font-black text-emerald-400 text-xl tracking-tighter">{isCalculated && stats ? formatIndianCurrency(stats.totalInterest) : '₹0'}</p>
          </div>
          <div className="bg-white/5 border border-white/5 p-5 rounded-[22px] text-center font-mono">
            <p className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-widest mb-1">Total Amount</p>
            <p className="font-black text-blue-400 text-xl tracking-tighter">{isCalculated && stats ? formatIndianCurrency(stats.totalAmount) : '₹0'}</p>
          </div>
        </div>
      </div>

      {isCalculated && stats && stats.chartData.length > 0 && (
        <div className="h-[180px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <XAxis dataKey="label" fontSize={9} axisLine={false} tickLine={false} tick={{ fill: '#8fa3c7', fontWeight: 'bold' }} />
              <YAxis fontSize={9} axisLine={false} tickLine={false} tick={{ fill: '#8fa3c7', fontWeight: 'bold' }} tickFormatter={(v) => formatIndianShorthand(v)} />
              <Tooltip cursor={{ fill: 'white', opacity: 0.05 }} contentStyle={{ backgroundColor: '#141c30', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {stats.chartData.map((_, index) => <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

/**
 * DISCOUNT CALCULATOR
 */
const DiscountCalculator = () => {
  const [price, setPrice] = useState('');
  const [discountPct, setDiscountPct] = useState('');
  const [hasInteracted, setHasInteracted] = useState({ price: false, discount: false });

  const discountAmount = (!price || !discountPct) ? 0 : (parseFloat(price) * parseFloat(discountPct)) / 100;
  const finalPrice = (!price || !discountPct) ? 0 : parseFloat(price) - discountAmount;
  const isValid = price && discountPct;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card rounded-[22px] p-6 space-y-6"
    >
      <div className="flex items-center gap-2">
        <Tag className="w-5 h-5 text-blue-500" />
        <h3 className="text-sm font-black text-white uppercase tracking-widest">Discount Calculator</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">Price (₹)</label>
          <input
            type="number"
            value={price}
            placeholder="0.00"
            onChange={(e) => setPrice(e.target.value)}
            onBlur={() => setHasInteracted(prev => ({ ...prev, price: true }))}
            className={`w-full h-14 bg-white/5 text-white rounded-2xl px-4 text-sm font-bold focus:border-blue-500/50 outline-none border transition-all font-mono ${
              hasInteracted.price && !price ? 'border-red-500/50' : 'border-white/5'
            }`}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">Discount (%)</label>
          <input
            type="number"
            value={discountPct}
            placeholder="0"
            onChange={(e) => setDiscountPct(e.target.value)}
            onBlur={() => setHasInteracted(prev => ({ ...prev, discount: true }))}
            className={`w-full h-14 bg-white/5 text-white rounded-2xl px-4 text-sm font-bold focus:border-blue-500/50 outline-none border transition-all font-mono ${
              hasInteracted.discount && !discountPct ? 'border-red-500/50' : 'border-white/5'
            }`}
          />
        </div>
      </div>

      <motion.div 
        animate={isValid ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.95, opacity: 0.2, y: 10 }}
        className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 rounded-[22px] p-6 text-center font-mono mt-4"
      >
        <div className="space-y-1">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Final amount</p>
          <p className="font-black text-white text-3xl tracking-tighter">{isValid ? formatIndianCurrency(finalPrice) : '₹0'}</p>
          {isValid && discountAmount > 0 && (
            <p className="text-[10px] text-emerald-300/60 font-bold uppercase tracking-widest mt-2 font-mono">Saved {formatIndianCurrency(discountAmount)}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function FinanceHub() {
  return (
    <div className="min-h-screen text-white px-5 pt-8 pb-32 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">Finance Hub</h1>
        <p className="text-xs font-bold text-[#8fa3c7] uppercase tracking-widest">Smart systems for capital management</p>
      </div>

      <div className="space-y-10">
        <RateConverter />
        <InterestCalculator />
        <DiscountCalculator />

        <section className="space-y-4 pt-4">
          <h3 className="text-[10px] font-black text-[#8fa3c7] uppercase tracking-[0.4em] px-1 text-center">Core Intelligence</h3>
          <div className="grid grid-cols-1 gap-4">
            {[
              { title: 'Market Index', desc: 'Real-time delta tracking for interest conversions.', icon: <Zap className="w-5 h-5 text-blue-500" /> },
              { title: 'Capital Growth', desc: 'Exponential expansion modeling for principal assets.', icon: <TrendingUp className="w-5 h-5 text-emerald-500" /> },
              { title: 'Risk Guard', desc: 'Encrypted valuation protocols for manual entries.', icon: <ShieldCheck className="w-5 h-5 text-indigo-500" /> },
            ].map((item, idx) => (
              <motion.div key={idx} whileTap={{ scale: 0.98 }} className="premium-card p-5 rounded-[22px] flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-blue-500/10">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-white tracking-widest uppercase italic">{item.title}</h4>
                  <p className="text-[10px] font-bold text-[#8fa3c7] mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
