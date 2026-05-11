"use client";

import { Users, Mail, Phone, Shield, Trash2, Edit, Power, MapPin, GraduationCap, Calendar } from "lucide-react";
import { toggleUserStatus, deleteUser, addUser, updateUser } from "@/lib/actions/users";
import { useTransition, useState } from "react";

interface User {
  ID: number;
  nama: string;
  email: string;
  role: string;
  no_hp: string;
  foto: string | null;
  is_active: boolean;
  nama_panggilan?: string | null;
  pendidikan_terakhir?: string | null;
  tanggal_lahir?: Date | null;
  alamat?: string | null;
}

export default function UserList({ 
  users, 
  currentUserRole 
}: { 
  users: User[], 
  currentUserRole: string 
}) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'aktif' | 'draft'>('aktif');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        if (editingUser) {
          formData.append("id", editingUser.ID.toString());
          await updateUser(formData);
        } else {
          await addUser(formData);
        }
        setIsModalOpen(false);
      } catch (error) {
        alert("Gagal menyimpan data pengguna.");
      }
    });
  };

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    if (confirm("Apakah Anda yakin ingin mengubah status aktif pengguna ini?")) {
      startTransition(async () => {
        await toggleUserStatus(id, currentStatus);
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini secara permanen?")) {
      startTransition(async () => {
        await deleteUser(id);
      });
    }
  };

  // Filter logic based on hierarchy
  const visibleUsers = users.filter(user => {
    // 1. Filter by Active / Draft Tab
    if (activeTab === 'aktif' && !user.is_active) return false;
    if (activeTab === 'draft' && user.is_active) return false;

    // 2. Filter by Role Hierarchy
    if (currentUserRole === "Super Admin") return true;
    if (currentUserRole === "Admin" || currentUserRole === "Investor") {
      return user.role === "Operator";
    }
    return false; // Operators see no one
  });

  const canEdit = currentUserRole === "Super Admin" || currentUserRole === "Admin";

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex gap-4 p-2 glass card-glass w-fit rounded-full mx-auto sm:mx-0">
        <button 
          onClick={() => setActiveTab('aktif')}
          className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'aktif' 
              ? 'bg-[var(--sky)] text-white shadow-lg shadow-[var(--sky)]/30 scale-105' 
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5'
          }`}
        >
          Pengguna Aktif
        </button>
        <button 
          onClick={() => setActiveTab('draft')}
          className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'draft' 
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105' 
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5'
          }`}
        >
          Draft Nonaktif
        </button>
      </div>

      {canEdit && (
        <div className="flex justify-start sm:justify-end -mt-4 mb-4">
          <button onClick={handleOpenAdd} className="btn-primary-glass flex items-center gap-2 text-sm px-6 py-3">
            <UserPlus className="w-4 h-4" />
            <span>Tambah User</span>
          </button>
        </div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleUsers.map((user) => (
          <div 
            key={user.ID} 
            className={`glass card-glass group transition-all duration-700 ${!user.is_active ? 'opacity-70 grayscale-[0.5] border-rose-500/20' : ''}`}
          >
            <div className="flex flex-col items-center text-center">
              {/* Profile Avatar with Liquid Style */}
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-[28px] bg-white/20 flex items-center justify-center border border-white/40 overflow-hidden relative shadow-xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                  {user.foto ? (
                    <img src={user.foto} alt={user.nama} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-10 h-10 text-[var(--sky)]" />
                  )}
                </div>
                {/* Status Indicator (Liquid Button Style) */}
                {canEdit && (
                  <button 
                    onClick={() => handleToggleStatus(user.ID, user.is_active)}
                    disabled={isPending}
                    className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-[4px] border-[var(--bg-color)] shadow-xl ${
                      user.is_active 
                        ? "bg-emerald-400 text-white shadow-emerald-400/30 hover:bg-rose-400" 
                        : "bg-rose-400 text-white shadow-rose-400/30 hover:bg-emerald-400"
                    }`}
                    title={user.is_active ? "Nonaktifkan Pengguna" : "Aktifkan Pengguna"}
                  >
                    <Power className="w-4.5 h-4.5" />
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="mb-6 w-full">
                <h3 className="font-black text-2xl mb-1 tracking-tighter text-[var(--text-main)]">
                  {user.nama}
                </h3>
                {user.nama_panggilan && (
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">
                    "{user.nama_panggilan}"
                  </p>
                )}
                
                {/* Role Badge (Liquid Pill) */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 border border-white/60 shadow-sm mt-2">
                  <Shield className="w-3.5 h-3.5 text-[var(--sky)]" />
                  <span className="text-[9px] font-black text-[var(--sky)] uppercase tracking-[3px]">{user.role}</span>
                </div>
              </div>

              {/* Contact Details with Soft Icons */}
              <div className="w-full space-y-2 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/30 border border-white/40 transition-all hover:bg-white/50 group/item">
                  <div className="w-8 h-8 rounded-xl bg-[var(--sky)]/10 flex items-center justify-center text-[var(--sky)] shadow-inner shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[var(--text-main)]/70 truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/30 border border-white/40 transition-all hover:bg-white/50 group/item">
                  <div className="w-8 h-8 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shadow-inner shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[var(--text-main)]/70">{user.no_hp}</span>
                </div>
                
                {/* Extended Profile Info (If Available) */}
                {user.alamat && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/30 border border-white/40 transition-all hover:bg-white/50 group/item">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-[var(--text-main)]/70 truncate text-left">{user.alamat}</span>
                  </div>
                )}
                {user.pendidikan_terakhir && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/30 border border-white/40 transition-all hover:bg-white/50 group/item">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-inner shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-[var(--text-main)]/70 truncate text-left">{user.pendidikan_terakhir}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              {canEdit && (
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => handleOpenEdit(user)}
                    className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/15 border border-white/5 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profil</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(user.ID)}
                    disabled={isPending}
                    className="w-14 h-12 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/10 flex items-center justify-center text-rose-400 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {visibleUsers.length === 0 && (
          <div className="col-span-full glass card-glass p-12 text-center animate-pulse">
            <Users className="w-12 h-12 text-[var(--text-muted)]/30 mx-auto mb-4" />
            <h3 className="text-xl font-black opacity-40 uppercase tracking-[4px] text-[var(--text-main)]">
              Tidak ada data {activeTab === 'draft' ? 'draft' : 'pengguna'}
            </h3>
          </div>
        )}
      </div>

      {/* MODAL FORM TAMBAH / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex justify-center items-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="glass card-glass w-full max-w-2xl animate-in zoom-in-95 duration-300 rounded-3xl relative mt-20 mb-20 p-6 md:p-8">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
            >
              ✕
            </button>
            <h3 className="text-2xl font-black mb-6 text-[var(--text-main)]">
              {editingUser ? "Edit Profil Karyawan" : "Tambah Karyawan Baru"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)]">Nama Lengkap</label>
                  <input type="text" name="nama" defaultValue={editingUser?.nama || ""} required className="input-glass w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)]">Nama Panggilan</label>
                  <input type="text" name="nama_panggilan" defaultValue={editingUser?.nama_panggilan || ""} className="input-glass w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)]">Email</label>
                  <input type="email" name="email" defaultValue={editingUser?.email || ""} required className="input-glass w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)]">Nomor HP</label>
                  <input type="text" name="no_hp" defaultValue={editingUser?.no_hp || ""} required className="input-glass w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)]">Role</label>
                  <select name="role" defaultValue={editingUser?.role || ""} required className="input-glass w-full appearance-none">
                    <option value="" className="bg-[#0a101f]">-- Pilih Role --</option>
                    <option value="Super Admin" className="bg-[#0a101f]">Super Admin</option>
                    <option value="Admin" className="bg-[#0a101f]">Admin</option>
                    <option value="Investor" className="bg-[#0a101f]">Investor</option>
                    <option value="Operator" className="bg-[#0a101f]">Operator</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)]">Pendidikan Terakhir</label>
                  <select name="pendidikan_terakhir" defaultValue={editingUser?.pendidikan_terakhir || ""} className="input-glass w-full appearance-none">
                    <option value="" className="bg-[#0a101f]">-- Pilih Pendidikan --</option>
                    <option value="SD/Sederajat" className="bg-[#0a101f]">SD/Sederajat</option>
                    <option value="SMP/Sederajat" className="bg-[#0a101f]">SMP/Sederajat</option>
                    <option value="SMA/SMK/Sederajat" className="bg-[#0a101f]">SMA/SMK/Sederajat</option>
                    <option value="D3/S1/Sederajat" className="bg-[#0a101f]">D3/S1/Sederajat</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)]">Tanggal Lahir</label>
                  <input type="date" name="tanggal_lahir" defaultValue={editingUser?.tanggal_lahir ? new Date(editingUser.tanggal_lahir).toISOString().split('T')[0] : ""} className="input-glass w-full" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)]">Alamat Lengkap</label>
                  <textarea name="alamat" defaultValue={editingUser?.alamat || ""} className="input-glass w-full min-h-[100px]" />
                </div>
              </div>
              
              {!editingUser && (
                <div className="bg-[var(--sky)]/10 border border-[var(--sky)]/20 p-4 rounded-xl text-xs font-bold text-[var(--sky)] mt-4">
                  ℹ️ Password default untuk pengguna baru adalah: <strong className="text-white">Pertashop123!</strong>
                </div>
              )}

              <div className="pt-6 border-t border-white/10 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-black transition-colors">Batal</button>
                <button type="submit" disabled={isPending} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[var(--sky)] to-[var(--primary)] text-white text-sm font-black hover:opacity-90 transition-opacity">
                  {isPending ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
