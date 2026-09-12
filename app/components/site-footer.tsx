import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function SiteFooter() {
  const whatsappLink = buildWhatsAppLink(
    process.env.STORE_WHATSAPP,
    "Olá! Vim pelo site e gostaria de mais informações."
  );

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex shrink-0 flex-col gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Jairo Motos" className="h-10 w-20 max-w-none" />
          <p className="max-w-xs text-sm text-muted-foreground">
            Motos seminovas com procedência. Confira o estoque disponível e fale direto com a gente.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-foreground">Links</span>
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            Motos à venda
          </Link>
          <Link href="/login" className="text-muted-foreground transition-colors hover:text-foreground">
            Área do funcionário
          </Link>
        </div>

        {whatsappLink && (
          <div className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-foreground">Contato</span>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
          </div>
        )}
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Jairo Motos. Todos os direitos reservados.
      </div>
    </footer>
  );
}
