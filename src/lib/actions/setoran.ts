"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addSetoran(formData: FormData) {
  const tanggal = new Date(formData.get("tanggal") as string);
  const jumlah = parseInt(formData.get("jumlah") as string);
  const metode = formData.get("metode") as "tf" | "tunai" || "tunai";
  const keterangan = formData.get("keterangan") as string;
  const shift_id = formData.get("shift_id") ? parseInt(formData.get("shift_id") as string) : null;

  await prisma.setoran.create({
    data: {
      tanggal,
      jumlah,
      metode,
      keterangan,
      shift_id,
    },
  });

  revalidatePath("/dashboard/transaksi");
  revalidatePath("/dashboard");
}

export async function deleteSetoran(id: number) {
  // Soft delete: set deleted_at instead of deleting record
  await prisma.setoran.update({
    where: { id },
    data: { deleted_at: new Date() }
  });
  revalidatePath("/dashboard/setoran");
  revalidatePath("/dashboard");
}

export async function restoreSetoran(id: number) {
  await prisma.setoran.update({
    where: { id },
    data: { deleted_at: null }
  });
  revalidatePath("/dashboard/setoran");
  revalidatePath("/dashboard");
}

export async function getDeletedSetoran() {
  return await prisma.setoran.findMany({
    where: { NOT: { deleted_at: null } },
    orderBy: { deleted_at: 'desc' }
  });
}

export async function permanentDeleteSetoran(id: number) {
  await prisma.setoran.delete({
    where: { id }
  });
  revalidatePath("/dashboard/setoran");
}
