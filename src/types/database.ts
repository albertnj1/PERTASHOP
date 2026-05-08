/**
 * Database Type Definitions
 * These interfaces mirror the Prisma schema for use throughout the application.
 */

export interface BbmConfig {
  id: number;
  nama_bbm: string | null;
  harga: number | null;
  stok: number | null;
  kapasitas: number | null;
  updated_at: Date | null;
}

export interface LaporanHarian {
  id: number;
  tanggal: Date | null;
  hari: string | null;
  kas_kecil: number | null;
  total_penjualan: number | null;
  total_pengeluaran: number | null;
  saldo_bersih: number | null;
  created_at: Date;
  pertashop_id: number | null;
}

export interface Setoran {
  id: number;
  laporan_id: number | null;
  tanggal: Date | null;
  jumlah: number | null;
  metode: "tf" | "tunai" | null;
  keterangan: string | null;
  shift_id: number | null;
}

export interface Shift {
  id: number;
  user_id: number | null;
  jam_buka: Date | null;
  jam_tutup: Date | null;
  status: "open" | "closed" | null;
}

export interface User {
  ID: number;
  nama: string;
  email: string;
  role: string;
  no_hp: string;
  foto?: string | null;
  created_at: Date;
}
