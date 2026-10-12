import { z } from "zod";
export const serviceSchema = z.enum(
  ["web", "software", "aplicacion", "mvp", "otro"],
  { error: "Selecciona un tipo de proyecto válido." },
);
export const serviceLabels = {
  web: "Página web",
  software: "Software a medida",
  aplicacion: "Aplicación web",
  mvp: "Desarrollo MVP",
  otro: "Otro proyecto",
} as const;
export const budgetLabels = {
  under_2000: "Menos de 2.000 €",
  from_2000_5000: "Entre 2.000 y 5.000 €",
  from_5000_10000: "Entre 5.000 y 10.000 €",
  from_10000_25000: "Entre 10.000 y 25.000 €",
  over_25000: "Más de 25.000 €",
  undecided: "Todavía no lo sé",
} as const;
const plainText = (value: string) =>
  !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F<>]/u.test(value);
const singleLine = (value: string) => value.trim().replace(/\s+/gu, " ");
const optionalText = (max: number) =>
  z
    .string()
    .transform(singleLine)
    .pipe(
      z
        .string()
        .max(max)
        .refine(plainText, "Utiliza texto sin etiquetas HTML."),
    )
    .optional()
    .transform((value) => value || undefined);
export const leadSchema = z.strictObject({
  name: z
    .string()
    .transform(singleLine)
    .pipe(
      z
        .string()
        .min(2, "Introduce al menos 2 caracteres.")
        .max(100, "Máximo 100 caracteres.")
        .refine(plainText, "Utiliza texto sin etiquetas HTML."),
    ),
  email: z
    .string()
    .trim()
    .pipe(z.email("Introduce un email válido.").max(254))
    .transform((value) => {
      const at = value.lastIndexOf("@");
      return value.slice(0, at) + "@" + value.slice(at + 1).toLowerCase();
    }),
  company: optionalText(150),
  phone: optionalText(40).refine(
    (value) =>
      !value ||
      (/^[+\d\s().\-#xX]+$/u.test(value) &&
        (value.match(/\d/g)?.length ?? 0) >= 5),
    "Introduce un teléfono válido, incluyendo prefijo si corresponde.",
  ),
  projectType: serviceSchema,
  budget: z
    .union([
      z.enum(
        Object.keys(budgetLabels) as [
          keyof typeof budgetLabels,
          ...(keyof typeof budgetLabels)[],
        ],
      ),
      z.literal(""),
    ])
    .optional()
    .transform((value) => value || undefined),
  description: z
    .string()
    .trim()
    .transform((value) => value.replace(/\r\n?/g, "\n"))
    .pipe(
      z
        .string()
        .min(20, "Describe el proyecto con al menos 20 caracteres.")
        .max(5000, "Máximo 5.000 caracteres.")
        .refine(plainText, "Utiliza texto sin etiquetas HTML."),
    ),
  privacy: z.literal(true, {
    error: "Debes leer la información de privacidad y marcar la casilla.",
  }),
});
const attributionValue = z
  .string()
  .trim()
  .max(150)
  .refine(plainText)
  .optional();
export const attributionSchema = z.strictObject({
  landingPath: z.string().max(200).optional(),
  originPath: z.string().max(200).optional(),
  referrer: z.string().max(300).optional(),
  utmSource: attributionValue,
  utmMedium: attributionValue,
  utmCampaign: attributionValue,
  utmContent: attributionValue,
  utmTerm: attributionValue,
});
export const leadRequestSchema = leadSchema.extend({
  website: z.string().max(200).optional(),
  attribution: attributionSchema.optional(),
});
export type LeadInput = z.output<typeof leadSchema>;
export type LeadRequest = z.output<typeof leadRequestSchema>;
export type Attribution = z.output<typeof attributionSchema>;
export type FieldErrors = Partial<
  Record<keyof z.input<typeof leadSchema>, string>
>;
export type LeadResponse =
  | { success: true; message: string }
  | { success: false; message: string; fieldErrors?: FieldErrors };
