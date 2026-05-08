/**
 * Utility functions for the Pertashop application
 */

/**
 * Format a number to Indonesian Rupiah currency format
 * @param amount - The number to format
 * @returns Formatted currency string (e.g., Rp 1.000.000)
 */
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace("IDR", "Rp");
};

/**
 * Calculate net profit from gross sales and expenses
 * @param grossSales - Total sales amount
 * @param expenses - Total expenses amount
 * @returns Net profit
 */
export const calculateProfit = (grossSales: number, expenses: number): number => {
  return grossSales - expenses;
};

/**
 * Format a date to Indonesian locale string
 * @param date - Date object or string
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
