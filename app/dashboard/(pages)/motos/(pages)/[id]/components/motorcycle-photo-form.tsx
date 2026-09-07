"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { updateMotorcycleImages } from "@/app/dashboard/(pages)/motos/lib/actions";
import { MultiImageUpload } from "@/components/ui/image-upload";
import { FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default function MotorcyclePhotoForm({
  motorcycleId,
  images,
}: {
  motorcycleId: string;
  images: string[];
}) {
  const action = updateMotorcycleImages.bind(null, motorcycleId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col items-center gap-4">
      <MultiImageUpload name="images" defaultValue={images} />

      {state?.message && <FormMessage message={state.message} tone="success" />}

      <Button type="submit" disabled={pending} size="lg">
        <Save className="size-4" />
        {pending ? "Salvando..." : "Salvar fotos"}
      </Button>
    </form>
  );
}
