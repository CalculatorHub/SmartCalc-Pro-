import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Maximize, Banknote, RefreshCcw, Info, Share2, Target, Copy } from 'lucide-react';
import { CalculationHistory, HistoryItem } from './CalculationHistory';
import { ExportActions } from './ExportActions';
import { formatCurrency } from '@/lib/calculations';
import { formatNumber, vibrate } from '@/lib/utils';
import { CopyButton } from './ui/CopyButton';

type AreaUnit = 'SQ_FT' | 'SQ_M' | 'ACRE' | 'GUNTA' | 'HECTARE';

export const LandCalculator = () => {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [inputUnit, setInputUnit] = useState<AreaUnit>('SQ_FT');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [priceUnit, setPriceUnit] = useState<AreaUnit>('SQ_FT');
  const [currency] = useState('₹');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    area: number;
    totalPrice: number;
    conversions: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lc_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const calculate = () => {
    if (!length || !width || !pricePerUnit) {
      setResults(null);
      return;
    }

    const l = parseFloat(length);
    const w = parseFloat(width);
    const p = parseFloat(pricePerUnit);

    if (isNaN(l) || isNaN(w) || isNaN(p)) {
      setError('Please enter valid numeric values');
      return;
    }

    setError(null);
    let areaInSqFt = 0;
    if (inputUnit === 'SQ_FT') areaInSqFt = l * w;
    else if (inputUnit === 'SQ_M') areaInSqFt = (l * w) * 10.7639;

    let totalArea = l * w;
    let totalPrice = 0;

    if (priceUnit === 'SQ_FT') totalPrice = areaInSqFt * p;
    else if (priceUnit === 'SQ_M') totalPrice = (areaInSqFt / 10.7639) * p;
    else if (priceUnit === 'ACRE') totalPrice = (areaInSqFt / 43560) * p;

    setResults({
      area: totalArea,
      totalPrice,
      conversions: {
        sqFt: areaInSqFt,
        sqM: areaInSqFt / 10.7639,
        acre: areaInSqFt / 43560,
        gunta: areaInSqFt / 1089,
        hectare: areaInSqFt / 107639
      }
    });
  };

  useEffect(() => {
    calculate();
  }, [length, width, inputUnit, pricePerUnit, priceUnit]);

  const handleSaveToHistory = () => {
    if (!results) return;
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      type: 'Land',
      inputs: { length, width, unit: inputUnit, price: pricePerUnit, priceUnit },
      result: `Valuation: ${formatCurrency(results.totalPrice, currency)} (${results.area.toLocaleString()} ${inputUnit})`,
      timestamp: new Date().toISOString()
    };
    const newHistory = [newItem, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('lc_history', JSON.stringify(newHistory));
  };

  const handleReuse = (item: HistoryItem) => {
    setLength(item.inputs.length);
    setWidth(item.inputs.width);
    if (item.inputs.unit) setInputUnit(item.inputs.unit);
    if (item.inputs.price) setPricePerUnit(item.inputs.price);
    if (item.inputs.priceUnit) setPriceUnit(item.inputs.priceUnit);
  };

  const reset = () => {
    vibrate(15);
    setLength('');
    setWidth('');
    setPricePerUnit('');
    setResults(null);
    setError(null);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('lc_history');
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 transition-colors duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em]">
              <MapPin className="h-3 w-3" />
              Estate Protocol
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-primary uppercase italic leading-none">
              Estate <span className="text-emerald-600">Hub</span>
            </h2>
            <p className="text-secondary text-[10px] font-black uppercase tracking-widest leading-relaxed">Precision spatial valuation terminal. Rates indexed locally.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="relative border-none shadow-xl bg-card overflow-hidden rounded-[2rem] border border-theme">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600" />
              <CardHeader className="pb-4 pt-8 px-8">
                <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-tight text-primary">
                  <Maximize className="h-4 w-4 text-emerald-600" />
                  Dimensions Matrix
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pb-8 px-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary ml-1">Length</Label>
                    <Input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="h-14 bg-bg text-primary border-2 border-theme rounded-2xl px-6 font-black text-lg outline-none focus:border-emerald-500 transition-all placeholder:text-muted-foreground/30"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary ml-1">Width</Label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="h-14 bg-bg text-primary border-2 border-theme rounded-2xl px-6 font-black text-lg outline-none focus:border-emerald-500 transition-all placeholder:text-muted-foreground/30"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="flex gap-2 p-1 bg-bg rounded-2xl border-2 border-theme h-14">
                  {['SQ_FT', 'SQ_M'].map((u) => (
                    <button
                      key={u}
                      onClick={() => {
                        setInputUnit(u as any);
                        vibrate(5);
                      }}
                      className={`flex-1 rounded-xl text-[9px] font-black uppercase transition-all duration-500 ${
                        inputUnit === u ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-secondary hover:bg-muted/50'
                      }`}
                    >
                      {u === 'SQ_FT' ? 'Square Feet' : 'Square Meters'}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="relative border-none shadow-xl bg-card overflow-hidden rounded-[2rem] border border-theme">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />
              <CardHeader className="pb-4 pt-8 px-8">
                <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-tight text-primary">
                  <Banknote className="h-4 w-4 text-amber-500" />
                  Valuation Signal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pb-8 px-8">
                 <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
                   <div className="relative">
                     <Input
                       type="number"
                       value={pricePerUnit}
                       onChange={(e) => setPricePerUnit(e.target.value)}
                       className="h-14 bg-bg text-primary border-2 border-theme rounded-2xl px-14 text-lg font-black outline-none focus:border-amber-500 transition-all placeholder:text-muted-foreground/30"
                       placeholder="0.00"
                     />
                     <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black">₹</div>
                   </div>
                   <Select value={priceUnit} onValueChange={(v: any) => setPriceUnit(v)}>
                     <SelectTrigger className="h-14 bg-bg text-primary border-2 border-theme rounded-2xl px-6 font-black text-[11px] uppercase tracking-widest transition-all focus:ring-amber-500">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent className="bg-card border-theme rounded-xl overflow-hidden font-black text-[10px] uppercase">
                       <SelectItem value="SQ_FT" className="py-3 hover:bg-muted">Sq. Ft</SelectItem>
                       <SelectItem value="SQ_M" className="py-3 hover:bg-muted">Sq. M</SelectItem>
                       <SelectItem value="ACRE" className="py-3 hover:bg-muted">Acre</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>

                <div className="flex gap-4 pt-2">
                  <Button variant="outline" onClick={reset} className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest bg-bg border-2 border-theme text-secondary hover:bg-muted/50 transition-all">
                    Reset Matrix
                  </Button>
                  <Button onClick={handleSaveToHistory} disabled={!results} className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 border-none transition-all">
                    Archive Eval
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
            <Card className="relative border-none shadow-2xl bg-card overflow-hidden rounded-[2.5rem] border border-theme">
             <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-amber-500" />
             <CardHeader className="pb-4 pt-10 px-8 sm:px-12 text-center relative overflow-hidden">
                <div className="absolute top-4 right-6">
                  {results && <CopyButton value={results.totalPrice} label="Copy Valuation" />}
                </div>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Target className="h-5 w-5 text-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Est. Valuation</span>
                </div>
                <CardTitle className="text-4xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary via-emerald-600 to-emerald-800 italic leading-none tabular-nums">
                 {results ? `${currency}${formatNumber(results.totalPrice, 0)}` : '---'}
                </CardTitle>
             </CardHeader>
             <CardContent className="space-y-8 px-8 sm:px-12 pb-12">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-[2rem] bg-muted/30 dark:bg-muted/10 border-2 border-theme transition-all duration-500 text-center">
                  <span className="text-[8px] font-black uppercase tracking-widest text-secondary block mb-2">Coverage</span>
                  <p className="text-2xl font-black text-primary tabular-nums leading-none">
                    {results ? results.area.toLocaleString() : '0'} 
                    <span className="text-[10px] uppercase ml-1 opacity-60">{inputUnit === 'SQ_FT' ? 'ft²' : 'm²'}</span>
                  </p>
                </div>
                <div className="p-6 rounded-[2rem] bg-muted/30 dark:bg-muted/10 border-2 border-theme transition-all duration-500 text-center">
                  <span className="text-[8px] font-black uppercase tracking-widest text-secondary block mb-2">Index</span>
                  <p className="text-2xl font-black text-primary tabular-nums leading-none">{currency}{parseFloat(pricePerUnit || '0').toLocaleString()}</p>
                </div>
              </div>

              {results && (
                <div className="pt-6 flex justify-between items-center">
                  <ExportActions
                    title="EstateHub Valuation"
                    inputs={[
                      { label: 'Area', value: `${results.area} ${inputUnit}` },
                      { label: 'Rate', value: `${currency}${pricePerUnit}/${priceUnit}` },
                    ]}
                    results={[
                      { label: 'Total', value: formatCurrency(results.totalPrice, currency) },
                      { label: 'Acreage', value: `${results.conversions.acre.toFixed(4)} Ac` },
                    ]}
                  />
                  <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <LocalLandTerminology />
        </div>
      </div>

      <div className="mt-12">
        <CalculationHistory 
          history={history} 
          onClear={clearHistory} 
          onReuse={handleReuse} 
          title="Audit Log: Spatial Ledger"
        />
      </div>
    </div>
  );
};

const LocalLandTerminology = () => {
  return (
    <Card className="border-none bg-muted/30 dark:bg-muted/10 rounded-[2.5rem] border-2 border-theme overflow-hidden">
      <CardHeader className="pt-8 px-10 pb-4">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-2">
          <Info className="h-4 w-4" />
          Unit Lexicon
        </CardTitle>
      </CardHeader>
      <CardContent className="px-10 pb-10 space-y-6">
        {[
          { term: 'Acre', def: '43,560 sq. ft or 4047 sq. m' },
          { term: 'Hectare', def: '10,000 sq. m or 2.47 acres' },
          { term: 'Gunta', def: '1,089 sq. ft (Standard in India)' },
          { term: 'Cent', def: '435.6 sq. ft (1/100 of an acre)' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest leading-none">{item.term}</span>
            <span className="text-[10px] font-black text-secondary leading-relaxed opacity-70 uppercase tracking-tighter">{item.def}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
