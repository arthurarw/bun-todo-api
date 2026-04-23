import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_PATH: z.string().min(1).default("./database.sqlite"),
  COOKIE_NAME: z.string().min(1).default("tk_auth"),
  SESSION_TTL_HOURS: z.coerce.number().int().positive().default(24)
});

export const env = envSchema.parse(process.env);
