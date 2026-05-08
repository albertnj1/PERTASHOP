import React from 'react';
import { getActiveShift } from "@/lib/actions/shifts";
import { AlertTriangle, ArrowLeft, FileText, Wallet } from "lucide-react";
import Link from "next/link";

interface ShiftGuardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  icon?: 'report' | 'setoran';
}

export default async function ShiftGuard({ children, title, subtitle, icon = 'report' }: ShiftGuardProps) {
  const activeShift = await getActiveShift();

  if (!activeShift) {
    const Icon = icon === 'setoran' ? Wallet : FileText;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
        <div className="glass p-10 md:p-12 max-w-xl w-full text-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute -top-10 -right-10 opacity-5 rotate-12 pointer-events-none">
             <Icon className="w-64 h-64" />
          </div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[var(--sky)]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-20 h-20 bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[var(--sky)]/20 relative z-10">
            <Icon className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold mb-2 relative z-10">{title}</h2>
          <p className="text-white/60 mb-10 relative z-10">{subtitle}</p>

          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 mb-10 relative z-10 backdrop-blur-md">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-red-200 mb-2">Akses Ditolak.</h3>
            <p className="text-red-200/70 text-sm leading-relaxed max-w-xs mx-auto">
              Belum ada shift yang dibuka saat ini. Silakan buka shift terlebih dahulu.
            </p>
          </div>

          <Link 
            href="/dashboard" 
            className="flex items-center justify-center gap-2 text-[var(--sky)] font-bold hover:gap-3 transition-all relative z-10 no-underline group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
