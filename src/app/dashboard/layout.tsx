import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClientLayout from "./DashboardClientLayout";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = {
    nama: session.user.nama || "User",
    role: session.user.role || "Operator",
  };

  return (
    <DashboardClientLayout user={user}>
      {children}
    </DashboardClientLayout>
  );
}
