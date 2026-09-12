import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Gauge, MessageCircle, Palette } from "lucide-react";
import { getAvailableMotorcycleById } from "@/lib/motos/get-available-motorcycles";
import { formatCentsToBRL } from "@/lib/format";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/app/components/site-header";
import { SiteFooter } from "@/app/components/site-footer";
import { MotorcycleGallery } from "@/app/motos/[id]/components/motorcycle-gallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const moto = await getAvailableMotorcycleById(id);
  if (!moto) return { title: "Moto não encontrada — Jairo Motos" };

  return {
    title: `${moto.brand} ${moto.model} (${moto.year}) — Jairo Motos`,
    description: moto.description ?? `${moto.brand} ${moto.model} ${moto.year} à venda na Jairo Motos.`,
  };
}

export default async function MotorcycleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const moto = await getAvailableMotorcycleById(id);
  if (!moto) notFound();

  const storePhone = process.env.STORE_WHATSAPP;
  const message = `Olá! Tenho interesse na ${moto.brand} ${moto.model} (${moto.year}), anunciada por ${formatCentsToBRL(moto.salePriceCents)}.`;
  const whatsappLink = buildWhatsAppLink(storePhone, message);

  return (
    <div className="dark flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar para as motos
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <MotorcycleGallery images={moto.images} alt={`${moto.brand} ${moto.model}`} />

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {moto.brand} {moto.model}
            </h1>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" /> {moto.year}
              </span>
              <span className="flex items-center gap-1.5">
                <Gauge className="size-4" /> {moto.mileage.toLocaleString("pt-BR")} km
              </span>
              {moto.color && (
                <span className="flex items-center gap-1.5">
                  <Palette className="size-4" /> {moto.color}
                </span>
              )}
            </div>

            <p className="mt-6 text-3xl font-bold text-primary sm:text-4xl">
              {formatCentsToBRL(moto.salePriceCents)}
            </p>

            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "lg" }), "mt-5 w-full sm:w-auto")}
              >
                <MessageCircle className="size-4" />
                Tenho interesse
              </a>
            )}

            {moto.description && (
              <div className="mt-8 border-t border-border pt-6">
                <h2 className="text-sm font-semibold text-foreground">Descrição</h2>
                <p className="mt-2 text-sm whitespace-pre-line text-muted-foreground">
                  {moto.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
