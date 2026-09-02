import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Conexão direta (sem pooler) — necessária para o Prisma Migrate/CLI.
    url: env("DIRECT_URL"),
  },
});
