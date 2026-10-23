# ASIVQUARK

Web corporativa de un estudio de desarrollo de software y productos digitales en Barcelona. Sitio público con servicios, proyectos, nosotros, contacto, blog y documentos legales; captación y CRM privado implementados. Rediseño global Foco aplicado en octubre de 2026. Dominio público: **https://asivquark.com**, sin `www`.

## Stack

Next.js 16.4 (App Router), React 19.3, TypeScript estricto, Tailwind CSS 4, Manrope y JetBrains Mono mediante `next/font`, Lucide React, Neon PostgreSQL, **Prisma ORM y Prisma Migrate 7.10.0**, Better Auth, Resend y Zod. Gestor: pnpm 12.11.2. Preparada para Vercel, sin despliegue realizado. Prisma 7.10.0 es estable; no instalar la release candidate de Prisma 8 actualmente etiquetada como `latest`.

## Inicio rápido

Requisitos: Node.js >=22.12 (recomendado Node 22 LTS), pnpm 12.11.2 y conexión para instalar y descargar las fuentes durante el build inicial.

```bash
npm install -g pnpm@12.11.2
pnpm install
cp .env.example .env.local
pnpm dev
```

Abrir http://localhost:3000. No hacen falta Neon, Better Auth ni Resend para visualizar las ocho páginas de marketing. `.env.local` está ignorado; `.env.example` se versiona sin secretos.

## Estructura

```text
src/
  app/
    (marketing)/       # Ocho páginas públicas y shell corporativo
    api/auth/[...all]/ # API con inicialización diferida
    layout.tsx, globals.css, not-found.tsx
    robots.ts, sitemap.ts, icon.svg, opengraph-image.tsx
  components/
    branding/          # Logotipo provisional
    ui/                # Button, Container, Section, Card, SectionHeading
    layout/            # Header, menú móvil y footer
    marketing/         # Heroes, servicios, FAQ, proceso y CTA
    forms/             # Contacto interactivo y estados accesibles
  features/leads/      # Contratos, repositorio, seguridad y outbox
  emails/              # Plantillas seguras en HTML y texto
  content/             # Servicios y proyectos públicos tipados y versionados
  config/              # URLs por entorno y navegación
  lib/
    auth/              # Autenticación y autorización en servidor
    prisma.ts          # Prisma/Neon diferido, reutilizado con hot reload
    email/             # Resend transaccional
    seo/               # Metadata reutilizable
    validations/       # Variables privadas
  generated/prisma/    # Cliente generado; ignorado por Git
prisma/
  schema.prisma        # Cuatro modelos de auth y cuatro modelos de captación
  migrations/0_init/   # Línea base SQL, sin aplicar
prisma.config.ts       # CLI, carga .env.local y conexión Neon
drizzle/               # Archivo histórico inactivo, conservado por seguridad
scripts/               # Procesamiento privado de emails
tests/                 # Entornos, regresión DB y leads con dobles
docs/                  # Arquitectura, producto, SEO y validación
```

No se crean carpetas vacías de funcionalidades futuras. `features/leads/` contiene lógica real de captación; no hay módulos vacíos para un CRM futuro.

## Variables

| Variable               | Uso                                         | Obligatoria para home local |
| ---------------------- | ------------------------------------------- | --------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Origen público; localhost por defecto       | No                          |
| `BETTER_AUTH_URL`      | Origen de autenticación, coincide con sitio | No                          |
| `DATABASE_URL`         | URL Neon pooled privada para la aplicación  | No                          |
| `DIRECT_URL`           | Override directo opcional para Prisma CLI   | No                          |
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

Copiar `DATABASE_URL` pooled real de la consola Neon: se utiliza en la aplicación y Prisma CLI, incluidas migraciones. `DIRECT_URL` es un override directo opcional para herramientas administrativas; si se configura, debe apuntar a la misma base/rama. No construir hostnames manualmente y conservar TLS. Usar ramas separadas para desarrollo, previews y producción.

