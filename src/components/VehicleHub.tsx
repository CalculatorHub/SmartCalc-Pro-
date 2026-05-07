import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Fuel, Navigation, RefreshCw, Zap, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { formatNumber, vibrate } from '@/lib/utils';
import { CopyButton } from './ui/CopyButton';
import { CalculationHistory, HistoryItem } from './CalculationHistory';
import { ExportActions } from './ExportActions';
import { useLocalStorage } from '@/lib/pwa';
import { getCachedPrices, fetchAllPrices } from '@/services/priceService';

const FALLBACK_FUEL_PRICES = {
  petrol: {
    delhi: 129.50, mumbai: 139.40, bangalore: 133.80, chennai: 135.20, hyderabad: 136.20, andhra: 137.80
  },
  diesel: {
    delhi: 115.30, mumbai: 123.50, bangalore: 119.85, chennai: 121.90, hyderabad: 121.50, andhra: 122.40
  }
};

export const VehicleHub = () => {
  const [fuelCity, setFuelCity] = useLocalStorage<string>('vh-fuel-city', '');
  const [fuelType, setFuelType] = useLocalStorage<'petrol' | 'diesel' | null>('vh-fuel-type', null);
  const [fuelDistance, setFuelDistance] = useLocalStorage<string>('vh-fuel-distance', '');
  const [fuelMileage, setFuelMileage] = useLocalStorage<string>('vh-fuel-mileage', '');
  const [manualFuelPrice, setManualFuelPrice] = useLocalStorage<string>('vh-fuel-price', '');
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('vh-history', []);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    fuelReq: number;
    enteredPrice: number;
    totalCost: number;
    costPerKm: number;
  } | null>(null);

  const updatePriceByCity = (city: string, type: 'petrol' | 'diesel' | null) => {
    if (!type) return;
    const normalized = city.toLowerCase().trim();
    const cityRates = FALLBACK_FUEL_PRICES[type] as Record<string, number>;
    if (cityRates[normalized]) {
      setManualFuelPrice(cityRates[normalized].toString());
    }
  };

  const refreshFuelPrices = async () => {
    setLoading(true);
    try {
      const updated = await fetchAllPrices(fuelCity || 'Andhra Pradesh');
      if (fuelType) {
        setManualFuelPrice(fuelType === 'petrol' ? updated.petrol.toString() : updated.diesel.toString());
      }
    } catch (e) {
      console.error('Failed to refresh fuel prices', e);
    } finally {
      setLoading(false);
    }
  };

  const calculate = () => {
    if (!fuelType || !fuelDistance || !fuelMileage || !manualFuelPrice) {
      setResults(null);
      return null;
    }

    const dist = Number(fuelDistance);
    const mil = Number(fuelMileage);
    const price = Number(manualFuelPrice);

    if (isNaN(dist) || isNaN(mil) || isNaN(price) || dist <= 0 || mil <= 0 || price <= 0) {
      setResults(null);
      return null;
    }

    const fr = dist / mil;
    const tc = fr * price;
    const cpkm = tc / dist;
    const res = { fuelReq: fr, enteredPrice: price, totalCost: tc, costPerKm: cpkm };
    setResults(res);
    return res;
  };

  useEffect(() => {
    calculate();
  }, [fuelDistance, fuelMileage, fuelType, manualFuelPrice]);

  const handleSaveTrip = () => {
    const res = calculate();
    if (res && fuelType) {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        type: 'Vehicle',
        inputs: {
          distance: fuelDistance,
          mileage: fuelMileage,
          fuelType,
          fuelPrice: manualFuelPrice
        },
        result: `Cost: ₹${res.totalCost.toFixed(0)} (${res.fuelReq.toFixed(1)}L)`,
        timestamp: new Date().toISOString()
      };
      setHistory([newItem, ...history].slice(0, 10));
    }
  };

  const handleReuse = (item: HistoryItem) => {
    setFuelDistance(item.inputs.distance);
    setFuelMileage(item.inputs.mileage);
    setFuelType(item.inputs.fuelType || null);
    setManualFuelPrice(item.inputs.fuelPrice || '');
  };

  const clearHistory = () => setHistory([]);
  const reset = () => {
    vibrate(15);
    setFuelDistance('');
    setFuelMileage('');
    setManualFuelPrice('');
    setFuelType(null);
    setResults(null);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 sm:space-y-8 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 pb-24">
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-[0.2em]">
            <Zap className="h-3 w-3 fill-current" />
            System Live
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-primary uppercase italic leading-none mb-1">
            Logistics <span className="text-blue-600">Terminal</span>
          </h2>
          <p className="text-secondary text-[10px] font-black uppercase tracking-widest leading-relaxed">Precision vehicle & fuel efficiency matrix. Engineered for accuracy.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-muted/30 dark:bg-muted/10 p-4 rounded-3xl border border-theme">
           <div className="h-10 w-10 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
             <Fuel className="h-5 w-5 text-blue-500" />
           </div>
           <div>
             <div className="text-[8px] font-black text-secondary uppercase tracking-widest leading-none mb-1">Status</div>
             <div className="text-[10px] font-black text-primary uppercase tracking-tighter leading-none">Operational</div>
           </div>
        </div>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              <Card className="relative border-none shadow-xl bg-card overflow-hidden rounded-[2rem] border border-theme">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
                <CardHeader className="pb-4 pt-8 px-8">
                  <CardTitle className="text-sm font-black flex items-center gap-2 text-primary uppercase tracking-tight">
                    <Fuel className="h-4 w-4 text-blue-600" />
                    Fuel Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pb-8 px-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary ml-1">Location Node</Label>
                        <Input
                          value={fuelCity}
                          onChange={(e) => {
                            setFuelCity(e.target.value);
                            updatePriceByCity(e.target.value, fuelType);
                          }}
                          className="h-14 bg-bg text-primary border-2 border-theme rounded-2xl px-6 font-black text-sm outline-none focus:border-blue-500 transition-all placeholder:text-muted-foreground/30"
                          placeholder="ENTER_CITY"
                        />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary ml-1">Type</Label>
                      <div className="flex p-1 bg-bg rounded-2xl border-2 border-theme h-14">
                        {['petrol', 'diesel'].map((f) => (
                          <button
                            key={f}
                            onClick={() => {
                              setFuelType(f as any);
                              updatePriceByCity(fuelCity, f as any);
                              vibrate(5);
                            }}
                            aria-label={`Select ${f} fuel type`}
                            className={`flex-1 rounded-xl text-[9px] font-black uppercase transition-all duration-500 ${
                              fuelType === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-secondary hover:bg-muted/50'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary ml-1">Pump Rate (₹)</Label>
                    <div className="relative group">
                      <Input
                         type="number"
                         value={manualFuelPrice}
                         onChange={(e) => setManualFuelPrice(e.target.value)}
                         placeholder="0.00"
                         className="h-14 bg-bg text-primary border-2 border-theme rounded-2xl px-14 text-lg font-black outline-none transition-all focus:border-blue-500 placeholder:text-muted-foreground/30"
                       />
                       <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary">₹</div>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         disabled={loading}
                         onClick={refreshFuelPrices} 
                         className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 rounded-xl bg-blue-600 text-white font-black uppercase text-[8px] tracking-widest hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-600/20"
                       >
                         {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : 'Sync'}
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative border-none shadow-xl bg-card overflow-hidden rounded-[2rem] border border-theme">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600" />
                <CardHeader className="pb-4 pt-8 px-8">
                  <CardTitle className="text-sm font-black flex items-center gap-2 text-primary uppercase tracking-tight">
                    <Navigation className="h-4 w-4 text-emerald-600" />
                    Spatial Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6 pt-0">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary ml-1">Distance (KM)</Label>
                       <Input
                         type="number"
                         value={fuelDistance}
                         onChange={(e) => setFuelDistance(e.target.value)}
                         className="h-14 bg-bg text-primary border-2 border-theme rounded-2xl px-6 font-black text-lg outline-none focus:border-emerald-500 transition-all placeholder:text-muted-foreground/30"
                         placeholder="0"
                       />
                     </div>
                     <div className="space-y-2">
                       <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary ml-1">Economy (KMPL)</Label>
                       <Input
                         type="number"
                         value={fuelMileage}
                         onChange={(e) => setFuelMileage(e.target.value)}
                         className="h-14 bg-bg text-primary border-2 border-theme rounded-2xl px-6 font-black text-lg outline-none focus:border-emerald-500 transition-all placeholder:text-muted-foreground/30"
                         placeholder="0"
                       />
                     </div>
                   </div>
                   <div className="flex gap-4">
                     <Button 
                       onClick={reset}
                       variant="outline" 
                       className="h-12 flex-1 rounded-2xl border-2 border-theme bg-bg text-secondary text-[10px] font-black uppercase tracking-widest hover:bg-muted/50"
                     >Reset</Button>
                     <Button 
                       onClick={handleSaveTrip} 
                       disabled={!results}
                       className="h-12 flex-1 rounded-2xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 border-none"
                     >Archive Data</Button>
                   </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
               <Card className="relative border-none shadow-2xl bg-card overflow-hidden rounded-[2.5rem] border border-theme">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-emerald-500 to-violet-600" />
                  <CardContent className="p-8 sm:p-12 space-y-8 text-center">
                     <div className="space-y-4">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Est. Expenditure</span>
                       <div className="relative">
                         <div className="absolute inset-0 blur-3xl bg-blue-500/10 rounded-full" />
                         <h3 className="relative text-5xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary via-blue-700 to-blue-900 italic leading-none py-2 tabular-nums">
                         ₹{results ? formatNumber(results.totalCost, 0) : '0'}
                       </h3>
                       <div className="absolute top-4 right-0">
                         {results && <CopyButton value={Math.round(results.totalCost)} label="Copy Trip Cost" />}
                       </div>
                       </div>
                       <div className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-80">
                         {results ? results.fuelReq.toFixed(1) : '0.0'} Liters Required
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                         <div className="p-6 rounded-[2rem] bg-muted/30 dark:bg-muted/10 border-2 border-theme">
                           <p className="text-[8px] font-black uppercase tracking-widest text-secondary mb-1">Unit Cost</p>
                           <p className="text-2xl font-black text-primary leading-none tabular-nums">₹{results ? results.costPerKm.toFixed(2) : '0.00'}</p>
                           <span className="text-[8px] font-black text-secondary uppercase mt-1 block">Per KM</span>
                         </div>
                         <div className="p-6 rounded-[2rem] bg-muted/30 dark:bg-muted/10 border-2 border-theme">
                           <p className="text-[8px] font-black uppercase tracking-widest text-secondary mb-1">Volume</p>
                           <p className="text-2xl font-black text-primary leading-none tabular-nums">{results ? results.fuelReq.toFixed(1) : '0.0'}L</p>
                           <span className="text-[8px] font-black text-secondary uppercase mt-1 block">Total Signal</span>
                         </div>
                     </div>

                    <div className="pt-4 flex justify-center">
                      {results && fuelType && (
                        <ExportActions
                          title="VehicleHub Trip Plan"
                          inputs={[
                            { label: 'Type', value: fuelType.toUpperCase() },
                            { label: 'Dist', value: `${fuelDistance} km` },
                            { label: 'M', value: `${fuelMileage} km/L` },
                          ]}
                          results={[
                            { label: 'Cost', value: `₹${results.totalCost.toFixed(0)}` },
                            { label: 'Fuel', value: `${results.fuelReq.toFixed(2)} L` },
                          ]}
                        />
                      )}
                    </div>
                 </CardContent>
               </Card>
            </div>
          </div>
        </motion.section>

        <CalculationHistory 
          history={history} 
          onClear={clearHistory} 
          onReuse={handleReuse} 
          title="Audit Log: Vehicle Ledger"
        />
      </div>
    </TooltipProvider>
  );
};
