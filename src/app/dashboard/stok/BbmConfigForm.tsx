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
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="id" value={config.id} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium opacity-70 px-1">Harga (Rp)</label>
          <input 
            type="number" 
            name="harga" 
            defaultValue={config.harga} 
            className="input-glass"
            placeholder="Contoh: 12500"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium opacity-70 px-1">Stok Saat Ini (L)</label>
          <input 
            type="number" 
            step="0.01"
            name="stok" 
            defaultValue={config.stok} 
            className="input-glass"
            placeholder="Contoh: 1500.5"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium opacity-70 px-1">Kapasitas Tangki (L)</label>
          <input 
            type="number" 
            step="0.01"
            name="kapasitas" 
            defaultValue={config.kapasitas} 
            className="input-glass"
            placeholder="Contoh: 3000"
            required
          />
        </div>
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary-glass w-full flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>Simpan Perubahan</span>
        </button>
      </div>
    </form>
  );
}
