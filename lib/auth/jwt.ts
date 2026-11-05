import { SignJWT, jwtVerify } from "jose";

export type UserRole = "admin" | "teacher" | "student";

export type SessionPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

export type PendingAuthPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

export const SESSION_COOKIE = "session";
export const PENDING_AUTH_COOKIE = "pending-auth";

const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;
const PENDING_DURATION_SECONDS = 10 * 60;

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "SESSION_SECRET is not set. Add it to .env.local before using authentication."
    );
  }

  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function signPendingAuth(payload: PendingAuthPayload) {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
    pending: true,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${PENDING_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyToken(
  token: string | undefined
): Promise<(SessionPayload & { pending?: boolean }) | null> {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey());

    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      (payload.role !== "admin" &&
        payload.role !== "teacher" &&
        payload.role !== "student")
    ) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      pending: payload.pending === true,
    };
  } catch {
    return null;
  }
}

export function roleHome(role: UserRole) {
  if (role === "admin") return "/admin";
  if (role === "teacher") return "/teacher";
  return "/";
}

export { SESSION_DURATION_SECONDS, PENDING_DURATION_SECONDS };
