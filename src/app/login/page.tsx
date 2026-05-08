"use client";

import { useState, useActionState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, Fuel, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";

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
    <div className="flex justify-center items-center min-h-screen">
      <div className="glass card-glass w-full max-w-[400px] m-5 px-[30px] py-[40px]">
        <div className="text-center mb-[35px]">
          <div className="w-[70px] h-[70px] mx-auto mb-5 rounded-[20px] flex items-center justify-center bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] shadow-[0_8px_25px_rgba(10,65,116,0.6),inset_0_2px_5px_rgba(255,255,255,0.4)]">
            <Fuel className="w-8 h-8 text-white" />
          </div>
          <h2 className="m-0 font-bold text-[26px] text-white">Welcome Back</h2>
          <p className="mt-2 opacity-70 text-[15px]">Please log in to your Pertashop account</p>
        </div>

        {state?.error && (
          <div className="bg-red-500/20 border border-red-500/40 text-[#ffbaba] px-[15px] py-[12px] rounded-xl mb-[25px] text-center text-sm backdrop-blur-md flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
            <AlertCircle className="w-[18px] h-[18px]" />
            {state.error}
          </div>
        )}

        <form action={formAction}>
          <div className="mb-5">
            <label className="text-sm text-white/90 mb-2.5 block font-medium">Email Address</label>
            <div className="relative flex items-center group">
              <Mail className="absolute left-[15px] w-5 h-5 text-white/60 transition-colors group-focus-within:text-[var(--sky)]" />
              <input
                type="email"
                name="email"
                className="input-glass w-full"
                style={{ paddingLeft: '45px' }}
                placeholder="name@example.com"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="mb-[30px]">
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-sm text-white/90 font-medium">Password</label>
              <Link href="/forgot-password" className="text-[var(--sky)] text-[13px] opacity-90 hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative flex items-center group">
              <Lock className="absolute left-[15px] w-5 h-5 text-white/60 transition-colors group-focus-within:text-[var(--sky)]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input-glass w-full"
                style={{ paddingLeft: '45px', paddingRight: '45px' }}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute right-[15px] text-white/60 hover:text-[var(--sky)] transition-colors focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="btn-primary-glass w-full mb-[15px] text-base py-3.5 tracking-[1px] uppercase disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2" 
            style={{ borderRadius: '16px' }}
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

          <div className="text-center text-[13px] opacity-80">
            Don't have an account?{" "}
            <Link href="/register" className="text-[var(--sky)] font-semibold hover:underline">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
