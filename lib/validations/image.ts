import * as z from "zod";

export const MAX_IMAGES = 5;

function isValidImageValue(value: string) {
  return value.startsWith("data:image/") || value.startsWith("https://");
}

// New photos arrive as compressed "data:image/..." URIs (uploaded to Cloudinary
// by the server action); already-saved photos arrive as their Cloudinary
// "https://" URL, resubmitted untouched by the multi-image picker.
export function imagesArraySchema(min = 0) {
  const base =
    min > 0
      ? z
          .array(z.string().trim())
          .min(min, { error: "Anexe ao menos uma foto." })
          .max(MAX_IMAGES, { error: `Máximo de ${MAX_IMAGES} fotos.` })
      : z.array(z.string().trim()).max(MAX_IMAGES, { error: `Máximo de ${MAX_IMAGES} fotos.` });

  return base.refine((arr) => arr.every(isValidImageValue), {
    error: "Uma das fotos é inválida.",
  });
}
