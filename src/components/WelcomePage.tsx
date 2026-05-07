import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, Map as MapIcon, Percent, ArrowRight, Fuel, Gauge, LayoutGrid, IndianRupee, Navigation, Zap, ShieldCheck } from 'lucide-react';

interface WelcomePageProps {
  onStart: () => void;
}

export const WelcomePage = ({ onStart }: WelcomePageProps) => {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 overflow-hidden relative selection:bg-blue-500 selection:text-white">
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-48 -left-48 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-48 -right-48 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"
        />
        {/* Particle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="max-w-5xl w-full text-center space-y-16 relative z-10">
        {/* Brand System */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-10"
        >
          <div className="relative inline-flex mb-4">
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full opacity-20 blur-2xl font-black"
            />
            <div className="relative flex items-center justify-center w-28 h-28 bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-2xl rotate-12 hover:rotate-0 transition-all duration-700 group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity" />
              <Zap className="h-12 w-12 text-blue-500 fill-blue-500 group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-7xl sm:text-9xl font-black tracking-tighter text-white uppercase italic leading-none">
              Smart<span className="text-blue-600 drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">calpro</span>
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] w-12 bg-zinc-800" />
              <p className="text-xs font-black uppercase tracking-[0.5em] text-zinc-500">Professional Utility Suite</p>
              <div className="h-[2px] w-12 bg-zinc-800" />
            </div>
          </div>

          <p className="text-xl sm:text-2xl text-zinc-400 max-w-2xl mx-auto font-medium tracking-tight leading-relaxed">
            The neuro-fiscal engine for a modern India. <br/>
            <span className="text-white font-black italic">Precision. Logic. Scale.</span>
          </p>
        </motion.div>

        {/* Protocol Hub Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {[
            { icon: IndianRupee, title: "Fiscal", desc: "Neuro-Economic Matrix", color: "text-blue-500", glow: "shadow-blue-500/20" },
            { icon: Navigation, title: "Logistics", desc: "Energy & Flow Analytics", color: "text-purple-500", glow: "shadow-purple-500/20" },
            { icon: MapIcon, title: "Spatial", desc: "Valuation Convergence", color: "text-emerald-500", glow: "shadow-emerald-500/20" },
          ].map((feature, i) => (
            <div key={i} className={`group relative p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-3xl hover:border-white/20 transition-all duration-700 shadow-2xl hover:-translate-y-3 overflow-hidden`}>
               <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white opacity-0 group-hover:opacity-[0.03] transition-opacity blur-2xl mr-4 mt-4`} />
              <div className={`w-14 h-14 rounded-2xl bg-zinc-950 border border-white/5 ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="font-black text-xl mb-3 text-white uppercase tracking-tight italic text-left">{feature.title}</h3>
              <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-[0.2em] font-black text-left opacity-70 group-hover:opacity-100 transition-opacity">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Global CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12"
        >
          <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <Button 
              size="lg" 
              onClick={onStart}
              className="relative h-20 px-16 text-2xl font-black rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl transition-all duration-500 gap-4 group"
            >
              Initialize System
              <ArrowRight className="h-7 w-7 group-hover:translate-x-2 transition-transform duration-500" />
            </Button>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
               <ShieldCheck className="h-4 w-4 text-emerald-500" />
               AES-256 SECURE NODE
            </div>
            <div className="h-1 w-1 rounded-full bg-zinc-800 hidden sm:block" />
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
               PATEL VAMSHIDHAR REDDY &copy; 2026
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
