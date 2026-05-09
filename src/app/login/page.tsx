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
    <div className="flex justify-center items-center min-h-screen relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="glass card-glass w-full max-w-[420px] m-5 px-[35px] py-[45px]">
        <div className="text-center mb-[40px]">
          <div className="w-[80px] h-[80px] mx-auto mb-6 rounded-[24px] flex items-center justify-center bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] shadow-[0_12px_30px_rgba(0,136,255,0.4)]">
            <Fuel className="w-10 h-10 text-white" />
          </div>
          <h2 className="m-0 font-extrabold text-[28px] text-[var(--text-color)]">Welcome Back</h2>
          <p className="mt-2 text-[var(--text-muted)] text-[15px]">Sign in to manage your Pertashop</p>
        </div>

        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-[15px] py-[12px] rounded-2xl mb-[25px] text-center text-sm backdrop-blur-md flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
            <AlertCircle className="w-[18px] h-[18px]" />
            {state.error}
          </div>
        )}

        <form action={formAction}>
          <div className="mb-6">
            <label className="text-sm text-[var(--text-color)] opacity-90 mb-2.5 block font-bold">Email Address</label>
            <div className="relative flex items-center group">
              <Mail className="absolute left-[18px] w-5 h-5 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--sky)]" />
              <input
                type="email"
                name="email"
                className="input-glass w-full"
                style={{ paddingLeft: '52px' }}
                placeholder="name@example.com"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="mb-[35px]">
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-sm text-[var(--text-color)] opacity-90 font-bold">Password</label>
              <Link href="/forgot-password" className="text-[var(--sky)] text-[13px] font-bold hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative flex items-center group">
              <Lock className="absolute left-[18px] w-5 h-5 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--sky)]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input-glass w-full"
                style={{ paddingLeft: '52px', paddingRight: '52px' }}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute right-[18px] text-[var(--text-muted)] hover:text-[var(--sky)] transition-colors focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-[20px] h-[20px]" /> : <Eye className="w-[20px] h-[20px]" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="btn-primary-glass w-full mb-[20px] text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed" 
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : "Log In"}
          </button>

          <div className="text-center text-[14px] text-[var(--text-muted)]">
            Don't have an account?{" "}
            <Link href="/register" className="text-[var(--sky)] font-bold hover:underline ml-1">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
