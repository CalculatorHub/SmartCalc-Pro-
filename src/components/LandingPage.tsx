import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { usePWAInstall } from '@/lib/pwa';
import { 
  LayoutGrid, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Moon,
  Sun,
  Download,
  IndianRupee,
  Navigation,
  Map as MapIcon
} from 'lucide-react';

interface LandingPageProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const { isInstallable, installApp } = usePWAInstall();

  return (
    <div className={`desktop-only-landing min-h-screen font-sans selection:bg-blue-500/20 ${isDarkMode ? 'dark' : ''} bg-[#09090b]`}>
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-[60px] py-[25px] bg-card/10 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-[100]">
        <div className="flex items-center gap-3 text-2xl font-black tracking-tighter cursor-pointer text-white" onClick={() => navigate('/')}>
          <div className="p-1.5 bg-blue-600 rounded-lg">
             <Zap size={20} className="fill-white text-white" />
          </div>
          Smart<span className="text-blue-500">calpro</span>
        </div>

        <div className="flex items-center gap-10">
          <button onClick={() => navigate('/')} className="text-xs font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors">Home</button>
          <button onClick={() => navigate('/finance')} className="text-xs font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors">Finance</button>
          <button onClick={() => navigate('/gold')} className="text-xs font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors">Metals</button>
          <button onClick={() => navigate('/vehicle')} className="text-xs font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors">Vehicle</button>
          <button onClick={() => navigate('/land')} className="text-xs font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors">Spatial</button>
        </div>

        <div className="flex items-center gap-5">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/5 text-white"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Button 
            onClick={() => navigate('/admin')}
            variant="outline" 
            className="rounded-xl border-white/10 font-black text-[10px] uppercase tracking-widest px-8 bg-white/5 text-white hover:bg-white/10 h-11"
          >
            Portal Access
          </Button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-16 px-8 text-center overflow-hidden">
        {/* Dynamic Glow System */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, -50, 0],
              y: [0, 50, 0],
              scale: [1.1, 1, 1.1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl mx-auto space-y-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-zinc-900/50 border border-white/10 backdrop-blur-md shadow-2xl">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">System v4.2 Deployment Success</span>
          </div>

          <h1 className="text-7xl sm:text-[120px] font-black tracking-tighter text-white uppercase italic leading-[0.85] m-0">
            Precision <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-purple-600 to-blue-400 drop-shadow-[0_0_40px_rgba(37,99,235,0.25)]">Utility Matrix</span>
          </h1>

          <p className="text-lg sm:text-2xl text-zinc-400 max-w-3xl mx-auto font-medium tracking-tight leading-relaxed opacity-80 uppercase italic">
            Unlock the power of neural architecture. Smartcalpro delivers enterprise-grade fiscal, metallurgical, and spatial analysis at scale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Button 
              onClick={() => navigate('/finance')}
              className="h-20 px-12 group !bg-blue-600 !hover:bg-blue-700 !text-white rounded-[2.5rem] shadow-2xl shadow-blue-600/30 text-xl font-black transition-all hover:scale-105 active:scale-95 flex items-center gap-4"
            >
              Launch System Core
              <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const el = document.getElementById('protocols');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="h-20 px-12 rounded-[2.5rem] border-2 border-white/10 bg-white/5 backdrop-blur-3xl hover:bg-white/10 text-xl font-black transition-all hover:border-blue-500 text-white"
            >
              Explore Node Hub
            </Button>
          </div>
        </motion.div>

        {/* Floating UI Elements Preview */}
        <div className="relative mt-32 w-full max-w-6xl mx-auto hidden lg:block">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-gradient-to-t from-[#09090b] via-transparent to-transparent z-10" />
           <div className="grid grid-cols-3 gap-8 perspective-[1000px]">
             {[1,2,3].map(i => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, rotateX: 20, y: 50 }}
                 animate={{ opacity: 1, rotateX: 10, y: 0 }}
                 transition={{ duration: 1.5, delay: 0.2*i }}
                 className="h-64 bg-zinc-900/40 rounded-[3rem] border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden group"
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                 <div className="p-8 space-y-4">
                   <div className="w-12 h-12 rounded-2xl bg-zinc-800 animate-pulse" />
                   <div className="h-4 w-3/4 bg-zinc-800 rounded-full" />
                   <div className="h-4 w-1/2 bg-zinc-800 rounded-full" />
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="border-y border-white/5 py-24 bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
          {[
            { label: 'Calculations Processed', value: '1.2M+', color: 'text-blue-500' },
            { label: 'Active Monthly Hubs', value: '50K+', color: 'text-purple-500' },
            { label: 'Precision Accuracy', value: '99.9%', color: 'text-emerald-500' },
            { label: 'Nodes Worldwide', value: '250+', color: 'text-amber-500' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -8 }}
              className="text-center space-y-3"
            >
              <div className={`text-5xl sm:text-7xl font-black ${stat.color} tracking-tighter italic drop-shadow-[0_0_15px_rgba(37,99,235,0.2)]`}>{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 opacity-60">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FEATURED PROTOCOLS */}
      <section id="protocols" className="py-32 px-8 max-w-7xl mx-auto space-y-24">
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-xl bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] border border-blue-600/20 mb-2">System Components</div>
          <h2 className="text-5xl sm:text-8xl font-black uppercase tracking-tighter italic text-white leading-none">Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Protocols</span></h2>
          <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-black opacity-60">High-performance engines designed for accuracy and scale from the 2026 Core.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            { title: 'Neural Finance', desc: 'EMI, FD, and Interest projections with inflation-adjusted logic and multi-tier analysis.', icon: '📈', color: 'bg-blue-600/10', border: 'hover:border-blue-500' },
            { title: 'Bullion Appraisal', desc: 'Real-time gold and silver valuation with purity calculation and local making charge offsets.', icon: '⚖️', color: 'bg-amber-600/10', border: 'hover:border-amber-500' },
            { title: 'Logistics Matrix', desc: 'Fuel requirement maps and travel cost analysis for precise corporate logistics.', icon: '🚛', color: 'bg-emerald-600/10', border: 'hover:border-emerald-500' },
            { title: 'Spatial Valuation', desc: 'Land area unit conversion with regional Indian metric support and cost estimation.', icon: '🗺️', color: 'bg-purple-600/10', border: 'hover:border-purple-500' },
            { title: 'Secure Vault', desc: 'Privacy-focused calculations with local encryption, PWA support, and neural sync.', icon: '🔒', color: 'bg-rose-600/10', border: 'hover:border-rose-500' },
            { title: 'Report Engine', desc: 'Generate high-fidelity PDF reports and share calculated signals across standard protocols.', icon: '📄', color: 'bg-zinc-600/10', border: 'hover:border-zinc-500' },
          ].map((protocol, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -12 }}
              className={`p-12 rounded-[3.5rem] bg-zinc-900/40 border-2 border-white/5 ${protocol.border} transition-all duration-700 space-y-10 group shadow-xl hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden`}
            >
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-0 group-hover:opacity-[0.02] blur-3xl transition-opacity" />
              <div className={`w-20 h-20 rounded-[2rem] ${protocol.color} flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                {protocol.icon}
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black tracking-tight text-white uppercase italic group-hover:text-blue-500 transition-colors">{protocol.title}</h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity font-sans">{protocol.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-8 pb-32 max-w-7xl mx-auto">
        <div className="relative rounded-[5rem] bg-zinc-950 p-20 sm:p-32 overflow-hidden text-center space-y-12 group border border-white/5 shadow-[0_60px_120px_rgba(0,0,0,0.8)]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent -z-10 opacity-60" />
          <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] group-hover:opacity-80 transition-opacity" />
          <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] group-hover:opacity-80 transition-opacity" />
          
          <div className="space-y-6">
            <h2 className="text-6xl sm:text-9xl font-black text-white tracking-tighter uppercase italic leading-[0.8] max-w-5xl mx-auto">
              Upgrade to the <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 drop-shadow-2xl">Neural Edge.</span>
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto uppercase tracking-[0.5em] text-[10px] font-black opacity-80 leading-relaxed">
              Experience calculation without compromise. <br/> Join 50,000+ power users initializing daily.
            </p>
          </div>

          <Button 
            onClick={() => navigate('/finance')}
            size="lg"
            className="h-24 px-20 text-2xl font-black rounded-full !bg-blue-600 !hover:bg-blue-700 !text-white shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-4">
              Initialize Local Node 
              <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </Button>

          <div className="flex flex-wrap items-center justify-center gap-12 pt-12 opacity-30">
             {['AES-256', 'PWA-GRID', 'ISO-CAL', 'NEURAL-SYN', 'QUANTUM-SAFE'].map(label => (
               <span key={label} className="text-[10px] font-black uppercase tracking-[0.6em] text-white drop-shadow-md">{label}</span>
             ))}
          </div>
        </div>
      </section>

      {/* FOOTER BAR */}
      <footer className="mt-20 py-12 border-t border-white/5 text-center">
         <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
              &copy; 2026 SMARTCALPRO CORE V4.2 • ALL RIGHTS RESERVED
            </p>
            <div className="flex items-center gap-4">
               <ShieldCheck size={16} className="text-emerald-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">AES-256 ENCRYPTED HUB</span>
            </div>
         </div>
      </footer>
    </div>
  );
};
