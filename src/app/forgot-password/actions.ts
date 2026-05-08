"use server";

import prisma from "@/lib/prisma";

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email wajib diisi." };
  }

  try {
    // Cek apakah user ada
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      // Untuk keamanan, jangan beri tahu jika email tidak ada
      // Tapi dalam konteks aplikasi internal seperti ini, mungkin lebih baik beri tahu
      return { error: "Email tidak terdaftar dalam sistem." };
    }

    // Di sini seharusnya mengirim email reset password
    // Karena belum ada setup email (seperti Nodemailer/Resend), kita simulasi saja
    
    return { 
      success: true, 
      message: "Instruksi reset password telah dikirim ke email Anda. (Simulasi: Silakan hubungi admin untuk reset manual)" 
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { error: "Terjadi kesalahan pada server. Coba lagi." };
  }
}
