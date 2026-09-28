import "dotenv/config";

import bcrypt from "bcrypt";

import {
  AdminRole,
  PrismaClient,
} from "../app/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = "admin@10rubaisaapattukkadai.com";

  const existingAdmin = await prisma.adminUser.findUnique({
    where: {
      email,
    },
  });

  // Existing account → make it SUPER_ADMIN
  if (existingAdmin) {
    const admin = await prisma.adminUser.update({
      where: {
        email,
      },
      data: {
        role: AdminRole.SUPER_ADMIN,
      },
    });

    console.log("Existing admin updated.");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);

    return;
  }

  // First-time account creation
  const passwordHash = await bcrypt.hash(
    "ChangeMe@123",
    12
  );

  const admin = await prisma.adminUser.create({
    data: {
      name: "Admin",
      email,
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
    },
  });

  console.log("Super Admin created.");
  console.log("Email:", admin.email);
  console.log("Role:", admin.role);
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });