import React, { useState, useEffect } from 'react';
import { 
  Clock, History as HistoryIcon, Trash2, Search, Copy, Check, Filter, 
  ArrowUpRight, Calculator, RefreshCw, BookmarkCheck
} from "lucide-react";
import { getHistory, clearHistory, HistoryEntry } from '../lib/historyUtils';
import Card from './Card';
import Input from './Input';
import Button from './Button';

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadHistory = () => {
    setHistoryItems(getHistory());
  };

  useEffect(() => {
    loadHistory();

    // Listen to changes in local storage
    const handleStorageChange = () => {
      loadHistory();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your calculation history? This action cannot be undone.")) {
      clearHistory();
      setHistoryItems([]);
    }
  };

  const copyResultValue = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Get distinct calculation types for filter dropdown
  const filterCategories = ['All', ...Array.from(new Set(historyItems.map(item => item.type)))];

  const filteredHistory = historyItems.filter(item => {
    const matchesSearch = 
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.details && item.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'All' || item.type === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container animate-in fade-in duration-350 space-y-6">
      
      {/* 📜 HEADER */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/10">
              <HistoryIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Calculation Ledger</h2>
              <p className="text-xs text-gray-400">Temporal logs and cached parameters of your operations</p>
            </div>
          </div>
          {historyItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 text-red-400 text-xs font-bold transition-all active:scale-95 cursor-pointer max-w-max"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Ledger
            </button>
          )}
        </div>
      </Card>

      {/* 📊 SEARCH AND FILTERS */}
      {historyItems.length > 0 && (
        <Card>
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search entries, parameters, or value..."
                className="w-full bg-[#020617]/50 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/30 transition-all font-medium"
              />
            </div>

            {/* Filter Pill List */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full select-none no-scrollbar">
              <Filter className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <div className="flex gap-1.5">
                {filterCategories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                      selectedFilter === cat
                        ? 'bg-indigo-600/25 border-indigo-500/40 text-indigo-300'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 📈 HISTORY LEDGER CONTAINER */}
      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <div 
              key={item.id}
              className="glass p-5 rounded-3xl border border-white/5 hover:border-indigo-500/20 bg-slate-900/40 transition-all duration-300 relative group animate-in slide-in-from-bottom-2 duration-300"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/5 border border-indigo-500/10">
                    {item.type}
                  </span>
                  <div className="font-mono text-sm font-semibold text-gray-300 italic pt-2">
                    {item.details || 'No additional parameters logged.'}
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="text-xs text-gray-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.date}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <h3 className="text-lg font-black text-emerald-400 font-mono bg-emerald-500/5 px-2.5 py-0.5 rounded-lg border border-emerald-500/10">
                      ₹{typeof item.value === 'number' ? Number(item.value).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : parseFloat(item.value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h3>
                    
                    <button
                      onClick={() => copyResultValue(item.id, item.value.toString())}
                      className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 text-[#8fa3c7] hover:text-white transition-all active:scale-90 cursor-pointer"
                      title="Copy result"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass p-12 py-16 rounded-[30px] flex flex-col items-center justify-center text-center border border-white/5">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-5 border border-white/5">
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
            {historyItems.length === 0 ? (
              <>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">Neutral Ledger</h3>
                <p className="text-xs font-bold text-gray-400 mt-2.5 max-w-[240px]">No historical data points detected in your local session cache yet. Compute on any calculator to log entries!</p>
              </>
            ) : (
              <>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">No Matches</h3>
                <p className="text-xs font-bold text-gray-400 mt-2.5 max-w-[240px]">We couldn't find any ledger records that matched your filters or search keywords.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedFilter('All'); }}
                  className="mt-4 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[10px] font-black uppercase text-white tracking-widest cursor-pointer transition-all active:scale-95"
                >
                  Reset Query
                </button>
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
