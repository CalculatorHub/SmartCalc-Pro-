import React from "react";
import Card3D from "../../components/ui/3DCard";
import Icon3D from "../../components/ui/3DIcon";
import { 
  Landmark, 
  Coins, 
  Car, 
  Home
} from "lucide-react";

interface DashboardProps {
  setPage: (page: string) => void;
}

export default function Dashboard({ setPage }: DashboardProps) {
  const role = localStorage.getItem("role") || "user";

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
          Smartcal<span className="text-blue-500">pro+</span>
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Integrated Intelligence Platform</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MenuCard
          title="Finance"
          icon={<Landmark className="w-6 h-6" />}
          color="from-blue-500 to-indigo-600"
          onClick={() => setPage("finance")}
          description="Quantum Accounting"
        />

        <MenuCard
          title="Metals"
          icon={<Coins className="w-6 h-6" />}
          color="from-yellow-400 to-orange-500"
          onClick={() => setPage("metals")}
          description="Live Valuation"
        />

        <MenuCard
          title="Vehicle"
          icon={<Car className="w-6 h-6" />}
          color="from-teal-400 to-cyan-600"
          onClick={() => setPage("vehicle")}
          description="Fuel & Efficiency"
        />

        <MenuCard
          title="Estate"
          icon={<Home className="w-6 h-6" />}
          color="from-pink-500 to-purple-600"
          onClick={() => setPage("estate")}
          description="Spatial Valuation"
        />
      </div>
    </div>
  );
}

function MenuCard({ 
  title, 
  icon, 
  color, 
  onClick, 
  description 
}: { 
  title: string; 
  icon: React.ReactNode; 
  color: string; 
  onClick: () => void;
  description: string;
}) {
  return (
    <Card3D 
      className="cursor-pointer group flex flex-col items-center text-center space-y-4 py-8"
    >
      <div onClick={onClick} className="w-full h-full flex flex-col items-center">
        <Icon3D icon={icon} color={color} />
        <div className="mt-2 text-left w-full px-2">
          <h3 className="font-black text-sm uppercase tracking-tighter text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors italic">
            {title}
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 leading-tight">
            {description}
          </p>
        </div>
      </div>
    </Card3D>
  );
}
