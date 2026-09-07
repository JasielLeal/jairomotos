"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { requireAdmin } from "@/lib/dal";
import {
  LoginSchema,
  LoginState,
  CreateUserSchema,
  CreateUserState,
} from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const validated = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { email, password } = validated.data;
  const rememberMe = formData.get("rememberMe") === "on";

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return { message: "Email ou senha inválidos." };
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return { message: "Email ou senha inválidos." };
  }

  await createSession(user.id, user.role, rememberMe);
  redirect(user.role === "ADMIN" ? "/dashboard" : "/dashboard/estoque");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

export async function createUser(
  _state: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  await requireAdmin();

  const validated = CreateUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, email, password, role } = validated.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { errors: { email: ["Este email já está em uso."] } };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.user.create({
    data: { name, email, passwordHash, role },
  });

  revalidatePath("/dashboard/usuarios");
  return { message: "Usuário criado com sucesso." };
}
