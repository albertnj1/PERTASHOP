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
          className={`fixed top-10 right-10 z-50 flex items-center gap-4 px-7 py-5 rounded-[24px] shadow-2xl border transition-all duration-500 animate-in slide-in-from-right ${
            notification.type === "success"
              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/20 border-red-500/30 text-red-300"
          }`}
          style={{ backdropFilter: "blur(24px)" }}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.type === "success" ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 shrink-0" />
            )}
          </div>
          <span className="font-bold text-sm tracking-tight">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 flex items-center gap-4">
            <div className="w-12 h-12 rounded-[20px] bg-[var(--sky)]/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-[var(--sky)]" />
            </div>
            Kelola Shift
          </h2>
          <p className="text-[var(--text-muted)] font-medium m-0">Buka dan tutup shift operasional secara real-time</p>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          {/* Stats Badges */}
          <div className="glass px-6 py-4 rounded-[24px] flex items-center gap-4 border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-[var(--sky)]/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[var(--sky)]" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] m-0">Shift Hari Ini</p>
              <p className="text-lg font-black text-[var(--text-color)] m-0">{stats.todayShifts}</p>
            </div>
          </div>
          <div className="glass px-6 py-4 rounded-[24px] flex items-center gap-4 border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center">
              <History className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] m-0">Total Shift</p>
              <p className="text-lg font-black text-[var(--text-color)] m-0">{stats.totalShifts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Shift Card - HERO */}
      <div
        className={`glass card-glass mb-10 relative overflow-hidden transition-all duration-700 rounded-[32px] ${
          isShiftOpen
            ? "border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.1)]"
            : "border-white/5"
        }`}
      >
        {/* Animated background glow for active shift */}
        {isShiftOpen && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-[2000ms]"
            style={{
              background: "radial-gradient(circle at 50% 0%, rgba(16,185,129,0.1), transparent 70%)",
              opacity: pulseEffect ? 1 : 0.5,
            }}
          />
        )}

        <div className="relative z-10 p-10">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-10">
            <div className={`px-5 py-2.5 rounded-full flex items-center gap-3 border ${isShiftOpen ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isShiftOpen
                    ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse"
                    : "bg-white/20"
                }`}
              />
              <span
                className={`text-[10px] font-black uppercase tracking-[2px] ${
                  isShiftOpen ? "text-emerald-400" : "text-[var(--text-muted)]"
                }`}
              >
                {isShiftOpen ? "Shift Aktif" : "Sistem Tertutup"}
              </span>
            </div>

            {isShiftOpen && (
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/5">
                <Users className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-[11px] font-bold text-[var(--text-muted)]">Operator: <strong className="text-[var(--text-color)]">{activeShift?.operatorName}</strong></span>
              </div>
            )}
          </div>

          {/* Timer Display */}
          <div className="text-center mb-10">
            {isShiftOpen ? (
              <>
                <div className="mb-4 flex items-center justify-center gap-3 text-[var(--text-muted)] text-[11px] font-black uppercase tracking-[3px]">
                  <Timer className="w-4 h-4" />
                  <span>Waktu Berjalan</span>
                </div>
                <div
                  className="font-black text-6xl md:text-8xl tracking-tight text-[var(--text-color)]"
                  style={{
                    textShadow: "0 10px 40px rgba(0,0,0,0.2)",
                  }}
                >
                  {elapsed}
                </div>
                <div className="mt-8 flex items-center justify-center gap-8 text-[13px] font-bold text-[var(--text-muted)]">
                  <div className="flex items-center gap-2">
                    <span className="opacity-40">BUKA:</span>
                    <span className="text-[var(--text-color)]">{formatTime(activeShift?.jam_buka || null)}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-color)] uppercase">{formatDate(activeShift?.jam_buka || null)}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-28 h-28 mx-auto mb-8 rounded-[32px] bg-white/5 border border-white/5 flex items-center justify-center shadow-inner">
                  <Zap className="w-12 h-12 text-[var(--text-muted)] opacity-20" />
                </div>
                <h3 className="text-2xl font-extrabold text-[var(--text-color)] mb-2">Belum Ada Shift Aktif</h3>
                <p className="text-[var(--text-muted)] font-medium text-sm">Buka shift untuk memulai operasional hari ini</p>
              </>
            )}
          </div>

          {/* Shift Stats for Active Shift */}
          {isShiftOpen && (
            <div className="grid grid-cols-2 gap-6 mb-10 max-w-md mx-auto">
              <div className="glass rounded-[24px] p-6 text-center border-white/5">
                <div className="w-10 h-10 rounded-2xl bg-[var(--sky)]/20 flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-5 h-5 text-[var(--sky)]" />
                </div>
                <p className="text-3xl font-black">{stats.activeTransactions}</p>
                <p className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mt-2">Total Transaksi</p>
              </div>
              <div className="glass rounded-[24px] p-6 text-center border-white/5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-3xl font-black">Rp {stats.activeRevenue.toLocaleString("id-ID")}</p>
                <p className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mt-2">Pendapatan</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-5">
            {!isShiftOpen ? (
              <button
                onClick={handleOpenShift}
                disabled={isPending}
                className="btn-primary-glass px-14 py-5 text-xl min-w-[240px]"
              >
                <Play className="w-7 h-7 fill-white" />
                {isPending ? "Membuka..." : "Buka Shift Baru"}
              </button>
            ) : (
              <>
                {!showConfirmClose ? (
                  <button
                    onClick={() => setShowConfirmClose(true)}
                    className="btn-primary-glass bg-gradient-to-br from-red-500 to-rose-600 px-14 py-5 text-xl min-w-[240px] shadow-red-500/20"
                  >
                    <Square className="w-7 h-7 fill-white" />
                    Akhiri Shift
                  </button>
                ) : (
                  <div className="glass p-8 rounded-[32px] border-amber-500/20 bg-amber-500/5 max-w-md text-center animate-in zoom-in duration-300">
                    <div className="w-16 h-16 rounded-[20px] bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-8 h-8 text-amber-400" />
                    </div>
                    <h4 className="font-extrabold text-xl mb-2 text-amber-100">Konfirmasi Tutup Shift</h4>
                    <p className="text-sm text-amber-100/60 font-medium mb-8">
                      Anda akan menutup sesi kerja hari ini. Durasi total: <b className="text-amber-400">{elapsed}</b>
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => setShowConfirmClose(false)}
                        className="btn-secondary-glass px-8 py-3 text-sm"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleCloseShift}
                        disabled={isPending}
                        className="btn-primary-glass bg-red-500 px-8 py-3 text-sm shadow-red-500/20"
                      >
                        {isPending ? "Menutup..." : "Ya, Tutup"}
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
      <div className="glass overflow-hidden border-white/5 rounded-[32px]">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-extrabold text-xl flex items-center gap-4 m-0">
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center">
              <History className="w-5 h-5 text-[var(--accent)]" />
            </div>
            Riwayat Aktivitas
          </h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] bg-white/5 px-4 py-2 rounded-full border border-white/5">
            {history.length} sesi terakhir
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)]">Operator</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)]">Tanggal</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)]">Waktu Sesi</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] text-right">Durasi Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((shift) => (
                <tr key={shift.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          shift.status === "open"
                            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse"
                            : "bg-white/10"
                        }`}
                      />
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${
                          shift.status === "open" ? "text-emerald-400" : "text-[var(--text-muted)]"
                        }`}
                      >
                        {shift.status === "open" ? "Aktif" : "Selesai"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-extrabold text-sm text-[var(--text-color)]">{shift.operatorName}</span>
                  </td>
                  <td className="px-8 py-6 text-[13px] font-bold text-[var(--text-muted)]">
                    {shift.jam_buka
                      ? new Date(shift.jam_buka).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3 font-mono text-[13px]">
                      <span className="text-emerald-400/80 font-bold">{formatTime(shift.jam_buka)}</span>
                      <span className="opacity-20">→</span>
                      <span className="text-rose-400/80 font-bold">{formatTime(shift.jam_tutup)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span
                      className={`text-[11px] font-black px-4 py-1.5 rounded-full border ${
                        shift.status === "open"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-white/5 text-[var(--text-muted)] border-white/5"
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
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="w-20 h-20 rounded-[24px] bg-white/5 flex items-center justify-center mx-auto mb-6">
                      <Clock className="w-10 h-10 text-[var(--text-muted)] opacity-20" />
                    </div>
                    <p className="text-[var(--text-muted)] font-bold italic">Belum ada riwayat shift yang tercatat.</p>
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
