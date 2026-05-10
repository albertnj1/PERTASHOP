import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, UserPlus } from "lucide-react";
import UserList from "./UserList";

export default async function UsersPage() {
  const session = await getSession();
  const userRole = session?.user?.role?.toLowerCase();
  const allowedRoles = ["admin", "super admin"];
  if (!userRole || !allowedRoles.includes(userRole)) {
    redirect("/dashboard");
  }

  const allUsers = await prisma.users.findMany({
    orderBy: { created_at: "desc" },
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

      <UserList users={allUsers} currentUserRole={session.user.role} />
    </div>
  );
}
