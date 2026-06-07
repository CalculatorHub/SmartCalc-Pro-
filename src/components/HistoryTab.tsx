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
    const matchesType = filterType === 'all' || item.type === filterType;
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
      case 'simple': return 'border-emerald-100 hover:border-emerald-300';
      case 'compound': return 'border-purple-100 hover:border-purple-300';
      case 'fuel': return 'border-orange-100 hover:border-orange-300';
      case 'gold': return 'border-amber-100 hover:border-amber-300';
      case 'silver': return 'border-slate-100 hover:border-slate-350';
      case 'estate': return 'border-indigo-100 hover:border-indigo-300';
      default: return 'border-gray-100 hover:border-gray-300';
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Header bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-gray-100">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search calculations..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs font-semibold"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="simple">Simple Interest</option>
          <option value="compound">Compound Growth</option>
          <option value="fuel">Fuel Mileage</option>
          <option value="gold">Gold Tracker</option>
          <option value="silver">Silver Tracker</option>
          <option value="estate">Real Estate</option>
        </select>

        {history.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to wipe all stored history log entries?")) {
                onClearAll();
              }
            }}
            className="text-rose-500 hover:bg-rose-50 hover:text-rose-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-transparent hover:border-rose-100 cursor-pointer flex items-center justify-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Clear Log
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-sm mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400 border border-gray-100">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-gray-800 text-md">No computations found</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
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
                  "bg-white border rounded-2xl overflow-hidden transition-all duration-200 shadow-3xs",
                  borderG
                )}
              >
                {/* Accordion clickable header */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/20"
                >
                  <div className="flex items-center gap-3">
                    <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider", textBg)}>
                      {item.type}
                    </span>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-800">{item.title}</h4>
                      <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {/* Launch parameter back into workspace */}
                    <button
                      onClick={() => onRestore(item)}
                      className="p-2 text-indigo-650 hover:bg-indigo-50 rounded-xl transition-all font-semibold text-xs flex items-center gap-1 cursor-pointer"
                      title="Load this simulation into current workspace"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span className="hidden sm:inline">Load</span>
                    </button>

                    {/* Delete item */}
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Collapse icon */}
                    <div className="p-1 text-gray-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Extended Details Drawer */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 bg-slate-50/50 border-t border-gray-50 space-y-4 text-xs font-semibold">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Param block */}
                      <div className="space-y-1.5">
                        <h5 className="text-[10px] uppercase font-bold text-gray-450 tracking-wider">Input variables</h5>
                        <ul className="space-y-1 divide-y divide-gray-100 text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
                          {Object.entries(item.inputs).map(([key, val]) => (
                            <li key={key} className="flex justify-between py-1 first:pt-0 last:pb-0">
                              <span className="capitalize font-medium text-gray-400">{key.replace(/([A-Z])/g, ' $1')}</span>
                              <span className="font-extrabold text-gray-800">
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
                        <h5 className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Computed outputs</h5>
                        <ul className="space-y-1 divide-y divide-gray-100 text-gray-600 bg-emerald-50/20 p-3 rounded-xl border border-emerald-50">
                          {Object.entries(item.outputs).map(([key, val]) => (
                            <li key={key} className="flex justify-between py-1 first:pt-0 last:pb-0">
                              <span className="capitalize font-medium text-gray-500">{key.replace(/([A-Z])/g, ' $1')}</span>
                              <span className="font-extrabold text-emerald-700 font-sans">
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
