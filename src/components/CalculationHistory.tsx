import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Trash2, RotateCcw, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface HistoryItem {
  id: string;
  type: 'Finance' | 'Vehicle' | 'Land';
  inputs: Record<string, any>;
  result: any;
  timestamp: string;
}

interface CalculationHistoryProps {
  history: HistoryItem[];
  onClear: () => void;
  onReuse: (item: HistoryItem) => void;
  title?: string;
}

export const CalculationHistory = ({ history, onClear, onReuse, title = "Previous Calculations" }: CalculationHistoryProps) => {
  if (history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 mt-12"
    >
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="bg-muted/30 dark:bg-muted/10 p-2 rounded-xl border border-theme">
            <History className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-black tracking-tighter uppercase text-primary">{title}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="text-red-500 hover:text-white hover:bg-red-500 font-black text-[9px] uppercase tracking-widest h-9 rounded-xl px-4 border border-transparent hover:border-red-600 transition-all"
        >
          <Trash2 className="h-3 w-3 mr-2" />
          Purge Log
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {history.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border border-theme shadow-lg hover:shadow-2xl transition-all bg-card relative overflow-hidden rounded-[2rem] group">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between space-y-0 text-primary">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-muted/40 rounded-xl border border-theme">
                      <Clock className="h-3.5 w-3.5 text-secondary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-secondary opacity-70">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-10 w-10 rounded-2xl shadow-sm hover:scale-110 transition-all bg-bg hover:bg-emerald-500 hover:text-white text-secondary border border-theme"
                    onClick={() => onReuse(item)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6 pt-3 space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(item.inputs).map(([key, value]) => (
                        <div key={key} className="px-3 py-1 bg-muted/20 rounded-xl text-[8px] font-black border border-theme text-secondary uppercase tracking-tighter">
                          <span className="mr-1 opacity-60">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-theme">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-1 opacity-60">Audit Result</p>
                    <p className="text-xl font-black text-primary tracking-tight truncate italic">
                      {typeof item.result === 'object' ? JSON.stringify(item.result) : item.result}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
