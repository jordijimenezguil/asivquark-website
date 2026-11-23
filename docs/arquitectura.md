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

Resend valida mensajes de texto y configuración al enviar. Leads consume Resend mediante outbox, con envío automático cuando API key y remitente son válidos. Remitente verificado, reintentos y flujos de recuperación se definirán cuando haya casos reales.

## Evolución y despliegue

Build por entorno, ramas Neon separadas, sin disco persistente ni migraciones al desplegar. No promover metadata de preview a producción. Añadir rutas públicas completas a sitemap y metadata; nuevas rutas privadas necesitan autorización de servidor. Arquitectura modular sencilla sin ampliar alcance antes de solicitud.

## Marketing y captación

Marketing conserva ocho rutas estáticas, contenido local y SEO. `features/leads` separa contrato, atribución, seguridad, repositorio y procesamiento. Formularios en `components/forms`, plantillas en `emails`, configuración privada en `config/contact.ts`. No hay consultas DB al renderizar las páginas.

`POST /api/leads/` ejecuta controles de origen, cuerpo, admisión, Zod, honeypot e idempotencia. Una transacción crea lead, eventos y outbox. La respuesta solo confirma persistencia; `after()` intenta efectos secundarios. Un comando privado procesa pendientes con reservas e idempotencia del proveedor. No existe caducidad ni borrado de solicitudes por antigüedad. No se crean endpoints administrativos ni cron público.

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

`src/lib/blog/content.ts` descubre contenido local, valida frontmatter con Zod, genera TOC español desde el AST y calcula lectura. `ArticleBody` compila MDX local revisado en servidor con next-mdx-remote, remark y rehype-slug; headings numerados fuera del texto accesible. `src/components/marketing/blog/` concentra componentes editoriales y TOC cliente (IntersectionObserver y cierre del details móvil). El listado se prerenderiza sin leer searchParams: mosaico de todos los artículos MDX publicados, sin filtros ni paginación y sin frontera cliente adicional. Artículos SSG y RSS force-static. Sitemap descubre todas las rutas MDX, conservando vacío en preview/local. `src/content/articles.ts` es solo una exportación de compatibilidad; el cuerpo vive exclusivamente en MDX. La card comercial de diseño web conserva su enlace estable en `src/config/blog.ts`; no hay que editar ese archivo al publicar una nueva guía.

## Iteración legal — 12/10/2026

Cuatro rutas legales con trailing slash: `/aviso-legal/`, `/politica-privacidad/`, `/politica-de-cookies/` y `/condiciones-de-uso/`. Configuración central en `src/config/legal.ts`, con identidad pendiente, aplicabilidad explícita y versión/fechas de aprobación separadas de revisión técnica. Documentos en preparación: advertencia pública sin datos ficticios y `noindex`; canonical únicamente en producción. Sitemap incorpora legales solo tras preparación aprobada, sin fechas artificiales.

Layout servidor compartido, Geist existente acotado a legal, hero compacto, índice HTML plegable móvil/lateral escritorio, lectura limitada y tarjetas de inventario de cookies. Footer enlaza los cuatro documentos y reutiliza el gestor. Contacto incorpora primera capa; casilla conserva reconocimiento de lectura, no consentimiento comercial. Producción/preview exigen preparación legal y URL/versión exactas del aviso aprobado además de requisitos operativos anteriores; desarrollo sigue siendo solo prueba.

`pnpm legal:check` informa pendientes y falla intencionadamente mientras no se aprueben datos/documentos. Resolver [checklist jurídico](legal/compliance-checklist.md), [inventario](legal/data-processing-inventory.md), [retención](legal/data-retention-review.md) y [guía contractual interna](legal/contratacion-servicios.md) (en README: rutas bajo docs/legal). No se publica la guía, migra la DB ni despliega producción. No se acredita conformidad legal integral. Las notas anteriores corresponden a iteraciones históricas. Resultados reales y límites en docs/validacion.md.

## Home — dirección móvil 2a «Selector arriba»

Hero exclusivo Home en `components/marketing/home-hero.tsx`: retícula sutil, H1 único sin cambios, lead corto móvil y completo desktop/servicios, configurador compacto 2×2 (web/software/app/MVP) y dos columnas desde lg. Automatización permanece en catálogo, navegación y contacto. Tokens Tailwind 4 en globals.css; no existe tailwind.config ni handoff/PROMPT.md en este checkout, por lo que se conserva el diseño desktop vigente y la especificación aportada.

Selector con radios nativos y formulario GET: flechas/Tab gestionados por navegador, `tipo=app` convertido al contrato `aplicacion`; funciona sin JS. CTA emite `cta_click` local con location home_hero/tipo, sujeto al consentimiento existente. Header global de 64/90px, CTA Contacto en móvil y oculto en contacto, icono menú 20px y caja 44px. SVG original conservado con caja de 28px y ajuste proporcional al espacio disponible para no desbordar en 320px. Paso 2 datos y paso 3 confirmación en contacto.

