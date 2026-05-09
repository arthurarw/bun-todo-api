import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, "Título obrigatório.").max(150, "Título muito longo."),
  description: z
    .string()
    .trim()
    .max(500, "Descrição muito longa.")
    .optional()
});

export const updateTodoStatusSchema = z.object({
  status: z.enum(["pending", "completed"])
});

export const findByIdSchema = z.object({
  id: z.uuid()
});
