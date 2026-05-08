import { prisma } from "@/lib/prisma";
import { Users, UserPlus, Mail, Phone, Shield, MoreVertical, Trash2, Edit } from "lucide-react";

export default async function UsersPage() {
  const allUsers = await prisma.users.findMany({
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-1">Pengguna</h2>
          <p className="text-white/60">Kelola akses dan profil pengguna sistem</p>
        </div>
        <button className="btn-primary-glass flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          <span>Tambah User</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allUsers.map((user) => (
          <div key={user.ID} className="glass card-glass p-6 group">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden relative">
                  {user.foto ? (
                    <img src={user.foto} alt={user.nama} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-6 h-6 text-white/40" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-1">
                    <span className="text-[10px] font-bold text-white uppercase">Profile</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user.nama}</h3>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 w-fit mt-1">
                    <Shield className="w-3 h-3 text-[var(--sky)]" />
                    <span className="text-[10px] font-bold text-[var(--sky)] uppercase tracking-wider">{user.role}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-white/70">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                  <Phone className="w-4 h-4" />
                </div>
                <span>{user.no_hp}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-white/10">
              <button className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-sm font-medium transition-all hover:border-white/20">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="w-12 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-400 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {allUsers.length === 0 && (
          <div className="col-span-full glass p-12 text-center">
            <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-medium opacity-60">Belum ada pengguna</h3>
            <p className="text-white/40 mt-2">Daftar pengguna kosong di database.</p>
          </div>
        )}
      </div>
    </div>
  );
}
