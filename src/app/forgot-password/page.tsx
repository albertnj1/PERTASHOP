"use client";

import { useActionState } from "react";
import { Mail, Fuel, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { forgotPasswordAction } from "./actions";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, null);

  return (
    <div className="flex justify-center items-center min-h-screen relative overflow-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--sky)]/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)]/10 blur-[150px] rounded-full" />
      </div>

      <div className="glass card-glass w-full max-w-[440px] m-6 p-12 relative z-10 animate-in zoom-in fade-in duration-700">
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-8 rounded-[32px] flex items-center justify-center bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] shadow-[0_15px_40px_rgba(0,136,255,0.4)]">
            <Fuel className="w-12 h-12 text-white" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[4px] text-[var(--sky)] mb-2 opacity-80">Recovery</p>
          <h2 className="m-0 font-black text-4xl text-[var(--text-main)] tracking-tight">Reset Password</h2>
          <p className="mt-3 text-[var(--text-muted)] font-bold text-base opacity-70">Enter your email to receive instructions</p>
        </div>

        {state?.error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-5 py-4 rounded-2xl mb-8 text-center text-sm backdrop-blur-md flex items-center justify-center gap-3 animate-in slide-in-from-top-4 duration-500">
            <AlertCircle className="w-5 h-5" />
            <span className="font-black uppercase tracking-wider">{state.error}</span>
          </div>
        )}

        {state?.success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-6 rounded-2xl mb-8 text-center backdrop-blur-md flex flex-col items-center justify-center gap-3 animate-in zoom-in duration-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <p className="font-bold text-base leading-relaxed">{state.message}</p>
          </div>
        )}

        {!state?.success && (
          <form action={formAction} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)] px-1">Email Address</label>
              <div className="relative flex items-center group">
                <Mail className="absolute left-6 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[var(--sky)] transition-colors" />
                <input
                  type="email"
                  name="email"
                  className="input-glass w-full pl-16 py-5 focus:scale-[1.02]"
                  placeholder="name@example.com"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary-glass w-full py-5 text-lg"
            >
              {isPending ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  SENDING...
                </span>
              ) : "SEND INSTRUCTIONS"}
            </button>
          </form>
        )}

        <div className="mt-12 text-center">
          <Link href="/login" className="inline-flex items-center gap-3 text-[13px] font-black uppercase tracking-wider text-[var(--text-muted)] hover:text-white transition-all group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
