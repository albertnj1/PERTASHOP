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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Shift Warning Banner */}
        {!data.isShiftActive && (
          <div className="md:col-span-3 glass p-7 border-amber-500/10 bg-amber-500/5 flex flex-col sm:flex-row items-center gap-6 animate-in slide-in-from-top duration-500 mb-2">
            <div className="w-16 h-16 rounded-[24px] bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/20 shadow-lg shadow-amber-500/10">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="font-extrabold text-amber-100 m-0 mb-1">Shift Belum Dibuka!</h4>
              <p className="text-sm text-amber-100/60 m-0 font-medium">Fitur laporan, rekap, dan setoran dinonaktifkan sampai shift baru dibuka.</p>
            </div>
            <Link 
              href="/dashboard/shift" 
              className="btn-primary-glass bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/20"
            >
              Buka Shift Sekarang
            </Link>
          </div>
        )}

        {/* Welcome Card */}
        <div className="md:col-span-2 glass card-glass flex flex-col sm:flex-row items-start sm:items-center gap-6 p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] rounded-[28px] flex items-center justify-center shadow-xl shrink-0">
            <span className="text-4xl">👋</span>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold mb-1">Selamat datang kembali!</h4>
            <p className="text-[var(--text-muted)] font-medium m-0 text-base">
              Anda masuk sebagai <b className="text-[var(--sky)] uppercase tracking-wider">{userRole}</b>
            </p>
          </div>
        </div>

        {/* Stok Pertamax */}
        <div className="glass card-glass p-7 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-4">
            <h6 className="m-0 font-bold opacity-80 flex items-center gap-2">
              <Fuel className="w-5 h-5 text-[var(--sky)]" />
              Stok Pertamax
            </h6>
            <span className={`text-sm font-black ${stokColor}`}>{data.stokPercentage}%</span>
          </div>
          <h4 className={`text-3xl font-black m-0 mb-4 ${stokColor}`}>
            {data.stok.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} L
          </h4>

          <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full ${stokBarColor} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${Math.min(data.stokPercentage, 100)}%` }}
            />
          </div>
          <p className="text-right text-[11px] font-bold text-[var(--text-muted)] mt-3 m-0 uppercase tracking-widest">
            Kapasitas: {data.kapasitas.toLocaleString("id-ID")} L
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Penjualan Hari Ini */}
        <div className="glass card-glass p-7 flex items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shrink-0">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h6 className="text-sm text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">Penjualan Hari Ini</h6>
            <h3 className="text-3xl font-black m-0">
              Rp {data.penjualanHariIni.toLocaleString("id-ID")}
            </h3>
            {!data.isShiftActive && data.penjualanHariIni === 0 && (
              <p className="text-[11px] font-bold text-white/30 mt-1 m-0">Buka shift untuk memulai transaksi</p>
            )}
          </div>
        </div>

        {/* Liter Terjual */}
        <div className="glass card-glass p-7 flex items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-xl shrink-0">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <div>
            <h6 className="text-sm text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">Liter Terjual</h6>
            <h3 className="text-3xl font-black m-0">
              {data.literTerjual.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} L
            </h3>
            {!data.isShiftActive && data.literTerjual === 0 && (
              <p className="text-[11px] font-bold text-white/30 mt-1 m-0">Buka shift untuk memulai transaksi</p>
            )}
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
