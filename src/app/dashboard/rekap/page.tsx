import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ShiftGuard from "@/components/ShiftGuard";
import RekapClient from "./RekapClient";

export default async function RekapPage() {
  const session = await getSession();
  if (session?.user?.role !== "Admin") {
    redirect("/dashboard");
  }

  return (
    <ShiftGuard 
      title="Rekap / Cetak" 
      subtitle="Ekspor data dan cetak laporan periodik"
      icon="report"
    >
      <RekapClient />
    </ShiftGuard>
  );
}
