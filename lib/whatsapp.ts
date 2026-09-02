import { formatCentsToBRL } from "@/lib/format";

export function buildInvoiceMessage(invoice: {
  number: number;
  customerName: string;
  items: { name: string; quantity: number; unit: string; subtotalCents: number }[];
  services: { description: string; amountCents: number }[];
  discountCents: number;
  totalCents: number;
}): string {
  const lines: string[] = [];

  lines.push(`Olá, ${invoice.customerName}! Aqui está sua nota #${invoice.number} da Jairo Motos:`);
  lines.push("");

  if (invoice.items.length > 0) {
    lines.push("*Itens:*");
    for (const item of invoice.items) {
      lines.push(`- ${item.quantity}${item.unit} ${item.name} — ${formatCentsToBRL(item.subtotalCents)}`);
    }
    lines.push("");
  }

  if (invoice.services.length > 0) {
    lines.push("*Serviços:*");
    for (const service of invoice.services) {
      lines.push(`- ${service.description} — ${formatCentsToBRL(service.amountCents)}`);
    }
    lines.push("");
  }

  if (invoice.discountCents > 0) {
    lines.push(`Desconto: -${formatCentsToBRL(invoice.discountCents)}`);
  }

  lines.push(`*Total: ${formatCentsToBRL(invoice.totalCents)}*`);
  lines.push("");
  lines.push("Obrigado pela preferência! 🏍️");

  return lines.join("\n");
}

export function buildWhatsAppLink(phone: string | null | undefined, message: string): string | null {
  if (!phone) return null;

  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;

  const withCountryCode = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(message)}`;
}
