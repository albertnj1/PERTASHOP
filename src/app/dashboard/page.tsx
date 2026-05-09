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
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Shift Warning Banner */}
        {!data.isShiftActive && (
          <div className="md:col-span-3 glass p-8 border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row items-center gap-8 animate-in slide-in-from-top-4 duration-700 mb-2 rounded-[32px]">
            <div className="w-20 h-20 rounded-[28px] bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-xl font-black text-amber-100 m-0 mb-1">Peringatan: Shift Tertutup</h4>
              <p className="text-sm text-amber-100/60 m-0 font-bold uppercase tracking-widest">Akses operasional dibatasi sampai shift baru dibuka</p>
            </div>
            <Link 
              href="/dashboard/shift" 
              className="btn-primary-glass bg-gradient-to-br from-amber-400 to-orange-600 shadow-amber-500/30 px-10"
            >
              Buka Shift Baru
            </Link>
          </div>
        )}

        {/* Welcome Card */}
        <div className="md:col-span-2 glass card-glass flex flex-col sm:flex-row items-start sm:items-center gap-8 p-10 group">
          <div className="w-24 h-24 bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] rounded-[32px] flex items-center justify-center shadow-[0_15px_35px_rgba(0,136,255,0.3)] shrink-0 group-hover:scale-110 transition-transform duration-500">
            <span className="text-5xl">👋</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[4px] text-[var(--sky)] mb-2 opacity-80">Dashboard Overview</p>
            <h4 className="text-4xl font-black mb-1">Halo, {userName}!</h4>
            <p className="text-[var(--text-muted)] font-bold m-0 text-lg">
              Anda beroperasi sebagai <span className="text-white bg-[var(--sky)]/20 px-3 py-1 rounded-lg ml-1">{userRole}</span>
            </p>
          </div>
        </div>

        {/* Stok Pertamax */}
        <div className="glass card-glass p-8 flex flex-col justify-center relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--sky)]/5 to-transparent blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h6 className="m-0 font-black text-[10px] uppercase tracking-[3px] text-[var(--text-muted)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--sky)]/20 flex items-center justify-center">
                <Fuel className="w-4 h-4 text-[var(--sky)]" />
              </div>
              Stok Pertamax
            </h6>
            <span className={`text-xs font-black px-3 py-1 rounded-full bg-white/5 border border-white/5 ${stokColor}`}>
              {data.stokPercentage}%
            </span>
          </div>
          <h4 className={`text-4xl font-black m-0 mb-6 relative z-10 ${stokColor}`}>
            {data.stok.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <span className="text-lg opacity-60">Ltr</span>
          </h4>

          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-1 relative z-10">
            <div
              className={`h-full ${stokBarColor} rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.3)]`}
              style={{ width: `${Math.min(data.stokPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-4 relative z-10">
             <p className="text-[10px] font-black text-[var(--text-muted)] m-0 uppercase tracking-widest">
               Kapasitas Tangki
             </p>
             <p className="text-[10px] font-black text-white m-0 uppercase tracking-widest">
               {data.kapasitas.toLocaleString("id-ID")} L
             </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Penjualan Hari Ini */}
        <div className="glass card-glass p-8 flex items-center gap-8 group">
          <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_15px_35px_rgba(245,158,11,0.3)] shrink-0 group-hover:rotate-6 transition-transform">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <div>
            <h6 className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[3px] mb-2">Penjualan Hari Ini</h6>
            <h3 className="text-4xl font-black m-0">
              <span className="text-xl text-amber-500 mr-2">Rp</span>
              {data.penjualanHariIni.toLocaleString("id-ID")}
            </h3>
          </div>
        </div>

        {/* Total Terjual */}
        <div className="glass card-glass p-8 flex items-center gap-8 group">
          <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_15px_35px_rgba(16,185,129,0.3)] shrink-0 group-hover:-rotate-6 transition-transform">
            <Droplets className="w-10 h-10 text-white" />
          </div>
          <div>
            <h6 className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[3px] mb-2">Total Liter Terjual</h6>
            <h3 className="text-4xl font-black m-0">
              {data.literTerjual.toLocaleString("id-ID", { minimumFractionDigits: 2 })}
              <span className="text-xl text-emerald-500 ml-2 font-bold">Liter</span>
            </h3>
          </div>
        </div>
      </div>
      
      {/* Profit & Loss Chart */}
      <div className="mb-8">
        <ProfitLossChart data={data.chartData} />
      </div>
    </div>
  );
}