Franja reciente solo móvil consume hasta cuatro proyectos publicados del mismo catálogo; actualmente vacío, sin casos ficticios. Carrusel/capturas diferidos hasta trabajos autorizados. No se añade barra flotante: no existe la barra previa mencionada. Resto de Home y páginas conservado, incluyendo infraestructura legal pendiente. Pruebas/limitaciones en docs/validacion.md.

## Contacto compacto 4a

Página servidor con intro y JSON-LD público; ContactForm mantiene frontera cliente, validación compartida, fetch JSON a /api/leads/, idempotencia, límites de reintento y conservación de datos. details funciona sin JavaScript; chips son radios. Alias soft adapta al contrato software sin alterar los tipos existentes.

POST /api/contacto/ acepta únicamente formulario URL-encoded del mismo origen, limita cuerpo a 32 KiB y convierte nombres españoles al contrato de leads. Delega persistencia, rate limit y gates al mismo handler mediante la ruta existente; respuesta HTML sin JS, con datos escapados conservados para reintento y noindex/no-store. Éxito con JS permanece dentro de la hoja y enfoca el h2; pasos solo móvil porque escritorio ya los muestra a la izquierda. generate_lead y form_error {campo} son eventos locales sujetos al consentimiento. Campos origen/utm y atribución nativa también requieren permiso analítico.

Banner cliente acotado a /contacto, antes del header, desactivado con NEXT_PUBLIC_ENV=production y siempre excluido por site.isProduction. Esta variable solo controla el aviso; VERCEL_ENV conserva autoridad para dominio, indexación y gates.

## Disponibilidad de captación — 23/10/2026

Sin interruptor manual de captación: getContactConfig calcula disponibilidad a partir de aviso configurado, plataforma Vercel, base de datos y secreto de seguridad. La página y ambos endpoints comparten esta configuración; el runtime comprueba de nuevo los requisitos para persistir. Desarrollo conserva modo de prueba. La entrega de correo depende de API key y remitente válidos, sin interruptor manual.

URL y versión del aviso de privacidad se obtienen exclusivamente de la configuración legal interna. No hay overrides de entorno ni validación de variables alternativas para estos valores.


## Rediseño global Foco — 23/10/2026

El sistema global Foco sustituye las superficies claras de las iteraciones anteriores. Configuración CSS-first de Tailwind 4 en globals.css, tipografía cargada en layout raíz y aliases de compatibilidad para plantillas existentes. Header y footer compartidos en el layout marketing; 404 raíz los compone expresamente. Componentes servidor conservan contenido inicial; fronteras cliente pequeñas para Spotlight, Marquee, ServiceExplorer y ProcessPanels. Spotlight usa requestAnimationFrame, IntersectionObserver y detección de puntero fino/movimiento reducido; marquee se pausa fuera de viewport. No se modifican DB, auth, envío de leads ni contratos de API. Véase [sistema visual](diseno-foco.md).


## Home — Automatización con IA como prioridad — 23/11/2026

HomeHero deja de montar Configurator y presenta un flujo semántico con figure/ol, sin nueva frontera cliente. Home reutiliza FeatureGrid, ProcessSteps, FAQAccordion y ContactCTA; catálogo original conservado, explorador de home filtrado a servicios complementarios. CTA usa /contacto/?tipo=automatizacion&origen=/, compatible con el contrato existente. No cambia persistencia ni integraciones.


## Portfolio autorizado — 23/11/2026

Incorporados Rutavana (plataforma de vehículos) y D7 Tattoo (estudio en Cerdanyola del Vallès), por petición explícita del propietario. Tarjetas con contexto breve, párrafo SEO y enlace externo accesible; visibles en /proyectos/ y home. Se destaca la continuidad del posicionamiento sin cifras, rankings ni resultados garantizados. Catálogo tipado ampliado con href y seoDescription; fallback del portfolio renderiza los proyectos en HTML inicial. Sin imágenes inventadas ni nuevas rutas de detalle. Metadata de /proyectos/ actualizada.


## Refuerzo transversal de IA — 23/11/2026

Por indicación del propietario, se añade contenido sin sustituir los textos existentes. Bloques contextuales de automatización e IA en diseño web, software, aplicaciones, MVP y portfolio; párrafos en servicios, nosotros y contacto. Footer y CTA compartidos refuerzan la oferta. Blog: introducción complementaria del índice y párrafos dentro de secciones existentes de ambos artículos, con updatedAt real. No se atribuye IA a Rutavana o D7 Tattoo. Home y landing de automatización ya tienen protagonismo suficiente. Legales, login y CRM revisados y conservados en su función; sin añadir promociones a sus cuerpos. Metadata específica, H1, rutas y contratos conservados. AutomationContext es un Server Component reutilizable con copy por contexto y enlace a la landing existente.


## Prioridad de automatización con IA — 23/11/2026

