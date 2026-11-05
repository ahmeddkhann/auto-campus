import "server-only";

import { cookies } from "next/headers";
import {
  PENDING_AUTH_COOKIE,
  PENDING_DURATION_SECONDS,
  SESSION_COOKIE,
  SESSION_DURATION_SECONDS,
  signPendingAuth,
  signSession,
  verifyToken,
  type PendingAuthPayload,
  type SessionPayload,
  type UserRole,
} from "@/lib/auth/jwt";

export type SessionData = SessionPayload & { pending?: boolean };

export async function createSessionCookie(user: PendingAuthPayload) {
  const token = await signSession({
    sub: user.sub,
    email: user.email,
    role: user.role,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });
}

export async function setPendingAuthCookie(user: PendingAuthPayload) {
  const token = await signPendingAuth(user);
  const cookieStore = await cookies();

  cookieStore.set(PENDING_AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: PENDING_DURATION_SECONDS,
    path: "/",
  });
}

export async function getPendingAuth(): Promise<PendingAuthPayload | null> {
  const cookieStore = await cookies();
  const session = await verifyToken(cookieStore.get(PENDING_AUTH_COOKIE)?.value);

  if (!session?.pending) {
    return null;
  }

  return { sub: session.sub, email: session.email, role: session.role };
}

export async function clearPendingAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(PENDING_AUTH_COOKIE);
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const session = await verifyToken(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session || session.pending) {
    return null;
  }

  return session;
}

export async function verifySession() {
  return getSession();
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(PENDING_AUTH_COOKIE);
}

export async function requireAdmin() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    throw new Error("Admin access required");
  }

  return session;
}

export async function requireTeacher() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    throw new Error("Teacher access required");
  }

  return session;
}

export type { UserRole };