`getPrisma()` utiliza `@prisma/adapter-neon` con WebSockets y Prisma Client 7.10.0 en Node.js. Valida DATABASE_URL al utilizarse, mantiene una instancia por proceso y la reutiliza en `globalThis` durante hot reload. No se conecta ni valida secretos al importar módulos de marketing.

`prisma/schema.prisma` utiliza el generador moderno `prisma-client`, salida explícita `src/generated/prisma`, y PostgreSQL. Importar desde `@/generated/prisma/client`; los archivos generados no se versionan. Instalación y build generan el cliente automáticamente sin credenciales. `prisma.config.ts` carga el entorno con `@next/env`; las URLs ya no se declaran en el esquema Prisma 7. La CLI utiliza DIRECT_URL si está configurada; en su ausencia usa DATABASE_URL. No hay URLs ficticias. Neon permite migraciones sobre su conexión pooled.

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

Instancia diferida mediante `getAuth()`, adaptador oficial `@better-auth/prisma-adapter` con provider `postgresql`. Los modelos Prisma conservan tablas físicas mediante `@@map`, columnas mediante `@map`, índices y claves foráneas. Se mantiene `transaction: false` para preservar la configuración previa del adaptador. API devuelve 503 sin credenciales; la home sigue funcionando. Email/contraseña preparado, registro público deshabilitado, sin OAuth ni usuarios sembrados; login visual añadido en iteración 4. Sesiones de siete días y cookies seguras en HTTPS.

`role` no admite entrada del cliente y tiene valor `user`. `requireAdmin()` exige sesión y rol admin en servidor; debe invocarse en cada futura página, acción y API privada. La iteración 4 añade aprovisionamiento privado, recuperación administrativa y limitador PostgreSQL. Ocultar rutas no es autorización.

## Resend

Configurar API key y email real de un dominio verificado. `sendTransactionalEmail()` valida destinatario, asunto y texto en servidor; inicializa el cliente solo al enviar. El módulo de leads añade emails HTML/texto y outbox mediante el SDK existente. Se activan automáticamente con API key y remitente válidos; no se han enviado emails en esta sesión. No hay automatizaciones de seguimiento ni remitentes inventados.

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
| `pnpm db:studio`   | Abrir Prisma Studio con conexión configurada                     |

`postinstall` genera Prisma Client. `pnpm-workspace.yaml` permite scripts de herramientas necesarias: esbuild, sharp, unrs-resolver, prisma y @prisma/engines. ESLint 9 se conserva por los peers de los plugins Next.js, pendientes de compatibilidad con 10.

Better Auth 1.7.7 incluye adaptadores de otros ORM y peers opcionales. Overrides limitados a esa versión excluyen su adaptador Drizzle y los peers drizzle-orm/drizzle-kit para evitar conservarlos transitivamente. La aplicación usa `better-auth/minimal` y el adaptador Prisma explícito, según la recomendación oficial para adaptadores externos. Al actualizar Better Auth revisar esos overrides y las pruebas.

## Vercel

Importar repositorio con preset Next.js, Node 22 LTS, instalación `pnpm install --frozen-lockfile` y build `pnpm build`. Ambos procesos generan Prisma Client; las páginas estáticas no consultan Neon. Las rutas con Prisma usan runtime Node.js. Sin Accelerate, Prisma Postgres ni almacenamiento local persistente. Configurar variables por entorno y revisar preview antes de autorizar producción. Credenciales privadas solo al activar servicios; migraciones en un paso administrativo autorizado separado del build.

Antes de publicación comercial: canal de contacto real, contenido legal y revisión final de contenido y accesibilidad. No se ha desplegado producción.

## Alcance y siguientes fases

Implementado en iteración 2: home definitiva, cuatro landings de servicios, nosotros, proyectos y contacto. Navegación con servicios desplegables en escritorio, listado en móvil e indicador de página activa. Footer con ubicación general y enlaces reales. Sin servicios externos para renderizar marketing.

