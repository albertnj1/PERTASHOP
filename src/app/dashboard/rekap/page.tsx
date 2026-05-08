import { prisma } from "@/lib/prisma";
import { Printer, Calendar, Download, FileSpreadsheet, FileText } from "lucide-react";
import ShiftGuard from "@/components/ShiftGuard";

export default async function RekapPage() {
  return (
    <ShiftGuard 
      title="Rekap / Cetak" 
      subtitle="Ekspor data dan cetak laporan periodik"
      icon="report"
    >
      <div className="animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">Rekap / Cetak</h2>
            <p className="text-white/60">Ekspor data dan cetak laporan periodik</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Date Range Picker Placeholder */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass card-glass p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[var(--sky)]" />
                Pilih Rentang Waktu
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-40 px-1">Dari Tanggal</label>
                  <input type="date" className="input-glass" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-40 px-1">Sampai Tanggal</label>
                  <input type="date" className="input-glass" />
                </div>
              </div>

              <button className="btn-primary-glass w-full py-4 text-lg">
                Generate Laporan
              </button>
            </div>

            <div className="glass p-6">
              <h4 className="font-bold mb-4 opacity-80 uppercase text-xs tracking-widest">Format Ekspor</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[var(--sky)]/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm">PDF Report</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm">Excel (.xlsx)</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-sky-500/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                    <Download className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm">CSV Data</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Reports / Recently Generated */}
          <div className="space-y-6">
            <div className="glass p-6">
              <h4 className="font-bold mb-6 flex items-center gap-2">
                <Printer className="w-4 h-4 text-white/40" />
                Laporan Terakhir
              </h4>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white/40 group-hover:text-[var(--sky)] transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-bold m-0">Laporan April 2026</p>
                        <p className="text-[10px] opacity-40 m-0">Generated: 27 April</p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-white/20 group-hover:text-white" />
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-3 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors border-t border-white/10">
                Lihat Semua Arsip
              </button>
            </div>
          </div>
        </div>
      </div>
    </ShiftGuard>
  );
}
