import "server-only";
import { Resend } from "resend";
import { z } from "zod";
import { emailConfig } from "@/lib/validations/server-env";
const message = z.object({
  to: z.email(),
  subject: z.string().min(1).max(200),
  text: z.string().min(1),
});
export async function sendTransactionalEmail(input: z.input<typeof message>) {
  const data = message.parse(input);
  const config = emailConfig();
  const { data: result, error } = await new Resend(config.key).emails.send({
    from: config.from,
    ...data,
  });
  if (error) throw new Error("No se ha podido enviar el email transaccional.");
  return result;
}
