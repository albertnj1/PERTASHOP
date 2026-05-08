import { prisma } from "@/lib/prisma";
import { Wallet, Calendar, Search } from "lucide-react";
import ShiftGuard from "@/components/ShiftGuard";
import SetoranClient from "./SetoranClient";
import TrashModal from "./TrashModal";
import DeleteSetoranButton from "./DeleteSetoranButton";

export default async function SetoranPage() {
  const [allSetorans, activeShift] = await Promise.all([
    prisma.setoran.findMany({
      orderBy: { tanggal: 'desc' },
    }),
    prisma.shifts.findFirst({ where: { status: 'open' } })
  ]);

  const activeSetorans = allSetorans.filter(s => !s.deleted_at);
  const deletedSetorans = allSetorans.filter(s => s.deleted_at);

  const totalSetoran = activeSetorans.reduce((acc, curr) => acc + (curr.jumlah || 0), 0);

  return (
    <ShiftGuard 
      title="Input Setoran" 
      subtitle="Catatan penyetoran hasil penjualan"
      icon="setoran"
    >
      <div className="animate-in fade-in duration-500">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1 text-white">Setoran</h2>
            <p className="text-white/60">Catatan penyetoran hasil penjualan</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="glass px-6 py-3 flex items-center gap-4 bg-emerald-500/10 border-emerald-500/20">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider opacity-60 m-0">Total Penyetoran</p>
                <h4 className="text-lg font-bold text-emerald-400 m-0">Rp {totalSetoran.toLocaleString()}</h4>
              </div>
            </div>
            
            <TrashModal deletedItems={JSON.parse(JSON.stringify(deletedSetorans))} />
            <SetoranClient activeShift={activeShift} />
          </div>
        </div>

        <div className="glass overflow-hidden border-white/10 shadow-2xl">
          <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5 text-[var(--sky)]" />
              Riwayat Setoran
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                type="text" 
                placeholder="Cari tanggal..." 
                className="bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-sm outline-none focus:border-[var(--sky)]/50 transition-all w-48 text-white"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40">Tanggal</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40">Keterangan</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40">Metode</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40 text-right">Jumlah Setoran</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeSetorans.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-medium text-white">{s.tanggal?.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white/60 line-clamp-1">{s.keterangan || "-"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${s.metode === 'tf' ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'}`}></div>
                        <span className="capitalize text-sm font-semibold text-white">{s.metode === 'tf' ? 'Transfer Bank' : 'Tunai'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-white tracking-tight">Rp {s.jumlah?.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <DeleteSetoranButton id={s.id} />
                      </div>
                    </td>
                  </tr>
                ))}
                
                {activeSetorans.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/30 italic">
                      Belum ada data setoran yang tercatat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ShiftGuard>
  );
}
