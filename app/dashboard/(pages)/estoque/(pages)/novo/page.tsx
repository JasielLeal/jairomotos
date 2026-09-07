import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/dal";
import ProductForm from "./components/product-form";

export default async function NewProductPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Novo produto"
        description="Cadastre um item no estoque com sua quantidade inicial."
      />
      <Card className="max-w-2xl">
        <CardContent>
          <ProductForm isAdmin={user.role === "ADMIN"} />
        </CardContent>
      </Card>
    </div>
  );
}
