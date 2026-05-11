"use client";

import { useState, useTransition } from "react";
import { Trash2, RotateCcw, X, Info, AlertCircle, Loader2 } from "lucide-react";
import { restoreSetoran, permanentDeleteSetoran } from "@/lib/actions/setoran";
import { createPortal } from "react-dom";

export default function TrashModal({ deletedItems }: { deletedItems: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleRestore = async (id: number) => {
    startTransition(async () => {
      await restoreSetoran(id);
    });
  };

  const handlePermanentDelete = async (id: number) => {
    if (confirm("Hapus permanen? Data tidak akan bisa dikembalikan lagi.")) {
      startTransition(async () => {
        await permanentDeleteSetoran(id);
      });
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="glass px-6 py-3 flex items-center gap-3 hover:bg-red-500/10 border-red-500/20 text-red-400 transition-all relative group"
      >
        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="font-bold">Tong Sampah</span>
        {deletedItems.length > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#0a101f] animate-pulse">
            {deletedItems.length}
          </span>
        )}
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="w-full max-w-3xl bg-[#0a101f] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(239,68,68,0.15)] overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-red-500/10 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-400">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Tong Sampah Setoran</h3>
                  <p className="text-sm text-white/40">Data yang dihapus sementara tersimpan di sini</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border-0 cursor-pointer"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto p-2 custom-scrollbar w-full">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-white/40">Tanggal</th>
                    <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-white/40">Keterangan</th>
                    <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-white/40 text-right">Jumlah</th>
                    <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-white/40 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {deletedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-white/80">
                          {new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-white/40">{item.keterangan || "-"}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-black text-white">Rp {item.jumlah.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleRestore(item.id)}
                            disabled={isPending}
                            className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all cursor-pointer"
                            title="Pulihkan Data"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handlePermanentDelete(item.id)}
                            disabled={isPending}
                            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all cursor-pointer"
                            title="Hapus Permanen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {deletedItems.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-20">
                          <Info className="w-12 h-12" />
                          <p className="font-bold tracking-tight">Tong sampah kosong</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-8 bg-white/5 flex items-center gap-4">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-xs text-white/40 leading-relaxed">
                <b>Catatan:</b> Data di tong sampah tidak dihitung dalam total akumulasi saldo. Pulihkan data jika ingin memasukkannya kembali ke laporan.
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