Automatización pasa a primera posición del catálogo comercial y de navegación compartida, menús, pie, banner y filtros. Configurator conserva las cinco opciones y presenta automatización primero y marcada inicialmente. Contacto muestra siempre automatización como primera opción, conservando la selección por URL y el contrato previo. Bloques IA adelantados al primer contenido tras el hero en landings y portfolio; textos generales de servicios/nosotros/contacto/blog y footer comienzan por IA y conservan la oferta restante. Metadata general, servicios, nosotros, contacto y blog alineada; H1 y metadata específicos de cada landing conservados. Sin atribuir IA a casos no documentados ni modificar rutas.


## Rutavana — Publicación con IA — 23/11/2026

El propietario confirma que el proceso de publicación de anuncios de Rutavana está automatizado con IA. La tarjeta compartida de home y portfolio presenta esta función en primer lugar, conserva el párrafo SEO continuo y enlaza a https://rutavana.com/publicar/anuncio. Campo opcional automationHref en el catálogo, sin atribuir IA a D7 Tattoo. La página pública se consultó por HTTP pero su HTML no expone el detalle del flujo; no se afirman pasos específicos ni resultados medidos.


## Precios populares y home sin casos concretos — 23/11/2026

Por indicación del propietario se integra «a precios populares» en subtítulos comerciales de home y landings, titular de servicios, presentación de nosotros, introducción de contacto y CTA compartido. Sin tarifas, descuentos ni comparaciones inventadas. Home describe publicación con IA, integraciones, plataformas, webs y SEO continuo en términos generales; retira nombres, enlaces externos y tarjetas de proyectos, conservando enlace a /proyectos/. Portfolio mantiene los dos proyectos y sus descripciones. Se conservan H1/metadata específicos y los artículos editoriales.


## Portfolio — Garraf Semsa y Startgamego — 23/11/2026

Proyectos incorporados por petición y confirmación del propietario: Garraf Semsa (automatización de facturas con IA) y Startgamego (app de gamificación a medida). Sin URLs, imágenes, métricas ni procesos detallados inventados. Garraf Semsa aparece primero y en filtro automatización; Startgamego en aplicaciones. Tarjetas usan tags explícitos y href/seoDescription opcionales para no atribuir SEO o enlaces a todos los casos. Metadata y presentación de portfolio actualizadas. Home permanece sin proyectos concretos.


Ampliación del mismo encargo: «Gestión interna de almacén y pedidos», software a medida para varias empresas del Vallès, confirmado por el propietario. Se presenta como experiencia agrupada, sin nombres, enlaces ni funciones no aportados; categoría software. Home continúa sin casos concretos.


## Tarjetas de portfolio equilibradas — 23/11/2026

Resumen único por proyecto, entre 25 y 32 palabras. Rutavana y D7 Tattoo conservan IA/SEO continuo en copy abreviado; eliminado el segundo párrafo específico. Catálogo sin seoDescription. Retícula con filas iguales desde md, espacio homogéneo para etiquetas/títulos y enlaces al pie. Sin alturas rígidas para el texto ni truncamiento. Los tres últimos proyectos siguen sin enlaces.


Orden final del portfolio confirmado por el propietario: Rutavana, D7 Tattoo, Garraf Semsa, Startgamego y Gestión interna de almacén y pedidos. El orden de casos es independiente de la prioridad de IA en la navegación de servicios.


## Portfolio sin filtros — 23/11/2026

Retirados los filtros por petición del propietario. /proyectos/ muestra las cinco tarjetas en el orden del catálogo y mantiene el CTA final. ProjectList pasa a Server Component sin hooks de navegación, lectura de cat ni eventos project_filter; eliminada Suspense y su fallback duplicado. Los parámetros cat anteriores ya no alteran la lista. Sin cambios de canonical o rutas.


## Home — Servicios en primer plano — 23/11/2026

Por petición del propietario se recupera la cabecera general de desarrollo de software y páginas web con selector de los cinco servicios. Web aparece primero y seleccionada inicialmente; automatización sigue disponible como quinta opción. La presentación de servicios incluye el catálogo completo antes del bloque destacado de IA, que conserva flujo ilustrativo, ejemplos y enlace a su landing. Metadata y CTA final de home vuelven al enfoque general. Sin cambios de rutas, dominios ni despliegue.


Ajuste posterior del propietario: automatización con IA vuelve a primera posición en las tarjetas del selector y en el catálogo de servicios de home. La selección inicial de web y la cabecera general se conservan.

## Superficies 6a — 23/11/2026

Home con dos pausas paper y línea de luz en lugar de franja. `surface-paper` adapta los tokens localmente para las páginas públicas: cabeceras/cierres oscuros, secciones claras explícitas y lectura continua clara en blog/legal. Container conserva 1280px y padding 20/32/64px en base/md/xl; Section compacta a 64/80/96px. Servicios y FAQ de home usan botones con estado y relaciones ARIA; proceso vertical en móvil y paneles desde lg. Spotlight escucha ratón fino sin movimiento reducido y restablece posición al cambiar preferencias. No hay nuevas dependencias, migraciones ni cambios de contratos.
