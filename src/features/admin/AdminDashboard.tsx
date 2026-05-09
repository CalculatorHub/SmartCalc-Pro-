import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid
} from "recharts";
import { motion } from "motion/react";
import Card3D from "../../components/ui/3DCard";

export default function AdminDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api("/api/finance");
      setData(res);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  /* 📊 Transform data for charts */
  const chartData = data.slice(-10).map((d, i) => ({
    name: `#${i + 1}`,
    value: parseFloat(d.result) || 0,
    type: d.type
  }));

  const totalValue = data.reduce((acc, d) => acc + (parseFloat(d.result) || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Total Records" value={data.length} color="from-blue-500 to-indigo-600" />
        <StatCard title="Total Volume" value={`₹${totalValue.toLocaleString('en-IN')}`} color="from-emerald-500 to-teal-700" />
      </div>

      <Card3D>
        <h2 className="text-sm font-black uppercase tracking-widest opacity-60 mb-6">Trend Analysis (Last 10)</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" fontSize={10} tick={{ fill: 'currentColor' }} />
              <YAxis fontSize={10} tick={{ fill: 'currentColor' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff'
                }} 
              />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card3D>

      <Card3D>
        <h2 className="text-sm font-black uppercase tracking-widest opacity-60 mb-6">Distribution Matrix</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" fontSize={10} tick={{ fill: 'currentColor' }} />
              <YAxis fontSize={10} tick={{ fill: 'currentColor' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card3D>

      {data.length === 0 && (
        <div className="p-10 text-center opacity-30 italic">
          No records identified in current session...
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color }: { title: string, value: string | number, color: string }) {
  return (
    <Card3D className="text-center py-8">
      <div className={`text-transparent bg-clip-text bg-gradient-to-r ${color} font-black text-2xl tracking-tighter mb-1`}>
        {value}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">{title}</div>
    </Card3D>
  );
}
