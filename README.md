# ASIVQUARK

Web corporativa de un estudio de desarrollo de software y productos digitales en Barcelona. Primera iteración: fundamento técnico, sistema de diseño y home provisional. Dominio público previsto: **https://asivquark.com**, sin `www`.

## Stack

Next.js 16.4 (App Router), React 19.3, TypeScript estricto, Tailwind CSS 4, Geist mediante `next/font`, Lucide React, Neon PostgreSQL, **Prisma ORM y Prisma Migrate 7.10.0**, Better Auth, Resend y Zod. Gestor: pnpm 12.11.2. Preparada para Vercel, sin despliegue realizado. Prisma 7.10.0 es estable; no instalar la release candidate de Prisma 8 actualmente etiquetada como `latest`.

## Inicio rápido

Requisitos: Node.js >=22.12 (recomendado Node 22 LTS), pnpm 12.11.2 y conexión para instalar y descargar Geist durante el build inicial.

```bash
npm install -g pnpm@12.11.2
pnpm install
cp .env.example .env.local
pnpm dev
```

Abrir http://localhost:3000. No hacen falta Neon, Better Auth ni Resend para visualizar la home. `.env.local` está ignorado; `.env.example` se versiona sin secretos.

## Estructura

```text
src/
  app/
    (marketing)/       # Home y shell corporativo
    api/auth/[...all]/ # API con inicialización diferida
    layout.tsx, globals.css, not-found.tsx
    robots.ts, sitemap.ts, icon.svg, opengraph-image.tsx
  components/
    branding/          # Logotipo provisional
    ui/                # Button, Container, Section, Card, SectionHeading
    layout/            # Header, menú móvil y footer
    marketing/         # Secciones de la home
  config/              # URLs por entorno y navegación
  lib/
    auth/              # Autenticación y autorización en servidor
    prisma.ts          # Prisma/Neon diferido, reutilizado con hot reload
    email/             # Resend transaccional
    seo/               # Metadata reutilizable
    validations/       # Variables privadas
  generated/prisma/    # Cliente generado; ignorado por Git
prisma/
  schema.prisma        # Cuatro modelos de autenticación
  migrations/0_init/   # Línea base SQL, sin aplicar
prisma.config.ts       # CLI, carga .env.local y conexión directa
drizzle/               # Archivo histórico inactivo, conservado por seguridad
tests/                 # Aislamiento de entornos
docs/                  # Arquitectura, producto, SEO y validación
```

No se crean carpetas vacías de funcionalidades futuras. `features/` se incorporará cuando contenga lógica real.

## Variables

| Variable               | Uso                                         | Obligatoria para home local |
| ---------------------- | ------------------------------------------- | --------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Origen público; localhost por defecto       | No                          |
| `BETTER_AUTH_URL`      | Origen de autenticación, coincide con sitio | No                          |
| `DATABASE_URL`         | URL Neon pooled privada para la aplicación  | No                          |
| `DIRECT_URL`           | URL Neon directa privada para Prisma CLI    | No                          |
| `BETTER_AUTH_SECRET`   | Secreto aleatorio de al menos 32 caracteres | No                          |
| `RESEND_API_KEY`       | API key privada                             | No                          |
| `RESEND_FROM_EMAIL`    | Remitente real verificado                   | No                          |

Vercel aporta `VERCEL_ENV` y `VERCEL_URL`; no deben copiarse como secretos locales. Nunca prefijar variables privadas con `NEXT_PUBLIC_`.

## Dominio y entornos

| Entorno    | Detección                                | Origen                  | Indexación |
| ---------- | ---------------------------------------- | ----------------------- | ---------- |
| Local      | Ausencia de `VERCEL_ENV` o `development` | `http://localhost:3000` | No         |
| Preview    | `VERCEL_ENV=preview`                     | `https://${VERCEL_URL}` | No         |
| Producción | `VERCEL_ENV=production`                  | `https://asivquark.com` | Sí         |

