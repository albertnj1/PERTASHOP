"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import {
  Clock,
  Play,
  Square,
  Timer,
  History,
  Activity,
  Zap,
  CheckCircle2,
  XCircle,
  Users,
  TrendingUp,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { openShift, closeShift, getActiveShift, getShiftHistory, getShiftStats } from "@/lib/actions/shifts";

interface ShiftData {
  id: number;
  user_id: number | null;
  operatorName: string;
  jam_buka: string | null;
  jam_tutup: string | null;
  status: string | null;
}

interface ShiftStats {
  todayShifts: number;
  totalShifts: number;
  activeTransactions: number;
  activeRevenue: number;
}

interface Props {
  initialActiveShift: ShiftData | null;
  initialHistory: ShiftData[];
  initialStats: ShiftStats;
}

function formatDuration(startIso: string): string {
  const start = new Date(startIso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - start);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatShiftDuration(start: string | null, end: string | null): string {
  if (!start || !end) return "-";
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}j ${minutes}m`;
  return `${minutes} menit`;
}

function formatTime(isoStr: string | null): string {
  if (!isoStr) return "-";
  return new Date(isoStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatDate(isoStr: string | null): string {
  if (!isoStr) return "-";
  return new Date(isoStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function ShiftClient({ initialActiveShift, initialHistory, initialStats }: Props) {
  const [activeShift, setActiveShift] = useState<ShiftData | null>(initialActiveShift);
  const [history, setHistory] = useState<ShiftData[]>(initialHistory);
  const [stats, setStats] = useState<ShiftStats>(initialStats);
  const [elapsed, setElapsed] = useState("00:00:00");
  const [isPending, startTransition] = useTransition();
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [pulseEffect, setPulseEffect] = useState(false);

  // Real-time timer
  useEffect(() => {
    if (!activeShift?.jam_buka || activeShift.status !== "open") return;

    const tick = () => setElapsed(formatDuration(activeShift.jam_buka!));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeShift]);

  // Pulse animation for active shift
  useEffect(() => {
    if (activeShift?.status === "open") {
      const interval = setInterval(() => {
        setPulseEffect((p) => !p);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [activeShift]);

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const refreshData = useCallback(async () => {
    const [newShift, newHistory, newStats] = await Promise.all([
      getActiveShift(),
      getShiftHistory(),
      getShiftStats(),
    ]);
    setActiveShift(newShift);
    setHistory(newHistory);
    setStats(newStats);
  }, []);

  const handleOpenShift = () => {
    startTransition(async () => {
      const result = await openShift();
      if (result.error) {
        setNotification({ type: "error", message: result.error });
      } else {
        setNotification({ type: "success", message: "Shift berhasil dibuka! Selamat bekerja 💪" });
        await refreshData();
      }
    });
  };

  const handleCloseShift = () => {
    if (!activeShift) return;
    startTransition(async () => {
      const result = await closeShift(activeShift.id);
      if (result.error) {
        setNotification({ type: "error", message: result.error });
      } else {
        setNotification({ type: "success", message: "Shift berhasil ditutup! Terima kasih atas kerja kerasnya 🎉" });
        setElapsed("00:00:00");
        await refreshData();
      }
      setShowConfirmClose(false);
    });
  };

  const isShiftOpen = activeShift?.status === "open";

  return (
    <div className="animate-in fade-in duration-500">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-500 animate-in slide-in-from-right ${
            notification.type === "success"
              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/20 border-red-500/30 text-red-300"
          }`}
          style={{ backdropFilter: "blur(20px)" }}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Clock className="w-7 h-7 text-[var(--sky)]" />
            Kelola Shift
          </h2>
          <p className="text-white/60 m-0">Buka dan tutup shift operasional secara real-time</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {/* Stats Badges */}
          <div className="glass px-5 py-3 flex items-center gap-3 bg-[var(--sky)]/10 border-[var(--sky)]/20">
            <Calendar className="w-4 h-4 text-[var(--sky)]" />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-60 m-0">Shift Hari Ini</p>
              <p className="text-base font-bold text-[var(--sky)] m-0">{stats.todayShifts}</p>
            </div>
          </div>
          <div className="glass px-5 py-3 flex items-center gap-3 bg-purple-500/10 border-purple-500/20">
            <History className="w-4 h-4 text-purple-400" />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-60 m-0">Total Shift</p>
              <p className="text-base font-bold text-purple-400 m-0">{stats.totalShifts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Shift Card - HERO */}
      <div
        className={`glass card-glass mb-8 relative overflow-hidden transition-all duration-700 ${
          isShiftOpen
            ? "border-emerald-500/30 shadow-[0_0_60px_rgba(16,185,129,0.15)]"
            : "border-white/10"
        }`}
      >
        {/* Animated background glow for active shift */}
        {isShiftOpen && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-[2000ms]"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.08), transparent 70%)",
              opacity: pulseEffect ? 1 : 0.5,
            }}
          />
        )}

        <div className="relative z-10 p-8">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  isShiftOpen
                    ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse"
                    : "bg-white/20"
                }`}
              />
              <span
                className={`text-sm font-bold uppercase tracking-widest ${
                  isShiftOpen ? "text-emerald-400" : "text-white/40"
                }`}
              >
                {isShiftOpen ? "Shift Sedang Berjalan" : "Tidak Ada Shift Aktif"}
              </span>
            </div>

            {isShiftOpen && (
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Users className="w-4 h-4" />
                <span>Operator: <strong className="text-white/80">{activeShift?.operatorName}</strong></span>
              </div>
            )}
          </div>

          {/* Timer Display */}
          <div className="text-center mb-8">
            {isShiftOpen ? (
              <>
                <div className="mb-3 flex items-center justify-center gap-2 text-white/50 text-sm">
                  <Timer className="w-4 h-4" />
                  <span>Durasi Shift</span>
                </div>
                <div
                  className="font-mono text-6xl md:text-7xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300"
                  style={{
                    textShadow: "0 0 40px rgba(52,211,153,0.3)",
                  }}
                >
                  {elapsed}
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm text-white/50">
                  <span>
                    Buka: <strong className="text-white/80">{formatTime(activeShift?.jam_buka || null)}</strong>
                  </span>
                  <span className="text-white/20">|</span>
                  <span>{formatDate(activeShift?.jam_buka || null)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Zap className="w-12 h-12 text-white/20" />
                </div>
                <h3 className="text-xl font-semibold text-white/60 mb-2">Belum Ada Shift Aktif</h3>
                <p className="text-white/40 text-sm">Buka shift untuk memulai operasional hari ini</p>
              </>
            )}
          </div>

          {/* Shift Stats for Active Shift */}
          {isShiftOpen && (
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
              <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                <Activity className="w-5 h-5 mx-auto mb-2 text-[var(--sky)]" />
                <p className="text-2xl font-bold">{stats.activeTransactions}</p>
                <p className="text-[10px] uppercase font-semibold tracking-wider text-white/40 mt-1">Transaksi</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                <TrendingUp className="w-5 h-5 mx-auto mb-2 text-amber-400" />
                <p className="text-2xl font-bold">Rp {stats.activeRevenue.toLocaleString("id-ID")}</p>
                <p className="text-[10px] uppercase font-semibold tracking-wider text-white/40 mt-1">Pendapatan</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            {!isShiftOpen ? (
              <button
                onClick={handleOpenShift}
                disabled={isPending}
                className="group relative flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_8px_30px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.6)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-400/30"
              >
                <Play className="w-6 h-6 transition-transform group-hover:scale-110" />
                {isPending ? "Membuka Shift..." : "Buka Shift"}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ) : (
              <>
                {!showConfirmClose ? (
                  <button
                    onClick={() => setShowConfirmClose(true)}
                    className="group relative flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-[0_8px_30px_rgba(239,68,68,0.3)] hover:shadow-[0_12px_40px_rgba(239,68,68,0.5)] hover:-translate-y-1 active:translate-y-0 border border-red-400/30"
                  >
                    <Square className="w-6 h-6 transition-transform group-hover:scale-110" />
                    Tutup Shift
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ) : (
                  <div className="glass p-6 rounded-2xl border-amber-500/30 bg-amber-500/10 max-w-sm text-center">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                    <h4 className="font-bold text-lg mb-2 text-amber-300">Konfirmasi Tutup Shift</h4>
                    <p className="text-sm text-white/60 mb-5">
                      Yakin ingin menutup shift? Durasi shift:{" "}
                      <strong className="text-white">{elapsed}</strong>
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setShowConfirmClose(false)}
                        className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors border border-white/10"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleCloseShift}
                        disabled={isPending}
                        className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50"
                      >
                        {isPending ? "Menutup..." : "Ya, Tutup Shift"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Shift History */}
      <div className="glass overflow-hidden border-white/10 shadow-2xl">
        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2 m-0">
            <History className="w-5 h-5 text-[var(--sky)]" />
            Riwayat Shift
          </h3>
          <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">
            {history.length} shift terakhir
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40">Operator</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40">Jam Buka</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40">Jam Tutup</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40 text-right">
                  Durasi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((shift) => (
                <tr key={shift.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          shift.status === "open"
                            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse"
                            : "bg-white/20"
                        }`}
                      />
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          shift.status === "open" ? "text-emerald-400" : "text-white/50"
                        }`}
                      >
                        {shift.status === "open" ? "Aktif" : "Selesai"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-sm">{shift.operatorName}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">
                    {shift.jam_buka
                      ? new Date(shift.jam_buka).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-emerald-400/80">{formatTime(shift.jam_buka)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-rose-400/80">{formatTime(shift.jam_tutup)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-lg ${
                        shift.status === "open"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-white/5 text-white/60"
                      }`}
                    >
                      {shift.status === "open" && shift.jam_buka
                        ? "Berjalan..."
                        : formatShiftDuration(shift.jam_buka, shift.jam_tutup)}
                    </span>
                  </td>
                </tr>
              ))}

              {history.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-white/30 italic">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    Belum ada riwayat shift.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
