import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, Map as MapIcon, Percent, ArrowRight, Fuel, Gauge, LayoutGrid, IndianRupee, Navigation, Zap } from 'lucide-react';

interface WelcomePageProps {
  onStart: () => void;
}

export const WelcomePage = ({ onStart }: WelcomePageProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-4xl w-full text-center space-y-12">
        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary blur-2xl opacity-20" />
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-primary text-primary-foreground rounded-[2rem] shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] rotate-12 hover:rotate-0 transition-transform duration-700 ease-out">
              <Zap className="h-12 w-12 fill-current" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-foreground uppercase italic">
              Smart<span className="text-primary">alpro</span>
            </h1>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </div>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium tracking-tight leading-relaxed">
            Revolutionizing Indian utility tools. <br/>
            <span className="text-foreground font-black italic">Finance. Vehicles. Land.</span>
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {[
            { icon: IndianRupee, title: "Finance", desc: "Neuro-Fiscal Projections", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
            { icon: Navigation, title: "Vehicle", desc: "Logistics & Economy Matrix", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { icon: MapIcon, title: "Land", desc: "Spatial Valuation Engine", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          ].map((feature, i) => (
            <div key={i} className={`p-8 rounded-[2rem] bg-muted/30 border-2 ${feature.border} backdrop-blur-xl hover:border-primary transition-all duration-500 group shadow-lg hover:shadow-2xl hover:-translate-y-2`}>
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="font-black text-xl mb-3 text-foreground uppercase tracking-tight italic">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed uppercase tracking-widest font-bold opacity-70 group-hover:opacity-100 transition-opacity">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6"
        >
          <Button 
            size="lg" 
            onClick={onStart}
            className="h-16 px-12 text-xl font-black rounded-full shadow-2xl hover:scale-105 transition-transform duration-500 gap-3 group"
          >
            Get Started
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-500" />
          </Button>

          <div className="flex items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest">Crafted by PATEL VAMSHIDHAR REDDY</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
