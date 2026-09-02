import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import ProductForm from "./product-form";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Novo produto"
        description="Cadastre um item no estoque com sua quantidade inicial."
      />
      <Card className="max-w-2xl">
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
    </div>
  );
}
