import React from 'react';
import {
  Shield,
  Info,
  Star,
  CheckCircle,
  ArrowRight,
  Wallet,
  Coins,
  Fuel,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from 'motion/react';

export default function HomePage() {
  const navigate = useNavigate();
  const features = [
    {
      title: "Financial Hub",
      desc: "EMI, Loan & Rates",
      icon: Wallet,
      color: "from-blue-500 to-blue-700",
      path: "/finance"
    },
    {
      title: "Metal Calculators",
      desc: "Manual Gold & Silver Tools",
      icon: Coins,
      color: "from-yellow-500 to-orange-600",
      path: "/gold"
    },
    {
      title: "Fuel & Vehicle",
      desc: "Trip & Fuel estimation",
      icon: Fuel,
      color: "from-green-500 to-green-700",
      path: "/vehicle"
    },
    {
      title: "Estate & Property",
      desc: "Value & Loan estimation",
      icon: Home,
      color: "from-purple-500 to-purple-700",
      path: "/estate"
    },
  ];

  return (
    <div className="min-h-screen bg-darkBg px-5 pt-6 pb-24 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-xl font-semibold">
            Hello User 👋
          </h1>
          <p className="text-sm text-gray-400">
            Smart tools for smarter financial decisions.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 p-3 rounded-full backdrop-blur-xl"
        >
          <Shield size={18} />
        </motion.div>
      </div>

      {/* ABOUT CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 bg-card border border-border rounded-2xl p-5 flex items-center gap-4 backdrop-blur-xl shadow-glow"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
          <Info className="text-white" />
        </div>

        <p className="text-sm text-gray-300 leading-relaxed font-medium">
          CalHub is your all-in-one financial calculator platform.
          We provide simple, accurate and reliable tools for your
          everyday financial calculations.
        </p>
      </motion.div>

      {/* WHAT IS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 bg-card border border-border rounded-2xl p-5 backdrop-blur-xl"
      >
        <h2 className="text-sm text-gray-400 mb-2 font-bold uppercase tracking-widest text-[10px]">
          What is CalHub?
        </h2>

        <p className="text-sm text-gray-300 font-medium">
          CalHub helps you calculate EMI, loan details, gold prices,
          fuel costs, and property values — all in one place.
        </p>
      </motion.div>

      {/* FEATURES */}
      <div className="mt-6">
        <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
          <Star size={12} /> Key Features
        </h2>

        <div className="space-y-3">
          {features.map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.path)}
                className="bg-card border border-border rounded-xl p-4 flex items-center justify-between backdrop-blur-xl cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg shadow-black/20`}>
                    <Icon size={18} className="text-white" />
                  </div>

                  <div>
                    <p className="font-bold text-sm tracking-tight">
                      {item.title}
                    </p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <ArrowRight size={16} className="text-gray-600" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* WHY CHOOSE */}
      <div className="mt-6">
        <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">
          Why Choose CalHub?
        </h2>

        <div className="grid grid-cols-2 gap-3 pb-8">
          {[
            "Fast & Accurate",
            "Secure & Private",
            "Easy to Use",
            "All in One",
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="bg-card border border-border rounded-xl p-4 text-center backdrop-blur-xl"
            >
              <CheckCircle className="mx-auto mb-2 text-blue-500" size={18} />
              <p className="text-[11px] font-black uppercase tracking-tight">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}



