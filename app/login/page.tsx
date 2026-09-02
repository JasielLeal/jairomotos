import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-card p-8 text-card-foreground shadow-sm ring-1 ring-foreground/10">
        <div className="mb-8 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Jairo Motos" className="mb-4 h-20 w-auto rounded-lg" />
          <p className="text-sm text-muted-foreground">
            Entre com sua conta para acessar o painel
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
