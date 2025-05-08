import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedData() {
  console.log("Checking for existing admin user");

  const existingAdmin = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
  });

  if (existingAdmin) {
    console.log("Admin user already exists");
    return;
  }

  const saltPassword = 10;
  const defaultPassword = "Admin@123";
  const hashedPassword = await bcrypt.hash(defaultPassword, saltPassword);

  //   create admin user
  const adminUser = await prisma.user.create({
    data: {
      firstName: "Gaurav Rana",
      email: "gauravrana@gmail.com",
      password: hashedPassword,
      country: "India",
      role: "ADMIN",
      verified: true,
    },
  });
}

async function main() {
  try {
    console.log("Seeding data...");
    await seedData();
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
