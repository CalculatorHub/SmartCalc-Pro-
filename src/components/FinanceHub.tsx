import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Percent, IndianRupee, TrendingUp, Calculator, Tag, ArrowRightLeft, 
  ChevronRight, Info, AlertCircle, Zap, Target, ShieldCheck, Wallet,
  Download, FileText, Share2, History, PlusCircle, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { annualToMonthlyRate, monthlyToAnnualRate, getMonthsBetween, numberToIndianWords } from '../lib/financeUtils';
import { exportToCSV, exportToPDF } from '../lib/exportUtils';

// --- Components ---

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

  const handleExportCSV = () => {
    if (history.length === 0) return;
    exportToCSV(history.map(({type, input, output, date}) => ({Type: type, Input: input, Output: output, Time: date})), 'Rate_Conversion_History');
  };

  const handleExportPDF = () => {
    if (history.length === 0) return;
    const headers = ['Type', 'Input', 'Output', 'Time'];
    const body = history.map(item => [item.type, item.input, item.output, item.date]);
    exportToPDF('Rate Conversion History', headers, body, 'Rate_Conversion_History');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-white/5 rounded-2xl shadow-md p-5 space-y-4 border border-gray-200 dark:border-white/10 transition-all hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-blue-500" />
          Smart Converter
        </h3>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setMode(prev => prev === 'pctToRs' ? 'rsToPct' : 'pctToRs');
            setInputVal('');
          }}
          className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800"
        >
          Switch Mode
        </motion.button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {mode === 'pctToRs' ? 'Enter Annual Percentage (%)' : 'Enter Monthly Rate (₹ per 100)'}
          </label>
          <motion.div 
            whileFocus={{ scale: 1.01 }}
            className="relative group"
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-blue-500">
              {mode === 'pctToRs' ? <Percent className="w-4 h-4" /> : <IndianRupee className="w-4 h-4" />}
            </div>
            <input
              type="number"
              value={inputVal}
              onChange={(e) => {
                const val = e.target.value;
                if (parseFloat(val) < 0) return;
                setInputVal(val);
              }}
              onBlur={() => setHasInteracted(true)}
              placeholder={mode === 'pctToRs' ? "Enter percentage" : "Enter rupee value"}
              autoComplete="off"
              className={`w-full h-12 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none border transition-all placeholder-gray-500 dark:placeholder-gray-400 ${
                hasInteracted && !inputVal ? 'border-red-500/50 bg-red-50/50 dark:bg-red-500/5' : 'border-transparent dark:border-white/5'
              }`}
            />
          </motion.div>
          {mode === 'rsToPct' && inputVal && parseFloat(inputVal) > 0 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-bold text-blue-500 italic px-1"
            >
              {numberToIndianWords(parseFloat(inputVal))}
            </motion.p>
          )}
          <AnimatePresence>
            {hasInteracted && !inputVal && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[10px] font-bold text-red-500"
              >
                Please enter all required values
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div 
              key={result.value + result.unit}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex flex-col items-center justify-center gap-2"
            >
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest italic">Converted Value</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                    {mode === 'rsToPct' ? '' : (parseFloat(result.value) >= 1 && result.unit.includes('Rupees') ? '₹' : '')}
                    {result.value}
                  </span>
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{result.unit}</span>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveToHistory}
                className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-blue-900/40 text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-700/50 hover:bg-blue-100 transition-colors"
              >
                <PlusCircle className="w-3 h-3" />
                Save to Log
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {history.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <History className="w-3 h-3" /> Recent History
              </span>
              <div className="flex gap-2">
                <button onClick={handleExportCSV} className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase hover:underline">CSV</button>
                <button onClick={handleExportPDF} className="text-[9px] font-black text-red-600 dark:text-red-400 uppercase hover:underline">PDF</button>
              </div>
            </div>
            <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {history.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5"
                  >
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-gray-400 uppercase">{item.input}</span>
                      <span className="text-[10px] font-black text-gray-800 dark:text-gray-200">{item.output}</span>
                    </div>
                    <span className="text-[8px] font-medium text-gray-400">{item.date}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 px-1">
          <Info className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
          <p className="text-[10px] leading-relaxed text-gray-500 dark:text-gray-400 font-medium">
            Logic: Converts annual percentage rates to monthly rupee-per-100 rates and vice versa.
          </p>
        </div>
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
  const [type, setType] = useState<'SI' | 'CI'>('CI');
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [hasInteracted, setHasInteracted] = useState({ principal: false, rate: false, dates: false });
  const [isCalculated, setIsCalculated] = useState(false);

  const stats = useMemo(() => {
    if (!principal || !rate || !startDate || !endDate) return null;
    
    const totalMonths = getMonthsBetween(startDate, endDate);
    const T = totalMonths / 12;

    const P = parseFloat(principal);
    const R = parseFloat(rate); // Annual Rate in %
    
    let totalInterest = 0;
    let totalAmount = 0;
    const chartData = [];

    if (totalMonths > 0) {
      if (type === 'SI') {
        totalInterest = (P * R * T) / 100;
        totalAmount = P + totalInterest;
        
        // Show progression by month if period is short, otherwise by year
        const step = totalMonths > 24 ? 12 : 1;
        const unit = totalMonths > 24 ? 'Year' : 'Month';
        
        for (let i = step; i <= totalMonths; i += step) {
          const t_partial = i / 12;
          chartData.push({
            label: `${unit} ${totalMonths > 24 ? i / 12 : i}`,
            amount: Math.round(P + (P * R * t_partial) / 100)
          });
        }
      } else {
        totalAmount = P * Math.pow(1 + R / 100, T);
        totalInterest = totalAmount - P;
        
        const step = totalMonths > 24 ? 12 : 1;
        const unit = totalMonths > 24 ? 'Year' : 'Month';

        for (let i = step; i <= totalMonths; i += step) {
          const t_partial = i / 12;
          chartData.push({
            label: `${unit} ${totalMonths > 24 ? i / 12 : i}`,
            amount: Math.round(P * Math.pow(1 + R / 100, t_partial))
          });
        }
      }
    }

    return {
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      chartData
    };
  }, [principal, rate, startDate, endDate, type]);

  const handleCalculate = () => {
    setHasInteracted({ principal: true, rate: true, dates: true });
    if (!principal || !rate || !startDate || !endDate) {
      setError('Please enter all required values');
      setIsCalculated(false);
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after start date');
      setIsCalculated(false);
      return;
    }
    setError('');
    setIsCalculated(true);
  };

  const saveToHistory = () => {
    if (!stats) return;
    const entry = {
      id: Date.now(),
      type: type === 'SI' ? 'Simple' : 'Compound',
      principal: parseFloat(principal),
      rate: parseFloat(rate),
      startDate,
      endDate,
      durationLabel: `${startDate} to ${endDate}`,
      interest: stats.totalInterest,
      total: stats.totalAmount,
      date: new Date().toLocaleTimeString()
    };
    setHistory(prev => [entry, ...prev].slice(0, 10));
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    exportToCSV(history.map(({type, principal, rate, years, interest, total, date}) => ({
      Type: type, 
      Principal: principal, 
      Rate: rate, 
      Years: years, 
      Interest: interest, 
      Total: total, 
      Time: date
    })), 'Interest_Calculation_History');
  };

  const handleExportPDF = () => {
    if (history.length === 0) return;
    const headers = ['Type', 'Principal', 'Rate', 'Years', 'Interest', 'Total'];
    const body = history.map(item => [item.type, `₹${item.principal}`, `${item.rate}%`, item.years, `₹${item.interest}`, `₹${item.total}`]);
    exportToPDF('Interest Calculation History', headers, body, 'Interest_Calculation_History');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-white/5 rounded-2xl shadow-md p-5 space-y-6 border border-gray-200 dark:border-white/10 transition-all hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-500" />
          Interest Stats
        </h3>
        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button 
            onClick={() => setType('SI')}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${type === 'SI' ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-400'}`}
          >
            Simple
          </button>
          <button 
            onClick={() => setType('CI')}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${type === 'CI' ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-400'}`}
          >
            Compound
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Principal (₹)</label>
          <motion.div whileFocus={{ scale: 1.01 }}>
            <input
              type="number"
              value={principal}
              placeholder="Enter principal amount"
              onChange={(e) => {
                const val = e.target.value;
                if (parseFloat(val) < 0) return;
                setPrincipal(val);
                setIsCalculated(false);
              }}
              onBlur={() => setHasInteracted(prev => ({ ...prev, principal: true }))}
              autoComplete="off"
              className={`w-full h-11 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-4 text-sm font-bold outline-none border transition-all focus:ring-2 focus:ring-blue-500 ${
                hasInteracted.principal && !principal ? 'border-red-500/50 bg-red-50/50 dark:bg-red-500/5' : 'border-transparent dark:border-white/10'
              }`}
            />
          </motion.div>
          {principal && parseFloat(principal) > 0 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-bold text-blue-500 italic px-1"
            >
              {numberToIndianWords(parseFloat(principal))}
            </motion.p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Annual Rate (%)</label>
            <motion.div whileFocus={{ scale: 1.01 }}>
              <input
                type="number"
                value={rate}
                placeholder="e.g. 5"
                onChange={(e) => {
                  const val = e.target.value;
                  if (parseFloat(val) < 0) return;
                  setRate(val);
                  setIsCalculated(false);
                }}
                onBlur={() => setHasInteracted(prev => ({ ...prev, rate: true }))}
                autoComplete="off"
                className={`w-full h-11 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-4 text-sm font-bold outline-none border transition-all focus:ring-2 focus:ring-blue-500 ${
                  hasInteracted.rate && !rate ? 'border-red-500/50 bg-red-50/50 dark:bg-red-500/5' : 'border-transparent dark:border-white/10'
                }`}
              />
            </motion.div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setIsCalculated(false); }}
              className="w-full h-11 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-4 text-sm font-bold border border-transparent dark:border-white/10 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Date</label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => { setEndDate(e.target.value); setIsCalculated(false); }}
            className="w-full h-11 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-4 text-sm font-bold border border-transparent dark:border-white/10 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-[10px] font-bold text-red-500 bg-red-500/10 p-2 rounded-lg text-center"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {isCalculated && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 py-1 px-3 bg-blue-500/10 rounded-full w-fit mx-auto"
          >
            <Zap className="w-3 h-3 text-blue-500" />
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest whitespace-nowrap">
              Calculation Active
            </span>
          </motion.div>
        )}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCalculate}
          className={`w-full h-11 text-white text-sm font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
            !principal || !rate || !startDate || !endDate ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
           <Calculator className="w-4 h-4" />
           CALCULATE GROWTH
        </motion.button>

        <div className={`grid grid-cols-2 gap-3 transition-all duration-300 ${isCalculated ? 'opacity-100' : 'opacity-40 scale-[0.98]'}`}>
          <motion.div 
            animate={isCalculated ? { scale: [1, 1.05, 1] } : {}}
            className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl"
          >
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">Interest</span>
            <span className="text-base font-extrabold text-gray-900 dark:text-white">₹{isCalculated && stats ? stats.totalInterest.toLocaleString() : '0'}</span>
            {isCalculated && stats && stats.totalInterest > 0 && (
              <span className="text-[8px] font-bold text-emerald-500/80 italic block mt-1 leading-tight">{numberToIndianWords(stats.totalInterest)}</span>
            )}
          </motion.div>
          <motion.div 
            animate={isCalculated ? { scale: [1, 1.05, 1] } : {}}
            transition={{ delay: 0.1 }}
            className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl"
          >
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">Maturity</span>
            <span className="text-base font-extrabold text-gray-900 dark:text-white">₹{isCalculated && stats ? stats.totalAmount.toLocaleString() : '0'}</span>
            {isCalculated && stats && stats.totalAmount > 0 && (
              <span className="text-[8px] font-bold text-blue-500/80 italic block mt-1 leading-tight">{numberToIndianWords(stats.totalAmount)}</span>
            )}
          </motion.div>
        </div>
        {isCalculated && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveToHistory}
            className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-white/10 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Save Calculation
          </motion.button>
        )}
      </div>

      {history.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <History className="w-3.5 h-3.5" /> Recent Results
            </h4>
            <div className="flex gap-3">
              <button onClick={handleExportCSV} className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1 hover:underline">
                <FileText className="w-3 h-3" /> CSV
              </button>
              <button onClick={handleExportPDF} className="text-[9px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center gap-1 hover:underline">
                <Download className="w-3 h-3" /> PDF
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
            <AnimatePresence initial={false}>
              {history.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 flex items-center justify-between group"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded uppercase">{item.type}</span>
                      <span className="text-[9px] font-bold text-gray-400 italic">P: ₹{item.principal.toLocaleString()} @ {item.rate}% p.a.</span>
                    </div>
                    <span className="text-[9px] font-extrabold text-blue-500/80 uppercase tracking-tighter block mb-0.5">{item.durationLabel}</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">₹{item.total.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">+₹{item.interest.toLocaleString()}</span>
                    <span className="text-[8px] font-medium text-gray-400 uppercase tracking-tighter">{item.date}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em]">Growth Projection</h4>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.chartData || []} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
              <XAxis 
                dataKey="label" 
                fontSize={9} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontWeight: 'bold' }} 
              />
              <YAxis 
                fontSize={9} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontWeight: 'bold' }} 
                tickFormatter={(v) => `₹${v >= 100000 ? (v/100000).toFixed(1) + 'L' : (v/1000).toFixed(0) + 'k'}`} 
              />
              <Tooltip 
                cursor={{ fill: '#3b82f6', opacity: 0.05 }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  backgroundColor: '#1e293b',
                  color: '#f8fafc'
                }}
                itemStyle={{ color: '#60a5fa' }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {stats?.chartData?.map((_entry: any, index: number) => {
                  const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];
                  return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
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
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-white/5 rounded-2xl shadow-md p-5 space-y-4 border border-gray-200 dark:border-white/10 transition-all hover:shadow-lg"
    >
      <div className="flex items-center gap-2">
        <Tag className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Discount Saver</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base Price (₹)</label>
          <motion.div whileFocus={{ scale: 1.01 }}>
            <input
              type="number"
              value={price}
              placeholder="Item price"
              onChange={(e) => {
                const val = e.target.value;
                if (parseFloat(val) < 0) return;
                setPrice(val);
              }}
              onBlur={() => setHasInteracted(prev => ({ ...prev, price: true }))}
              autoComplete="off"
              className={`w-full h-11 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none border transition-all ${
                hasInteracted.price && !price ? 'border-red-500/50 bg-red-50/50 dark:bg-red-500/5' : 'border-transparent dark:border-white/10'
              }`}
            />
          </motion.div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Discount (%)</label>
          <motion.div whileFocus={{ scale: 1.01 }}>
            <input
              type="number"
              value={discountPct}
              placeholder="Discount %"
              onChange={(e) => {
                const val = e.target.value;
                if (parseFloat(val) < 0) return;
                setDiscountPct(val);
              }}
              onBlur={() => setHasInteracted(prev => ({ ...prev, discount: true }))}
              autoComplete="off"
              className={`w-full h-11 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none border transition-all ${
                hasInteracted.discount && !discountPct ? 'border-red-500/50 bg-red-50/50 dark:bg-red-500/5' : 'border-transparent dark:border-white/10'
              }`}
            />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {(!price || !discountPct) && (hasInteracted.price || hasInteracted.discount) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-[10px] font-bold text-red-500 bg-red-500/10 p-2 rounded-lg text-center"
          >
            Please enter all required values
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={isValid ? { scale: [1, 1.02, 1], opacity: 1 } : { scale: 0.98, opacity: 0.4 }}
        className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col gap-3 transition-opacity"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 font-medium tracking-tight">You Save:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{isValid ? discountAmount.toLocaleString() : '0'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-200 font-bold tracking-tight">Final Price:</span>
          <span className="text-xl font-black text-blue-600 dark:text-blue-400">₹{isValid ? finalPrice.toLocaleString() : '0'}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * CALCULATION LOG / STEP TRACKER
 */
export default function FinanceHub() {
  return (
    <div className="space-y-6 pb-28 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500" id="finance-hub-content">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-2">
          <Wallet className="w-8 h-8 text-blue-500" />
          Finance
        </h2>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Financial calculators & tools</p>
        <span className="text-[8px] font-bold text-gray-400/50 uppercase tracking-[0.2em] mt-1">CRAFTED BY PATEL VAMSHIDHAR REDDY</span>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">01. Rate Analysis</h3>
            <span className="w-8 h-px bg-gray-200 dark:bg-gray-700 flex-1 mx-4" />
          </div>
          <RateConverter />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">02. Growth Engine</h3>
            <span className="w-8 h-px bg-gray-200 dark:bg-gray-700 flex-1 mx-4" />
          </div>
          <InterestCalculator />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">03. Savings Tool</h3>
            <span className="w-8 h-px bg-gray-200 dark:bg-gray-700 flex-1 mx-4" />
          </div>
          <DiscountCalculator />
        </section>

        <section className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Financial Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="financial-insights">
            {[
              { title: 'Rate Analysis', desc: 'Analyze rate changes and trends.', icon: <Zap className="w-5 h-5 text-blue-500" /> },
              { title: 'Growth Engine', desc: 'Visualize growth over time.', icon: <Target className="w-5 h-5 text-emerald-500" /> },
              { title: 'Savings Tool', desc: 'Calculate and track savings.', icon: <ShieldCheck className="w-5 h-5 text-indigo-500" /> },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ translateY: -5, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                className="bg-white dark:bg-white/5 p-5 rounded-2xl shadow-md border border-gray-200 dark:border-white/10 space-y-3 transition-all group"
              >
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900/50 rounded-xl flex items-center justify-center transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{item.title}</h4>
                  <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <div className="bg-blue-600/10 dark:bg-blue-600/5 p-4 rounded-2xl border border-blue-600/10 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <p className="text-[10px] leading-relaxed text-blue-800 dark:text-blue-300 font-bold uppercase tracking-wider">
          Market rates are updated in real-time. All calculations are approximate and should be verified with your financial advisor.
        </p>
      </div>
    </div>
  );
}
