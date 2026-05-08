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
  await prisma.setoran.delete({
    where: { id },
  });
  revalidatePath("/dashboard/transaksi");
}
