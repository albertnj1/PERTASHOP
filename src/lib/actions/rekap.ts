"use server";

import { prisma } from "@/lib/prisma";

export async function getRekapData(fromDate: string, toDate: string) {
  const from = new Date(fromDate);
  from.setHours(0, 0, 0, 0);
  
  const to = new Date(toDate);
  to.setHours(23, 59, 59, 999);

  const laporan = await prisma.laporan_harian.findMany({
    where: {
      tanggal: {
        gte: from,
        lte: to
      }
    },
    orderBy: {
      tanggal: 'desc'
    },
    include: {
      bbm_log: true,
      pengeluaran: true
    }
  });

  const summary = {
    count: laporan.length,
    totalGross: laporan.reduce((sum, l) => sum + (l.total_penjualan || 0), 0),
    totalExpense: laporan.reduce((sum, l) => sum + (l.total_pengeluaran || 0), 0),
    totalNet: laporan.reduce((sum, l) => sum + (l.saldo_bersih || 0), 0),
  };

  return {
    laporan: JSON.parse(JSON.stringify(laporan)),
    summary
  };
}
