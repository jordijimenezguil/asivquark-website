// Compatibility exports for existing callers. The definitive contract lives in leads.
export {
  leadSchema as contactSchema,
  serviceSchema as projectTypeSchema,
} from "../../features/leads/schema.ts";
export type { LeadInput as ContactInput } from "../../features/leads/schema.ts";
import { serviceSchema } from "../../features/leads/schema.ts";
export function parseProjectType(value: string | string[] | undefined) {
  const result = serviceSchema.safeParse(value);
  return result.success ? result.data : undefined;
}
