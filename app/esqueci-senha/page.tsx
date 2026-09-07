import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { displaySerif } from "../login/fonts";

export default function ForgotPasswordPage() {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-sm rounded-[28px] bg-card p-8 text-center sm:p-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Jairo Motos" className="mx-auto mb-8 h-14 w-auto" />

        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <KeyRound className="size-5" />
        </div>

        <h1 className={`${displaySerif.className} text-2xl font-bold tracking-tight text-foreground`}>
          Recuperar senha
        </h1>
        <p className="mt-2 text-sm text-muted-foreground text-pretty">
          As contas deste painel são criadas e gerenciadas por um administrador. Para redefinir
          sua senha, entre em contato com o administrador do sistema.
        </p>

        <Link
          href="/login"
          className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full shadow-lg shadow-primary/30")}
        >
          <ArrowLeft className="size-4" />
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}
