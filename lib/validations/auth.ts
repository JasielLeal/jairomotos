import * as z from "zod";

export const LoginSchema = z.object({
  email: z.email({ error: "Informe um email válido." }).trim(),
  password: z.string().min(1, { error: "Informe a senha." }),
});

export type LoginState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const CreateUserSchema = z.object({
  name: z.string().min(2, { error: "Nome muito curto." }).trim(),
  email: z.email({ error: "Informe um email válido." }).trim(),
  password: z
    .string()
    .min(8, { error: "A senha deve ter ao menos 8 caracteres." })
    .trim(),
  role: z.enum(["ADMIN", "EMPLOYEE"]),
});

export type CreateUserState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        role?: string[];
      };
      message?: string;
    }
  | undefined;
