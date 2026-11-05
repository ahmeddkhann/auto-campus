import Link from "next/link";
import { GraduationCap } from "lucide-react";

import { Navbar } from "@/components/ui/navbar";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#1a56db] to-[#7e3af2] text-white">
      <Navbar />

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/20">
          <GraduationCap className="h-16 w-16" aria-hidden="true" />
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          Transform School Management
        </h1>

        <p className="mb-10 max-w-2xl leading-relaxed text-blue-50/90">
          Auto Campus is a comprehensive school management system built with
          Next.js and Supabase. Streamline administration, classroom management,
          and communication in one powerful platform.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-white px-8 py-4 text-lg font-medium text-blue-700 transition-colors hover:bg-blue-50"
          >
            Admin Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-white/40 bg-white/10 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-white/20"
          >
            Sign Up as Admin
          </Link>
        </div>

        <div className="mt-16 border-t border-white/20 pt-8">
          <p className="text-sm text-blue-100/70">
            Auto Campus School Management System • Built with Next.js 16 &
            Supabase
          </p>
        </div>
      </div>
    </main>
  );
}
