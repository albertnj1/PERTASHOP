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
}

export default function LaporanClient({ pertashops, activeShift, bbmPrice, userRole }: LaporanClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State for automatic calculations
  const [totalisator, setTotalisator] = useState({ awal: 0, akhir: 0 });
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

      {/* Modal / Centered Card UI - Removed createPortal */}
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex justify-center bg-black/80 backdrop-blur-md overflow-y-auto pt-10 pb-20 px-4">
          
          <div className="relative w-full max-w-2xl h-fit bg-[#0a101f] border border-white/10 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in duration-300">
            
            {/* Inner Glow / Header Image Area */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#3b82f6]/10 to-transparent pointer-events-none" />

            <form onSubmit={handleSubmit} className="relative p-8 md:p-12 space-y-8 flex flex-col items-center">
              <input type="hidden" name="shift_id" value={activeShift?.id || ""} />
              <input type="hidden" name="harga_bbm" value={bbmPrice} />
              <input type="hidden" name="hari" value={dayName} />

              {/* Header Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-[#4facfe] to-[#00f2fe] rounded-[1.5rem] flex items-center justify-center shadow-[0_8px_20px_rgba(0,242,254,0.3)] mb-2">
                <Layout className="w-10 h-10 text-white" />
              </div>

              {/* Title Section */}
              <div className="text-center space-y-2 mb-4">
                <h2 className="text-3xl font-black tracking-tight text-white m-0">Laporan Harian</h2>
                <p className="text-sm opacity-50 font-medium">Input data totalisator dan pengeluaran harian</p>
              </div>

              {/* Shift ID Badge */}
              <div className="w-full bg-[#162a4a]/40 border border-[#3b82f6]/20 rounded-2xl py-4 px-6 text-center text-[#93c5fd] font-bold text-sm tracking-wide">
                Memasukkan Laporan untuk <span className="text-white">Shift ID: {activeShift?.id || "N/A"}</span>
              </div>

              {/* Form Fields Container */}
              <div className="w-full space-y-8 mt-4">
                
                {/* Pilih Pertashop */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-white/80 px-1">Pilih Pertashop</label>
                  <div className="relative">
                    <select 
                      name="pertashop_id" 
                      required 
                      className="w-full bg-[#0a101f] border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#4facfe]/50 focus:ring-4 focus:ring-[#4facfe]/10 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">-- Pilih --</option>
                      {pertashops.map(p => (
                        <option key={p.id} value={p.id}>{p.nama}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 pointer-events-none" />
                  </div>
                </div>

                {/* Date & Day Grid */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-white/80 px-1">Tanggal</label>
                    <input 
                      type="date" 
                      name="tanggal" 
                      required 
                      readOnly={userRole === "Operator"}
                      defaultValue={new Date().toISOString().split('T')[0]}
                      onChange={handleDateChange}
                      className={`w-full bg-[#0a101f] border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#4facfe]/50 focus:ring-4 focus:ring-[#4facfe]/10 transition-all ${userRole === "Operator" ? "opacity-60 cursor-not-allowed" : ""}`}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-white/80 px-1">Hari</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={dayName}
                      placeholder="Contoh: Senin"
                      className="w-full bg-[#0a101f] border border-white/10 rounded-2xl py-4 px-6 text-white/50 outline-none"
                    />
                  </div>
                </div>

                {/* Kas Kecil */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-white/80 px-1">Kas Kecil (Opsional)</label>
                  <input 
                    type="number" 
                    name="kas_kecil" 
                    defaultValue="0"
                    className="w-full bg-[#0a101f] border border-white/10 rounded-2xl py-4 px-6 text-xl font-bold text-white outline-none focus:border-[#4facfe]/50 transition-all"
                  />
                </div>

                {/* Section: Data Totalisator */}
                <div className="pt-4 space-y-6">
                  <h4 className="text-lg font-bold text-white flex items-center gap-3">
                    <span className="text-xl">⛽</span> Data Totalisator
                  </h4>
                  <div className="h-px bg-white/10 w-full" />
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-40 px-1">Angka Awal</label>
                      <input 
                        type="number" 
                        step="0.01"
                        name="totalisator_awal" 
                        required 
                        className="w-full bg-[#0a101f] border border-white/10 rounded-2xl py-4 px-6 text-xl font-bold text-white outline-none focus:border-[#4facfe]/50 transition-all"
                        onChange={(e) => setTotalisator(prev => ({ ...prev, awal: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-40 px-1">Angka Akhir</label>
                      <input 
                        type="number" 
                        step="0.01"
                        name="totalisator_akhir" 
                        required 
                        className="w-full bg-[#0a101f] border border-white/10 rounded-2xl py-4 px-6 text-xl font-bold text-white outline-none focus:border-[#4facfe]/50 transition-all"
                        onChange={(e) => setTotalisator(prev => ({ ...prev, akhir: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-40 px-1">Test Pump (Liter)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        name="test_pump" 
                        defaultValue="0"
                        className="w-full bg-[#0a101f] border border-white/10 rounded-2xl py-4 px-6 text-xl font-bold text-white outline-none focus:border-[#4facfe]/50 transition-all"
                        onChange={(e) => setTestPump(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-white/80 px-1">Harga BBM Saat Ini (ReadOnly)</label>
                    <div className="w-full bg-[#0a101f] border border-white/10 rounded-2xl py-4 px-6 text-lg font-bold text-white/50">
                      Rp {bbmPrice.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Section: Data Pengeluaran */}
                <div className="pt-4 space-y-6">
                  <h4 className="text-lg font-bold text-white flex items-center gap-3">
                    <span className="text-xl">💸</span> Data Pengeluaran
                  </h4>
                  <div className="h-px bg-white/10 w-full" />

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-white/80 px-1">Cashback / Diskon (Opsional)</label>
                    <input 
                      type="number" 
                      name="cashback" 
                      defaultValue="0"
                      className="w-full bg-[#0a101f] border border-white/10 rounded-2xl py-4 px-6 text-xl font-bold text-white outline-none focus:border-[#4facfe]/50 transition-all"
                      onChange={(e) => setPengeluaran(prev => ({ ...prev, cashback: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-white/80 px-1">Biaya Operasional (Opsional)</label>
                    <input 
                      type="number" 
                      name="biaya_operasional" 
                      defaultValue="0"
                      className="w-full bg-[#0a101f] border border-white/10 rounded-2xl py-4 px-6 text-xl font-bold text-white outline-none focus:border-[#4facfe]/50 transition-all"
                      onChange={(e) => setPengeluaran(prev => ({ ...prev, biaya: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="w-full pt-8 space-y-6 flex flex-col items-center">
                <button 
                  type="submit"
                  disabled={isPending}
                  className="w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white font-black text-xl tracking-wide shadow-[0_12px_24px_rgba(79,172,254,0.3)] hover:shadow-[0_15px_30px_rgba(79,172,254,0.5)] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 border-0 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>MENYIMPAN...</span>
                    </>
                  ) : (
                    <span>SIMPAN LAPORAN</span>
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
        </div>
      )}
    </>
  );
}
