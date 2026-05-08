"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LogOut,
  LayoutDashboard,
  FileText,
  Printer,
  Wallet,
  Settings,
  Users,
  Fuel,
  Clock,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/shift", label: "Kelola Shift", icon: Clock },
];

const MAIN_MENU = [
  { href: "/dashboard/transaksi", label: "Transaksi", icon: FileText },
  { href: "/dashboard/rekap", label: "Rekap / Cetak", icon: Printer },
  { href: "/dashboard/setoran", label: "Setoran", icon: Wallet },
];

const SETTINGS_MENU = [
  { href: "/dashboard/stok", label: "Atur Stok", icon: Settings },
  { href: "/dashboard/users", label: "Pengguna", icon: Users },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname.startsWith(href);
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = "/login";
  };

  const renderNavItem = (item: { href: string; label: string; icon: React.ElementType; exact?: boolean }) => {
    const Icon = item.icon;
    const active = isActive(pathname, item.href, item.exact);
    return (
      <Link
        key={item.href}
        href={item.href}
        prefetch={true}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 no-underline ${
          active
            ? "bg-[rgba(123,189,232,0.15)] text-white font-medium"
            : "text-white/70 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen">
      {/* NAVBAR */}
      <nav className="navbar px-5 lg:px-8 flex justify-between items-center h-[var(--nav-h)] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 text-white/80 hover:bg-white/15 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/dashboard" prefetch={true} className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] flex items-center justify-center text-white shadow-md">
              <Fuel className="w-5 h-5" />
            </div>
            <h4 className="m-0 font-bold text-xl hidden sm:block text-white">Pertashop</h4>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold opacity-90">User</div>
            <div className="text-xs text-[var(--sky)]">Admin</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <Users className="w-5 h-5 text-white/80" />
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/40 hover:text-white transition-colors cursor-pointer border-0"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="app flex">
        {/* SIDEBAR - Desktop */}
        <aside className="sidebar hidden md:block w-[var(--sidebar-w)] shrink-0 sticky top-[var(--nav-h)] h-[calc(100vh-var(--nav-h))] overflow-y-auto p-4">
          <div className="mt-2">
            {NAV_ITEMS.map(renderNavItem)}

            <div className="my-4 border-t border-white/10 mx-2" />
            <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-3">Main Menu</div>
            {MAIN_MENU.map(renderNavItem)}

            <div className="my-4 border-t border-white/10 mx-2" />
            <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-3">Pengaturan</div>
            {SETTINGS_MENU.map(renderNavItem)}
          </div>
        </aside>

        {/* SIDEBAR - Mobile Overlay */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-30 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside
              className="fixed left-0 top-[var(--nav-h)] bottom-0 w-[280px] z-40 md:hidden overflow-y-auto p-4 slide-in-from-left"
              style={{ background: "var(--body-bg)", borderRight: "1px solid var(--glass-border)" }}
            >
              <div className="mt-2">
                {NAV_ITEMS.map(renderNavItem)}

                <div className="my-4 border-t border-white/10 mx-2" />
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-3">Main Menu</div>
                {MAIN_MENU.map(renderNavItem)}

                <div className="my-4 border-t border-white/10 mx-2" />
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-3">Pengaturan</div>
                {SETTINGS_MENU.map(renderNavItem)}
              </div>
            </aside>
          </>
        )}

        {/* MAIN CONTENT */}
        <main className="content flex-1 min-w-0 max-w-[1200px] mx-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
