import React from 'react';
import { Home, Wallet, Coins, Car, Landmark } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'finance', icon: Wallet, label: 'Finance' },
    { id: 'gold', icon: Coins, label: 'Gold' },
    { id: 'vehicle', icon: Car, label: 'Vehicle' },
    { id: 'land', icon: Landmark, label: 'Land' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur border-t border-white/10 flex justify-around py-2 z-50 md:hidden transition-all duration-500" id="bottom-nav">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center transition-all duration-300 ${
              isActive ? 'text-white scale-[1.15]' : 'text-slate-400 hover:text-white'
            }`}
            id={`nav-${item.id}`}
          >
            <div className="text-xl">
              <Icon size={20} strokeWidth={isActive ? 3 : 2} />
            </div>
            <span className="text-[12px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
