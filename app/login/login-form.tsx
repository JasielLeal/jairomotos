"use client";

import { useId, useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { login } from "@/lib/actions/auth";
import { Field, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const rememberId = useId();

  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="Email" htmlFor="email" error={state?.errors?.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@jairomotos.com"
          required
        />
      </Field>

      <Field label="Senha" htmlFor="password" error={state?.errors?.password}>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Digite sua senha"
            required
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={showPassword}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
          </button>
        </div>
      </Field>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox id={rememberId} name="rememberMe" />
          <Label htmlFor={rememberId} className="font-normal text-muted-foreground">
            Lembrar de mim
          </Label>
        </div>
        <Link href="/esqueci-senha" className="text-sm font-medium text-primary hover:underline">
          Esqueceu sua senha?
        </Link>
      </div>

      {state?.message && <FormMessage message={state.message} />}

      <Button
        type="submit"
        disabled={pending}
        size="lg"
        className="mt-1 w-full shadow-lg shadow-primary/30"
      >
        <LogIn className="size-4" />
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
