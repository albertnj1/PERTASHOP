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
          <h2 className="text-2xl font-bold mb-1 text-white">Data Tersimpan</h2>
          <p className="text-white/60">Tinjau dan audit laporan harian yang sudah masuk</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Date Picker Section */}
        <div className="glass card-glass p-8">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[var(--sky)]" />
            Pilih Periode Peninjauan
          </h3>
          
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 space-y-2 w-full">
              <label className="text-xs font-bold uppercase tracking-widest opacity-40 px-1">Mulai Tanggal</label>
              <input 
                type="date" 
                className="input-glass w-full" 
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              />
            </div>
            <div className="flex-1 space-y-2 w-full">
              <label className="text-xs font-bold uppercase tracking-widest opacity-40 px-1">Hingga Tanggal</label>
              <input 
                type="date" 
                className="input-glass w-full" 
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary-glass px-10 py-4 text-lg flex items-center justify-center gap-3 w-full md:w-auto"
            >
              {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : "Tampilkan Data"}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {reportData && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 bg-emerald-500/5 border-emerald-500/10">
                <p className="text-[10px] uppercase font-bold opacity-40 mb-1">Total Omzet (Kotor)</p>
                <h3 className="text-2xl font-black text-white">Rp {reportData.summary.totalGross.toLocaleString()}</h3>
              </div>
              <div className="glass p-6 bg-red-500/5 border-red-500/10">
                <p className="text-[10px] uppercase font-bold opacity-40 mb-1">Total Biaya/Diskon</p>
                <h3 className="text-2xl font-black text-white">Rp {reportData.summary.totalExpense.toLocaleString()}</h3>
              </div>
              <div className="glass p-6 bg-[var(--sky)]/5 border-[var(--sky)]/10">
                <p className="text-[10px] uppercase font-bold opacity-40 mb-1">Net Profit (Saldo Bersih)</p>
                <h3 className="text-2xl font-black text-emerald-400">Rp {reportData.summary.totalNet.toLocaleString()}</h3>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="glass overflow-hidden">
              <div className="p-6 border-b border-white/10 bg-white/5">
                <h4 className="font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[var(--sky)]" />
                  Detail Laporan Harian
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-white/40">Tanggal</th>
                      <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-white/40">Hari</th>
                      <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-white/40 text-right">Omzet</th>
                      <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-white/40 text-right">Biaya</th>
                      <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-white/40 text-right">Saldo Bersih</th>
                      <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-white/40 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reportData.laporan.map((l: any) => (
                      <tr key={l.id} className="hover:bg-white/[0.02] transition-colors group cursor-default">
                        <td className="px-6 py-4 font-bold text-white">
                          {new Date(l.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-white/60 capitalize">{l.hari}</td>
                        <td className="px-6 py-4 text-right font-medium text-white">Rp {l.total_penjualan.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-red-400">Rp {l.total_pengeluaran.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-400">Rp {l.saldo_bersih.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                            Saved
                          </span>
                        </td>
                      </tr>
                    ))}
                    {reportData.laporan.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center text-white/30 italic">
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

