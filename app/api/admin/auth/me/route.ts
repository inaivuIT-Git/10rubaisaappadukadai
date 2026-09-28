import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/app/lib/prisma";
import { verifyAdminToken } from "@/app/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("admin_session")?.value;

    // No session cookie
    if (!token) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    // Verify JWT token
    const payload = await verifyAdminToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          message: "Invalid or expired session.",
        },
        {
          status: 401,
        }
      );
    }

    // Confirm admin still exists and is active
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
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    // Valid authenticated admin
    return NextResponse.json(
      {
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Admin session verification error:",
      error
    );

    return NextResponse.json(
      {
        message: "Unable to verify session.",
      },
      {
        status: 500,
      }
    );
  }
}