"use client";

import { useActionState } from "react";
import { UserPlus } from "lucide-react";
import { createUser } from "@/lib/actions/auth";
import { Field, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateUserForm() {
  const [state, action, pending] = useActionState(createUser, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Nome" htmlFor="name" error={state?.errors?.name} required>
        <Input id="name" name="name" required />
      </Field>
      <Field label="Email" htmlFor="email" error={state?.errors?.email} required>
        <Input id="email" name="email" type="email" required />
      </Field>
      <Field label="Senha" htmlFor="password" error={state?.errors?.password} required>
        <Input id="password" name="password" type="password" required minLength={8} />
      </Field>
      <Field label="Papel" htmlFor="role" error={state?.errors?.role} required>
        <Select name="role" defaultValue="EMPLOYEE" required items={{ EMPLOYEE: "Funcionário", ADMIN: "Administrador" }}>
          <SelectTrigger id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EMPLOYEE">Funcionário</SelectItem>
            <SelectItem value="ADMIN">Administrador</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {state?.message && <FormMessage message={state.message} tone="success" />}

      <div>
        <Button type="submit" disabled={pending} size="lg">
          <UserPlus className="size-4" />
          {pending ? "Criando..." : "Criar usuário"}
        </Button>
      </div>
    </form>
  );
}