### Rutas públicas

- `/`
- `/diseno-web-barcelona/`
- `/desarrollo-software-medida/`
- `/desarrollo-aplicaciones-web/`
- `/desarrollo-mvp/`
- `/proyectos/`
- `/nosotros/`
- `/contacto/`

`trailingSlash: true` redirige a las URLs con barra final. El sitemap usa la misma lista de ocho rutas de `src/config/navigation.ts`, sin fechas inventadas ni fichas de proyectos inexistentes. Canonicals absolutos, sin parámetros y sin www, exclusivamente en producción. Local y preview permanecen no indexables y sin canonical; el sitemap está vacío. No se ha desplegado ni cambiado DNS.

### Contenido y componentes

`src/content/services.ts` define cuatro servicios mediante el tipo `Service`: copy, SEO, secciones, proceso, FAQ y CTA. `ServicePage` compone las landings con un orden de proceso específico por servicio. Se reutilizan `PageHero`, `ServiceHero`, `ServiceCard`, `FeatureGrid`, `BenefitCard`, `ProcessSteps`, `FAQAccordion`, `ContactCTA` y `Breadcrumbs` del módulo `commercial.tsx`, además de las primitivas existentes y `ProjectCard`.

`src/content/projects.ts` contiene el modelo `PublicProject` (slug, título, resumen, categoría, descripción, tecnologías, imagen y publicación) y una colección vacía. Solo se muestran proyectos publicados; no se han creado fichas individuales. Incorporar trabajos reales con autorización antes de ampliar el portfolio.

Las páginas son Server Components. Las fronteras cliente se limitan al menú, enlaces de navegación con estado activo y formulario/atribución en memoria. Las FAQ usan `details/summary` nativos. El diseño combina cabeceras oscuras y lectura clara, con Geist y los tokens existentes.

### SEO y conversión

`pageMetadata()` en `src/lib/seo/metadata.ts` sigue centralizando title, description, metadataBase, canonical, robots, Open Graph y Twitter. Cada ruta declara textos propios. Las siete páginas interiores muestran breadcrumbs; en producción emiten `BreadcrumbList`. La home emite `Organization` y `WebSite`, con Barcelona como ubicación general y sin dirección postal ni contactos inventados. JSON-LD serializado con escape de `<`; no hay ratings ni marcado FAQPage.

Los servicios enlazan a contacto con `?servicio=web|software|aplicacion|mvp` y a un servicio relacionado. `data-conversion="project-contact"` identifica los CTA para una medición futura; no existe analítica ni emisión de eventos externos.

### Captación de leads — Iteración 3

Formulario real con nombre, email, empresa/teléfono opcionales, tipo de proyecto, presupuesto orientativo opcional, descripción y lectura de privacidad. Validación Zod compartida y definitiva en servidor. Estados de carga, errores por campo, reintento conservando datos y éxito solo tras persistencia. El servicio se preselecciona por URL y se puede modificar. No utiliza React Hook Form ni React Email.

`POST /api/leads/` requiere origen del entorno, JSON, cuerpo de hasta 32 KiB y UUID en `Idempotency-Key`. La transacción Prisma guarda Lead, eventos y dos registros EmailOutbox. La clave única evita duplicados; el hash normalizado impide reutilizarla con contenido distinto. Rate limiting PostgreSQL compartido entre instancias, HMAC para contadores sin IP/email en texto, honeypot y respuestas controladas. No hay endpoints públicos de lectura; la iteración 4 añade CRM autorizado.

Notificaciones mediante Resend después de responder con `after()`. Reservas y claves estables previenen envíos concurrentes; fallos conservan el lead y dejan estados recuperables. Resend mantiene idempotencia 24 horas; el procesador deja de reintentar solicitudes ambiguas a las 20 horas. La respuesta de éxito no afirma entrega de correo.

```bash
pnpm test:leads
pnpm leads:process                 # Intentar hasta 20 correos pendientes; requiere Resend configurado
```

