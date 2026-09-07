import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { verifySession } from "@/lib/dal";
import { getInvoiceDetail } from "@/app/dashboard/(pages)/notas/(pages)/[id]/lib/get-invoice-detail";
import { renderInvoicePdfBuffer } from "@/app/dashboard/(pages)/notas/(pages)/[id]/lib/invoice-pdf";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await verifySession();

  const { id } = await params;
  const detail = await getInvoiceDetail(id);
  if (!detail) {
    return new Response("Nota não encontrada.", { status: 404 });
  }

  const logoPath = path.join(process.cwd(), "public", "logo.png");

  const buffer = await renderInvoicePdfBuffer({
    invoice: detail.invoice,
    subtotalCents: detail.subtotalCents,
    logoPath: existsSync(logoPath) ? pathToFileURL(logoPath).href : undefined,
    storePhone: process.env.STORE_WHATSAPP || undefined,
  });

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="nota-${detail.invoice.number}.pdf"`,
    },
  });
}
