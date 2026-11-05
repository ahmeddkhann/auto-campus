"use client";

import Link from "next/link";
import { useActionState } from "react";

import { verifyOTP, type AuthState } from "@/actions/auth";

export default function VerifyOTPPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    verifyOTP,
    null
  );

  return (
    <>
      <h1 className="mb-2 text-center text-2xl font-bold">Check your email</h1>
      <p className="mb-6 text-center text-sm text-zinc-500">
        Enter the 6-digit code we sent you. It expires in 5 minutes.
      </p>

      {state?.error && (
        <p
          role="alert"
          className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
        >
          {state.error}
        </p>
      )}

      <form action={formAction} className="space-y-5">
        <input
          name="code"
          type="text"
          required
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          maxLength={6}
          pattern="[0-9]{6}"
          placeholder="000000"
          aria-label="6-digit verification code"
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-zinc-700"
        />

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Verifying..." : "Verify code"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Wrong account?{" "}
        <Link href="/login" className="font-semibold text-blue-600">
          Sign in again
        </Link>
      </p>
    </>
  );
}
