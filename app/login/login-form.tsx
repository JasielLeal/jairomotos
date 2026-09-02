"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { login } from "@/lib/actions/auth";
import { Field, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Email" htmlFor="email" error={state?.errors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>

      <Field label="Senha" htmlFor="password" error={state?.errors?.password}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>

      {state?.message && <FormMessage message={state.message} />}

      <Button type="submit" disabled={pending} size="lg" className="mt-2 w-full">
        <LogIn className="size-4" />
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
