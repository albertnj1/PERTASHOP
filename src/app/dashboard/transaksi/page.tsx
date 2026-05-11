import { prisma } from "@/lib/prisma";
import {
  FileText,
  Plus,
  Calendar,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Filter,
} from "lucide-react";
import Link from "next/link";
import LaporanClient from "./LaporanClient";
import ShiftGuard from "@/components/ShiftGuard";

import { getSession } from "@/lib/auth";

export default async function LaporanPage() {
  const [reports, pertashops, activeShift, bbmConfig, session, lastBbmLog] =
    await Promise.all([
      prisma.laporan_harian.findMany({
        orderBy: { tanggal: "desc" },
        include: {
          _count: {
            select: { bbm_log: true, pengeluaran: true },
          },
        },
        take: 30,
      }),
      prisma.pertashop.findMany(),
      prisma.shifts.findFirst({ where: { status: "open" } }),
      prisma.bbm_config.findFirst({ where: { nama_bbm: "Pertamax" } }),
      getSession(),
      prisma.bbm_log.findFirst({ orderBy: { id: "desc" }, select: { totalisator_akhir: true } }),
    ]);

  const userRole = session?.user?.role || "Operator";
  const lastTotalisator = lastBbmLog?.totalisator_akhir || 0;

  return (
    <ShiftGuard
      title="Laporan Harian"
      subtitle="Input data totalisator dan pengeluaran harian"
      icon="report"
    >
      <div className="animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">Laporan Harian</h2>
            <p className="text-white/60">
              Arsip laporan operasional dan keuangan harian
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="glass px-4 py-2 flex items-center gap-2 hover:bg-white/10 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>
            <LaporanClient
              pertashops={pertashops}
              activeShift={activeShift}
              bbmPrice={bbmConfig?.harga || 0}
              userRole={userRole}
              lastTotalisator={lastTotalisator}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="glass card-glass group cursor-pointer hover:border-[var(--sky)]/50 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Date Column */}
                <div className="flex items-center gap-4 lg:w-1/4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] uppercase font-bold opacity-40">
                      {report.hari}
                    </span>
                    <span className="text-xl font-bold text-[var(--sky)] leading-tight">
                      {report.tanggal?.getDate()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-0.5">
                      {report.tanggal?.toLocaleDateString("id-ID", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase font-bold tracking-widest">
                      <span>{report._count.bbm_log} Logs</span>
                      <span className="w-1 h-1 rounded-full bg-white/20"></span>
                      <span>{report._count.pengeluaran} Pengeluaran</span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 py-2 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-6">
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-40 mb-1">
                      Penjualan
                    </p>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>
                        Rp {report.total_penjualan?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-40 mb-1">
                      Pengeluaran
                    </p>
                    <div className="flex items-center gap-1.5 text-red-400 font-bold">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>
                        Rp {report.total_pengeluaran?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-40 mb-1">
                      Saldo Bersih
                    </p>
                    <p className="font-bold text-white">
                      Rp {report.saldo_bersih?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-40 mb-1">
                      Kas Kecil
                    </p>
                    <p className="font-bold text-sky-300">
                      Rp {report.kas_kecil?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="flex items-center justify-end lg:w-16 shrink-0 border-t lg:border-t-0 border-white/10 pt-4 lg:pt-0">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[var(--sky)]/20 group-hover:border-[var(--sky)]/40 transition-all group-hover:translate-x-1">
                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-[var(--sky)] transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {reports.length === 0 && (
            <div className="glass p-16 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                <FileText className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-bold mb-2">Belum ada laporan</h3>
              <p className="text-white/40 max-w-sm mx-auto mb-8">
                Data laporan harian masih kosong. Silakan buat laporan baru
                untuk memulai pencatatan.
              </p>
              <LaporanClient
                pertashops={pertashops}
                activeShift={activeShift}
                bbmPrice={bbmConfig?.harga || 0}
                userRole={userRole}
              />
            </div>
          )}
        </div>
      </div>
    </ShiftGuard>
  );
}
