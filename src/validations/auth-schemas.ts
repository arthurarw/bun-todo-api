import { z } from "zod";

export const registerSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z
    .string()
    .min(6, "A senha precisa ter no mínimo 6 caracteres.")
    .max(32, "A senha pode ter no máximo 32 caracteres.")
});

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1)
});
