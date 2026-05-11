"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteUser(id: number) {
  await prisma.users.delete({
    where: { ID: id },
  });
  revalidatePath("/dashboard/users");
}

export async function updateUser(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const nama = formData.get("nama") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;
  const no_hp = formData.get("no_hp") as string;
  const nama_panggilan = formData.get("nama_panggilan") as string || null;
  const pendidikan_terakhir = formData.get("pendidikan_terakhir") as string || null;
  const alamat = formData.get("alamat") as string || null;
  
  const tanggal_lahir_str = formData.get("tanggal_lahir") as string;
  const tanggal_lahir = tanggal_lahir_str ? new Date(tanggal_lahir_str) : null;

  await prisma.users.update({
    where: { ID: id },
    data: { 
      nama, email, role, no_hp, 
      nama_panggilan, pendidikan_terakhir, alamat, tanggal_lahir 
    } as any,
  });

  revalidatePath("/dashboard/users");
}

export async function addUser(formData: FormData) {
  const nama = formData.get("nama") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string || "Pertashop123!"; // Default password
  const role = formData.get("role") as string;
  const no_hp = formData.get("no_hp") as string;
  
  const nama_panggilan = formData.get("nama_panggilan") as string || null;
  const pendidikan_terakhir = formData.get("pendidikan_terakhir") as string || null;
  const alamat = formData.get("alamat") as string || null;
  
  const tanggal_lahir_str = formData.get("tanggal_lahir") as string;
  const tanggal_lahir = tanggal_lahir_str ? new Date(tanggal_lahir_str) : null;

  // In real app, password should be hashed with bcrypt. 
  // We assume there's a bcrypt step here.
  const bcrypt = require("bcryptjs");
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.users.create({
    data: {
      nama, email, role, no_hp, password: hashedPassword,
      nama_panggilan, pendidikan_terakhir, alamat, tanggal_lahir
    } as any,
  });

  revalidatePath("/dashboard/users");
}
export async function toggleUserStatus(id: number, currentStatus: boolean) {
  await prisma.users.update({
    where: { ID: id },
    data: { is_active: !currentStatus } as any,
  });
  revalidatePath("/dashboard/users");
}
