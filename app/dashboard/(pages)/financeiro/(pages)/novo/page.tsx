import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { verifySession } from "@/lib/dal";
import TransactionForm from "./components/transaction-form";

export default async function NewTransactionPage() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    redirect("/dashboard/estoque");
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Novo lançamento"
        description="Para lançamentos gerados por vendas, aprove a nota correspondente."
      />
      <Card className="max-w-xl">
        <CardContent>
          <TransactionForm />
        </CardContent>
      </Card>
    </div>
  );
}
