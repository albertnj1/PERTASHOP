"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  try {
    // Cari user di database
    const user = await prisma.users.findFirst({
      where: { email },
    });

    if (!user) {
      return { error: "Email atau password salah!" };
    }

    // Verifikasi password (password_verify versi Node.js menggunakan bcrypt)
    // Di PHP lama menggunakan password_hash, yang by default adalah bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password || "");

    if (!isPasswordValid) {
      return { error: "Email atau password salah!" };
    }

    // Check if account is active
    if (user.is_active === false) {
      return { error: "Akun Anda dinonaktifkan. Silakan hubungi admin." };
    }

    // Buat session
    await createSession(user);
    
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Terjadi kesalahan pada server. Coba lagi." };
  }
}
