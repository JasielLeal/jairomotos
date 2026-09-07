"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Bike,
  FileText,
  Wallet,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard, exact: true, adminOnly: true },
  { href: "/dashboard/estoque", label: "Estoque", icon: Package },
  { href: "/dashboard/motos", label: "Motos", icon: Bike },
  {
    href: "/dashboard/motos/financeiro",
    label: "Financeiro Motos",
    icon: Wallet,
    exact: true,
    adminOnly: true,
  },
  { href: "/dashboard/notas", label: "Notas", icon: FileText },
  { href: "/dashboard/financeiro", label: "Financeiro", icon: Wallet, adminOnly: true },
];

export default function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  const items = isAdmin
    ? [...NAV_ITEMS, { href: "/dashboard/usuarios", label: "Usuários", icon: UserCog }]
    : NAV_ITEMS.filter((item) => !item.adminOnly);

  // Only the most specific match (longest href) is highlighted, so a nested
  // route like /dashboard/motos/financeiro doesn't light up both "Motos" and
  // its own item at once.
  const activeHref = items
    .filter((item) => (item.exact ? pathname === item.href : pathname.startsWith(item.href)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => {
        const active = item.href === activeHref;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-11 items-center gap-3 rounded-lg px-3 text-[0.95rem] font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="size-5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
