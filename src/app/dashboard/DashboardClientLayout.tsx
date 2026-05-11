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
    // Filter by role if specified (Case-insensitive check)
    if (item.roles) {
      const userRoleLower = user.role.toLowerCase();
      const hasPermission = item.roles.some(role => role.toLowerCase() === userRoleLower);
      if (!hasPermission) return null;
    }

    const Icon = item.icon;
    const active = isActive(pathname, item.href, item.exact);
    return (
      <Link
        key={item.href}
        href={item.href}
        prefetch={true}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center gap-3 p-3.5 rounded-[20px] transition-all duration-700 no-underline mb-1.5 group relative overflow-hidden ${
          active
            ? "bg-white/40 text-[var(--text-main)] font-black shadow-[0_8px_25px_rgba(0,0,0,0.03)] border border-white/50"
            : "text-[var(--text-muted)] hover:bg-white/20 hover:text-[var(--text-main)]"
        }`}
      >
        {active && (
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--sky)] to-[var(--primary)] shadow-[3px_0_15px_var(--sky)]" />
        )}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-700 ${
          active ? "bg-[var(--sky)]/20 text-[var(--sky)] scale-110 shadow-sm" : "bg-white/10 text-[var(--text-muted)] group-hover:bg-white/20 group-hover:text-[var(--text-main)]"
        }`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-[12px] uppercase tracking-[1.5px] font-black">{item.label}</span>
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
            className="md:hidden w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-[var(--text-main)] hover:bg-white/10 transition-all cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/dashboard" prefetch={true} className="flex items-center gap-4 no-underline group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] flex items-center justify-center text-white shadow-[0_8px_20px_rgba(0,136,255,0.3)] group-hover:scale-110 transition-transform duration-500">
              <Fuel className="w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <h4 className="m-0 font-black text-2xl tracking-tight text-[var(--text-main)]">PERTASHOP</h4>
              <p className="m-0 text-[9px] font-black uppercase tracking-[3px] text-[var(--sky)] opacity-80">Management System</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-black uppercase tracking-widest text-[var(--text-main)]">{user.nama}</div>
            <div className="text-[11px] text-[var(--sky)] uppercase font-black tracking-[3px]">{user.role}</div>
          </div>
          
          {/* Navbar User Management Link (Only for Admin/Super Admin) */}
          {(user.role.toLowerCase() === "super admin" || user.role.toLowerCase() === "admin") && (
            <Link 
              href="/dashboard/users" 
              className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group hover:border-[var(--sky)]/30 transition-all cursor-pointer no-underline"
              title="Manajemen Pengguna"
            >
              <Users className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--sky)] transition-colors" />
            </Link>
          )}
          
          

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
        <aside className="sidebar hidden md:block w-[var(--sidebar-w)] shrink-0 sticky top-[var(--nav-h)] h-[calc(100vh-var(--nav-h))] overflow-y-auto p-5 glass border-y-0 border-l-0 rounded-none bg-white/[0.01]">
          <div className="mt-2">
            <div className="text-[9px] font-black text-white/20 uppercase tracking-[3px] mb-4 px-4">Dashboard</div>
            {NAV_ITEMS.map(renderNavItem)}

            <div className="my-6 border-t border-white/5 mx-4" />
            <div className="text-[9px] font-black text-white/20 uppercase tracking-[3px] mb-4 px-4">Main Menu</div>
            {MAIN_MENU.map(renderNavItem)}

            <div className="my-6 border-t border-white/5 mx-4" />
            <div className="text-[9px] font-black text-white/20 uppercase tracking-[3px] mb-4 px-4">Pengaturan</div>
            {SETTINGS_MENU.map(renderNavItem)}
          </div>
        </aside>

        {/* SIDEBAR - Mobile Overlay */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside
              className="fixed left-0 top-[var(--nav-h)] bottom-0 w-[300px] z-40 md:hidden overflow-y-auto p-6 glass border-y-0 border-l-0 rounded-none bg-[var(--glass-bg)] backdrop-blur-3xl animate-in slide-in-from-left duration-500"
            >
              <div className="mt-4">
                {NAV_ITEMS.map(renderNavItem)}

                <div className="my-10 border-t border-white/5 mx-4" />
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
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative selection:bg-[var(--sky)] selection:text-white">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {children}
          </div>
          
          {/* Enhanced Background Mesh */}
          <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[var(--sky)]/[0.07] blur-[140px] pointer-events-none z-[-1] animate-pulse" />
          <div className="fixed bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[var(--primary)]/[0.05] blur-[140px] pointer-events-none z-[-1]" />
        </main>
      </div>
    </div>
  );
}