Un `pnpm build` local no publica metadata de producción aunque `NODE_ENV=production`. `src/config/site.ts` centraliza la validación: producción exige el dominio exacto; auth debe coincidir. Preview utiliza el origen oficial temporal para sitio y auth, incluso si hereda valores de producción. No hay canonical fuera de producción; sitemap vacío en local/preview y no anunciado por robots.

Configurar exclusivamente en Vercel **Production**:

```env
NEXT_PUBLIC_SITE_URL=https://asivquark.com
BETTER_AUTH_URL=https://asivquark.com
```

Para probar un build público fuera de Vercel se necesitan ambas variables y `VERCEL_ENV=production`. Volver a valores locales antes de ejecutar dev. No promover artefactos construidos como preview a producción.

`next.config.ts` prepara la redirección permanente 308 de www a la versión sin www, solo en producción. Ambos dominios deben configurarse con TLS en Vercel posteriormente. No se ha modificado DNS ni asumido conexión del dominio.

## Neon y Prisma

Copiar las URLs reales de la consola Neon: `DATABASE_URL` pooled para la aplicación y `DIRECT_URL` directa para migraciones, introspección y Studio. No construir hostnames manualmente. Ambas deben apuntar a la misma base/rama y utilizar los parámetros TLS suministrados por Neon. Usar ramas separadas para desarrollo, previews y producción.

`getPrisma()` utiliza `@prisma/adapter-neon` con WebSockets y Prisma Client 7.10.0 en Node.js. Valida DATABASE_URL al utilizarse, mantiene una instancia por proceso y la reutiliza en `globalThis` durante hot reload. No se conecta ni valida secretos al importar módulos de marketing.

`prisma/schema.prisma` utiliza el generador moderno `prisma-client`, salida explícita `src/generated/prisma`, y PostgreSQL. Importar desde `@/generated/prisma/client`; los archivos generados no se versionan. Instalación y build generan el cliente automáticamente sin credenciales. `prisma.config.ts` carga el entorno con `@next/env`; las URLs ya no se declaran en el esquema Prisma 7. La CLI exige DIRECT_URL para operaciones de base, sin fallback a una URL ficticia ni a la pooled.

```bash
pnpm db:generate
# Solo con una base/rama de desarrollo configurada:
pnpm db:migrate --name descripcion_del_cambio
pnpm db:generate
# En despliegues autorizados, aplicar únicamente migraciones ya revisadas:
pnpm db:deploy
```

La línea base `0_init` conserva el SQL anterior con cuatro tablas de autenticación y rol. No se ha aplicado. Si la base está vacía, aplicar migraciones después de confirmar destino y autorización. **Si contiene tablas, primero respaldar e inspeccionar; nunca ejecutar la línea base sobre tablas existentes.** El procedimiento de [transición segura](docs/prisma.md) explica cómo verificar equivalencia y marcar la línea base aplicada sin recrear datos.

`migrate dev` crea/aplica migraciones en desarrollo y utiliza una shadow database; si solicita reset, cancelar. `migrate deploy` aplica únicamente archivos existentes y no genera cliente. No se ejecuta ninguno automáticamente al instalar, construir o desplegar en Vercel. No utilizar reset ni db push en esta transición.

## Better Auth

Configurar base de datos, secreto y origen del entorno antes de utilizar `/api/auth/*`. Generar secreto con `openssl rand -base64 48`, guardándolo únicamente en variables privadas.

Instancia diferida mediante `getAuth()`, adaptador oficial `@better-auth/prisma-adapter` con provider `postgresql`. Los modelos Prisma conservan tablas físicas mediante `@@map`, columnas mediante `@map`, índices y claves foráneas. Se mantiene `transaction: false` para preservar la configuración previa del adaptador. API devuelve 503 sin credenciales; la home sigue funcionando. Email/contraseña preparado, registro público deshabilitado, sin OAuth, login visual ni usuarios sembrados. Sesiones de siete días y cookies seguras en HTTPS.

