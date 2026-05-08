"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getActiveShift() {
  const shift = await prisma.shifts.findFirst({
    where: { status: "open" },
    orderBy: { jam_buka: "desc" },
  });

  if (!shift) return null;

  // Get operator name
  let operatorName = "Unknown";
  if (shift.user_id) {
    const user = await prisma.users.findUnique({
      where: { ID: shift.user_id },
      select: { nama: true },
    });
    if (user) operatorName = user.nama;
  }

  return {
    id: shift.id,
    user_id: shift.user_id,
    operatorName,
    jam_buka: shift.jam_buka?.toISOString() || null,
    jam_tutup: shift.jam_tutup?.toISOString() || null,
    status: shift.status,
  };
}

export async function openShift() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // Check if there's already an open shift
  const existing = await prisma.shifts.findFirst({
    where: { status: "open" },
  });

  if (existing) {
    return { error: "Masih ada shift yang sedang berjalan. Tutup shift terlebih dahulu." };
  }

  const userId = session.user?.id;

  const shift = await prisma.shifts.create({
    data: {
      user_id: userId,
      jam_buka: new Date(),
      status: "open",
    },
  });

  revalidatePath("/dashboard/shift");
  revalidatePath("/dashboard");
  return { success: true, shiftId: shift.id };
}

export async function closeShift(shiftId: number) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const shift = await prisma.shifts.findUnique({
    where: { id: shiftId },
  });

  if (!shift) {
    return { error: "Shift tidak ditemukan." };
  }

  if (shift.status === "closed") {
    return { error: "Shift sudah ditutup." };
  }

  await prisma.shifts.update({
    where: { id: shiftId },
    data: {
      jam_tutup: new Date(),
      status: "closed",
    },
  });

  revalidatePath("/dashboard/shift");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getShiftHistory() {
  const shifts = await prisma.shifts.findMany({
    orderBy: { jam_buka: "desc" },
    take: 20,
  });

  // Get all unique user IDs
  const userIds = [...new Set(shifts.map((s) => s.user_id).filter(Boolean))] as number[];
  const users = await prisma.users.findMany({
    where: { ID: { in: userIds } },
    select: { ID: true, nama: true },
  });
  const userMap = new Map(users.map((u) => [u.ID, u.nama]));

  return shifts.map((s) => ({
    id: s.id,
    user_id: s.user_id,
    operatorName: s.user_id ? userMap.get(s.user_id) || "Unknown" : "Unknown",
    jam_buka: s.jam_buka?.toISOString() || null,
    jam_tutup: s.jam_tutup?.toISOString() || null,
    status: s.status,
  }));
}

export async function getShiftStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayShifts = await prisma.shifts.count({
    where: {
      jam_buka: { gte: today, lt: tomorrow },
    },
  });

  const totalShifts = await prisma.shifts.count();

  // Get transactions count for current open shift
  const activeShift = await prisma.shifts.findFirst({
    where: { status: "open" },
  });

  let activeTransactions = 0;
  let activeRevenue = 0;

  if (activeShift) {
    const transactions = await prisma.transactions.findMany({
      where: { shift_id: activeShift.id },
    });
    activeTransactions = transactions.length;
    activeRevenue = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
  }

  return {
    todayShifts,
    totalShifts,
    activeTransactions,
    activeRevenue,
  };
}
