import { prisma } from "@/lib/prisma";
import { Settings, Fuel } from "lucide-react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import BbmConfigForm from "./BbmConfigForm";

export default async function BbmPage() {
  const session = await getSession();
  const allowedRoles = ["Super Admin", "Admin"];
  if (!session?.user?.role || !allowedRoles.includes(session.user.role)) {
    redirect("/dashboard");
  }
  const configs = await prisma.bbm_config.findMany();

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 flex items-center gap-4">
            <div className="w-12 h-12 rounded-[20px] bg-[var(--sky)]/20 flex items-center justify-center">
              <Settings className="w-6 h-6 text-[var(--sky)]" />
            </div>
            Konfigurasi BBM
          </h2>
          <p className="text-[var(--text-muted)] font-medium">Kelola harga pasar dan stok operasional bahan bakar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {configs.map((config) => (
          <div key={config.id} className="glass card-glass p-8 rounded-[32px] border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--sky)]/10 to-transparent blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            
            <div className="flex items-center gap-5 mb-8 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] rounded-[20px] flex items-center justify-center shadow-[0_10px_20px_rgba(0,136,255,0.2)]">
                <Fuel className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black">{config.nama_bbm}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                  Update: {config.updated_at?.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <BbmConfigForm config={JSON.parse(JSON.stringify(config))} />
          </div>
        ))}

        {configs.length === 0 && (
          <div className="col-span-full glass card-glass p-20 text-center rounded-[32px]">
            <div className="w-20 h-20 rounded-[28px] bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Settings className="w-10 h-10 text-[var(--text-muted)] opacity-20" />
            </div>
            <h3 className="text-xl font-extrabold text-[var(--text-muted)]">Belum ada konfigurasi BBM</h3>
            <p className="text-[var(--text-muted)] font-medium mt-2">Silakan tambahkan data bbm_config di database untuk mulai mengelola.</p>
          </div>
        )}
      </div>
    </div>
  );
}
