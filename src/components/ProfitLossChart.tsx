"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartData {
  name: string;
  penjualan: number;
  pengeluaran: number;
  profit: number;
}

export default function ProfitLossChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass card-glass p-10 flex flex-col items-center justify-center min-h-[350px]">
        <div className="w-20 h-20 rounded-[32px] bg-white/5 flex items-center justify-center mb-6">
          <span className="text-3xl">📊</span>
        </div>
        <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">Belum ada data untuk ditampilkan</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPenjualan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--sky)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--sky)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 900, letterSpacing: 1 }}
            dy={20}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 900 }}
            tickFormatter={(value) => `Rp${(value / 1000).toLocaleString()}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(10, 16, 31, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              backdropFilter: "blur(20px)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              padding: "20px",
            }}
            itemStyle={{ fontWeight: 900, fontSize: "14px", padding: "4px 0" }}
            labelStyle={{ color: "var(--sky)", marginBottom: "12px", fontWeight: 900, fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px" }}
            formatter={(value: any) => [`Rp ${Number(value).toLocaleString("id-ID")}`, ""]}
            cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="penjualan"
            stroke="var(--sky)"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorPenjualan)"
            animationDuration={2000}
            filter="url(#glow)"
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="var(--accent)"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorProfit)"
            animationDuration={2000}
            filter="url(#glow)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
