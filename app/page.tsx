import type { Metadata } from "next";
import Link from "next/link";
import { Bike, Calendar, Gauge, MessageCircle, Palette } from "lucide-react";
import { getAvailableMotorcycles } from "@/lib/motos/get-available-motorcycles";
import { formatCentsToBRL } from "@/lib/format";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/app/components/site-header";
import { SiteFooter } from "@/app/components/site-footer";

export const metadata: Metadata = {
  title: "Jairo Motos — Motos seminovas à venda",
  description: "Confira as motos seminovas disponíveis para venda na Jairo Motos.",
};

export default async function HomePage() {
  const motorcycles = await getAvailableMotorcycles();
  const storePhone = process.env.STORE_WHATSAPP;

  return (
    <div className="dark flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <section className="relative overflow-hidden bg-linear-to-br from-neutral-900 via-neutral-950 to-red-950">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-white text-balance sm:text-4xl">
            Motos seminovas com procedência
          </h1>
          <p className="mt-3 text-neutral-400 text-pretty">
            Confira as motos disponíveis para venda na Jairo Motos.
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        {motorcycles.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border py-20 text-center text-muted-foreground">
            <Bike className="size-10 opacity-40" />
            Nenhuma moto disponível no momento. Volte em breve!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {motorcycles.map((moto) => {
              const message = `Olá! Tenho interesse na ${moto.brand} ${moto.model} (${moto.year}), anunciada por ${formatCentsToBRL(moto.salePriceCents)}.`;
              const whatsappLink = buildWhatsAppLink(storePhone, message);

              return (
                <div
                  key={moto.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40"
                >
                  <Link href={`/motos/${moto.id}`} className="flex flex-1 flex-col">
                    <div className="aspect-4/3 shrink-0 overflow-hidden bg-muted">
                      {moto.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={moto.images[0]}
                          alt={`${moto.brand} ${moto.model}`}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <Bike className="size-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="text-lg font-semibold text-foreground group-hover:text-primary">
                        {moto.brand} {moto.model}
                      </h2>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3.5" /> {moto.year}
                        </span>
                        <span className="flex items-center gap-1">
                          <Gauge className="size-3.5" /> {moto.mileage.toLocaleString("pt-BR")} km
                        </span>
                        {moto.color && (
                          <span className="flex items-center gap-1">
                            <Palette className="size-3.5" /> {moto.color}
                          </span>
                        )}
                      </div>

                      {moto.description && (
                        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                          {moto.description}
                        </p>
                      )}

                      <p className="mt-4 text-2xl font-bold text-primary">
                        {formatCentsToBRL(moto.salePriceCents)}
                      </p>
                    </div>
                  </Link>

                  {whatsappLink && (
                    <div className="px-5 pb-5">
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ size: "lg" }), "w-full")}
                      >
                        <MessageCircle className="size-4" />
                        Tenho interesse
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
