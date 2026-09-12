import Link from "next/link";
import { Button } from "@/components/ui/button";

export const PAGE_SIZE = 10;

export function PaginationBar({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function pageHref(page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Página {currentPage} de {totalPages}
      </p>
      <div className="flex gap-2">
        {currentPage > 1 ? (
          <Button variant="outline" size="sm" render={<Link href={pageHref(currentPage - 1)} />}>
            Anterior
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
        )}
        {currentPage < totalPages ? (
          <Button variant="outline" size="sm" render={<Link href={pageHref(currentPage + 1)} />}>
            Próxima
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Próxima
          </Button>
        )}
      </div>
    </div>
  );
}
