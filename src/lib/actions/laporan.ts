"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createLaporan(formData: FormData) {
  const pertashop_id = parseInt(formData.get("pertashop_id") as string);
  const shift_id = parseInt(formData.get("shift_id") as string);
  const tanggal = new Date(formData.get("tanggal") as string);
  const hari = formData.get("hari") as string;
  const kas_kecil = parseInt((formData.get("kas_kecil") as string) || "0");
  
  const totalisator_awal = parseFloat(formData.get("totalisator_awal") as string);
  const totalisator_akhir = parseFloat(formData.get("totalisator_akhir") as string);
  try {
    const pertashop_id = parseInt(formData.get("pertashop_id") as string);
    const shift_id = parseInt(formData.get("shift_id") as string);
    const tanggal = new Date(formData.get("tanggal") as string);
    const hari = formData.get("hari") as string;
    const kas_kecil = parseInt((formData.get("kas_kecil") as string) || "0");
    
    const totalisator_awal = parseFloat(formData.get("totalisator_awal") as string);
    const totalisator_akhir = parseFloat(formData.get("totalisator_akhir") as string);
    const test_pump = parseFloat((formData.get("test_pump") as string) || "0");
    const harga_bbm = parseInt(formData.get("harga_bbm") as string);
    
    const cashback = parseInt((formData.get("cashback") as string) || "0");
    const biaya_operasional = parseInt((formData.get("biaya_operasional") as string) || "0");

    // Validasi
    if (isNaN(totalisator_awal) || isNaN(totalisator_akhir) || isNaN(harga_bbm)) {
      throw new Error("Data totalisator atau harga BBM tidak valid.");
    }

    if (totalisator_akhir < totalisator_awal) {
      throw new Error("Angka Akhir tidak boleh lebih kecil dari Angka Awal.");
    }

    // Calculations
    const penjualan_liter = totalisator_akhir - totalisator_awal - test_pump;
    const total_penjualan = Math.round(penjualan_liter * harga_bbm);
    const total_pengeluaran = cashback + biaya_operasional;
    const saldo_bersih = total_penjualan - total_pengeluaran;

    // 1. Create Laporan Harian
    const laporan = await prisma.laporan_harian.create({
      data: {
        pertashop_id,
        tanggal,
        hari,
        kas_kecil,
        total_penjualan,
        total_pengeluaran,
        saldo_bersih,
      },
    });

    // 2. Create BBM Log
    await prisma.bbm_log.create({
      data: {
        laporan_id: laporan.id,
        shift_id,
        totalisator_awal,
        totalisator_akhir,
        test_pump,
        penjualan_liter,
        penjualan_rp: total_penjualan,
      },
    });

    // 3. Create Pengeluaran entries
    if (cashback > 0) {
      await prisma.pengeluaran.create({
        data: {
          laporan_id: laporan.id,
          shift_id,
          nama: "Cashback / Diskon",
          jumlah: cashback,
          tipe: "cashback",
        },
      });
    }

    if (biaya_operasional > 0) {
      await prisma.pengeluaran.create({
        data: {
          laporan_id: laporan.id,
          shift_id,
          nama: "Biaya Operasional",
          jumlah: biaya_operasional,
          tipe: "biaya",
        },
      });
    }

    revalidatePath("/dashboard/transaksi");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error creating laporan:", error);
    throw error;
  }
}

export async function deleteLaporan(id: number) {
  // Sequential deletes - compatible with Supabase pgbouncer (no interactive transactions)
  await prisma.bbm_log.deleteMany({ where: { laporan_id: id } });
  await prisma.pengeluaran.deleteMany({ where: { laporan_id: id } });
  await prisma.setoran.deleteMany({ where: { laporan_id: id } });
  await prisma.laporan_harian.delete({ where: { id } });

  revalidatePath("/dashboard/transaksi");
  revalidatePath("/dashboard");
}
