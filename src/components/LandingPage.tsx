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
  Download
} from 'lucide-react';

interface LandingPageProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const { isInstallable, installApp } = usePWAInstall();

  return (
    <div className={`desktop-only-landing min-h-screen font-sans selection:bg-blue-500/20 ${isDarkMode ? 'dark' : ''}`}>
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-[60px] py-[25px] bg-card/80 backdrop-blur-md border-b border-theme sticky top-0 z-50">
        <div className="flex items-center gap-2 text-2xl font-black tracking-tighter cursor-pointer text-primary" onClick={() => navigate('/')}>
          Smart<span className="text-blue-600">calpro</span>
        </div>

        <div className="flex items-center gap-8">
          <button onClick={() => navigate('/')} className="nav-link active">Home</button>
          <button onClick={() => navigate('/finance')} className="nav-link">Finance</button>
          <button onClick={() => navigate('/gold-silver')} className="nav-link">Gold</button>
          <button onClick={() => navigate('/vehicle')} className="nav-link">Vehicle</button>
          <button onClick={() => navigate('/land')} className="nav-link">Land</button>
          <button className="nav-link">About</button>
          <button className="nav-link">Contact</button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center hover:scale-110 transition-all border border-theme text-primary"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Button 
            onClick={() => navigate('/admin')}
            variant="outline" 
            className="rounded-xl border-theme font-bold text-xs uppercase tracking-widest px-6 bg-card text-primary"
          >
            Portal Login
          </Button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="flex justify-between items-center px-[80px] py-[100px] max-w-7xl mx-auto gap-20">
        {/* HERO LEFT */}
        <div className="max-w-[600px] space-y-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20 px-4 py-2 rounded-full text-blue-600 dark:text-blue-400 font-bold text-xs tracking-tight"
          >
            <Zap size={14} className="fill-current" />
            ⚡ All-in-One Calculation Platform
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[64px] font-black leading-[1.1] tracking-tight uppercase px-0 text-primary"
          >
            Smartcalpro – All-in-One <br />
            <span className="gradient-text italic">Smart Calculator</span> <br />
            Platform
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg max-w-[500px] leading-relaxed font-medium hero-subtext text-secondary"
          >
            Experience next-gen financial, metallic, vehicle, and land calculations 
            with precision, speed, and confidence. Engineered for pro power.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 pt-4"
          >
            <Button 
              onClick={() => navigate('/finance')}
              className="h-14 px-8 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 btn-primary"
            >
              Start Calculating
            </Button>
            <Button 
              variant="outline"
              className="h-14 px-8 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-border transition-all text-primary border-theme bg-card btn-secondary"
            >
              Explore Features
            </Button>

            {isInstallable && (
              <Button 
                onClick={installApp}
                className="h-14 px-8 rounded-xl font-black uppercase tracking-widest text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/30 transition-all hover:-translate-y-1"
              >
                <Download size={18} className="mr-2" />
                Download App
              </Button>
            )}
          </motion.div>
        </div>

        {/* HERO RIGHT - DASHBOARD PREVIEW */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Decorative Blur Background */}
          <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full -z-10" />
          
          <div className="dashboard-card w-[480px] space-y-8 shadow-2xl relative overflow-hidden bg-card/80 backdrop-blur-xl border-theme">
             <div className="flex justify-between items-start gap-10">
                {/* PROTOCOLS COLUMN */}
                <div className="flex-1 space-y-4">
                  <h4 className="label-text">Protocols</h4>
                  <div className="space-y-3">
                    <div className="dashboard-item bg-card text-primary border border-theme rounded-lg px-4 py-2 shadow-sm hover:bg-border transition flex items-center gap-3">
                      <span className="text-blue-600">📊</span> Finance Matrix
                    </div>
                    <div className="dashboard-item bg-card text-primary border border-theme rounded-lg px-4 py-2 shadow-sm hover:bg-border transition flex items-center gap-3">
                      <span className="text-amber-500">🪙</span> Metals Terminal
                    </div>
                    <div className="dashboard-item bg-card text-primary border border-theme rounded-lg px-4 py-2 shadow-sm hover:bg-border transition flex items-center gap-3">
                      <span className="text-emerald-500">🚗</span> Vehicle Hub
                    </div>
                    <div className="dashboard-item bg-card text-primary border border-theme rounded-lg px-4 py-2 shadow-sm hover:bg-border transition flex items-center gap-3">
                      <span className="text-rose-500">🏢</span> Estate Suite
                    </div>
                  </div>
                </div>

                {/* CORE COLUMN */}
                <div className="w-[120px] space-y-4">
                  <h4 className="label-text">Core</h4>
                  <div className="space-y-3">
                    <div className="dashboard-item bg-card text-primary border border-theme rounded-lg px-4 py-2 shadow-sm hover:bg-border transition flex items-center justify-center">
                      💬 <span className="sr-only">Feedback</span>
                    </div>
                    <div className="dashboard-item bg-card text-primary border border-theme rounded-lg px-4 py-2 shadow-sm hover:bg-border transition flex items-center justify-center">
                      🔒 <span className="sr-only">Admin</span>
                    </div>
                  </div>
                </div>
             </div>

             {/* SYSTEM STATUS AREA */}
             <div className="space-y-4 pt-4 border-t border-theme">
                <h4 className="label-text">System Status</h4>
                <div className="flex gap-4">
                   <div className="status-badge flex-1 flex flex-col gap-1 items-start">
                      <div className="flex items-center gap-2 font-black uppercase tracking-tighter text-primary">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                         ✅ Operational
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">All Systems Active</span>
                   </div>
                   <div className="flex flex-col gap-2">
                       <div className="px-4 py-2 rounded-xl bg-card border border-theme text-[10px] font-black text-blue-600">
                         AES-256
                       </div>
                       <div className="px-4 py-2 rounded-xl bg-card border border-theme text-[10px] font-black text-emerald-600">
                         99.9%
                       </div>
                   </div>
                </div>
             </div>

             {/* DASHBOARD FOOTER */}
             <div className="pt-6 border-t border-theme flex flex-col items-center gap-2">
                 <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] footer-text">
                    <ShieldCheck size={12} />
                    AES-256 ENCRYPTED MATRIX
                 </div>
                 <div className="text-[8px] font-black uppercase tracking-[0.2em] footer-text">
                    CRAFTED BY <span className="text-blue-600 font-bold">PATEL VAMSHI</span> ❤️
                 </div>
             </div>

             {/* Decorative Corner */}
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl" />
          </div>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <div className="border-y border-theme py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: 'Calculations Processed', value: '1.2M+', color: 'text-blue-600' },
            { label: 'Active Monthly Users', value: '50K+', color: 'text-purple-600' },
            { label: 'Precision Accuracy', value: '99.9%', color: 'text-emerald-600' },
            { label: 'Indian States Covered', value: '28+', color: 'text-amber-600' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="text-center space-y-2"
            >
              <div className={`text-4xl font-black ${stat.color} tracking-tighter italic`}>{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FEATURED PROTOCOLS */}
      <section className="py-24 px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black uppercase tracking-tighter italic text-primary">Advanced Protocols</h2>
          <p className="text-secondary uppercase tracking-[0.3em] text-[10px] font-black">Professional-Grade Calculation Engines</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Neural Finance', desc: 'EMI, FD, and Interest projections with inflation-adjusted logic.', icon: '📈', color: 'bg-blue-500/10' },
            { title: 'Bullion Appraisal', desc: 'Real-time gold and silver valuation with purity and making charges.', icon: '⚖️', color: 'bg-amber-500/10' },
            { title: 'Logistics Matrix', desc: 'Fuel requirement and travel cost analysis for precise budgeting.', icon: '🚛', color: 'bg-emerald-500/10' },
            { title: 'Spatial Valuation', desc: 'Land area conversion and cost estimation based on local units.', icon: '🗺️', color: 'bg-purple-500/10' },
            { title: 'Data Export', desc: 'Generate professional PDF reports and share results instantly.', icon: '📄', color: 'bg-rose-500/10' },
            { title: 'Secure Vault', desc: 'Privacy-focused calculations with local encryption and PWA support.', icon: '🔒', color: 'bg-zinc-500/10' },
          ].map((protocol, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-card border-2 border-theme hover:border-primary transition-all duration-500 space-y-6 group shadow-lg hover:shadow-2xl">
              <div className={`w-16 h-16 rounded-[1.5rem] ${protocol.color} flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform`}>
                {protocol.icon}
              </div>
              <h3 className="text-2xl font-black tracking-tight text-primary uppercase italic">{protocol.title}</h3>
              <p className="text-secondary text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{protocol.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-8 pb-24 max-w-7xl mx-auto">
        <div className="relative rounded-[4rem] bg-zinc-950 p-16 sm:p-24 overflow-hidden text-center space-y-10 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-600/10 to-transparent -z-10" />
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/20 blur-[120px] group-hover:opacity-50 transition-opacity" />
          
          <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none max-w-4xl mx-auto">
            Ready to upgrade your <br/> <span className="text-blue-500">calculation work?</span>
          </h2>
          
          <p className="text-zinc-400 max-w-xl mx-auto uppercase tracking-widest text-[10px] font-black opacity-80">
            Join thousands of professionals using Smartcalpro daily.
          </p>

          <Button 
            onClick={() => navigate('/finance')}
            size="lg"
            className="h-20 px-16 text-xl font-black rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-500/40 hover:scale-105 transition-all group"
          >
            Launch System Now 
            <ArrowRight size={24} className="ml-4 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>
      </section>

      {/* FOOTER BAR */}
      <footer className="mt-20 py-8 border-t border-theme text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] footer-text">
           &copy; 2026 SMARTCALPRO PLATFORM V2.4 • ALL RIGHTS RESERVED
         </p>
      </footer>
    </div>
  );
};
