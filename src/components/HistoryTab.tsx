import React, { useState } from 'react';
import { Search, Trash2, Calendar, CornerDownLeft, Play, ExternalLink, RefreshCw, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { HistoryItem, CalculatorType } from '../types';
import { formatDate, formatCurrency, cn } from '../utils';

interface HistoryTabProps {
  history: HistoryItem[];
  currency: string;
  onClearAll: () => void;
  onDeleteItem: (id: string) => void;
  onRestore: (item: HistoryItem) => void;
}

export default function HistoryTab({
  history,
  currency,
  onClearAll,
  onDeleteItem,
  onRestore,
}: HistoryTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter list
  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' 
      ? true 
      : filterType === 'precious-metals'
        ? (item.type === 'gold' || item.type === 'silver')
        : item.type === filterType;
    return matchesSearch && matchesType;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getMetalColor = (type: CalculatorType) => {
    switch (type) {
      case 'simple': return 'bg-emerald-500 text-emerald-50';
      case 'compound': return 'bg-purple-500 text-purple-50';
      case 'fuel': return 'bg-orange-500 text-orange-50';
      case 'gold': return 'bg-amber-500 text-amber-50';
      case 'silver': return 'bg-slate-400 text-slate-50';
      case 'estate': return 'bg-indigo-500 text-indigo-50';
      default: return 'bg-blue-500 text-blue-50';
    }
  };

  const getBorderColor = (type: CalculatorType) => {
    switch (type) {
      case 'simple': return 'border-emerald-100 dark:border-emerald-950/50 hover:border-emerald-300 dark:hover:border-emerald-800';
      case 'compound': return 'border-purple-100 dark:border-purple-950/50 hover:border-purple-300 dark:hover:border-purple-800';
      case 'fuel': return 'border-orange-100 dark:border-orange-950/50 hover:border-orange-300 dark:hover:border-orange-850';
      case 'gold': return 'border-amber-100 dark:border-amber-950/50 hover:border-amber-300 dark:hover:border-amber-800';
      case 'silver': return 'border-slate-100 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700';
      case 'estate': return 'border-indigo-100 dark:border-indigo-950/50 hover:border-indigo-300 dark:hover:border-indigo-800';
      default: return 'border-app-border hover:border-app-accent/40';
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Header bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-app-card p-4 rounded-2xl border border-app-border shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-app-text-muted absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search calculations..."
            className="w-full pl-9 pr-4 py-2 bg-app-bg border border-app-border rounded-xl focus:outline-none focus:ring-2 focus:ring-app-accent/20 focus:border-app-accent text-xs font-semibold text-app-text"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-app-bg border border-app-border rounded-xl px-3.5 py-2 text-xs font-bold text-app-text-secondary focus:outline-none focus:ring-2 focus:ring-app-accent/20 focus:border-app-accent cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="simple">Simple Interest</option>
          <option value="compound">Compound Growth</option>
          <option value="fuel">Fuel Mileage</option>
          <option value="precious-metals">Precious Metals</option>
          <option value="estate">Real Estate</option>
        </select>

        {history.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to wipe all stored history log entries?")) {
                onClearAll();
              }
            }}
            className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-app-border hover:border-rose-500/30 cursor-pointer flex items-center justify-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Clear Log
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredHistory.length === 0 ? (
        <div className="bg-app-card rounded-2xl border border-app-border p-12 text-center max-w-sm mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-app-bg flex items-center justify-center mx-auto text-app-text-muted border border-app-border">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-app-text text-md">No computations found</h4>
            <p className="text-xs text-app-text-secondary leading-relaxed">
              When you perform calculations, click "Save Calculation" to record them dynamically here for future reference.
            </p>
          </div>
        </div>
      ) : (
        /* History lists */
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const isExpanded = expandedId === item.id;
            const textBg = getMetalColor(item.type);
            const borderG = getBorderColor(item.type);

            return (
              <div
                key={item.id}
                className={cn(
                  "bg-app-card border rounded-2xl overflow-hidden transition-all duration-200 shadow-3xs",
                  borderG
                )}
              >
                {/* Accordion clickable header */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-app-bg/30"
                >
                  <div className="flex items-center gap-3">
                    <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-4xs shrink-0", textBg)}>
                      {item.type === 'gold' || item.type === 'silver' ? 'precious metals' : item.type}
                    </span>
                    <div>
                      <h4 className="text-sm font-extrabold text-app-text">{item.title}</h4>
                      <p className="text-[10px] text-app-text-muted font-medium flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {/* Launch parameter back into workspace */}
                    <button
                      onClick={() => onRestore(item)}
                      className="p-2 text-app-accent hover:bg-app-accent/10 rounded-xl transition-all font-bold text-xs flex items-center gap-1 cursor-pointer"
                      title="Load this simulation into current workspace"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span className="hidden sm:inline">Load</span>
                    </button>

                    {/* Delete item */}
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-2 text-app-text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Collapse icon */}
                    <div className="p-1 text-app-text-muted">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Extended Details Drawer */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 bg-app-bg/50 border-t border-app-border space-y-4 text-xs font-semibold">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Param block */}
                      <div className="space-y-1.5">
                        <h5 className="text-[10px] uppercase font-bold text-app-text-muted tracking-wider">Input variables</h5>
                        <ul className="space-y-1 divide-y divide-app-border text-app-text-secondary bg-app-card p-3 rounded-xl border border-app-border">
                          {Object.entries(item.inputs).map(([key, val]) => (
                            <li key={key} className="flex justify-between py-1 first:pt-0 last:pb-0">
                              <span className="capitalize font-medium text-app-text-muted">{key.replace(/([A-Z])/g, ' $1')}</span>
                              <span className="font-extrabold text-app-text">
                                {typeof val === 'number'
                                  ? (key.toLowerCase().includes('price') || key.toLowerCase().includes('principal') || key.toLowerCase().includes('down')
                                      ? formatCurrency(val, currency)
                                      : val.toLocaleString())
                                  : String(val)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Result block */}
                      <div className="space-y-1.5">
                        <h5 className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Computed outputs</h5>
                        <ul className="space-y-1 divide-y divide-emerald-100/30 dark:divide-emerald-950/35 text-app-text-secondary bg-emerald-500/5 dark:bg-emerald-950/10 p-3 rounded-xl border border-emerald-500/10 dark:border-emerald-950/20">
                          {Object.entries(item.outputs).map(([key, val]) => (
                            <li key={key} className="flex justify-between py-1 first:pt-0 last:pb-0">
                              <span className="capitalize font-medium text-emerald-500/80 dark:text-emerald-400/80">{key.replace(/([A-Z])/g, ' $1')}</span>
                              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-sans">
                                {typeof val === 'number'
                                  ? formatCurrency(val, currency)
                                  : String(val)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
