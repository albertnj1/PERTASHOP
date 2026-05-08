"use client";

import { useActionState } from "react";
import { Mail, Fuel, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { forgotPasswordAction } from "./actions";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, null);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="glass card-glass w-full max-w-[400px] m-5 px-[30px] py-[40px]">
        <div className="text-center mb-[35px]">
          <div className="w-[70px] h-[70px] mx-auto mb-5 rounded-[20px] flex items-center justify-center bg-gradient-to-br from-[var(--sky)] to-[var(--primary)] shadow-[0_8px_25px_rgba(10,65,116,0.6),inset_0_2px_5px_rgba(255,255,255,0.4)]">
            <Fuel className="w-8 h-8 text-white" />
          </div>
          <h2 className="m-0 font-bold text-[26px] text-white">Reset Password</h2>
          <p className="mt-2 opacity-70 text-[15px]">Enter your email to receive instructions</p>
        </div>

        {state?.error && (
          <div className="bg-red-500/20 border border-red-500/40 text-[#ffbaba] px-[15px] py-[12px] rounded-xl mb-[25px] text-center text-sm backdrop-blur-md flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
            <AlertCircle className="w-[18px] h-[18px]" />
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-[#baffda] px-[15px] py-[15px] rounded-xl mb-[25px] text-center text-sm backdrop-blur-md flex flex-col items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-1" />
            <p>{state.message}</p>
          </div>
        )}

        {!state?.success && (
          <form action={formAction}>
            <div className="mb-[30px]">
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

            <button 
              type="submit" 
              disabled={isPending}
              className="btn-primary-glass w-full mb-[20px] text-base py-3.5 tracking-[1px] uppercase disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2" 
              style={{ borderRadius: '16px' }}
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : "Send Instructions"}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-[13px] opacity-80 hover:opacity-100 text-white transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
