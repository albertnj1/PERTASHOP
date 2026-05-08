import { getActiveShift, getShiftHistory, getShiftStats } from "@/lib/actions/shifts";
import ShiftClient from "./ShiftClient";

export default async function ShiftPage() {
  const [activeShift, history, stats] = await Promise.all([
    getActiveShift(),
    getShiftHistory(),
    getShiftStats(),
  ]);

  return (
    <ShiftClient
      initialActiveShift={activeShift}
      initialHistory={history}
      initialStats={stats}
    />
  );
}
