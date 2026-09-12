import { LogOut } from "lucide-react";
import { getCurrentUser } from "@/lib/dal";
import { logout } from "@/lib/actions/auth";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const user = await getCurrentUser();

  return (
    <div className="flex h-screen overflow-hidden bg-muted/40">
      <aside className="flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex items-center border-b border-sidebar-border px-4 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Jairo Motos" className="h-12 w-auto max-w-none" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <Sidebar isAdmin={user.role === "ADMIN"} />
        </div>
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</p>
              <p className="truncate text-xs text-sidebar-foreground/60">{user.email}</p>
            </div>
            <ThemeToggle />
          </div>
          <form action={logout}>
            <Button
              type="submit"
              variant="ghost"
              className="mt-1 w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <LogOut className="size-4" />
              Sair
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="flex flex-col gap-6">{children}</div>
      </main>
    </div>
  );
}
