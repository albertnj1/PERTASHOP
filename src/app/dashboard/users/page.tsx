import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, UserPlus } from "lucide-react";
import UserList from "./UserList";

export default async function UsersPage() {
  const session = await getSession();
  const userRole = session?.user?.role?.toLowerCase();
  const allowedRoles = ["admin", "super admin"];
  
  if (!session || !userRole || !allowedRoles.includes(userRole)) {
    redirect("/dashboard");
  }

  const allUsersRaw = await prisma.users.findMany({
    orderBy: { created_at: "desc" },
  });

  // Serialize data for Client Component
  const allUsers = allUsersRaw.map(user => ({
    ID: user.ID,
    nama: user.nama,
    email: user.email,
    role: user.role,
    no_hp: user.no_hp,
    foto: user.foto,
    is_active: (user as any).is_active ?? true,
    nama_panggilan: (user as any).nama_panggilan || null,
    pendidikan_terakhir: (user as any).pendidikan_terakhir || null,
    tanggal_lahir: (user as any).tanggal_lahir || null,
    alamat: (user as any).alamat || null,
  }));

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-main)] mb-1 tracking-tight">Pengguna</h2>
          <p className="text-[var(--text-muted)] font-medium">Kelola akses dan profil pengguna sistem</p>
        </div>
      </div>

      <UserList users={allUsers} currentUserRole={session?.user?.role || "Operator"} />
    </div>
  );
}
