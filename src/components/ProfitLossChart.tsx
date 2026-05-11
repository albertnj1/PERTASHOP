"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
        <div className="w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center mb-6">
          <span className="text-3xl">📊</span>
        </div>
        <p className="text-[var(--text-muted)] font-black uppercase tracking-widest text-[10px]">Belum ada data untuk ditampilkan</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPenjualan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--sky)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--sky)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--text-muted)", fontSize: 10, fontWeight: 700 }}
            dy={15}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--text-muted)", fontSize: 10, fontWeight: 700 }}
            tickFormatter={(value) => `Rp${(value / 1000).toLocaleString()}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              borderRadius: "20px",
              backdropFilter: "blur(20px)",
              boxShadow: "var(--glass-shadow)",
              padding: "15px",
            }}
            itemStyle={{ fontWeight: 800, fontSize: "12px", color: "var(--text-main)" }}
            labelStyle={{ color: "var(--sky)", marginBottom: "8px", fontWeight: 900, fontSize: "10px", textTransform: "uppercase" }}
            formatter={(value: any) => [`Rp ${Number(value).toLocaleString("id-ID")}`, ""]}
            cursor={{ stroke: "var(--sky)", strokeWidth: 1, strokeDasharray: "5 5" }}
          />
          <Area
            type="monotone"
            dataKey="penjualan"
            stroke="var(--sky)"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorPenjualan)"
            animationDuration={2000}
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="var(--accent)"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorProfit)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
