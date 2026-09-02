"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function ClickableRow({
  href,
  className,
  onClick,
  ...props
}: { href: string } & ComponentProps<typeof TableRow>) {
  const router = useRouter();

  return (
    <TableRow
      onClick={(e) => {
        // Let nested links/buttons (e.g. the row's own title link) handle their own click.
        if ((e.target as HTMLElement).closest("a, button")) return;
        onClick?.(e);
        router.push(href);
      }}
      className={cn("cursor-pointer", className)}
      {...props}
    />
  );
}
