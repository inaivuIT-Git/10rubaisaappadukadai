import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/app/lib/prisma";
import { requireSuperAdmin } from "@/app/lib/admin-auth";
import { AdminRole } from "@/app/generated/prisma/client";

// =====================================================
// GET - List Admin Users
// SUPER_ADMIN only
// =====================================================

export async function GET() {
  try {
    const auth = await requireSuperAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        {
          message: auth.message,
        },
        {
          status: auth.status,
        }
      );
    }

    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        users,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Get admin users error:", error);

    return NextResponse.json(
      {
        message: "Unable to load users.",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// POST - Create Admin User
// SUPER_ADMIN only
// =====================================================

export async function POST(request: Request) {
  try {
    const auth = await requireSuperAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        {
          message: auth.message,
        },
        {
          status: auth.status,
        }
      );
    }

    const body = await request.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const role = body.role;

    // -------------------------------------------------
    // Required fields
    // -------------------------------------------------

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        {
          message: "Name, email, password and role are required.",
        },
        {
          status: 400,
        }
      );
    }

    // -------------------------------------------------
    // Validate role
    // -------------------------------------------------

    if (
      role !== AdminRole.SUPER_ADMIN &&
      role !== AdminRole.ADMIN
    ) {
      return NextResponse.json(
        {
          message: "Invalid user role.",
        },
        {
          status: 400,
        }
      );
    }

    // -------------------------------------------------
    // Password requirement
    // -------------------------------------------------

    if (password.length < 8) {
      return NextResponse.json(
        {
          message: "Password must contain at least 8 characters.",
        },
        {
          status: 400,
        }
      );
    }

    // -------------------------------------------------
    // Check duplicate email
    // -------------------------------------------------

    const existingUser = await prisma.adminUser.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "A user with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // -------------------------------------------------
    // Hash password
    // -------------------------------------------------

    const passwordHash = await bcrypt.hash(password, 12);

    // -------------------------------------------------
    // Create user
    // -------------------------------------------------

    const user = await prisma.adminUser.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully.",
        user,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create admin user error:", error);

    return NextResponse.json(
      {
        message: "Unable to create user.",
      },
      {
        status: 500,
      }
    );
  }
}