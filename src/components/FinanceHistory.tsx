import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { History, Clock, FileBarChart, ChevronRight, RefreshCcw } from "lucide-react";

export default function FinanceHistory() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    setLoading(true);
    fetch("/api/finance")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 py-8 space-y-6 max-w-md mx-auto"
    >
      <div className="flex justify-between items-center px-2">
        <h1 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
          <History className="w-5 h-5 text-blue-500" />
          Finance Archive
        </h1>
        <button 
          onClick={fetchHistory}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 active:rotate-180 transition-transform duration-500"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {loading && data.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 opacity-20"
          >
            <Clock className="w-12 h-12 mb-4 animate-pulse" />
            <p className="font-bold uppercase tracking-widest text-xs">Scanning Records...</p>
          </motion.div>
        ) : data.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 opacity-40 text-center"
          >
            <FileBarChart className="w-12 h-12 mb-4" />
            <h3 className="font-bold text-sm tracking-tight mb-1 uppercase">No Records Found</h3>
            <p className="text-xs max-w-[200px]">Perform a calculation in the Finance Hub to archive your first dataset.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {data.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group p-5 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-2 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-1">
                      {item.type}
                    </span>
                    <h3 className="font-bold text-slate-950 dark:text-white flex items-center gap-2">
                      Result: ₹ {parseFloat(item.result).toLocaleString('en-IN')}
                    </h3>
                  </div>
                  <div className="text-[10px] opacity-40 font-bold">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="bg-slate-500/5 rounded-2xl p-3 grid grid-cols-2 gap-2">
                  {Object.entries(item.inputs).map(([key, val]: [string, any]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-tighter opacity-40 font-bold leading-none mb-1">{key}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{val}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1 cursor-pointer">
                    View Details <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
