"use client";

import { useState } from "react";
import { Bike } from "lucide-react";
import { cn } from "@/lib/utils";

export function MotorcycleGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {images.length > 1 && (
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-1 sm:w-20 sm:shrink-0 sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:pb-0">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver foto ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:size-20",
                index === active
                  ? "border-primary"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${alt} — foto ${index + 1}`} className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="order-1 aspect-4/3 flex-1 overflow-hidden rounded-2xl border border-border bg-muted sm:order-2">
        {hasImages ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[active]} alt={alt} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Bike className="size-16 text-muted-foreground/30" />
          </div>
        )}
      </div>
    </div>
  );
}
