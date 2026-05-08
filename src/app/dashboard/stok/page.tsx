import { prisma } from "@/lib/prisma";
import { Settings, Fuel, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import BbmConfigForm from "./BbmConfigForm";

export default async function BbmPage() {
  const configs = await prisma.bbm_config.findMany();

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-1">Atur BBM</h2>
          <p className="text-white/60">Kelola harga dan stok bahan bakar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {configs.map((config) => (
          <div key={config.id} className="glass card-glass p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] rounded-xl flex items-center justify-center shadow-lg">
                <Fuel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{config.nama_bbm}</h3>
                <p className="text-xs opacity-60">ID: {config.id} • Terakhir diubah: {config.updated_at?.toLocaleDateString()}</p>
              </div>
            </div>

            <BbmConfigForm config={JSON.parse(JSON.stringify(config))} />
          </div>
        ))}

        {configs.length === 0 && (
          <div className="col-span-full glass p-12 text-center">
            <Settings className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-medium opacity-60">Belum ada konfigurasi BBM</h3>
            <p className="text-white/40 mt-2">Data bbm_config kosong di database.</p>
          </div>
        )}
      </div>
    </div>
  );
}
