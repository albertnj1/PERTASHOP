"use server";

import { prisma } from "@/lib/prisma";
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

  await prisma.users.update({
    where: { ID: id },
    data: { nama, email, role, no_hp },
  });

  revalidatePath("/dashboard/users");
}
export async function toggleUserStatus(id: number, currentStatus: boolean) {
  await prisma.users.update({
    where: { ID: id },
    data: { is_active: !currentStatus },
  });
  revalidatePath("/dashboard/users");
}