`tsx` es la única nueva dependencia, exclusivamente de desarrollo para pruebas y comandos privados. La aplicación utiliza Prisma 7.10.0 y mantiene Better Auth sin cambios de tablas existentes. Migración aditiva preparada en `prisma/migrations/20261012070000_leads/`, no aplicada. Antes de migrar una base existente, verificar baseline según [Prisma](docs/prisma.md). No hay conexión Neon ni entrega Resend comprobadas en esta sesión.

### Configuración y bloqueos de producción

Variables adicionales documentadas en `.env.example`:

| Variable | Uso |
| --- | --- |
| `LEADS_NOTIFICATION_EMAIL` | Buzón comercial real, exclusivamente servidor |
| `LEADS_SECURITY_SECRET` | Secreto independiente de al menos 32 caracteres para HMAC de límites |

Local funciona sin servicios y permite comprobar errores; no simula registro. Sin DATABASE_URL o secreto de seguridad, enviar devuelve 503. Sin Resend activado, los emails quedan pendientes. Producción/preview exige configuración de captación, Vercel, DB y secreto; aviso definido en la configuración legal interna; en ausencia de requisitos el formulario y endpoint permanecen cerrados. No existe política de privacidad aprobada ni se ha publicado una ficticia. Reconstruir el despliegue al cambiar configuración del formulario.

Atribución de entrada, página anterior y UTM en memoria de pestaña; CTA de servicio añade su ruta en `origen`. No hay cookies de seguimiento, almacenamiento de navegador ni trackers externos. Referrer conserva únicamente el origen; datos ausentes quedan null. Los valores nunca se usan para seguridad.

