import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

async function criarClient() {
  if (process.env.NODE_ENV === "production") {
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL_PROD!,
    });
    return new PrismaClient({ adapter });
  }

  const { PrismaBetterSqlite3 } = await import("@prisma/adapter-better-sqlite3");
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}

const prismaGlobal = global.prisma ?? await criarClient();

export const prisma = prismaGlobal;

if (process.env.NODE_ENV !== "production") {
  global.prisma = prismaGlobal;
}