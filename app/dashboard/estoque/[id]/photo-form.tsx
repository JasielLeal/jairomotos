"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { updateProductImage } from "@/lib/actions/products";
import { ImageUpload } from "@/components/ui/image-upload";
import { FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default function ProductPhotoForm({
  productId,
  imageData,
}: {
  productId: string;
  imageData: string | null;
}) {
  const action = updateProductImage.bind(null, productId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col items-center gap-4">
      <ImageUpload name="imageData" defaultValue={imageData} />

      {state?.message && <FormMessage message={state.message} tone="success" />}

      <Button type="submit" disabled={pending} size="lg">
        <Save className="size-4" />
        {pending ? "Salvando..." : "Salvar foto"}
      </Button>
    </form>
  );
}
