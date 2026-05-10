import { Droplets, TrendingUp, Fuel, AlertTriangle } from "lucide-react";
import { getDashboardData } from "@/lib/actions/dashboard";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import ProfitLossChart from "@/components/ProfitLossChart";

export default async function DashboardPage() {
  const [data, session] = await Promise.all([
    getDashboardData(),
    getSession(),
  ]);

  const userName = session?.user?.nama || "User";
  const userRole = session?.user?.role || "Operator";

  const stokColor =
    data.stokPercentage >= 50
      ? "text-emerald-400"
      : data.stokPercentage >= 25
      ? "text-amber-400"
      : "text-red-400";

  const stokBarColor =
    data.stokPercentage >= 50
      ? "bg-emerald-400"
      : data.stokPercentage >= 25
      ? "bg-amber-400"
      : "bg-red-400";

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Shift Warning Banner */}
        {!data.isShiftActive && (
          <div className="md:col-span-3 glass p-10 border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row items-center gap-10 animate-in slide-in-from-top-10 duration-1000 mb-2 rounded-[40px] shadow-[0_20px_50px_rgba(245,158,11,0.1)]">
            <div className="w-24 h-24 rounded-[32px] bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.3)]">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-2xl font-black text-amber-50 m-0 mb-2 tracking-tight">Peringatan: Shift Belum Dibuka</h4>
              <p className="text-sm text-amber-50/60 m-0 font-black uppercase tracking-[3px]">Akses fitur operasional dibatasi sampai shift baru diaktifkan</p>
            </div>
            <Link 
              href="/dashboard/shift" 
              className="btn-primary-glass bg-gradient-to-br from-amber-400 to-orange-600 shadow-amber-500/40 px-12 py-5 text-base"
            >
              Buka Shift Sekarang
            </Link>
          </div>
        )}

        {/* Welcome Card */}
        <div className="md:col-span-2 glass card-glass flex flex-col sm:flex-row items-start sm:items-center gap-8 p-8 group">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] rounded-[28px] flex items-center justify-center shadow-[0_15px_30px_rgba(0,136,255,0.3)] shrink-0 group-hover:scale-110 transition-transform duration-700">
            <span className="text-4xl">👋</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[4px] text-[var(--sky)] mb-2 opacity-90">Operational Portal</p>
            <h4 className="text-3xl font-black mb-1 tracking-tighter">Halo, {userName}!</h4>
            <p className="text-[var(--text-muted)] font-black m-0 text-lg flex items-center gap-3 uppercase tracking-widest">
              Role: <span className="text-[var(--text-main)] bg-white/40 border border-white/50 px-3 py-1 rounded-xl text-xs font-black">{userRole}</span>
            </p>
          </div>
        </div>

        {/* Stok Pertamax */}
        <div className="glass card-glass p-8 flex flex-col justify-center relative group min-h-[220px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--sky)]/10 to-transparent blur-[40px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h6 className="m-0 font-black text-[10px] uppercase tracking-[3px] text-[var(--text-muted)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--sky)]/20 flex items-center justify-center shadow-sm">
                <Fuel className="w-4 h-4 text-[var(--sky)]" />
              </div>
              Stok BBM
            </h6>
            <span className={`text-xs font-black px-3 py-1 rounded-full bg-white/40 border border-white/50 ${stokColor}`}>
              {data.stokPercentage}%
            </span>
          </div>
          <h4 className={`text-4xl font-black m-0 mb-6 relative z-10 tracking-tighter ${stokColor}`}>
            {data.stok.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <span className="text-lg opacity-40 font-bold ml-1">Ltr</span>
          </h4>

          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5 relative z-10 shadow-inner border border-white/10">
            <div
              className={`h-full ${stokBarColor} rounded-full transition-all duration-1500 ease-out`}
              style={{ width: `${Math.min(data.stokPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Penjualan Hari Ini */}
        <div className="glass card-glass p-8 flex items-center gap-8 group">
          <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_15px_35px_rgba(245,158,11,0.3)] shrink-0 group-hover:rotate-12 transition-transform duration-700">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <div>
            <h6 className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[3px] mb-2">Revenue Today</h6>
            <h3 className="text-4xl font-black m-0 tracking-tighter">
              <span className="text-xl text-amber-500 mr-2 font-bold">Rp</span>
              {data.penjualanHariIni.toLocaleString("id-ID")}
            </h3>
          </div>
        </div>

        {/* Total Terjual */}
        <div className="glass card-glass p-8 flex items-center gap-8 group">
          <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_15px_35px_rgba(16,185,129,0.3)] shrink-0 group-hover:-rotate-12 transition-transform duration-700">
            <Droplets className="w-10 h-10 text-white" />
          </div>
          <div>
            <h6 className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[3px] mb-2">Volume Sold</h6>
            <h3 className="text-4xl font-black m-0 tracking-tighter">
              {data.literTerjual.toLocaleString("id-ID", { minimumFractionDigits: 2 })}
              <span className="text-xl text-emerald-500 ml-2 font-black">Ltr</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass card-glass p-12 rounded-[48px] border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--sky)]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 relative z-10">
          <div>
            <h5 className="text-3xl font-black m-0 flex items-center gap-5 tracking-tight">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
              </div>
              Analisis Penjualan & Profit
            </h5>
            <p className="text-[11px] text-[var(--text-muted)] font-black uppercase tracking-[4px] mt-3">Statistik komprehensif 7 periode terakhir</p>
          </div>
          
          <div className="flex items-center gap-6 bg-white/[0.03] p-3 rounded-2xl border border-white/5 backdrop-blur-md">
             <div className="px-6 py-2.5 rounded-xl bg-white/10 text-xs font-black uppercase tracking-[3px] text-white cursor-default shadow-lg">
               Live Data
             </div>
          </div>
        </div>
        
        <div className="h-[450px] w-full relative z-10">
          <ProfitLossChart data={data.chartData} />
        </div>
      </div>
    </div>
  );
}
