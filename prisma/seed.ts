import "dotenv/config";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";
import bcrypt from "bcryptjs";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DIRECT_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@jairomotos.com";
  const adminName = process.env.ADMIN_NAME ?? "Administrador";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "troque-esta-senha";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: { name: adminName, email: adminEmail, passwordHash, role: "ADMIN" },
    });
    console.log(`Usuário admin criado: ${adminEmail} / senha: ${adminPassword}`);
  } else {
    console.log(`Usuário admin já existia: ${adminEmail}`);
  }

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    await prisma.product.createMany({
      data: [
        {
          sku: "OL-5W30",
          name: "Óleo Motor 5W30 1L",
          category: "Óleo e Lubrificantes",
          unit: "un",
          costCents: 1800,
          priceCents: 3200,
          quantity: 20,
          minStock: 5,
        },
        {
          sku: "PN-TRAS",
          name: "Pastilha de Freio Traseira",
          category: "Freios",
          unit: "par",
          costCents: 3500,
          priceCents: 6900,
          quantity: 10,
          minStock: 3,
        },
        {
          sku: "PNEU-100",
          name: "Pneu Traseiro 100/90-18",
          category: "Pneus e Câmaras",
          unit: "un",
          costCents: 12000,
          priceCents: 19900,
          quantity: 4,
          minStock: 2,
        },
      ],
    });
    console.log("Produtos de exemplo criados.");
  }

  const customerCount = await prisma.customer.count();
  if (customerCount === 0) {
    await prisma.customer.create({
      data: { name: "Cliente Exemplo", phone: "(11) 99999-0000" },
    });
    console.log("Cliente de exemplo criado.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
