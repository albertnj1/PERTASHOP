"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LogOut,
  LayoutDashboard,
  FileText,
  Wallet,
  Settings,
  Users,
  Fuel,
  Clock,
  Menu,
  X,
  History,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/shift", label: "Kelola Shift", icon: Clock, roles: ["Super Admin", "Admin", "Operator"] },
];

const MAIN_MENU = [
  { href: "/dashboard/transaksi", label: "Transaksi", icon: FileText, roles: ["Super Admin", "Admin", "Operator"] },
  { href: "/dashboard/rekap", label: "Data Tersimpan", icon: History, roles: ["Super Admin", "Admin", "Investor", "Operator"] },
  { href: "/dashboard/setoran", label: "Setoran", icon: Wallet, roles: ["Super Admin", "Admin", "Operator"] },
];

const SETTINGS_MENU = [
  { href: "/dashboard/stok", label: "Atur Stok", icon: Settings, roles: ["Super Admin", "Admin"] },
  { href: "/dashboard/users", label: "Pengguna", icon: Users, roles: ["Super Admin", "Admin"] },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname.startsWith(href);
}

export default function DashboardClientLayout({ 
  children, 
  user 
}: { 
  children: React.ReactNode, 
  user: { nama: string; role: string } 
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
  };

  const renderNavItem = (item: { href: string; label: string; icon: React.ElementType; exact?: boolean; roles?: string[] }) => {
    // Filter by role if specified
    if (item.roles && !item.roles.includes(user.role)) return null;

    const Icon = item.icon;
    const active = isActive(pathname, item.href, item.exact);
    return (
      <Link
        key={item.href}
        href={item.href}
        prefetch={true}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center gap-4 p-4 rounded-[24px] transition-all duration-500 no-underline mb-2 group relative overflow-hidden ${
          active
            ? "bg-white/10 text-white font-black shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-white/10"
            : "text-[var(--text-muted)] hover:bg-white/5 hover:text-white"
        }`}
      >
        {active && (
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--sky)] to-[var(--primary)] shadow-[2px_0_15px_var(--sky)]" />
        )}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
          active ? "bg-[var(--sky)]/20 text-[var(--sky)] scale-110" : "bg-white/5 text-[var(--text-muted)] group-hover:bg-white/10 group-hover:text-white"
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm uppercase tracking-[2px] font-bold">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen">
      {/* NAVBAR */}
      <nav className="navbar px-6 lg:px-12 flex justify-between items-center h-[var(--nav-h)] sticky top-0 z-40 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-white/80 hover:bg-white/10 transition-all cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/dashboard" prefetch={true} className="flex items-center gap-4 no-underline group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] flex items-center justify-center text-white shadow-[0_8px_20px_rgba(0,136,255,0.3)] group-hover:scale-110 transition-transform duration-500">
              <Fuel className="w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <h4 className="m-0 font-black text-2xl tracking-tight text-white">PERTASHOP</h4>
              <p className="m-0 text-[9px] font-black uppercase tracking-[3px] text-[var(--sky)] opacity-80">Management System</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-black uppercase tracking-widest text-white">{user.nama}</div>
            <div className="text-[10px] text-[var(--sky)] uppercase font-black tracking-[2px]">{user.role}</div>
          </div>
          
          <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group hover:border-[var(--sky)]/30 transition-all cursor-pointer">
            <Users className="w-5 h-5 text-white/60 group-hover:text-[var(--sky)] transition-colors" />
          </div>
          
          <ThemeToggle />
          
          <div className="h-8 w-px bg-white/5 mx-1" />
          
          <button
            onClick={handleLogout}
            className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all cursor-pointer border-0 shadow-lg shadow-rose-500/5"
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
        <main className="flex-1 overflow-y-auto p-4 md:p-10 relative">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
          
          {/* Subtle Background Glows */}
          <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--sky)]/5 blur-[120px] pointer-events-none z-[-1]" />
          <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] pointer-events-none z-[-1]" />
        </main>
      </div>
    </div>
  );
}
