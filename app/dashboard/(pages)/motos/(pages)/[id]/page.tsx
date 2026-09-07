import { notFound } from "next/navigation";
import { formatCentsToBRL, formatDateTime } from "@/lib/format";
import { getMotorcycleDetail } from "@/app/dashboard/(pages)/motos/(pages)/[id]/lib/get-motorcycle-detail";
import { MotorcycleStatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditMotorcycleForm from "@/app/dashboard/(pages)/motos/(pages)/[id]/components/edit-motorcycle-form";
import MotorcyclePhotoForm from "@/app/dashboard/(pages)/motos/(pages)/[id]/components/motorcycle-photo-form";
import MotorcycleActionsPanel from "@/app/dashboard/(pages)/motos/(pages)/[id]/components/motorcycle-actions-panel";

export default async function MotorcycleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const detail = await getMotorcycleDetail(id);
  if (!detail) notFound();
  const { motorcycle } = detail;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
            {motorcycle.brand} {motorcycle.model}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {motorcycle.year} · {motorcycle.color || "cor não informada"} ·{" "}
            {motorcycle.mileage.toLocaleString("pt-BR")} km
          </p>
        </div>
        <MotorcycleStatusBadge status={motorcycle.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Editar moto</CardTitle>
          </CardHeader>
          <CardContent>
            <EditMotorcycleForm motorcycle={motorcycle} />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Fotos</CardTitle>
            </CardHeader>
            <CardContent>
              <MotorcyclePhotoForm motorcycleId={motorcycle.id} images={motorcycle.images} />
            </CardContent>
          </Card>

          {motorcycle.status === "SOLD" && (
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da venda</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Comprador</p>
                    <p className="font-medium text-foreground">
                      {motorcycle.buyerName || "Não informado"}
                    </p>
                  </div>
                  {motorcycle.buyerPhone && (
                    <div>
                      <p className="text-xs text-muted-foreground">Telefone</p>
                      <p className="font-medium text-foreground">{motorcycle.buyerPhone}</p>
                    </div>
                  )}
                  {motorcycle.soldAt && (
                    <div>
                      <p className="text-xs text-muted-foreground">Data da venda</p>
                      <p className="font-medium text-foreground">
                        {formatDateTime(motorcycle.soldAt)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Valor vendido</p>
                    <p className="font-medium text-foreground">
                      {formatCentsToBRL(motorcycle.soldPriceCents ?? 0)}
                    </p>
                  </div>
                </div>

                {motorcycle.saleProofImages.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs text-muted-foreground">Comprovantes</p>
                    <div className="flex flex-wrap gap-3">
                      {motorcycle.saleProofImages.map((src, index) => (
                        <a
                          key={index}
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="size-24 shrink-0 overflow-hidden rounded-xl border border-border bg-muted"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`Comprovante ${index + 1}`}
                            className="size-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <MotorcycleActionsPanel motorcycle={motorcycle} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
