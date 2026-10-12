# Arquitectura — Iteración 3

## Responsabilidades

`app/` define rutas y metadata nativa. `(marketing)` añade cabecera y footer sin alterar la URL. `components/ui` define primitivas; `marketing` compone contenido sin servicios externos. `config/navigation.ts` es compartido con el cliente; `config/site.ts` se consume en servidor y configuración Next para validar orígenes y despliegue. `lib/seo` prepara metadata reutilizable. `content/services.ts` define contenidos comerciales tipados; `content/projects.ts` mantiene únicamente proyectos reales publicados (colección vacía actualmente). `ServicePage` comparte componentes y sitúa el proceso según el recorrido editorial de cada servicio.

DB, auth, email y validaciones privadas usan `server-only`. Sus clientes se inicializan al consumirse, sin efectos de red al importar ni durante build de marketing. Se añadirá `features/` cuando exista lógica real que separar, sin crear placeholders.

## Renderizado y diseño

Ocho páginas de marketing prerenderizables con contenido SEO en HTML inicial. Menú móvil y enlaces activos son fronteras cliente pequeñas. Contacto limita `useSearchParams` a la preselección bajo Suspense; el formulario tiene validación cliente y POST JSON, aislados del resto de marketing. Button usa unión de props para distinguir botón/enlace; no hay estado global ni fetch del navegador. Tailwind 4 conserva la integración Turbopack de la plantilla 16.4 y React Compiler. Geist se descarga durante build y se sirve localmente vía `next/font`.

Tokens en globals, contenedores y secciones reutilizables, tipografía responsive, sin recursos gráficos externos o animaciones pesadas.

## Persistencia y migraciones

Prisma ORM 7.10.0 con `@prisma/adapter-neon` conserva Neon PostgreSQL. `src/lib/prisma.ts` crea Prisma Client al utilizarse mediante `getPrisma()` y reutiliza instancia en `globalThis` durante hot reload. El adaptador usa un pool WebSocket de Neon al conectarse, con DATABASE_URL pooled. Runtime Node.js, sin Accelerate ni Prisma Postgres. No hay consultas durante build público.

`prisma/schema.prisma` conserva user, session, account y verification mediante `@@map`, columnas con `@map`, texto PostgreSQL y timestamp sin zona con precisión 6 (la precisión predeterminada anterior). Se mantienen nulabilidad, claves, índices, defaults y cascadas; actualización automática pasa de la lógica del ORM anterior a `@updatedAt`. IDs siguen siendo responsabilidad de Better Auth. Los modelos comerciales añadidos en la iteración 3 se mantienen separados de las tablas de auth.

Prisma Migrate mantiene SQL en `prisma/migrations`; línea base 0_init idéntica al SQL anterior, sin aplicar. El archivo histórico `drizzle/` se conserva inactivo. CLI en `prisma.config.ts`, variables cargadas con `@next/env`, DIRECT_URL directa sin fallback. Generación de cliente en `src/generated/prisma` al instalar/build sin conexión externa. [Transición segura y baselining](prisma.md).

## Auth y email

Better Auth con adaptador oficial Prisma y provider postgresql. `transaction: false` conserva la configuración previa; el nuevo driver soporta WebSockets, sin cambiar política transaccional en esta tarea. Instancia diferida, trusted origin exacto, cookies seguras en HTTPS y sesiones de siete días. API App Router en runtime Node.js, sin registro público, OAuth, UI o usuarios ficticios; 503 cuando faltan credenciales.

`requireAdmin()` comprueba sesión y exige rol admin desde servidor. Cada futuro acceso privado debe invocarlo; preparar provisioning y respuestas HTTP de autorización antes de activar dashboard. No confundir configuración de auth con un área privada terminada.

Resend valida mensajes de texto y configuración al enviar. Leads consume Resend mediante outbox, con opt-in explícito para envíos reales. Remitente verificado, reintentos y flujos de recuperación se definirán cuando haya casos reales.

## Evolución y despliegue

Build por entorno, ramas Neon separadas, sin disco persistente ni migraciones al desplegar. No promover metadata de preview a producción. Añadir rutas públicas completas a sitemap y metadata; nuevas rutas privadas necesitan autorización de servidor. Arquitectura modular sencilla sin ampliar alcance antes de solicitud.

## Marketing y captación

Marketing conserva ocho rutas estáticas, contenido local y SEO. `features/leads` separa contrato, atribución, seguridad, repositorio y procesamiento. Formularios en `components/forms`, plantillas en `emails`, configuración privada en `config/contact.ts`. No hay consultas DB al renderizar las páginas.

