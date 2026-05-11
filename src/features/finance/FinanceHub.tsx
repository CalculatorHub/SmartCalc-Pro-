import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  Percent, 
  Save,
  Landmark,
  History,
  Trash2,
  Calendar,
  Layers,
  IndianRupee,
  Activity,
  Download,
  Tag,
  RefreshCw
} from "lucide-react";
import Card3D from "../../components/ui/3DCard";
import Icon3D from "../../components/ui/3DIcon";
import InputUI from "../../components/ui/MotionInput";
import Button from "../../components/ui/MotionButton";
import { num } from "../../utils/helpers";
import { saveFinanceRecord, subscribeToFinance, deleteFinanceRecord } from "../../services/financeService";

export default function FinanceHub() {
  const [records, setRecords] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const unsub = subscribeToFinance((data) => {
      setRecords(data);
    });
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <Card3D className="relative overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Icon3D icon={<Landmark className="w-6 h-6" />} color="from-blue-500 to-indigo-600" />
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                Finance Hub
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-0.5">
                Quantum Accounting v4.0
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-3 rounded-2xl transition-all ${showHistory ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </Card3D>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card3D className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Transmissions</h3>
                <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-[8px] font-black">{records.length} RECORDS</span>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
                {records.length === 0 ? (
                  <p className="text-center py-8 text-xs opacity-30 italic">No records found in local matrix.</p>
                ) : (
                  records.map(r => (
                    <div key={r.id} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex justify-between items-center group">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-blue-500">{r.type}</p>
                        <p className="text-sm font-bold">₹ {parseFloat(r.result).toLocaleString('en-IN')}</p>
                      </div>
                      <button 
                         onClick={() => deleteFinanceRecord(r.id)}
                         className="p-2 text-red-500/30 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card3D>
          </motion.div>
        )}
      </AnimatePresence>

      <FinancePlanner />
    </div>
  );
}

const saveFinance = async (type: string, inputs: any, result: any) => {
  try {
    await saveFinanceRecord({ type, inputs, result: String(result) });
  } catch (error) {
    console.error("Failed to save finance record:", error);
  }
};

function FinancePlanner() {
  const [mode, setMode] = useState<"simple" | "compound">("simple");
  
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("2"); // Interest per 100 per month

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [result, setResult] = useState<any[]>([]);
  const [totalInterest, setTotalInterest] = useState(0);

  // 💰 Indian Number to Words Converter
  const numberToWords = (num: number): string => {
    if (num === 0) return "Zero";
    if (isNaN(num)) return "";

    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const format = (n: number, suffix: string) => {
      if (n === 0) return "";
      let str = "";
      if (n > 19) {
        str = b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
      } else {
        str = a[n];
      }
      return str + " " + suffix + " ";
    };

    let words = "";
    words += format(Math.floor(num / 10000000), "Crore");
    words += format(Math.floor((num / 100000) % 100), "Lakh");
    words += format(Math.floor((num / 1000) % 100), "Thousand");
    words += format(Math.floor((num / 100) % 10), "Hundred");

    const remainder = Math.floor(num % 100);
    if (remainder > 0) {
      if (words !== "") words += "and ";
      if (remainder > 19) {
        words += b[Math.floor(remainder / 10)] + (remainder % 10 !== 0 ? " " + a[remainder % 10] : "");
      } else {
        words += a[remainder];
      }
    }

    return words.trim() + " Rupees Only";
  };

  // 💰 FORMAT INR
  const formatINR = (value: string | number) => {
    if (!value) return "";
    return Number(value).toLocaleString("en-IN");
  };

  // 🔁 RATE CONVERTER + DISCOUNT CALC
  const [percentVal, setPercentVal] = useState("");
  const [rupeeVal, setRupeeVal] = useState("");

  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountResult, setDiscountResult] = useState<{ discountAmount: string, finalPrice: string } | null>(null);

  // 🔁 CORE LOGIC (FIXED RATIO)
  const handlePercentChange = (val: string) => {
    setPercentVal(val);
    if (!val) {
      setRupeeVal("");
      return;
    }
    const n = Number(val);
    const rupees = n / 12;
    setRupeeVal(rupees.toFixed(2));
  };

  const handleRupeeChange = (val: string) => {
    setRupeeVal(val);
    if (!val) {
      setPercentVal("");
      return;
    }
    const n = Number(val);
    const percent = n * 12;
    setPercentVal(percent.toFixed(2));
  };

  // 💸 DISCOUNT AUTO CALC
  useEffect(() => {
    if (!price || !discount) {
      setDiscountResult(null);
      return;
    }
    const discAmount = (num(price) * num(discount)) / 100;
    const final = num(price) - discAmount;
    setDiscountResult({
      discountAmount: discAmount.toFixed(2),
      finalPrice: final.toFixed(2),
    });
  }, [price, discount]);

  const calculate = () => {
    if (!start || !end) {
      alert("⚠️ Temporal bounds not defined. Select start and end dates.");
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate <= startDate) {
      alert("⚠️ Chronological error: End date must be after start date.");
      return;
    }

    const months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    if (months <= 0) {
      alert("⚠️ Insufficient duration (less than 1 month).");
      return;
    }

    let data = [];
    let currentPrincipal = num(principal);
    let cumulativeInterest = 0;

    for (let i = 1; i <= months; i++) {
      // Always use percentage rate for calculations
      const interest = (currentPrincipal * num(rate)) / 100;

      const prevPrincipal = currentPrincipal;
      
      if (mode === "compound") {
        currentPrincipal += interest;
      }

      cumulativeInterest += interest;

      data.push({
        month: `M${i}`,
        principal: prevPrincipal,
        interest: interest,
        total: prevPrincipal + interest,
      });

      if (mode === "simple") {
        // Principal stays constant for simple interest
        currentPrincipal = num(principal);
      }
    }

    setResult(data);
    setTotalInterest(cumulativeInterest);
  };

  const downloadCSV = () => {
    if (!result.length) return;
    const headers = ["Month", "Principal", "Interest", "Total"];
    const rows = result.map((r) => [
      r.month,
      r.principal.toFixed(2),
      r.interest.toFixed(2),
      r.total.toFixed(2),
    ]);
    const csv = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "finance-report.csv";
    link.click();
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 🔁 RATE CONVERTER */}
      <Card3D className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-blue-500" />
          Rate Converter
        </h2>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Percent (%)</label>
              <InputUI 
                value={percentVal} 
                setValue={(v) => handlePercentChange(v)} 
                type="number" 
                placeholder="%" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Rupees / Paise (₹)</label>
              <InputUI 
                value={rupeeVal ? `₹ ${formatINR(rupeeVal)}` : ""} 
                setValue={(v) => {
                  const raw = v.replace(/[^0-9.]/g, "");
                  handleRupeeChange(raw);
                }} 
                type="text" 
                placeholder="₹" 
              />
            </div>
          </div>
          
          {percentVal && rupeeVal && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 italic">
              {percentVal}% = ₹{rupeeVal}
            </p>
          )}
        </div>
      </Card3D>

      <Card3D className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            Finance Planner
          </h2>
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl">
             <button 
              onClick={() => setMode("simple")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${mode === "simple" ? "bg-white dark:bg-slate-800 shadow-sm text-blue-500" : "opacity-40"}`}
             >Simple</button>
             <button 
              onClick={() => setMode("compound")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${mode === "compound" ? "bg-white dark:bg-slate-800 shadow-sm text-blue-500" : "opacity-40"}`}
             >Compound</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Principal (₹)</label>
              <InputUI 
                value={principal} 
                setValue={setPrincipal} 
                type="number" 
                placeholder="Principal amount" 
              />
              {num(principal) > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1"
                >
                  <p className="text-xs font-black text-blue-600 dark:text-blue-400">₹ {Number(principal).toLocaleString('en-IN')}</p>
                  <p className="text-[9px] font-bold uppercase tracking-tighter opacity-60 leading-tight">
                    {numberToWords(num(principal))}
                  </p>
                </motion.div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Monthly Interest (%)</label>
              <InputUI 
                value={rate} 
                setValue={setRate} 
                type="number" 
                placeholder="Monthly Rate (%)"
              />
              {num(rate) > 0 && num(principal) > 0 && (
                <p className="text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-400 ml-1">
                  Interest: ₹ {((num(principal) * num(rate)) / 100).toLocaleString('en-IN')} per Month
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Start Date</label>
              <InputUI value={start} setValue={setStart} type="date" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">End Date</label>
              <InputUI value={end} setValue={setEnd} type="date" />
            </div>
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          <span className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest py-1">
            <TrendingUp className="w-4 h-4" /> Calculate Projections
          </span>
        </Button>
      </Card3D>

      {/* 💸 DISCOUNT CALCULATOR */}
      <Card3D className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-500" />
          Discount Calculator
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Price (₹)</label>
            <InputUI value={price} setValue={setPrice} type="number" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Discount (%)</label>
            <InputUI value={discount} setValue={setDiscount} type="number" />
          </div>
        </div>

        {discountResult && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Savings: ₹{discountResult.discountAmount}</p>
            <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">Final: ₹{discountResult.finalPrice}</p>
          </div>
        )}
      </Card3D>

      <AnimatePresence>
        {result.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-20"
          >
            {/* SUMMARY CARD */}
            <Card3D className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white border-none">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Total Interest Generated</span>
                  <p className="text-4xl font-black italic">₹ {totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={downloadCSV}
                    className="bg-white/20 hover:bg-white/40 p-3 rounded-full transition-all"
                    title="Download Report"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => saveFinance(`${mode.toUpperCase()} Interest Planner`, { principal, rate, start, end }, totalInterest)}
                    className="bg-white/20 hover:bg-white/40 p-3 rounded-full transition-all"
                    title="Save Record"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest">
                <div>
                  <span className="opacity-60 block">Initial Matrix</span>
                  <span>₹ {num(principal).toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="opacity-60 block">Total Lifecycle Matured</span>
                  <span>₹ {(num(principal) + totalInterest).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </Card3D>

            {/* DATA TABLE */}
            <Card3D className="overflow-hidden p-0">
               <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex items-center justify-between">
                 <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">Granular Ledger</h3>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black opacity-40 italic">{result.length} Intervals Recorded</span>
                    <button onClick={downloadCSV} className="text-emerald-500 hover:text-emerald-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                 </div>
               </div>
               <div className="overflow-x-auto max-h-96 no-scrollbar">
                 <table className="w-full text-sm">
                   <thead>
                     <tr className="text-left text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-white/5 text-slate-400">
                       <th className="px-6 py-4">Epoch</th>
                       <th className="px-6 py-4 text-right">Principal</th>
                       <th className="px-6 py-4 text-right">Interest</th>
                       <th className="px-6 py-4 text-right">Maturity</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                     {result.map((r, i) => (
                       <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                         <td className="px-6 py-4 font-black uppercase text-blue-500 text-[10px]">{r.month}</td>
                         <td className="px-6 py-4 text-right text-xs">₹ {r.principal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                         <td className="px-6 py-4 text-right text-xs text-emerald-500 font-bold">+ ₹ {r.interest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                         <td className="px-6 py-4 text-right text-xs font-black">₹ {r.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </Card3D>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
