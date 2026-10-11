# Arquitectura — Iteración 1

## Responsabilidades

`app/` define rutas y metadata nativa. `(marketing)` añade cabecera y footer sin alterar la URL. `components/ui` define primitivas; `marketing` compone contenido sin servicios externos. `config/navigation.ts` es compartido con el cliente; `config/site.ts` se consume en servidor y configuración Next para validar orígenes y despliegue. `lib/seo` prepara metadata reutilizable.

DB, auth, email y validaciones privadas usan `server-only`. Sus clientes se inicializan al consumirse, sin efectos de red al importar ni durante build de marketing. Se añadirá `features/` cuando exista lógica real que separar, sin crear placeholders.

## Renderizado y diseño

Home prerenderizable, contenido completo en HTML. Solo menú móvil mantiene estado cliente. Button usa unión de props para distinguir botón/enlace; no hay estado global ni fetch del navegador. Tailwind 4 conserva la integración Turbopack de la plantilla 16.4 y React Compiler. Geist se descarga durante build y se sirve localmente vía `next/font`.

Tokens en globals, contenedores y secciones reutilizables, tipografía responsive, sin recursos gráficos externos o animaciones pesadas.

## Persistencia y migraciones

Prisma ORM 7.10.0 con `@prisma/adapter-neon` conserva Neon PostgreSQL. `src/lib/prisma.ts` crea Prisma Client al utilizarse mediante `getPrisma()` y reutiliza instancia en `globalThis` durante hot reload. El adaptador usa un pool WebSocket de Neon al conectarse, con DATABASE_URL pooled. Runtime Node.js, sin Accelerate ni Prisma Postgres. No hay consultas durante build público.

`prisma/schema.prisma` conserva user, session, account y verification mediante `@@map`, columnas con `@map`, texto PostgreSQL y timestamp sin zona con precisión 6 (la precisión predeterminada anterior). Se mantienen nulabilidad, claves, índices, defaults y cascadas; actualización automática pasa de la lógica del ORM anterior a `@updatedAt`. IDs siguen siendo responsabilidad de Better Auth. No hay modelos comerciales.

Prisma Migrate mantiene SQL en `prisma/migrations`; línea base 0_init idéntica al SQL anterior, sin aplicar. El archivo histórico `drizzle/` se conserva inactivo. CLI en `prisma.config.ts`, variables cargadas con `@next/env`, DIRECT_URL directa sin fallback. Generación de cliente en `src/generated/prisma` al instalar/build sin conexión externa. [Transición segura y baselining](prisma.md).

## Auth y email

Better Auth con adaptador oficial Prisma y provider postgresql. `transaction: false` conserva la configuración previa; el nuevo driver soporta WebSockets, sin cambiar política transaccional en esta tarea. Instancia diferida, trusted origin exacto, cookies seguras en HTTPS y sesiones de siete días. API App Router en runtime Node.js, sin registro público, OAuth, UI o usuarios ficticios; 503 cuando faltan credenciales.

`requireAdmin()` comprueba sesión y exige rol admin desde servidor. Cada futuro acceso privado debe invocarlo; preparar provisioning y respuestas HTTP de autorización antes de activar dashboard. No confundir configuración de auth con un área privada terminada.

Resend valida mensajes de texto y configuración al enviar. No existe consumidor activo. Remitente verificado, reintentos y flujos de recuperación se definirán cuando haya casos reales.

## Evolución y despliegue

Build por entorno, ramas Neon separadas, sin disco persistente ni migraciones al desplegar. No promover metadata de preview a producción. Añadir rutas públicas completas a sitemap y metadata; nuevas rutas privadas necesitan autorización de servidor. Arquitectura modular sencilla sin ampliar alcance antes de solicitud.
