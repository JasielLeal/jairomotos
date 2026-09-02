import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Conexão direta (sem pooler) — necessária para o Prisma Migrate/CLI.
    // Cai para DATABASE_URL quando DIRECT_URL não está definida (ex.: build
    // na Vercel, que só roda `prisma generate` e não precisa de conexão real).
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
