import "server-only";
import { z } from "zod";

const database = z
  .string()
  .url()
  .refine(
    (value) => ["postgres:", "postgresql:"].includes(new URL(value).protocol),
    "Se requiere una URL PostgreSQL.",
  );
export function databaseUrl() {
  const result = database.safeParse(process.env.DATABASE_URL);
  if (!result.success)
    throw new Error(
      "Configura DATABASE_URL antes de utilizar la base de datos.",
    );
  return result.data;
}
export function authSecret() {
  const result = z.string().min(32).safeParse(process.env.BETTER_AUTH_SECRET);
  if (!result.success)
    throw new Error(
      "Configura BETTER_AUTH_SECRET con al menos 32 caracteres aleatorios.",
    );
  return result.data;
}
export function emailConfig() {
  const result = z
    .object({ key: z.string().startsWith("re_"), from: z.email() })
    .safeParse({
      key: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM_EMAIL,
    });
  if (!result.success)
    throw new Error(
      "Configura RESEND_API_KEY y RESEND_FROM_EMAIL con un remitente verificado.",
    );
  return result.data;
}
