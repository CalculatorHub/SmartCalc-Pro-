import React from "react";
import { motion } from "motion/react";
import { Home, IndianRupee, Coins, Car, MapPin } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 backdrop-blur-2xl bg-white/70 dark:bg-slate-950/80 border-t border-white/20 flex justify-around items-center py-3 px-2 z-40 safe-area-bottom">
      <NavItem 
        label="Home" 
        icon={<Home className="w-5 h-5" />} 
        active={activeTab === "home"} 
        onClick={() => setActiveTab("home")}
      />
      <NavItem 
        label="Finance" 
        icon={<IndianRupee className="w-5 h-5" />} 
        active={activeTab === "finance"} 
        onClick={() => setActiveTab("finance")}
      />
      <NavItem 
        label="Gold" 
        icon={<Coins className="w-5 h-5" />} 
        active={activeTab === "gold"} 
        onClick={() => setActiveTab("gold")}
      />
      <NavItem 
        label="Vehicle" 
        icon={<Car className="w-5 h-5" />} 
        active={activeTab === "vehicle"} 
        onClick={() => setActiveTab("vehicle")}
      />
      <NavItem 
        label="Land" 
        icon={<MapPin className="w-5 h-5" />} 
        active={activeTab === "land"} 
        onClick={() => setActiveTab("land")}
      />
    </div>
  );
}

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}

function NavItem({ label, icon, active, onClick }: NavItemProps) {
  return (
    <motion.div 
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-1 min-w-[60px] relative cursor-pointer ${active ? "text-blue-500" : "opacity-60 text-slate-500 dark:text-slate-400"}`}
      id={`nav-item-${label.toLowerCase()}`}
    >
      <div className="relative">
        {icon}
        {active && (
          <motion.div
            layoutId="nav-active"
            className="absolute -inset-2 bg-blue-500/10 rounded-xl -z-10"
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          />
        )}
      </div>
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
      
      {active && (
        <motion.div 
          layoutId="nav-dot"
          className="w-1 h-1 bg-blue-500 rounded-full mt-0.5" 
        />
      )}
    </motion.div>
  );
}
