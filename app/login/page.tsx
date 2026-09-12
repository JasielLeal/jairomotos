import LoginForm from "./login-form";
import { displaySerif } from "./fonts";

export default function LoginPage() {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background p-4 text-foreground md:p-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-[28px] bg-card md:flex md:min-h-150">
        <div className="hidden md:flex md:w-[44%] md:p-3">
          <div className="relative flex w-full flex-col items-start justify-between overflow-hidden rounded-3xl bg-linear-to-br from-neutral-900 via-neutral-950 to-red-950 p-8 xl:p-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Jairo Motos" className="h-14 w-auto max-w-none shrink-0" />

            <div className="max-w-sm">
              <h1 className="text-2xl font-bold leading-tight text-white text-balance xl:text-3xl">
                Gestão completa para sua oficina.
              </h1>
              <p className="mt-3 text-sm text-neutral-400 text-pretty">
                Entre para acessar o painel de estoque, notas e financeiro.
              </p>
            </div>

            <p className="text-xs text-neutral-600">
              © {new Date().getFullYear()} Jairo Motos. Todos os direitos reservados.
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center p-8 sm:p-10 md:p-12">
          <div className="mx-auto w-full max-w-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Jairo Motos" className="mx-auto mb-8 h-14 w-auto max-w-none md:hidden" />

            <h2 className={`${displaySerif.className} text-3xl font-bold tracking-tight text-foreground`}>
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre com seu email e senha para acessar sua conta
            </p>

            <div className="mt-8">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
