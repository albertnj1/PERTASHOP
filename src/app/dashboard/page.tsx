import { Droplets, TrendingUp, Fuel, AlertTriangle } from "lucide-react";
import { getDashboardData } from "@/lib/actions/dashboard";
import { getSession } from "@/lib/auth";
import Link from "next/link";

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
          <div className="md:col-span-3 glass p-6 border-amber-500/20 bg-amber-500/10 flex flex-col sm:flex-row items-center gap-6 animate-in slide-in-from-top duration-500 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/30 shadow-lg shadow-amber-500/10">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="font-bold text-amber-100 m-0 mb-1">Shift Belum Dibuka!</h4>
              <p className="text-sm text-amber-100/60 m-0">Fitur laporan, rekap, dan setoran dinonaktifkan sampai shift baru dibuka.</p>
            </div>
            <Link 
              href="/dashboard/shift" 
              className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all no-underline shadow-lg shadow-amber-500/20 active:scale-95"
            >
              Buka Shift Sekarang
            </Link>
          </div>
        )}

        {/* Welcome Card */}

        <div className="md:col-span-2 glass card-glass flex flex-col sm:flex-row items-start sm:items-center gap-6 p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] rounded-2xl flex items-center justify-center shadow-lg shrink-0">
            <span className="text-3xl">👋</span>
          </div>
          <div>
            <h4 className="text-2xl font-bold mb-1 text-white">Selamat datang kembali!</h4>
            <p className="opacity-80 text-sm m-0">
              Kamu login sebagai <b className="text-[var(--sky)]">{userRole}</b>
            </p>
          </div>
        </div>

        {/* Stok Pertamax - data real dari bbm_config */}
        <div className="glass card-glass p-6 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-3">
            <h6 className="m-0 font-semibold text-white/90 flex items-center gap-2">
              <Fuel className="w-4 h-4 text-[var(--sky)]" />
              Stok Pertamax
            </h6>
            <span className={`text-sm font-bold ${stokColor}`}>{data.stokPercentage}%</span>
          </div>
          <h4 className={`text-2xl font-bold m-0 mb-3 ${stokColor}`}>
            {data.stok.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L
          </h4>

          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${stokBarColor} rounded-full transition-all duration-700`}
              style={{ width: `${Math.min(data.stokPercentage, 100)}%` }}
            />
          </div>
          <p className="text-right text-xs opacity-60 mt-2 m-0">
            Kapasitas: {data.kapasitas.toLocaleString("id-ID", { minimumFractionDigits: 0 })} L
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Penjualan Hari Ini - data real dari laporan_harian */}
        <div className="glass card-glass p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <h6 className="text-sm opacity-80 font-medium mb-1">Penjualan Hari Ini</h6>
            <h3 className="text-2xl font-bold m-0">
              Rp {data.penjualanHariIni.toLocaleString("id-ID")}
            </h3>
            {!data.isShiftActive && data.penjualanHariIni === 0 && (
              <p className="text-xs text-white/40 mt-1 m-0">Buka shift untuk memulai</p>
            )}
          </div>
        </div>

        {/* Liter Terjual - data real dari bbm_log */}
        <div className="glass card-glass p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center shadow-lg shrink-0">
            <Droplets className="w-7 h-7 text-white" />
          </div>
          <div>
            <h6 className="text-sm opacity-80 font-medium mb-1">Liter Terjual</h6>
            <h3 className="text-2xl font-bold m-0">
              {data.literTerjual.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L
            </h3>
            {!data.isShiftActive && data.literTerjual === 0 && (
              <p className="text-xs text-white/40 mt-1 m-0">Buka shift untuk memulai</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