`role` no admite entrada del cliente y tiene valor `user`. `requireAdmin()` exige sesión y rol admin en servidor; debe invocarse en cada futura página, acción y API privada. Crear administradores, recuperación de contraseña y controles de abuso definitivos queda pendiente antes de activar administración. Ocultar rutas no es autorización.

## Resend

Configurar API key y email real de un dominio verificado. `sendTransactionalEmail()` valida destinatario, asunto y texto en servidor; inicializa el cliente solo al enviar. No tiene consumidores activos, formulario ni automatización. No se han enviado emails ni inventado remitentes.

## Scripts

| Comando            | Función                                                |
| ------------------ | ------------------------------------------------------ |
| `pnpm dev`         | Desarrollo con Turbopack                               |
| `pnpm build`       | Generar Prisma Client y build optimizado               |
| `pnpm start`       | Servir build existente                                 |
| `pnpm lint`        | ESLint sin advertencias permitidas                     |
| `pnpm typecheck`   | Tipos de rutas y TypeScript                            |
| `pnpm test:config` | Pruebas de URLs y aislamiento                          |
| `pnpm test:db`     | Comparación offline del esquema y línea base histórica |
| `pnpm db:generate` | Generar Prisma Client sin conectar a DB                |
| `pnpm db:migrate`  | Crear y aplicar migraciones en desarrollo              |
| `pnpm db:deploy`   | Aplicar migraciones existentes, con autorización       |
| `pnpm db:studio`   | Abrir Prisma Studio con DIRECT_URL                     |

`postinstall` genera Prisma Client. `pnpm-workspace.yaml` permite scripts de herramientas necesarias: esbuild, sharp, unrs-resolver, prisma y @prisma/engines. ESLint 9 se conserva por los peers de los plugins Next.js, pendientes de compatibilidad con 10.

Better Auth 1.7.7 incluye adaptadores de otros ORM y peers opcionales. Overrides limitados a esa versión excluyen su adaptador Drizzle y los peers drizzle-orm/drizzle-kit para evitar conservarlos transitivamente. La aplicación usa `better-auth/minimal` y el adaptador Prisma explícito, según la recomendación oficial para adaptadores externos. Al actualizar Better Auth revisar esos overrides y las pruebas.

## Vercel

Importar repositorio con preset Next.js, Node 22 LTS, instalación `pnpm install --frozen-lockfile` y build `pnpm build`. Ambos procesos generan Prisma Client; las páginas estáticas no consultan Neon. Las rutas con Prisma usan runtime Node.js. Sin Accelerate, Prisma Postgres ni almacenamiento local persistente. Configurar variables por entorno y revisar preview antes de autorizar producción. Credenciales privadas solo al activar servicios; migraciones en un paso administrativo autorizado separado del build.

Antes de publicación comercial: canal de contacto real, contenido legal y revisión final de contenido y accesibilidad. No se ha desplegado producción.

## Alcance y siguientes fases

Implementado: home responsive, navegación por anclas, logotipo tipográfico provisional, componentes y tokens, metadata, OG, icono, robots/sitemap e integraciones diferidas. Proyectos informa de próximos casos reales; contacto explica que el canal está en preparación.

Pendiente: servicios completos, proyectos reales, blog, CMS, dashboard, leads, formularios, login, flujos email, páginas legales y mediciones Core Web Vitals. No comenzar otra iteración sin petición expresa.

- [Arquitectura](docs/arquitectura.md)
- [Producto](docs/producto.md)
- [SEO](docs/seo.md)
- [Validación](docs/validacion.md)
- [Prisma y transición de migraciones](docs/prisma.md)
- [Instrucciones de agentes](AGENTS.md)

Referencias: [Better Auth/Prisma](https://better-auth.com/docs/adapters/prisma), [Prisma 7 PostgreSQL](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql), [configuración Prisma 7](https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference), [baselining](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/baselining), [Resend](https://resend.com/docs/send-with-nextjs). Para Next, consultar primero las guías instaladas en `node_modules/next/dist/docs/`.
