import type { ReactNode } from "react";

export function EmptyState({ icon, message }: { icon?: ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      {icon && <div className="text-muted-foreground/50">{icon}</div>}
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
