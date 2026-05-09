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
    <div className="glass card-glass p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h5 className="text-xl font-extrabold mb-1">Analisis Profit & Loss</h5>
          <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">Data penjualan vs profit (7 laporan terakhir)</p>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-[var(--sky)] shadow-[0_0_10px_rgba(0,209,255,0.4)]" />
            <span className="text-[11px] text-[var(--text-muted)] uppercase font-black tracking-widest">Penjualan</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-[var(--accent)] shadow-[0_0_10px_rgba(112,0,255,0.4)]" />
            <span className="text-[11px] text-[var(--text-muted)] uppercase font-black tracking-widest">Profit</span>
          </div>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPenjualan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--sky)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--sky)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 11, fontWeight: 700 }}
              dy={15}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 11, fontWeight: 700 }}
              tickFormatter={(value) => `Rp${(value / 1000).toLocaleString()}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                borderRadius: "20px",
                backdropFilter: "blur(16px)",
                boxShadow: "var(--glass-shadow)",
                padding: "15px",
              }}
              itemStyle={{ fontWeight: 800, fontSize: "12px" }}
              labelStyle={{ color: "var(--text-muted)", marginBottom: "8px", fontWeight: 900, fontSize: "10px", textTransform: "uppercase" }}
              formatter={(value: any) => [`Rp ${Number(value).toLocaleString("id-ID")}`, ""]}
            />
            <Area
              type="monotone"
              dataKey="penjualan"
              stroke="var(--sky)"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorPenjualan)"
              animationDuration={1500}
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
    </div>
  );
}
