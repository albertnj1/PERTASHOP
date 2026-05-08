"use client";

import { useState, useActionState, useEffect } from "react";
import { Mail, Lock, User, Phone, Eye, EyeOff, Fuel, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerAction } from "./actions";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(registerAction, null);

  useEffect(() => {
    if (state?.success) {
      // Redirect to dashboard after successful registration
      router.push("/dashboard");
    }
  }, [state, router]);

  return (
    <div className="flex justify-center items-center min-h-screen py-10">
      <div className="glass card-glass w-full max-w-[450px] m-5 px-[30px] py-[40px]">
        <div className="text-center mb-[35px]">
          <div className="w-[70px] h-[70px] mx-auto mb-5 rounded-[20px] flex items-center justify-center bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] shadow-[0_8px_25px_rgba(10,65,116,0.6),inset_0_2px_5px_rgba(255,255,255,0.4)]">
            <Fuel className="w-8 h-8 text-white" />
          </div>
          <h2 className="m-0 font-bold text-[26px] text-white">Create Account</h2>
          <p className="mt-2 opacity-70 text-[15px]">Join Pertashop Management System</p>
        </div>

        {state?.error && (
          <div className="bg-red-500/20 border border-red-500/40 text-[#ffbaba] px-[15px] py-[12px] rounded-xl mb-[25px] text-center text-sm backdrop-blur-md flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
            <AlertCircle className="w-[18px] h-[18px]" />
            {state.error}
          </div>
        )}

        <form action={formAction}>
          <div className="mb-5">
            <label className="text-sm text-white/90 mb-2.5 block font-medium">Full Name</label>
            <div className="relative flex items-center group">
              <User className="absolute left-[15px] w-5 h-5 text-white/60 transition-colors group-focus-within:text-[var(--sky)]" />
              <input
                type="text"
                name="nama"
                className="input-glass w-full"
                style={{ paddingLeft: '45px' }}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

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
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="text-sm text-white/90 mb-2.5 block font-medium">Phone Number</label>
            <div className="relative flex items-center group">
              <Phone className="absolute left-[15px] w-5 h-5 text-white/60 transition-colors group-focus-within:text-[var(--sky)]" />
              <input
                type="tel"
                name="no_hp"
                className="input-glass w-full"
                style={{ paddingLeft: '45px' }}
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="text-sm text-white/90 mb-2.5 block font-medium">Password</label>
            <div className="relative flex items-center group">
              <Lock className="absolute left-[15px] w-5 h-5 text-white/60 transition-colors group-focus-within:text-[var(--sky)]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input-glass w-full"
                style={{ paddingLeft: '45px', paddingRight: '45px' }}
                placeholder="Create a password"
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

          <div className="mb-[30px]">
            <label className="text-sm text-white/90 mb-2.5 block font-medium">Confirm Password</label>
            <div className="relative flex items-center group">
              <CheckCircle2 className="absolute left-[15px] w-5 h-5 text-white/60 transition-colors group-focus-within:text-[var(--sky)]" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                className="input-glass w-full"
                style={{ paddingLeft: '45px' }}
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          <div className="mb-[30px]">
            <label className="text-sm text-white/90 mb-3 block font-medium">Register as</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative cursor-pointer group">
                <input type="radio" name="role" value="Operator" defaultChecked className="peer sr-only" />
                <div className="p-3 text-center rounded-xl bg-white/5 border border-white/10 text-white/60 peer-checked:bg-[var(--sky)]/20 peer-checked:border-[var(--sky)] peer-checked:text-[var(--sky)] transition-all hover:bg-white/10">
                  <span className="text-sm font-bold uppercase tracking-wider">Operator</span>
                </div>
              </label>
              <label className="relative cursor-pointer group">
                <input type="radio" name="role" value="Admin" className="peer sr-only" />
                <div className="p-3 text-center rounded-xl bg-white/5 border border-white/10 text-white/60 peer-checked:bg-[var(--sky)]/20 peer-checked:border-[var(--sky)] peer-checked:text-[var(--sky)] transition-all hover:bg-white/10">
                  <span className="text-sm font-bold uppercase tracking-wider">Admin</span>
                </div>
              </label>
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
                Creating Account...
              </>
            ) : "Register Now"}
          </button>

          <div className="text-center text-[13px] opacity-80">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--sky)] font-semibold hover:underline">
              Log In here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
