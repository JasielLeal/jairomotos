import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { verifySession } from "@/lib/dal";
import BoletoForm from "./components/boleto-form";

export default async function NewBoletoPage() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    redirect("/dashboard/estoque");
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Novo boleto"
        description="Cadastre um boleto a pagar ou a receber para acompanhar o vencimento."
      />
      <Card className="max-w-xl">
        <CardContent>
          <BoletoForm />
        </CardContent>
      </Card>
    </div>
  );
}