Para Resend, configurar dominio/remitente verificado y buzón interno reales. Obtener registros SPF/DKIM exactos de la consola y aplicarlos únicamente con autorización; consultar [dominios de Resend](https://resend.com/docs/dashboard/domains/introduction). No se modificó DNS.

Antes de activar producción: verificar/aplicar migraciones en rama autorizada, configurar servicios, revisar información legal, programar procesamiento privado de correos pendientes, realizar prueba integral con destinatarios controlados y revisar visualmente el formulario. `after()` no es un worker durable y no se ha activado cron ni servicio adicional. Las solicitudes se conservan sin caducidad ni borrado por antigüedad.

Detalle de arquitectura, seguridad, límites, reintentos, modelo de datos y operaciones: [sistema de leads](docs/leads.md). Resultados reales: [validación](docs/validacion.md).

Futuras iteraciones: CRM/admin y gestión de estados. No se implementan dashboard, login visual, usuarios, blog, CMS, automatizaciones, pagos o sistemas de reserva. Portfolio sin casos ficticios. Métricas Core Web Vitals y revisión visual responsive pendientes de medición; no se ha desplegado producción.

- [Arquitectura](docs/arquitectura.md)
- [Producto](docs/producto.md)
- [SEO](docs/seo.md)
- [Validación](docs/validacion.md)
- [Prisma y transición de migraciones](docs/prisma.md)
- [Instrucciones de agentes](AGENTS.md)

Referencias: [Better Auth/Prisma](https://better-auth.com/docs/adapters/prisma), [Prisma 7 PostgreSQL](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql), [configuración Prisma 7](https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference), [baselining](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/baselining), [Resend](https://resend.com/docs/send-with-nextjs). Para Next, consultar primero las guías instaladas en `node_modules/next/dist/docs/`.

## CRM interno — Iteración 4

Rutas `/login/`, `/admin/`, `/admin/leads/` y `/admin/leads/[id]/`. Dashboard real, listado paginado y responsive, búsqueda privada por POST, filtros URL, detalle/atribución, estados con concurrencia optimista, notas internas e historial con autor. Better Auth mantiene registro deshabilitado y rol existente `admin`, comprobado en servidor para cada operación. Sin CRM externo ni cambios de dependencias.

Migración aditiva `20261012120000_crm` preparada y revisada, **aplicada a la base Neon configurada por el usuario el 12/10/2026**. Añade LeadNote, RateLimit, versión de lead y actor de eventos. Primero configurar una rama autorizada y revisar baseline; después `pnpm db:deploy` y `pnpm db:generate`. Aprovisionamiento exclusivamente privado: `pnpm admin:account create < /ruta/privada/cuenta.json`. JSON privado con email/name/password propios, permisos 0600, contraseña >=12 sin defaults; nunca versionarlo. No promociona cuentas previas. Recuperación: `pnpm admin:account reset-password` con stdin privado; invalida sesiones. Comprobación nueva: `pnpm test:crm`.

[Arquitectura, configuración, procedimientos y límites del CRM](docs/crm.md). [Resultados reales](docs/validacion.md). Las tres migraciones están aplicadas; todavía no se ha creado administrador ni desplegado producción. La iteración 5 no se implementa.

## Rediseño público — 12/10/2026

UI renovada conforme al [plan](docs/plans/2026-10-12-redisenio-ui-asivquark.md): nueve rutas públicas, índice `/servicios/` y cuatro detalles bajo `/servicios/[slug]/`, sin rutas antiguas ni redirecciones históricas. Configurador, menú móvil modal nativo, formulario con opcionales y portfolio único con filtros. Logos originales en `public/brand/`; fuentes públicas separadas del CRM.

Contacto usa exclusivamente `?tipo=web|software|app|mvp`; `app` se adapta al contrato `aplicacion` al enviar. Presupuestos vigentes conservados (opción A del plan). No se activan captación, email, migraciones ni producción. `pnpm test:marketing` comprueba tipos comerciales, rutas y atribución. Véase [validación](docs/validacion.md) para resultados y bloqueos.

## Iteración 6 — Cookies

Gestor propio, consentimiento versionado de 365 días, bloqueo de atribución/eventos analíticos propios y `/politica-de-cookies/` con inventario real y pendientes legales visibles. No hay trackers externos nuevos ni cambios Prisma. `pnpm test:cookies` comprueba validación, caducidad y bloqueo/revocación. Detalle y límites: [Cookies](docs/cookies.md).

## Iteración 7 — Automatización de procesos e IA

Quinto servicio comercial en `/automatizacion-procesos-ia/`: optimizar procesos existentes, conectar herramientas y reducir tareas manuales; la IA se valora cuando aporta utilidad. No se implementan motores, agentes ni integraciones reales. Catálogo mínimo en `src/config/services.ts`, contenido extenso en `src/content/automation.ts`, composición servidor con los componentes comerciales actuales.

Home: cinco tarjetas (tres columnas en escritorio, automatización ocupa dos en la segunda fila), icono Workflow y quinta opción en configurador. Menú desktop/móvil y footer derivados del catálogo, con automatización antes de MVP en navegación. Índice de servicios y enlaces contextuales desde software, aplicaciones y nosotros actualizados. Rutas y fuentes anteriores conservadas; no se cambia la identidad tipográfica actual.

Contacto admite `?servicio=automatizacion` y `?tipo=automatizacion`. Se conserva `tipo=app` → contrato `aplicacion`; `servicio=aplicacion` y `otro` también funcionan. Valores desconocidos, repetidos o parámetros `tipo`/`servicio` simultáneos vuelven a web sin aceptar valores arbitrarios. El formulario incluye los cinco servicios y Otro proyecto. Zod reconoce `automatizacion`, sin cambios ajenos al tipo de proyecto. Privacidad, cookies, antispam, límites, idempotencia y outbox conservados.

Prisma: `Lead.service` es String/VarChar(20), admite `automatizacion` sin cambio de esquema ni migración. CRM reutiliza etiquetas y enum Zod compartidos para filtros/listado/detalle; groupBy existente incluye el servicio en estadísticas. Resend reutiliza la plantilla transaccional: «Nuevo lead ASIVQUARK — Automatización e IA». No hay emails enviados, datos remotos escritos ni nuevas funcionalidades administrativas.

SEO: title y description específicos, canonical de producción `https://asivquark.com/automatizacion-procesos-ia/`, Service enlazado al proveedor Organization compartido, BreadcrumbList, OG propio 1200×630 y contenido inicial estático. Sitemap deriva de publicPaths (diez rutas comerciales); preview/local siguen sin canonical público y con sitemap vacío. No hay ruta duplicada bajo `/servicios/`; enlace final a software usa la ruta real `/servicios/software-a-medida-barcelona/`. Keywords son hipótesis sin métricas inventadas.

Pruebas: `pnpm test:automation` verifica configuración, preselección, validación, persistencia con doble Prisma, CRM y email sin envíos. `pnpm test:automation:html` requiere un build local de producción y comprueba HTML, SEO, JSON-LD, sitemap y enlaces. Ejecutar el build de comprobación con `VERCEL_ENV=production NEXT_PUBLIC_SITE_URL=https://asivquark.com BETTER_AUTH_URL=https://asivquark.com pnpm exec next build --webpack` (no publica). Tests de regresión, resultados y límites de navegador/build: [validación](docs/validacion.md).

## SEO de diseño web y blog estático

Landing conservada en `/servicios/diseno-web-barcelona/`, optimizada para diseño web Barcelona y diseño web profesional. Contenido comercial completo, ocho FAQ, CTA al formulario existente y enlace a guía informativa. Mismo diseño público y sin cambios en otros servicios.

Blog estático autorizado en `/blog/`, con `/blog/que-debe-tener-una-pagina-web-profesional/`. No CMS, editor, estado editorial ni modelo Prisma: catálogo en `src/config/blog.ts`, contenido en `src/content/articles.ts`, prerenderizado con slugs cerrados. Artículo incluido como contenido público del próximo despliegue; no se ha desplegado. Header/footer y enlaces guía/servicio mantienen intenciones diferenciadas y sitemap de producción actualizado.

`pnpm test:web-design` comprueba contenido, URL conservada, contrato del CTA y blog. `pnpm test:web-design:html` verifica artefactos después de build local con metadata de producción, igual que test:automation:html. [Estrategia, metadatos e investigación](docs/seo.md); [validaciones reales](docs/validacion.md).

### Blog — Guía con índice

Artículos locales en `content/blog/*.mdx`, autores en `content/authors.json`, descubrimiento y validación de frontmatter automáticos. Diseño y plantilla editorial en [docs/BLOG-DESIGN.md](docs/BLOG-DESIGN.md). Listado `/blog/`, artículos y RSS `/blog/rss.xml` estáticos. Listado en mosaico de tarjetas: una columna móvil, dos desde sm y tres desde lg; catálogo previsto de hasta seis artículos, sin búsqueda, filtros, destacado ni paginación. No hay CMS ni estados editoriales.

## Iteración legal — 12/10/2026

Cuatro rutas legales con trailing slash: `/aviso-legal/`, `/politica-privacidad/`, `/politica-de-cookies/` y `/condiciones-de-uso/`. Configuración central en `src/config/legal.ts`, con identidad pendiente, aplicabilidad explícita y versión/fechas de aprobación separadas de revisión técnica. Documentos en preparación: advertencia pública sin datos ficticios y `noindex`; canonical únicamente en producción. Sitemap incorpora legales solo tras preparación aprobada, sin fechas artificiales.

Layout servidor compartido, Geist existente acotado a legal, hero compacto, índice HTML plegable móvil/lateral escritorio, lectura limitada y tarjetas de inventario de cookies. Footer enlaza los cuatro documentos y reutiliza el gestor. Contacto incorpora primera capa; casilla conserva reconocimiento de lectura, no consentimiento comercial. Producción/preview dependen de los requisitos operativos; URL y versión del aviso proceden de la configuración legal interna. Desarrollo conserva modo de prueba.

`pnpm legal:check` informa pendientes y falla intencionadamente mientras no se aprueben datos/documentos. Resolver [checklist jurídico](docs/legal/compliance-checklist.md), [inventario](docs/legal/data-processing-inventory.md), [retención](docs/legal/data-retention-review.md) y [guía contractual interna](docs/legal/contratacion-servicios.md) (en README: rutas bajo docs/legal). No se publica la guía, migra la DB ni despliega producción. No se acredita conformidad legal integral. Las notas anteriores corresponden a iteraciones históricas. Resultados reales y límites en docs/validacion.md.

## Home — dirección móvil 2a «Selector arriba»

Hero exclusivo Home en `components/marketing/home-hero.tsx`: retícula sutil, H1 único sin cambios, lead corto móvil y completo desktop/servicios, configurador compacto 2×2 (web/software/app/MVP) y dos columnas desde lg. Automatización permanece en catálogo, navegación y contacto. Tokens Tailwind 4 en globals.css; no existe tailwind.config ni handoff/PROMPT.md en este checkout, por lo que se conserva el diseño desktop vigente y la especificación aportada.

Selector con radios nativos y formulario GET: flechas/Tab gestionados por navegador, `tipo=app` convertido al contrato `aplicacion`; funciona sin JS. CTA emite `cta_click` local con location home_hero/tipo, sujeto al consentimiento existente. Header global de 64/90px, CTA Contacto en móvil y oculto en contacto, icono menú 20px y caja 44px. SVG original conservado con caja de 28px y ajuste proporcional al espacio disponible para no desbordar en 320px. Paso 2 datos y paso 3 confirmación en contacto.

Franja reciente solo móvil consume hasta cuatro proyectos publicados del mismo catálogo; actualmente vacío, sin casos ficticios. Carrusel/capturas diferidos hasta trabajos autorizados. No se añade barra flotante: no existe la barra previa mencionada. Resto de Home y páginas conservado, incluyendo infraestructura legal pendiente. Pruebas/limitaciones en docs/validacion.md.

### Contacto mobile-first 4a

Intro compacta y hoja blanca con chips, opcionales nativos y footer legal mínimo. POST nativo /api/contacto/ adapta al handler seguro existente; con JS, confirmación dentro de la misma hoja. Captación pública conserva bloqueo hasta privacidad y configuración aprobadas. NEXT_PUBLIC_ENV=production oculta aviso de pruebas; VERCEL_ENV sigue gobernando los entornos. Ver dirección y límites en docs/producto.md y docs/validacion.md.

### Cambio de activación del formulario — 22/10/2026

Por petición expresa del propietario, la captación ya no depende de la aprobación editorial de los documentos legales. Se habilita automáticamente cuando dispone de plataforma, base de datos, secreto y aviso válidos. La URL de privacidad y su versión se obtienen del documento actual sin configuración adicional. Resend sigue siendo opcional para persistir leads. Los pendientes legales permanecen en legal:check. Véase docs/leads.md; esta decisión sustituye las condiciones históricas de aprobación para activar el formulario.

## Estilo global Foco — 23/10/2026

El sitio público comparte fondo oscuro, morado eléctrico y tipografía Manrope/JetBrains Mono, incluidos servicios, proyectos, nosotros, contacto, blog/artículos, legales y 404. [Sistema visual](docs/diseno-foco.md), [contrato del blog](docs/BLOG-DESIGN.md) y [comprobaciones reales](docs/validacion.md). Los apartados anteriores de iteraciones describen su estado histórico; esta dirección sustituye la combinación de lectura clara y heroes oscuros.

Tailwind 4 usa configuración CSS-first (`@theme` y `@layer components` en `src/app/globals.css`); no existe un tailwind.config separado. Las fuentes se cargan una vez en el layout raíz. Header y footer públicos se montan en el layout marketing, con excepción de la 404 raíz que los compone expresamente. No se añaden rutas, proyectos ficticios ni servicios externos.
