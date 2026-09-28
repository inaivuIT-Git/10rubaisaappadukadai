import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/app/lib/prisma";
import { createAdminToken } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    // -----------------------------------------
    // Read and validate request body
    // -----------------------------------------
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          message: "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }

    const email = body.email?.trim();
    const password = body.password;

    // -----------------------------------------
    // Validate required fields
    // -----------------------------------------
    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // Find admin
    // -----------------------------------------
    const admin = await prisma.adminUser.findUnique({
      where: {
        email,
      },
    });

    // Do not reveal whether the email exists
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        {
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    // -----------------------------------------
    // Verify password
    // -----------------------------------------
    const passwordMatches = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    // -----------------------------------------
    // Create 2-hour authentication token
    // -----------------------------------------
   const token = await createAdminToken({
  adminId: admin.id,
  email: admin.email,
  name: admin.name,
  role: admin.role,
});

    // -----------------------------------------
    // Create successful response
    // -----------------------------------------
    const response = NextResponse.json(
      {
        message: "Login successful.",
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      },
      {
        status: 200,
      }
    );

    // -----------------------------------------
    // Store token in HTTP-only cookie
    // -----------------------------------------
    response.cookies.set({
      name: "admin_session",
      value: token,

      // JavaScript in the browser cannot read this cookie
      httpOnly: true,

      // HTTPS only in production
      secure: process.env.NODE_ENV === "production",

      sameSite: "lax",

      path: "/",

      // 2 hours
      maxAge: 60 * 60 * 2,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        message: "Unable to login.",
      },
      {
        status: 500,
      }
    );
  }
}