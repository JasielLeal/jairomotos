import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import TransactionForm from "./transaction-form";

export default function NewTransactionPage() {
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
