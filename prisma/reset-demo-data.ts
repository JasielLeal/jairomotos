// One-off utility to wipe everything the demo seed (and the base seed) create,
// while keeping the User table intact so existing logins keep working.
// Usage: npx tsx prisma/reset-demo-data.ts
import "dotenv/config";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Deletion order respects FK constraints (StockMovement/Invoice items use
  // Restrict on productId/customerId; Invoice and Motorcycle cascade their
  // own children automatically).
  await prisma.boleto.deleteMany({});
  await prisma.financialTransaction.deleteMany({});
  await prisma.stockMovement.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.motorcycle.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.customer.deleteMany({});

  console.log("Dados de demonstração apagados (usuários preservados).");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
