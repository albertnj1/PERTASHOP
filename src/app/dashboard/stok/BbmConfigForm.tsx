"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { updateBbmConfig } from "@/lib/actions/bbm";

interface BbmConfig {
  id: number;
  nama_bbm: string;
  harga: number;
  stok: number;
  kapasitas: number;
}

export default function BbmConfigForm({ config }: { config: BbmConfig }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateBbmConfig(formData);
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
      <input type="hidden" name="id" value={config.id} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Harga (Rp)</label>
          <input 
            type="number" 
            name="harga" 
            defaultValue={config.harga} 
            className="input-glass focus:scale-[1.02]"
            placeholder="Contoh: 12500"
            required
          />
        </div>
        
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Stok Saat Ini (L)</label>
          <input 
            type="number" 
            step="0.01"
            name="stok" 
            defaultValue={config.stok} 
            className="input-glass focus:scale-[1.02]"
            placeholder="Contoh: 1500.5"
            required
          />
        </div>

        <div className="space-y-3 sm:col-span-2">
          <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Kapasitas Tangki (L)</label>
          <input 
            type="number" 
            step="0.01"
            name="kapasitas" 
            defaultValue={config.kapasitas} 
            className="input-glass focus:scale-[1.02]"
            placeholder="Contoh: 3000"
            required
          />
        </div>
      </div>

      <div className="pt-4">
        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary-glass w-full py-4 text-sm flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>Simpan Konfigurasi</span>
        </button>
      </div>
    </form>
  );
}
