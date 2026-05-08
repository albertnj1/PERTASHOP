"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, X, Calendar, Wallet, CheckCircle2, XCircle, Loader2, Info, FileText, ArrowLeft, Banknote } from "lucide-react";
import { addSetoran } from "@/lib/actions/setoran";

interface SetoranClientProps {
  activeShift: any;
}

export default function SetoranClient({ activeShift }: SetoranClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        await addSetoran(formData);
        setNotification({ type: "success", message: "Setoran berhasil disimpan!" });
        setIsOpen(false);
        setTimeout(() => setNotification(null), 3000);
      } catch (error) {
        setNotification({ type: "error", message: "Gagal menyimpan setoran. Periksa kembali input Anda." });
        setTimeout(() => setNotification(null), 3000);
      }
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn-primary-glass flex items-center gap-2 px-6 py-3 grow sm:grow-0 justify-center cursor-pointer min-w-[160px]"
      >
        <Plus className="w-5 h-5" />
        <span className="font-bold">Input Setoran</span>
      </button>

      {notification && (
        <div 
          className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right duration-500 ${
            notification.type === "success" 
              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" 
              : "bg-red-500/20 border-red-500/30 text-red-300"
          }`}
          style={{ backdropFilter: "blur(20px)" }}
        >
          {notification.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {isMounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[150] flex justify-center bg-black/80 backdrop-blur-md overflow-y-auto pt-10 pb-20 px-4 custom-scrollbar">
          
          <div className="relative w-full max-w-lg h-fit bg-[#0a101f] border border-white/10 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in duration-300">
            
            {/* Inner Glow */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

            <form onSubmit={handleSubmit} className="relative p-8 md:p-12 space-y-8 flex flex-col items-center">
              <input type="hidden" name="shift_id" value={activeShift?.id || ""} />
              <input type="hidden" name="metode" value="tunai" />

              {/* Header Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-[0_8px_20px_rgba(16,185,129,0.3)] mb-2">
                <Banknote className="w-10 h-10 text-white" />
              </div>

              {/* Title Section */}
              <div className="text-center space-y-2 mb-4">
                <h2 className="text-3xl font-black tracking-tight text-white m-0">Input Setoran</h2>
                <p className="text-sm opacity-50 font-medium">Catat dana yang disetorkan ke pusat</p>
              </div>

              <div className="w-full space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-white/80 px-1">Tanggal</label>
                  <input 
                    type="date" 
                    name="tanggal" 
                    required 
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#0a101f] border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-white/80 px-1">Jumlah Setoran (Rp)</label>
                  <div className="relative flex items-center">
                     <span className="absolute left-6 text-emerald-400 font-bold text-xl">Rp</span>
                     <input 
                      type="number" 
                      name="jumlah" 
                      placeholder="0"
                      required
                      className="w-full bg-[#0a101f] border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-2xl font-black text-white outline-none focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-white/80 px-1">Keterangan Tambahan</label>
                  <textarea 
                    name="keterangan" 
                    rows={4}
                    placeholder="Tulis catatan jika ada..."
                    className="w-full bg-[#0a101f] border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-emerald-500/50 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Section */}
              <div className="w-full pt-8 space-y-6 flex flex-col items-center">
                <button 
                  type="submit"
                  disabled={isPending}
                  className="w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-black text-xl tracking-wide shadow-[0_12px_24px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.5)] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 border-0 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>MENYIMPAN...</span>
                    </>
                  ) : (
                    <span>SIMPAN SETORAN</span>
                  )}
                </button>
                
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-white/50 hover:text-white font-bold transition-all flex items-center gap-2 border-0 bg-transparent cursor-pointer no-underline"
                  disabled={isPending}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Dashboard</span>
                </button>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
