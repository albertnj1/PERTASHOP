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

      {isOpen && (
        <div className="fixed inset-0 z-[150] flex justify-center bg-black/60 backdrop-blur-xl overflow-y-auto pt-10 pb-20 px-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg h-fit glass card-glass rounded-[40px] border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in duration-500">
            {/* Header Glow */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

            <form onSubmit={handleSubmit} className="relative p-10 md:p-14 space-y-10 flex flex-col items-center">
              <input type="hidden" name="shift_id" value={activeShift?.id || ""} />
              <input type="hidden" name="metode" value="tunai" />

              {/* Header Icon */}
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[32px] flex items-center justify-center shadow-[0_15px_35px_rgba(16,185,129,0.3)] mb-2 group">
                <Banknote className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-500" />
              </div>

              {/* Title Section */}
              <div className="text-center space-y-3 mb-4">
                <h2 className="text-4xl font-black tracking-tight text-white m-0">Input Setoran</h2>
                <p className="text-sm text-[var(--text-muted)] font-bold uppercase tracking-widest">Catat dana setoran ke pusat</p>
              </div>

              <div className="w-full space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Tanggal</label>
                  <input 
                    type="date" 
                    name="tanggal" 
                    required 
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="input-glass w-full focus:scale-[1.02]"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Jumlah Setoran</label>
                  <div className="relative flex items-center">
                     <span className="absolute left-6 text-emerald-400 font-bold text-xl">Rp</span>
                     <input 
                      type="number" 
                      name="jumlah" 
                      placeholder="0"
                      required
                      className="input-glass w-full py-6 pl-16 pr-6 text-2xl font-black focus:scale-[1.02]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Keterangan Tambahan</label>
                  <textarea 
                    name="keterangan" 
                    rows={4}
                    placeholder="Tulis catatan jika ada..."
                    className="input-glass w-full py-5 px-6 resize-none focus:scale-[1.02]"
                  />
                </div>
              </div>

              {/* Submit Section */}
              <div className="w-full pt-10 space-y-8 flex flex-col items-center">
                <button 
                  type="submit"
                  disabled={isPending}
                  className="btn-primary-glass w-full py-5 text-xl bg-emerald-500 shadow-emerald-500/20"
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
                  className="text-[var(--text-muted)] hover:text-white font-bold transition-all flex items-center gap-2 border-0 bg-transparent cursor-pointer no-underline group"
                  disabled={isPending}
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Kembali ke Dashboard</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
      )}
    </>
  );
}
