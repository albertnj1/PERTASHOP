"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get the current active (open) shift
  const activeShift = await prisma.shifts.findFirst({
    where: { status: "open" },
    orderBy: { jam_buka: "desc" },
  });

  // Penjualan Hari Ini: sum of penjualan_rp from bbm_log entries
  // linked to laporan_harian with today's date
  const todayLaporan = await prisma.laporan_harian.findMany({
    where: {
      tanggal: { gte: today, lt: tomorrow },
    },
    select: { id: true, total_penjualan: true },
  });

  const totalPenjualanHariIni = todayLaporan.reduce(
    (sum, lap) => sum + (lap.total_penjualan || 0),
    0
  );

  // Liter Terjual Hari Ini: sum of penjualan_liter from bbm_log
  // linked to today's laporan
  const todayLaporanIds = todayLaporan.map((l) => l.id);
  let totalLiterHariIni = 0;

  if (todayLaporanIds.length > 0) {
    const bbmLogs = await prisma.bbm_log.findMany({
      where: { laporan_id: { in: todayLaporanIds } },
      select: { penjualan_liter: true },
    });
    totalLiterHariIni = bbmLogs.reduce(
      (sum, log) => sum + (log.penjualan_liter || 0),
      0
    );
  }

  // Stok Pertamax: from bbm_config (most recent stok value)
  const bbmConfig = await prisma.bbm_config.findFirst({
    where: { nama_bbm: "Pertamax" },
    select: { stok: true, kapasitas: true },
  });

  // If no "Pertamax" config found, try the first bbm_config
  let stok = 0;
  let kapasitas = 0;
  if (bbmConfig) {
    stok = bbmConfig.stok || 0;
    kapasitas = bbmConfig.kapasitas || 0;
  } else {
    const anyBbm = await prisma.bbm_config.findFirst({
      select: { stok: true, kapasitas: true },
    });
    if (anyBbm) {
      stok = anyBbm.stok || 0;
      kapasitas = anyBbm.kapasitas || 0;
    }
  }

  const stokPercentage = kapasitas > 0 ? Math.round((stok / kapasitas) * 100 * 10) / 10 : 0;

  // Check if shift is active
  const isShiftActive = !!activeShift;

  return {
    penjualanHariIni: totalPenjualanHariIni,
    literTerjual: totalLiterHariIni,
    stok,
    kapasitas,
    stokPercentage,
    isShiftActive,
  };
}
