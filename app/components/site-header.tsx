import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function SiteHeader() {
  const whatsappLink = buildWhatsAppLink(
    process.env.STORE_WHATSAPP,
    "Olá! Vim pelo site e gostaria de mais informações."
  );

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Jairo Motos" className="h-11 w-auto max-w-none" />
        </Link>

        <nav className="flex items-center gap-4 text-sm sm:gap-6">
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            Motos à venda
          </Link>
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <MessageCircle className="size-4" />
              <span className="hidden sm:inline">Fale conosco</span>
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
