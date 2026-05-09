"use client";

import { Users, Mail, Phone, Shield, Trash2, Edit, Power, CheckCircle, XCircle } from "lucide-react";
import { toggleUserStatus, deleteUser } from "@/lib/actions/users";
import { useTransition } from "react";

interface User {
  ID: number;
  nama: string;
  email: string;
  role: string;
  no_hp: string;
  foto: string | null;
  is_active: boolean;
}

export default function UserList({ 
  users, 
  currentUserRole 
}: { 
  users: User[], 
  currentUserRole: string 
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    if (confirm("Apakah Anda yakin ingin mengubah status aktif pengguna ini?")) {
      startTransition(async () => {
        await toggleUserStatus(id, currentStatus);
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      startTransition(async () => {
        await deleteUser(id);
      });
    }
  };

  // Filter logic: 
  // Admin only manages Operators
  // Super Admin manages everyone
  const visibleUsers = users.filter(user => {
    if (currentUserRole === "Super Admin") return true;
    if (currentUserRole === "Admin") return user.role === "Operator";
    return false;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {visibleUsers.map((user) => (
        <div key={user.ID} className={`glass card-glass p-7 group transition-all duration-300 ${!user.is_active ? 'opacity-50 grayscale-[0.5]' : ''}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden relative shadow-inner">
                {user.foto ? (
                  <img src={user.foto} alt={user.nama} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-7 h-7 text-[var(--text-muted)]" />
                )}
                {!user.is_active && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-500" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-xl flex items-center gap-2.5">
                  {user.nama}
                  {!user.is_active && <span className="text-[9px] font-black bg-red-500/20 text-red-400 px-2.5 py-1 rounded-full uppercase tracking-widest">Off</span>}
                </h3>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--sky)]/10 border border-[var(--sky)]/20 w-fit mt-1.5">
                  <Shield className="w-3.5 h-3.5 text-[var(--sky)]" />
                  <span className="text-[10px] font-black text-[var(--sky)] uppercase tracking-widest">{user.role}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handleToggleStatus(user.ID, user.is_active)}
              disabled={isPending}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 border ${
                user.is_active 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" 
                  : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
              }`}
              title={user.is_active ? "Nonaktifkan User" : "Aktifkan User"}
            >
              <Power className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-7">
            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] font-medium">
              <div className="w-9 h-9 rounded-[14px] bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] font-medium">
              <div className="w-9 h-9 rounded-[14px] bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                <Phone className="w-4.5 h-4.5" />
              </div>
              <span>{user.no_hp}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-white/5">
            <button className="flex-1 h-12 rounded-[18px] bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center gap-2.5 text-[13px] font-bold transition-all hover:border-white/15">
              <Edit className="w-4.5 h-4.5" />
              <span>Edit Profil</span>
            </button>
            <button 
              onClick={() => handleDelete(user.ID)}
              disabled={isPending}
              className="w-14 h-12 rounded-[18px] bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 flex items-center justify-center text-red-400 transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}

      {visibleUsers.length === 0 && (
        <div className="col-span-full glass p-12 text-center">
          <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-medium opacity-60">Belum ada pengguna</h3>
          <p className="text-white/40 mt-2">Daftar pengguna kosong atau Anda tidak memiliki akses.</p>
        </div>
      )}
    </div>
  );
}
