"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function registerAction(prevState: any, formData: FormData) {
  const nama = formData.get("nama") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const no_hp = formData.get("no_hp") as string;
  const role = (formData.get("role") as string) || "Operator";

  if (!nama || !email || !password || !confirmPassword || !no_hp) {
    return { error: "Semua field wajib diisi." };
  }

  if (password !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok." };
  }

  if (password.length < 6) {
    return { error: "Password minimal 6 karakter." };
  }

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar." };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const newUser = await prisma.users.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        no_hp,
        role,
      },
    });

    // Buat session otomatis setelah register
    await createSession(newUser);
    
    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Terjadi kesalahan pada server saat mendaftar. Coba lagi." };
  }
}
