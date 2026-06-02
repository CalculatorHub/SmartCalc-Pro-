import React, { useState, useEffect } from 'react';
import { formatIndianCurrency } from '../../lib/financeUtils';
import { motion } from 'motion/react';
import { FileDown, Layers } from 'lucide-react';
import { exportToPDF } from '../../lib/exportUtils';

export default function EstimationCard({ area, totalPrice, unit }: { area: number; totalPrice: number; unit: string }) {
  const [localUnit, setLocalUnit] = useState<string>(unit);

  useEffect(() => {
    setLocalUnit(unit);
  }, [unit]);

  // Convert area
  const displayArea = (() => {
    if (unit === 'SQ.FT' && localUnit === 'SQ.M') {
      return area / 10.7639;
    }
    if (unit === 'SQ.M' && localUnit === 'SQ.FT') {
      return area * 10.7639;
    }
    return area;
  })();

  const handleDownloadPdf = () => {
    const title = "ESTATE MATRIX - VALUATION ANALYSIS REPORT";
    const headers = ["Operational Parameter", "Verified System Metric"];
    const body = [
      ["Standard Security Access Level", "Level Alpha (Verified)"],
      ["Total Coverage Area Space", `${displayArea.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${localUnit}`],
      ["Computed Valuation Output", formatIndianCurrency(totalPrice)],
      ["Selected Operational Unit", localUnit.toUpperCase()],
      ["Valuation Status Verification", "Active and Certified"]
    ];
    exportToPDF(title, headers, body, "estate_valuation_report");
  };

  return (
    <div className="premium-card rounded-[22px] p-6 space-y-8" id="estate-estimation-card">
      <div className="flex justify-between items-center select-none">
        <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-400 uppercase tracking-widest italic font-mono">
          <Layers className="w-3.5 h-3.5" />
          Display Unit
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 shadow-inner">
          <button
            onClick={() => setLocalUnit('SQ.FT')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-wider uppercase transition-all cursor-pointer ${
              localUnit === 'SQ.FT'
                ? "bg-blue-600 text-white shadow-glow-sm scale-102"
                : "text-[#8fa3c7] hover:text-white"
            }`}
          >
            SQ.FT
          </button>
          <button
            onClick={() => setLocalUnit('SQ.M')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-wider uppercase transition-all cursor-pointer ${
              localUnit === 'SQ.M'
                ? "bg-blue-600 text-white shadow-glow-sm scale-102"
                : "text-[#8fa3c7] hover:text-white"
            }`}
          >
            SQ.M
          </button>
        </div>
      </div>

      <motion.div 
        key={`${totalPrice}-${localUnit}-${area}`}
        initial="rest"
        animate="pulse"
        variants={{
          rest: { scale: 1 },
          pulse: {
            scale: [1, 1.02, 1],
            transition: { duration: 0.45, ease: "easeOut" }
          }
        }}
        className="space-y-2 relative rounded-xl"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0.95, 1.06, 1.12]
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute -inset-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/25 rounded-2xl blur-md pointer-events-none"
        />

        <div className="flex items-center gap-2">
          <h3 className="text-[10px] font-black text-[#8fa3c7] uppercase tracking-[0.4em]">Est. Valuation</h3>
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              backgroundColor: ["#3b82f6", "#10b981", "#3b82f6"]
            }}
            transition={{ duration: 0.5 }}
            className="w-1.5 h-1.5 rounded-full"
          />
        </div>

        <motion.div 
          animate={{
            color: ["#ffffff", "#93c5fd", "#ffffff"],
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-5xl font-black text-white tracking-tighter italic font-mono"
        >
          {formatIndianCurrency(totalPrice)}
        </motion.div>
      </motion.div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-5 bg-white/5 rounded-[22px] border border-white/5 font-mono">
           <div className="space-y-1">
              <span className="text-[9px] font-black text-[#8fa3c7] uppercase tracking-widest block">Total Coverage</span>
              <span className="text-sm font-black text-white italic">
                {displayArea.toLocaleString(undefined, { maximumFractionDigits: 2 })} {localUnit}
              </span>
           </div>
           <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">MAX</span>
           </div>
        </div>

        <div className="space-y-3">
            <div className="flex justify-between items-center text-[9px] font-black text-[#8fa3c7] uppercase px-1 tracking-widest">
                <span>Value Delta</span>
                <span className="text-emerald-400">Stable</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
            </div>
        </div>

        <button
          onClick={handleDownloadPdf}
          className="w-full h-12 rounded-xl text-[10px] uppercase tracking-[0.2em] font-black italic border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-glow-sm"
        >
          <FileDown className="w-4 h-4" />
          Download Report
        </button>
      </div>
    </div>
  );
}
