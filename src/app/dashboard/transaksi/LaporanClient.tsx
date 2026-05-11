"use client";

import { useState, useTransition, useEffect } from "react";
import { 
  Plus, Calendar, CheckCircle2, XCircle, 
  Loader2, Fuel, ChevronDown, ArrowLeft, Layout
} from "lucide-react";
import { createLaporan } from "@/lib/actions/laporan";

interface LaporanClientProps {
  pertashops: any[];
  activeShift: any;
  bbmPrice: number;
  userRole: string;
  lastTotalisator?: number;
}

export default function LaporanClient({ pertashops, activeShift, bbmPrice, userRole, lastTotalisator = 0 }: LaporanClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State for automatic calculations
  const [totalisator, setTotalisator] = useState({ awal: lastTotalisator, akhir: 0 });
  const [pengeluaran, setPengeluaran] = useState({ cashback: 0, biaya: 0 });
  const [dayName, setDayName] = useState("");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    setDayName(days[date.getDay()] || "");
  };

  useEffect(() => {
    const initialDate = new Date();
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    setDayName(days[initialDate.getDay()]);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        // Double check date for Operator in UI
        if (userRole === "Operator") {
          const today = new Date().toISOString().split('T')[0];
          const selectedDate = formData.get("tanggal") as string;
          if (selectedDate !== today) {
            throw new Error("Operator hanya dapat menginput laporan untuk hari ini.");
          }
        }

        await createLaporan(formData);
        setNotification({ type: "success", message: "Laporan harian berhasil disimpan!" });
        setIsOpen(false);
        setTimeout(() => setNotification(null), 3000);
      } catch (error: any) {
        setNotification({ 
          type: "error", 
          message: error.message || "Gagal menyimpan laporan. Cek kembali data Anda." 
        });
        setTimeout(() => setNotification(null), 5000);
      }
    });
  };

  const [testPump, setTestPump] = useState(0);

  return (
    <>
      {/* Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="btn-primary-glass flex items-center gap-2 px-6 py-3 grow sm:grow-0 justify-center cursor-pointer min-w-[160px]"
      >
        <Plus className="w-5 h-5" />
        <span className="font-bold">Buat Laporan</span>
      </button>

      {/* Notification Toast */}
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

      {/* Modal / Centered Card UI */}
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex justify-center bg-black/60 backdrop-blur-xl overflow-y-auto pt-10 pb-20 px-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl h-fit glass card-glass rounded-[40px] border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in duration-500">
            {/* Header Glow */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[var(--sky)]/10 to-transparent pointer-events-none" />

            <form onSubmit={handleSubmit} className="relative p-10 md:p-14 space-y-10 flex flex-col items-center">
              <input type="hidden" name="shift_id" value={activeShift?.id || ""} />
              <input type="hidden" name="harga_bbm" value={bbmPrice} />
              <input type="hidden" name="hari" value={dayName} />

              {/* Header Icon */}
              <div className="w-24 h-24 bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] rounded-[32px] flex items-center justify-center shadow-[0_15px_35px_rgba(0,136,255,0.3)] mb-2 group">
                <Fuel className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-500" />
              </div>

              {/* Title Section */}
              <div className="text-center space-y-3 mb-4">
                <h2 className="text-4xl font-black tracking-tight text-white m-0">Laporan Harian</h2>
                <p className="text-sm text-[var(--text-muted)] font-bold uppercase tracking-widest">Input data totalisator & pengeluaran</p>
              </div>

              {/* Shift ID Badge */}
              <div className="w-full bg-[var(--sky)]/10 border border-[var(--sky)]/20 rounded-[24px] py-5 px-8 text-center">
                <p className="text-[10px] font-black uppercase tracking-[3px] text-[var(--sky)] opacity-80 mb-1">Active Session</p>
                <p className="text-lg font-black text-white m-0">Shift ID: {activeShift?.id || "N/A"}</p>
              </div>

              {/* Form Fields Container */}
              <div className="w-full space-y-10 mt-4">
                
                {/* Pilih Pertashop */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Unit Pertashop</label>
                  <div className="relative">
                    <select 
                      name="pertashop_id" 
                      required 
                      className="input-glass w-full appearance-none pr-14"
                    >
                      <option value="" className="bg-[#0a101f]">-- Pilih Unit --</option>
                      {pertashops.map(p => (
                        <option key={p.id} value={p.id} className="bg-[#0a101f]">{p.nama}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                  </div>
                </div>

                {/* Date & Day Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Tanggal Operasional</label>
                    <input 
                      type="date" 
                      name="tanggal" 
                      required 
                      readOnly={userRole === "Operator"}
                      defaultValue={new Date().toISOString().split('T')[0]}
                      onChange={handleDateChange}
                      className={`input-glass w-full ${userRole === "Operator" ? "opacity-60 grayscale cursor-not-allowed" : ""}`}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Hari</label>
                    <div className="input-glass w-full opacity-60 bg-white/5 font-bold flex items-center">
                      {dayName || "..."}
                    </div>
                  </div>
                </div>

                {/* Kas Kecil */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Kas Kecil (Opsional)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-[var(--text-muted)]">Rp</span>
                    <input 
                      type="number" 
                      name="kas_kecil" 
                      defaultValue="0"
                      className="input-glass w-full pl-14 font-black text-xl"
                    />
                  </div>
                </div>

                {/* Section: Data Totalisator */}
                <div className="pt-6 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                      <Fuel className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h4 className="text-xl font-black m-0">Data Totalisator</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">
                        Angka Awal 
                        {userRole === "Operator" && <span className="text-rose-400 ml-2">(Otomatis/Terkunci)</span>}
                      </label>
                      <input 
                        type="number" 
                        step="0.01"
                        name="totalisator_awal" 
                        required 
                        readOnly={userRole === "Operator"}
                        defaultValue={userRole === "Operator" ? lastTotalisator : undefined}
                        className={`input-glass w-full text-xl font-black focus:scale-[1.02] ${userRole === "Operator" ? "opacity-60 grayscale cursor-not-allowed bg-black/20" : ""}`}
                        onChange={(e) => setTotalisator(prev => ({ ...prev, awal: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Angka Akhir</label>
                      <input 
                        type="number" 
                        step="0.01"
                        name="totalisator_akhir" 
                        required 
                        className="input-glass w-full text-xl font-black focus:scale-[1.02]"
                        onChange={(e) => setTotalisator(prev => ({ ...prev, akhir: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Test Pump (Liter)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      name="test_pump" 
                      defaultValue="0"
                      className="input-glass w-full text-xl font-black focus:scale-[1.02]"
                      onChange={(e) => setTestPump(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Section: Data Pengeluaran */}
                <div className="pt-6 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center">
                      <Layout className="w-5 h-5 text-rose-400" />
                    </div>
                    <h4 className="text-xl font-black m-0">Data Pengeluaran</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Cashback / Diskon</label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-[var(--text-muted)] text-xs">Rp</span>
                        <input 
                          type="number" 
                          name="cashback" 
                          defaultValue="0"
                          className="input-glass w-full pl-14 font-black"
                          onChange={(e) => setPengeluaran(prev => ({ ...prev, cashback: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Biaya Operasional</label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-[var(--text-muted)] text-xs">Rp</span>
                        <input 
                          type="number" 
                          name="biaya_operasional" 
                          defaultValue="0"
                          className="input-glass w-full pl-14 font-black"
                          onChange={(e) => setPengeluaran(prev => ({ ...prev, biaya: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="w-full pt-10 space-y-8 flex flex-col items-center">
                <button 
                  type="submit"
                  disabled={isPending}
                  className="btn-primary-glass w-full py-5 text-xl"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>MENYIMPAN...</span>
                    </>
                  ) : (
                    <span>SIMPAN LAPORAN SEKARANG</span>
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
    </>
  );
}
