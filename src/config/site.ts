import { z } from "zod";

export const productionOrigin = "https://asivquark.com";
export const localOrigin = "http://localhost:3000";

type Environment = {
  VERCEL_ENV?: string;
  VERCEL_URL?: string;
  NEXT_PUBLIC_SITE_URL?: string;
  BETTER_AUTH_URL?: string;
};

function parseOrigin(value: string, name: string) {
  const result = z.url().safeParse(value);
  if (!result.success)
    throw new Error(`${name}: introduce una URL absoluta válida.`);
  const url = new URL(result.data);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      `${name}: debe ser un origen HTTP(S), sin ruta ni credenciales.`,
    );
  }
  return url.origin;
}

export function resolveSite(environment: Environment) {
  const mode = environment.VERCEL_ENV ?? "development";
  if (!["production", "preview", "development"].includes(mode))
    throw new Error("VERCEL_ENV no válido.");
  const isProduction = mode === "production";
  const isPreview = mode === "preview";
  let origin: string;
  if (isProduction) {
    origin = parseOrigin(
      environment.NEXT_PUBLIC_SITE_URL ?? "",
      "NEXT_PUBLIC_SITE_URL",
    );
    if (origin !== productionOrigin)
      throw new Error(`Producción requiere ${productionOrigin}.`);
  } else if (isPreview) {
    if (!environment.VERCEL_URL)
      throw new Error("Preview requiere VERCEL_URL.");
    origin = parseOrigin(`https://${environment.VERCEL_URL}`, "VERCEL_URL");
    if (
      new URL(origin).hostname === "asivquark.com" ||
      new URL(origin).hostname === "www.asivquark.com"
    )
      throw new Error("Preview no puede utilizar el dominio de producción.");
  } else {
    origin = parseOrigin(
      environment.NEXT_PUBLIC_SITE_URL || localOrigin,
      "NEXT_PUBLIC_SITE_URL",
    );
    if (!["localhost", "127.0.0.1", "[::1]"].includes(new URL(origin).hostname))
      throw new Error("Desarrollo debe utilizar un origen local.");
  }
  // Vercel preview overrides accidentally inherited production/local auth URLs.
  const authOrigin = isPreview
    ? origin
    : parseOrigin(environment.BETTER_AUTH_URL || origin, "BETTER_AUTH_URL");
  if (authOrigin !== origin)
    throw new Error(
      "BETTER_AUTH_URL debe coincidir con el origen del entorno.",
    );
  return { origin, authOrigin, isProduction, isPreview, mode };
}

// This module is consumed only by server components and Next configuration.
export const site = {
  name: "ASIVQUARK",
  title: "Desarrollo de Software y Diseño Web en Barcelona | ASIVQUARK",
  description:
    "Desarrollamos páginas web, aplicaciones y software a medida para empresas y emprendedores en Barcelona. Descubre ASIVQUARK.",
  ...resolveSite({
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  }),
};
