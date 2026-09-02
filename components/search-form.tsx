import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchForm({
  action,
  placeholder,
  defaultValue,
  hiddenParams,
}: {
  action: string;
  placeholder: string;
  defaultValue?: string;
  hiddenParams?: Record<string, string | undefined>;
}) {
  return (
    <form action={action} method="GET" className="flex gap-2">
      <div className="relative flex-1 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="pl-9"
        />
      </div>
      {hiddenParams &&
        Object.entries(hiddenParams).map(
          ([key, value]) => value && <input key={key} type="hidden" name={key} value={value} />
        )}
      <Button type="submit" variant="outline">
        Buscar
      </Button>
    </form>
  );
}
