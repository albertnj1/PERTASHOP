"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateBbmConfig(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const harga = parseInt(formData.get("harga") as string);
  const stok = parseFloat(formData.get("stok") as string);
  const kapasitas = parseFloat(formData.get("kapasitas") as string);

  await prisma.bbm_config.update({
    where: { id },
    data: {
      harga,
      stok,
      kapasitas,
      updated_at: new Date(),
    },
  });

  revalidatePath("/dashboard/stok");
  revalidatePath("/dashboard");
}
