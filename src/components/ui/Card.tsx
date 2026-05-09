import React from "react";

export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`
      rounded-3xl p-5
      bg-white/80 dark:bg-[#0f172a]/80
      backdrop-blur-xl
      border border-slate-200 dark:border-white/10
      shadow-xl
      text-slate-900 dark:text-white
      ${className}
    `}>
      {children}
    </div>
  );
}