`POST /api/leads/` ejecuta controles de origen, cuerpo, admisión, Zod, honeypot e idempotencia. Una transacción crea lead, eventos y outbox. La respuesta solo confirma persistencia; `after()` intenta efectos secundarios. Un comando privado procesa pendientes con reservas e idempotencia del proveedor. Otro ejecuta retención explícita según vencimiento. No se crean endpoints administrativos ni cron público.

LeadRateBucket utiliza PostgreSQL y hashes temporales para compartir límites. Captura pública bloqueada sin aviso real/versionado y configuración operativa. Local solo para pruebas cuando falta información legal. Sin tracking persistente de navegador ni logs de datos personales.

Única dependencia nueva: tsx de desarrollo para tests/comandos. Sin cambios de Better Auth, domain strategy o servicios externos adicionales. [Arquitectura y límites de leads](leads.md).

## Actualización — Iteración 4

Layout administrativo separado, Server Actions y consultas protegidas en features/crm; notas/eventos transaccionales, concurrencia optimista y limitador de login PostgreSQL. Véase [CRM](crm.md) para implementación, procedimientos y límites actuales. Las secciones anteriores describen la fase previa.

## Rediseño público — 12/10/2026

Nueve rutas públicas: home, índice de servicios, cuatro detalles estáticos bajo `/servicios/[slug]/`, proyectos, nosotros y contacto. `generateStaticParams` fija los cuatro slugs y `dynamicParams=false`; desconocidos reciben 404. Retiradas las cuatro landings antiguas sin compatibilidad. `publicPaths` actualiza sitemap y lista de atribución admitida.

Shell público con Manrope, Montserrat y JetBrains Mono mediante `next/font`, estilos bajo `.marketing` y Geist conservado para privado. El footer servidor se compone en cada página con prop `cta`; contacto usa `false`. Menú móvil con `dialog.showModal()`, bloqueo de scroll, aislamiento modal nativo, Escape/restauración y cierre al pasar a escritorio. Configurador, filtros y observador de eventos son fronteras cliente; eventos CustomEvent locales sin red ni almacenamiento.

Servicios centralizan slug, tipo público, contrato, descripción, inclusiones y destinatarios. No hay CMS ni fichas de proyectos. El formulario mantiene API, validación Zod, idempotencia, timeout, reintento y controles legales. `projectTypeForContract()` adapta el tipo público solo al construir el payload.

## Iteración 6 — Consentimiento

Provider cliente acotado al shell público; páginas siguen servidor. Inventario central y Zod en features/cookies; cookie host-only de decisión, sin DB. Atribución y eventos verifican permiso antes de operar. Diálogo nativo y trigger en footer; política SSR. [Arquitectura y límites](cookies.md).

## Iteración 7 — Quinto servicio

Catálogo breve en `config/services.ts` compartido por navegación y etiquetas de leads, separado del contenido extenso de `content/automation.ts`. `Service.href` permite la nueva landing raíz sin alterar las cuatro rutas anteriores; generateStaticParams y búsqueda bajo `/servicios/[slug]` excluyen servicios de otra ubicación. Página de automatización servidor, estática y sin consultas a Neon; reutiliza primitivas comerciales. Formulario adapta tipo público/contrato mediante project-type y reconoce ambos parámetros documentados. CRM y emails consumen las mismas etiquetas; Lead.service String no requiere migración. Cookies y fronteras servidor/cliente existentes conservadas.

## SEO de diseño web y blog estático

WebDesignPage seleccionada únicamente para uiType=web, reutilizando primitivas comerciales con opciones que conservan defaults de otros servicios. Copy en web-design.ts; href/canonical existentes bajo servicios. Blog público estático autorizado: catálogo pequeño en config/blog.ts y cuerpo en content/articles.ts; índice y detalles Server Components, generateStaticParams y slugs cerrados. Sin estados, CMS, consultas DB o dependencias nuevas. Breadcrumbs reutiliza parent Blog/Servicios. Sitemap deriva las nuevas rutas; preview/local conservan aislamiento.

## Blog MDX — Guía con índice

`src/lib/blog/content.ts` descubre contenido local, valida frontmatter con Zod, genera TOC español desde el AST y calcula lectura. `ArticleBody` compila MDX local revisado en servidor con next-mdx-remote, remark y rehype-slug; headings numerados fuera del texto accesible. `src/components/marketing/blog/` concentra componentes editoriales y TOC cliente (IntersectionObserver y cierre del details móvil). El listado es SSR para filtros/paginación GET sin cliente adicional; artículos SSG y RSS force-static. Sitemap descubre todas las rutas MDX, conservando vacío en preview/local. `src/content/articles.ts` es solo una exportación de compatibilidad; el cuerpo vive exclusivamente en MDX. La card comercial de diseño web conserva su enlace estable en `src/config/blog.ts`; no hay que editar ese archivo al publicar una nueva guía.
