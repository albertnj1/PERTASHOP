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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {visibleUsers.map((user) => (
        <div 
          key={user.ID} 
          className={`glass card-glass p-8 group transition-all duration-700 ${!user.is_active ? 'opacity-50 grayscale-[0.3]' : ''}`}
        >
          <div className="flex flex-col items-center text-center">
            {/* Profile Avatar with Liquid Style */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-[36px] bg-white/20 flex items-center justify-center border border-white/40 overflow-hidden relative shadow-xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                {user.foto ? (
                  <img src={user.foto} alt={user.nama} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-10 h-10 text-[var(--sky)]" />
                )}
              </div>
              {/* Status Indicator (Liquid Button Style) */}
              <button 
                onClick={() => handleToggleStatus(user.ID, user.is_active)}
                disabled={isPending}
                className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 border-white shadow-xl ${
                  user.is_active 
                    ? "bg-emerald-400 text-white shadow-emerald-400/30" 
                    : "bg-rose-400 text-white shadow-rose-400/30"
                }`}
              >
                <Power className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* User Info */}
            <div className="mb-6 w-full">
              <h3 className="font-black text-2xl mb-2 tracking-tighter text-[var(--text-main)]">
                {user.nama}
              </h3>
              
              {/* Role Badge (Liquid Pill) */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 border border-white/60 shadow-sm">
                <Shield className="w-3.5 h-3.5 text-[var(--sky)]" />
                <span className="text-[9px] font-black text-[var(--sky)] uppercase tracking-[3px]">{user.role}</span>
              </div>
            </div>

            {/* Contact Details with Soft Icons */}
            <div className="w-full space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 rounded-[22px] bg-white/30 border border-white/40 transition-all hover:bg-white/50 group/item">
                <div className="w-10 h-10 rounded-[14px] bg-[var(--sky)]/10 flex items-center justify-center text-[var(--sky)] shadow-inner">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[var(--text-main)]/70 truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-[22px] bg-white/30 border border-white/40 transition-all hover:bg-white/50 group/item">
                <div className="w-10 h-10 rounded-[14px] bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shadow-inner">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[var(--text-main)]/70">{user.no_hp}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 w-full">
              <button className="flex-1 h-14 rounded-[22px] bg-white/5 hover:bg-white/15 border border-white/5 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95">
                <Edit className="w-4.5 h-4.5" />
                <span>Edit Profil</span>
              </button>
              <button 
                onClick={() => handleDelete(user.ID)}
                disabled={isPending}
                className="w-16 h-14 rounded-[22px] bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/10 flex items-center justify-center text-rose-400 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {visibleUsers.length === 0 && (
        <div className="col-span-full glass card-glass p-20 text-center animate-pulse">
          <Users className="w-16 h-16 text-white/10 mx-auto mb-6" />
          <h3 className="text-2xl font-black opacity-40 uppercase tracking-[4px]">Belum ada pengguna</h3>
        </div>
      )}
    </div>
  );
}
