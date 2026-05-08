import ShiftGuard from "@/components/ShiftGuard";
import RekapClient from "./RekapClient";

export default async function RekapPage() {
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
