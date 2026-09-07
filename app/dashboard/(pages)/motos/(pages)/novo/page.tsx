import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import MotorcycleForm from "@/app/dashboard/(pages)/motos/(pages)/novo/components/motorcycle-form";

export default function NewMotorcyclePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nova moto"
        description="Cadastre uma moto para revenda com seu custo de aquisição."
      />
      <Card className="max-w-2xl">
        <CardContent>
          <MotorcycleForm />
        </CardContent>
      </Card>
    </div>
  );
}
