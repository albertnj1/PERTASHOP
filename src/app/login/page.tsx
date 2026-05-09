"use client";

import { useState, useActionState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, Fuel, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
  }, [state, router]);

  return (
    <div className="flex justify-center items-center min-h-screen relative overflow-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--sky)]/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)]/10 blur-[150px] rounded-full" />
      </div>

      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="glass card-glass w-full max-w-[440px] m-6 p-12 relative z-10 animate-in zoom-in fade-in duration-700">
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-8 rounded-[32px] flex items-center justify-center bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] shadow-[0_15px_40px_rgba(0,136,255,0.4)] group">
            <Fuel className="w-12 h-12 text-white animate-bounce-subtle" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[4px] text-[var(--sky)] mb-2 opacity-80">Access Portal</p>
          <h2 className="m-0 font-black text-4xl text-white tracking-tight">Welcome Back</h2>
          <p className="mt-3 text-[var(--text-muted)] font-bold text-base opacity-70">Sign in to manage your operations</p>
        </div>

        {state?.error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-5 py-4 rounded-2xl mb-8 text-center text-sm backdrop-blur-md flex items-center justify-center gap-3 animate-in slide-in-from-top-4 duration-500">
            <AlertCircle className="w-5 h-5" />
            <span className="font-black uppercase tracking-wider">{state.error}</span>
          </div>
        )}

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

          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-muted)]">Password</label>
              <Link href="/forgot-password" title="Coming soon" className="text-[var(--sky)] text-[10px] font-black uppercase tracking-widest hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative flex items-center group">
              <Lock className="absolute left-6 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[var(--sky)] transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input-glass w-full pl-16 pr-16 py-5 focus:scale-[1.02]"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute right-6 text-[var(--text-muted)] hover:text-white transition-colors focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
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
                VERIFYING...
              </span>
            ) : "LOG IN NOW"}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[13px] font-bold text-[var(--text-muted)]">
            Don't have an account?{" "}
            <Link href="/register" className="text-[var(--sky)] font-black uppercase tracking-wider ml-1 hover:underline">
              Create One
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
