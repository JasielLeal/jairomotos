"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

async function fileToCompressedDataUrl(file: File, maxDimension = 640, quality = 0.75) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível processar a imagem.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL("image/webp", quality);
}

export function ImageUpload({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(defaultValue ?? null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setProcessing(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setPreview(dataUrl);
    } catch (err) {
      console.error("image-upload:", err);
      setError("Não foi possível carregar essa imagem. Tente outra foto.");
    } finally {
      setProcessing(false);
    }
  }

  function handleRemove() {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex size-40 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Foto do produto" className="size-full object-cover" />
        ) : (
          <ImageIcon className="size-10 text-muted-foreground/40" />
        )}
        {processing && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-xs text-muted-foreground">
            Processando...
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input type="hidden" name={name} value={preview ?? ""} />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-3.5" />
          {preview ? "Trocar foto" : "Adicionar foto"}
        </Button>
        {preview && (
          <Button type="button" variant="ghost" size="sm" onClick={handleRemove}>
            <X className="size-3.5" />
            Remover
          </Button>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
