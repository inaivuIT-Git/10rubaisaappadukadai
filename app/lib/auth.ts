import { SignJWT, jwtVerify } from "jose";

import { AdminRole } from "@/app/generated/prisma/client";

const secretValue = process.env.ADMIN_AUTH_SECRET;

if (!secretValue) {
  throw new Error("ADMIN_AUTH_SECRET is not configured.");
}

const secret = new TextEncoder().encode(secretValue);

export type AdminTokenPayload = {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
};

export async function createAdminToken(
  payload: AdminTokenPayload
) {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject(payload.adminId)
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);

    if (
      !payload.sub ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      (payload.role !== AdminRole.SUPER_ADMIN &&
        payload.role !== AdminRole.ADMIN)
    ) {
      return null;
    }

    return {
      adminId: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}