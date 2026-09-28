import { cookies } from "next/headers";

import { prisma } from "@/app/lib/prisma";
import { verifyAdminToken } from "@/app/lib/auth";
import { AdminRole } from "@/app/generated/prisma/client";

export type AuthenticatedAdmin = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
};

export async function getAuthenticatedAdmin(): Promise<
  AuthenticatedAdmin | null
> {
  const cookieStore = await cookies();

  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyAdminToken(token);

  if (!payload) {
    return null;
  }

  const admin = await prisma.adminUser.findUnique({
    where: {
      id: payload.adminId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!admin || !admin.isActive) {
    return null;
  }

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
}

export async function requireSuperAdmin() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    return {
      authorized: false as const,
      status: 401,
      message: "Unauthorized.",
    };
  }

  if (admin.role !== AdminRole.SUPER_ADMIN) {
    return {
      authorized: false as const,
      status: 403,
      message: "Super Admin access required.",
    };
  }

  return {
    authorized: true as const,
    admin,
  };
}