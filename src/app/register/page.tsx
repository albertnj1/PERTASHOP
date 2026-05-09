"use client";

import { useState, useActionState, useEffect } from "react";
import { Mail, Lock, User, Phone, Eye, EyeOff, Fuel, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerAction } from "./actions";
import ThemeToggle from "@/components/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(registerAction, null);

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
  }, [state, router]);

  return (
    <div className="flex justify-center items-center min-h-screen py-10 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="glass card-glass w-full max-w-[480px] m-5 px-[35px] py-[45px]">
        <div className="text-center mb-[40px]">
          <div className="w-[80px] h-[80px] mx-auto mb-6 rounded-[24px] flex items-center justify-center bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] shadow-[0_12px_30px_rgba(0,136,255,0.4)]">
            <Fuel className="w-10 h-10 text-white" />
          </div>
          <h2 className="m-0 font-extrabold text-[28px] text-[var(--text-color)]">Create Account</h2>
          <p className="mt-2 text-[var(--text-muted)] text-[15px]">Join Pertashop Management System</p>
        </div>

        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-[15px] py-[12px] rounded-2xl mb-[25px] text-center text-sm backdrop-blur-md flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
            <AlertCircle className="w-[18px] h-[18px]" />
            {state.error}
          </div>
        )}

        <form action={formAction}>
          <div className="mb-5">
            <label className="text-sm text-[var(--text-color)] opacity-90 mb-2 block font-bold">Full Name</label>
            <div className="relative flex items-center group">
              <User className="absolute left-[18px] w-5 h-5 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--sky)]" />
              <input
                type="text"
                name="nama"
                className="input-glass w-full"
                style={{ paddingLeft: '52px' }}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-sm text-[var(--text-color)] opacity-90 mb-2 block font-bold">Email Address</label>
              <div className="relative flex items-center group">
                <Mail className="absolute left-[18px] w-5 h-5 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--sky)]" />
                <input
                  type="email"
                  name="email"
                  className="input-glass w-full"
                  style={{ paddingLeft: '52px' }}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-[var(--text-color)] opacity-90 mb-2 block font-bold">Phone Number</label>
              <div className="relative flex items-center group">
                <Phone className="absolute left-[18px] w-5 h-5 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--sky)]" />
                <input
                  type="tel"
                  name="no_hp"
                  className="input-glass w-full"
                  style={{ paddingLeft: '52px' }}
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <div>
              <label className="text-sm text-[var(--text-color)] opacity-90 mb-2 block font-bold">Password</label>
              <div className="relative flex items-center group">
                <Lock className="absolute left-[18px] w-5 h-5 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--sky)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input-glass w-full"
                  style={{ paddingLeft: '52px', paddingRight: '52px' }}
                  placeholder="Create password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-[18px] text-[var(--text-muted)] hover:text-[var(--sky)] transition-colors focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-[var(--text-color)] opacity-90 mb-2 block font-bold">Confirm</label>
              <div className="relative flex items-center group">
                <CheckCircle2 className="absolute left-[18px] w-5 h-5 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--sky)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="input-glass w-full"
                  style={{ paddingLeft: '52px' }}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="text-sm text-[var(--text-color)] opacity-90 mb-3 block font-bold">Register as</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { val: "Operator", label: "Operator" },
                { val: "Admin", label: "Admin" },
                { val: "Investor", label: "Investor" },
                { val: "Super Admin", label: "Super Admin" },
              ].map((r) => (
                <label key={r.val} className="relative cursor-pointer group">
                  <input type="radio" name="role" value={r.val} defaultChecked={r.val === "Operator"} className="peer sr-only" />
                  <div className="p-2.5 text-center rounded-2xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text-muted)] peer-checked:bg-[var(--sky)]/20 peer-checked:border-[var(--sky)] peer-checked:text-[var(--sky)] transition-all hover:bg-white/5">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest">{r.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="btn-primary-glass w-full mb-5 text-base py-4" 
          >
            {isPending ? "Creating Account..." : "Register Now"}
          </button>

          <div className="text-center text-[14px] text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--sky)] font-bold hover:underline ml-1">
              Log In here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
