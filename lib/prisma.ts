import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

declare global {
  var prisma: PrismaClient | undefined;
}

function criarClient() {
  const adapter = new PrismaLibSql({
    url: `file:${path.join(process.cwd(), "prisma", "dev.db")}`,
  });
  return new PrismaClient({ adapter });
}

export const prisma = global.prisma || criarClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}