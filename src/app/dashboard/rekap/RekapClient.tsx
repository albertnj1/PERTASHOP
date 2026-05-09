"use client";

import { useState } from "react";
import { 
  Printer, Calendar, Download, FileSpreadsheet, 
  FileText, Loader2, CheckCircle2, AlertCircle 
} from "lucide-react";
import { getRekapData } from "@/lib/actions/rekap";

export default function RekapClient() {
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const data = await getRekapData(dateRange.from, dateRange.to);
      setReportData(data);
    } catch (err) {
      setError("Gagal mengambil data. Periksa koneksi atau rentang tanggal.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1">Data Tersimpan</h2>
          <p className="text-[var(--text-muted)] font-medium">Tinjau dan audit laporan harian yang sudah masuk</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Date Picker Section */}
        <div className="glass card-glass p-8">
          <h3 className="text-xl font-extrabold mb-8 flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[var(--sky)]/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[var(--sky)]" />
            </div>
            Pilih Periode Peninjauan
          </h3>
          
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 space-y-3 w-full">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Mulai Tanggal</label>
              <input 
                type="date" 
                className="input-glass w-full focus:scale-[1.01]" 
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              />
            </div>
            <div className="flex-1 space-y-3 w-full">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Hingga Tanggal</label>
              <input 
                type="date" 
                className="input-glass w-full focus:scale-[1.01]" 
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary-glass px-10 py-4 h-[58px] flex items-center justify-center gap-3 w-full md:w-auto"
            >
              {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : "Tampilkan Data"}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-3 animate-in shake duration-300">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {reportData && (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass card-glass p-7 border-emerald-500/10 bg-emerald-500/5">
                <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400/60 mb-2">Total Omzet (Kotor)</p>
                <h3 className="text-3xl font-black">Rp {reportData.summary.totalGross.toLocaleString()}</h3>
              </div>
              <div className="glass card-glass p-7 border-red-500/10 bg-red-500/5">
                <p className="text-[10px] uppercase font-black tracking-widest text-red-400/60 mb-2">Total Biaya/Diskon</p>
                <h3 className="text-3xl font-black">Rp {reportData.summary.totalExpense.toLocaleString()}</h3>
              </div>
              <div className="glass card-glass p-7 border-[var(--sky)]/10 bg-[var(--sky)]/5 shadow-[0_0_30px_rgba(0,209,255,0.05)]">
                <p className="text-[10px] uppercase font-black tracking-widest text-[var(--sky)]/60 mb-2">Net Profit (Saldo Bersih)</p>
                <h3 className="text-3xl font-black text-emerald-400">Rp {reportData.summary.totalNet.toLocaleString()}</h3>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="glass border-white/5 overflow-hidden">
              <div className="p-7 border-b border-white/5 flex items-center justify-between">
                <h4 className="text-lg font-extrabold flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--sky)]/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[var(--sky)]" />
                  </div>
                  Detail Laporan Harian
                </h4>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                    <Printer className="w-4.5 h-4.5 text-[var(--text-muted)]" />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                    <Download className="w-4.5 h-4.5 text-[var(--text-muted)]" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02]">
                      <th className="px-7 py-5 text-[10px] uppercase font-black tracking-[2px] text-[var(--text-muted)]">Tanggal</th>
                      <th className="px-7 py-5 text-[10px] uppercase font-black tracking-[2px] text-[var(--text-muted)]">Hari</th>
                      <th className="px-7 py-5 text-[10px] uppercase font-black tracking-[2px] text-[var(--text-muted)] text-right">Omzet</th>
                      <th className="px-7 py-5 text-[10px] uppercase font-black tracking-[2px] text-[var(--text-muted)] text-right">Biaya</th>
                      <th className="px-7 py-5 text-[10px] uppercase font-black tracking-[2px] text-[var(--text-muted)] text-right">Saldo Bersih</th>
                      <th className="px-7 py-5 text-[10px] uppercase font-black tracking-[2px] text-[var(--text-muted)] text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reportData.laporan.map((l: any) => (
                      <tr key={l.id} className="hover:bg-white/[0.02] transition-colors group cursor-default">
                        <td className="px-7 py-5 font-bold">
                          {new Date(l.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </td>
                        <td className="px-7 py-5 text-[var(--text-muted)] font-bold capitalize">{l.hari}</td>
                        <td className="px-7 py-5 text-right font-bold">Rp {l.total_penjualan.toLocaleString()}</td>
                        <td className="px-7 py-5 text-right text-red-400 font-bold">Rp {l.total_pengeluaran.toLocaleString()}</td>
                        <td className="px-7 py-5 text-right font-black text-emerald-400">Rp {l.saldo_bersih.toLocaleString()}</td>
                        <td className="px-7 py-5 text-center">
                          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                    {reportData.laporan.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-7 py-20 text-center text-[var(--text-muted)] font-bold italic text-base">
                          Tidak ada data laporan pada periode ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

