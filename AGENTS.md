<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## ASIVQUARK: contexto y alcance

Web corporativa de software y productos digitales en Barcelona. Dominio público único: `https://asivquark.com`. Iteración 1: arquitectura, sistema de diseño, home e integraciones preparadas. No implementar siguientes fases sin petición expresa.

Leer `README.md`, `docs/arquitectura.md`, `docs/producto.md` y `docs/seo.md` antes de ampliar funcionalidades. Actualizar documentos afectados y registrar comprobaciones reales en `docs/validacion.md`.

## Convenciones

- pnpm como gestor único, lockfile versionado, Node >=22.12 (recomendado 22 LTS).
- Código en `src/`, alias `@/`, App Router y TypeScript estricto. Sin `any`, carpetas vacías ni capas anticipadas.
- Server Components por defecto; menú móvil es frontera cliente. Contenido SEO en HTML inicial.
- Primitivas en `components/ui`, marca en `branding`, shell en `layout`, secciones en `marketing`.
- Tokens en `globals.css`, Manrope y JetBrains Mono vía `next/font`, iconos Lucide. Respetar teclado, focus, contraste y movimiento reducido.
- BrandLogo es texto provisional: reutilizar el original cuando se facilite, sin rediseñar identidad.
- No inventar proyectos, métricas, testimonios, contactos ni contenido legal.

## Entornos y seguridad

- URLs centralizadas en `src/config/site.ts`; `VERCEL_ENV` separa preview/producción, `NODE_ENV` no.
- Producción exige `https://asivquark.com`. Preview usa `VERCEL_URL`, sin canonical público, con `noindex, nofollow` y sitemap vacío.
- Solo rutas públicas reales en sitemap; navegación relativa hacia destinos existentes.
- DB/auth/email usan `server-only` e inicialización diferida. La home funciona sin secretos ni consultas externas.
- ORM único: Prisma 7.10.0 y Prisma Migrate, PostgreSQL Neon mediante `@prisma/adapter-neon`. Cliente en `src/lib/prisma.ts`; `getPrisma()` reutiliza instancia con hot reload.
- Esquema en `prisma/schema.prisma`, cliente generado ignorado en `src/generated/prisma`. Generar antes de comprobar tipos; nunca editar archivos generados.
- DATABASE_URL pooled para runtime; DIRECT_URL directa para CLI en `prisma.config.ts`. No cambiar estrategia de dominios ni introducir Accelerate/Prisma Postgres.
- `drizzle/` es archivo histórico inactivo: conservarlo hasta verificar la línea base frente a la base real. Leer `docs/prisma.md` antes de migrar. No ejecutar reset/db push ni aceptar propuestas de reset.
- Better Auth 1.7.7 usa entrada `minimal` y adaptador Prisma explícito. Overrides pnpm excluyen únicamente sus dependencias/peers Drizzle; revisarlos al actualizar Better Auth.
- Registro público deshabilitado. Roles no editables desde cliente; comprobar permisos en servidor en cada futuro acceso privado.
- No versionar secretos ni `.env.local`. `.env.example` contiene solo documentación sin credenciales.
- No migrar bases externas, enviar emails, publicar producción o modificar DNS sin autorización explícita para la operación.

## Verificación

Preservar cambios del usuario y consultar las guías relevantes de Next.js instalado antes de editar. Ejecutar `pnpm prisma validate`, `pnpm db:generate`, `pnpm lint`, `pnpm typecheck`, `pnpm test:config`, `pnpm test:db`, `pnpm build`; revisar escritorio y móvil si existe navegador. No afirmar resultados o métricas sin ejecución. Documentar límites y bloqueos. Instalación/build generan cliente, no aplican migraciones.

## Blog
Antes de crear, editar o maquetar cualquier cosa bajo `/blog` (páginas, componentes del blog o artículos en `content/blog/`), lee `docs/BLOG-DESIGN.md` y síguelo. No introduzcas colores, tamaños tipográficos ni componentes nuevos sin añadirlos antes a ese documento. Si un cambio altera la anatomía del artículo, el frontmatter o los componentes MDX, actualiza `docs/BLOG-DESIGN.md` en el mismo cambio.
