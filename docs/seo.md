# SEO técnico — Iteración 3

Arquitectura comercial con ocho rutas públicas y cuatro intenciones de servicio diferenciadas. Home se orienta a desarrollo de software en Barcelona; diseño web a páginas de empresas y profesionales; software a procesos empresariales; aplicaciones a plataformas de navegador; MVP a primera versión y aprendizaje. Sin páginas doorway, cifras, casos, ratings ni direcciones inventadas.

## Metadata y canonicals

`pageMetadata()` centraliza title, description, metadataBase, canonical, robots, Open Graph y Twitter. Las páginas declaran título y descripción específicos según el mapa SEO solicitado. Un H1 por página, idioma `es`, OG `es_ES` y contenido principal en HTML prerenderizado.

URLs con barra final mediante `trailingSlash: true`; Next redirige las variantes sin barra. Producción usa exclusivamente `https://asivquark.com`, canonicals absolutos con barra y sin parámetros. La redirección www preparada sigue requiriendo configurar ambos dominios y TLS en Vercel; no se modifica DNS.

Producción depende de `VERCEL_ENV=production`, no de `NODE_ENV`. Local/preview carecen de canonical, tienen meta y header `noindex, nofollow`, robots bloquea rastreo y sitemap vacío. Preview toma `VERCEL_URL` aunque herede variables de producción. No promover artefactos de preview a producción.

## Sitemap y navegación

`publicPaths` en `config/navigation.ts` enumera exclusivamente home, cuatro servicios, proyectos, nosotros y contacto. Sitemap de producción genera esas ocho URLs, sin lastmod artificial. Robots permite rutas públicas, excluye API y anuncia sitemap únicamente en producción. Robots no protege contenido privado; los permisos futuros deberán comprobarse en servidor.

Home enlaza los cuatro servicios; cada landing enlaza contacto con un parámetro de selección validado y un servicio relacionado mediante texto contextual. Header, footer y breadcrumbs enlazan rutas existentes. No hay fichas individuales de proyecto, legales vacíos, blog ni enlaces a rutas futuras.

## Datos estructurados

Home de producción: `Organization` y `WebSite`, nombre y URL reales, ubicación general Barcelona, España. Páginas interiores: `BreadcrumbList` con dos niveles y URL canónica. Serialización JSON y escape de `<` en script nativo. Sin dirección postal, contactos, identificadores o perfiles no confirmados. No hay AggregateRating ni FAQPage. Fuera de producción no se emite JSON-LD público.

Se comprueba sintaxis JSON, tipos, posiciones y URLs contra los artefactos generados. Esto no equivale a una validación remota de Google Rich Results o Schema Markup Validator.

## Renderizado y lanzamiento

Las ocho páginas son estáticas y no consultan Neon. Contacto prerenderiza hero y contenido editorial; su formulario usa `useSearchParams` únicamente para preselección bajo Suspense. El mismo formulario se prerenderiza como fallback para mantener composición y contenidos. Disponibilidad según configuración legal/operativa. El canonical excluye el parámetro `servicio`.

Pendiente antes del lanzamiento comercial: canal operativo y legales, revisión visual en escritorio/tablet/móvil, pruebas de teclado en navegador y medición real de Core Web Vitals. No se afirma posicionamiento ni cumplimiento de métricas. Véase [validación](validacion.md) para resultados y límites reales.


La iteración 3 no añade URLs al sitemap ni páginas de agradecimiento indexables. Estado de éxito solo tras 201 dentro de contacto, sin datos en URL. CTA conserva servicio y añade origen real; los parámetros no cambian el canonical. API privada a efectos de indexación, sin endpoints de lectura de leads. El tracker de atribución solo guarda contexto en memoria hasta la solicitud y no emite analítica externa.

## Actualización — Iteración 4

Login y todas las rutas admin dinámicas y noindex/nofollow con headers no-store. Ausentes del sitemap y navegación pública; metadata genérica sin datos personales. Robots excluye admin/login en producción. Véase [CRM](crm.md) para implementación, procedimientos y límites actuales. Las secciones anteriores describen la fase previa.

## Rediseño público — 12/10/2026

Nueve rutas en `publicPaths`, servicios bajo `/servicios/`: `diseno-web-barcelona`, `software-a-medida-barcelona`, `aplicaciones-web-barcelona`, `desarrollo-mvp`. Sin landings antiguas ni redirecciones históricas. Breadcrumbs de tres niveles en detalles, dos en índices; FAQPage refleja preguntas visibles en producción. Organization compartida se emite una vez por página e incorpora email confirmado y logo original, sin perfiles externos inventados. OG conserva 1200×630 y añade isotipo original; favicon SVG, PNG 32/512 y apple-icon 180 derivados del original.

Contacto únicamente `tipo`, filtros de portfolio `cat`; canonical siempre sin parámetros. La separación de entornos y sitemap vacío local/preview se conserva. No hay rutas individuales de proyectos ni legales vacíos. Comprobaciones HTTP locales registradas en validación; inspección remota, artefactos completos de producción/preview y métricas visuales pendientes por bloqueo del build/navegador.

## Iteración 6 — Política de cookies

`/politica-de-cookies/` con metadata propia, canonical únicamente en producción y noindex en preview/local. Tabla y contenido inicial SSR; enlaces HTML desde footer. Sitemap comercial conservado sin cambios.

## Iteración 7 — Mapa de URL y semántica del nuevo servicio

URL única: `/automatizacion-procesos-ia/`. Canonical producción: `https://asivquark.com/automatizacion-procesos-ia/`. Title: «Automatización de Procesos e IA en Barcelona | ASIVQUARK». Description: «Automatizamos procesos, conectamos herramientas e integramos inteligencia artificial para mejorar la eficiencia de empresas en Barcelona y toda España». H1: «Automatización de procesos e inteligencia artificial para empresas». OG propio 1200×630 con logo original y mensaje «IA cuando aporta valor».

publicPaths/sitemap comercial ahora tienen diez rutas: home, índice servicios, cuatro detalles existentes, automatización, proyectos, nosotros y contacto. Política cookies conserva la estrategia previa. No hay `/servicios/automatizacion-procesos-ia/`, variantes ni duplicados; robots sin cambios. Local/preview conservan noindex/no canonical y sitemap vacío.

Intención distinta: mejorar procesos existentes, automatización de tareas y conexiones; IA opcional según problema. «Automatización de procesos Barcelona» y variantes son hipótesis sin volúmenes/dificultades medidos. Enlaces de home/menú/footer/índice y referencias contextuales desde software, aplicaciones y nosotros. CTA `?servicio=automatizacion` no cambia canonical de contacto.

JSON-LD Service con nombre/finalidad/ámbito España y provider por @id de Organization compartida; BreadcrumbList coherente con ruta raíz. Sin precios, reviews ni duplicación del proveedor. FAQ visible sin nuevo FAQPage: no se promete resultado enriquecido. Fuentes consultadas: https://schema.org/Service y documentación oficial Google https://developers.google.com/search/updates (la URL histórica de FAQPage redirige allí). Se verifican JSON y contenido del artefacto local; no se afirma validación remota en Google/Schema.org.

## Optimización SEO — Diseño web profesional y blog estático

### Decisiones confirmadas por el propietario

Se conserva **`/servicios/diseno-web-barcelona/`**, la URL pública real, aunque el encargo inicial indicaba `/diseno-web-barcelona/`. Canonical: `https://asivquark.com/servicios/diseno-web-barcelona/`. No se migra, redirige ni duplica. Se conserva la estética y tipografía actuales del sitio público (Manrope del rediseño; Geist no sustituye esa identidad en esta tarea).

No existe CMS ni modelo Post. Tras consultar esta discrepancia, el propietario autorizó explícitamente **blog estático con artículo público**, sin estado DRAFT/PUBLISHED ni sistema de publicación. Contenido en repositorio y rutas prerenderizadas, sin DB. Preparado para el siguiente despliegue autorizado; no se ha desplegado producción.

### Landing comercial

Principal: diseño web Barcelona. Secundaria prioritaria: diseño web profesional. Objetivo: solicitudes de presupuesto, sin promesas de rankings o resultados económicos.

- Title y OG title: Diseño Web Profesional en Barcelona | ASIVQUARK.
- Description: Creamos páginas web profesionales en Barcelona, rápidas, adaptadas a móviles y diseñadas para las necesidades de tu negocio.
- OG description: Diseñamos y desarrollamos páginas web profesionales para empresas, autónomos y negocios en Barcelona.
- H1: Diseño web profesional en Barcelona para empresas.
- OG de marca existente; metadataBase y separación de entornos conservados. No meta keywords ni canonicals alternativos.
- CTA: `/contacto/?servicio=web`; selector existente adapta a contrato web.

H2 principales, en orden:

1. Páginas web profesionales para empresas y negocios.
2. ¿Qué incluye nuestro servicio de diseño web?
3. Tipos de páginas web que desarrollamos.
4. ¿Qué diferencia una página web profesional de una web básica?
5. Nuestro servicio de diseño web en Barcelona.
6. Cómo desarrollamos tu página web.
7. ¿Cuánto cuesta una página web profesional?
8. Por qué elegir ASIVQUARK para tu proyecto web.
9. Preguntas frecuentes sobre diseño web profesional.
10. Hablemos de tu nueva página web.

Ocho prestaciones, cinco tipos de web, tabla comparativa cualificada, base local sin dirección inventada, cinco pasos, precio explicado por alcance y ocho FAQ completas. SEO técnico inicial separado de posicionamiento continuado; hosting/soporte/mantenimiento según alcance. FAQ visible sin nuevo FAQPage. Service y BreadcrumbList referencian Organization compartida, sin precios/reviews/ratings.

El contenido de web se separa en `content/web-design.ts` y se consume en home/configurador/listado y landing mediante el catálogo existente. Solo cambia la descripción comercial de esta tarjeta; H1 general y copy de otros servicios conservados. `WebDesignPage` reutiliza componentes comerciales; sus opciones nuevas mantienen comportamiento predeterminado en otras landings.

### Artículo informativo y enlaces

Blog: `/blog/`. Artículo: `/blog/que-debe-tener-una-pagina-web-profesional/`.

- Title/H1: ¿Qué debe tener una página web profesional?
- SEO title: ¿Qué debe tener una página web profesional? | ASIVQUARK.
- Description: Descubre qué elementos necesita una página web profesional: diseño, rendimiento, accesibilidad, estructura SEO y experiencia de usuario.
- Canonical propio: `https://asivquark.com/blog/que-debe-tener-una-pagina-web-profesional/`, no canonical hacia la landing.
- Doce secciones educativas: definición, identidad, UX/navegación, móvil, rendimiento, accesibilidad, SEO, seguridad/mantenimiento, contacto, evaluación, contratación y conclusión con acción concreta. Checklist de revisión y referencias oficiales. Sin copiar bloques completos de la landing.
- BlogPosting con headline/description/url/publisher real e idioma, más BreadcrumbList. Sin autor ni fechas ficticias; no se presenta como aprobación por Rich Results.
- Header y footer enlazan `/blog/`; índice enlaza artículo; landing enlaza guía desde comparación; guía enlaza servicio contextual y CTA final. Todos mediante enlaces HTML.
- Sitemap de producción incluye las doce rutas de publicPaths, incluidas blog y artículo. Sin lastModified inventado; preview/local siguen sitemap vacío y noindex. No hay estados editoriales ni borradores. Slugs desconocidos reciben 404.

Catálogo breve en `config/blog.ts`, cuerpo en `content/articles.ts`, ruta dinámica estática con generateStaticParams/dynamicParams=false. Para añadir artículos se modifica el repositorio explícitamente; no se crea editor o backend.

### Datos aportados y contraste de intención

Referencia del propietario: captura Semrush, sin fecha/región confirmadas. No son datos actuales garantizados, ni volúmenes exclusivos de Barcelona; KD no expresa una probabilidad de posicionar.

| Keyword | Volumen aportado | KD aportado | Intención estimada Semrush |
| --- | ---: | ---: | --- |
| diseño web | 18.100 | 57 % | Informativa |
| diseño web barcelona | 4.400 | 23 % | Comercial |
| diseño web profesional | 3.600 | 25 % | Informativa |
| agencia de diseño web | 2.900 | 23 % | Informativa |
| diseñador web | 2.400 | 24 % | Comercial |

Se hicieron búsquedas web reales separadas de las dos frases exactas. La muestra de «diseño web Barcelona» mostró principalmente home/landings de estudios y agencias: https://codewebbarcelona.com/, https://www.latevaweb.com/, https://websbarcelona.com/diseno-web-barcelona. Para «diseño web profesional» aparecieron guías y servicios: https://pindia.es/blog/posts/diseno-web-profesional/, https://www.websdirect.es/blog/diseno-web-profesional/, https://nerade.com/diseno-web/. Las primeras muestras no compartían URLs exactas. Se infiere intención comercial para la local y mezcla informativa/comercial para la genérica; no se asume que Semrush describa toda la SERP. No se verificaron Google localizado, posiciones completas, local pack/directorios, personalización o SERP de pago. No se copiaron textos ni promesas de competidores.

Fuentes técnicas primarias consultadas: [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [Google Article](https://developers.google.com/search/docs/appearance/structured-data/article), [W3C introducción accesibilidad](https://www.w3.org/WAI/fundamentals/accessibility-intro/). El artículo enlaza sus versiones en español verificadas. Guías Next.js instaladas leídas para metadata y rutas.

### Pendientes SEO

Google Search Console, inspección remota del sitio desplegado, indexación y evolución posterior de consultas/posiciones/solicitudes no comprobadas. Sin garantías de mejora de rankings. Revisar la intención con resultados localizados y validar el contenido tras datos reales de uso. Validación visual/teclado y Core Web Vitals pendientes; resultados técnicos reales en `validacion.md`.

## Blog MDX — Actualización de diseño 1a

La description del frontmatter unifica lead y meta description. BlogPosting incluye autor Organization ASIVQUARK, fechas aportadas (2026-10-12), publisher/logo e imagen OG real (cover local cuando existe; OG de marca en su ausencia). Breadcrumb Inicio / Blog / categoría; h2 con IDs españoles sin tildes y números decorativos. RSS `/blog/rss.xml` y sitemap descubren MDX automáticamente. Listado añade Blog/blogPost y canonical limpio. Listado y artículos se prerenderizan: /blog/ no lee searchParams ni requiere función para filtrar o paginar. Las categorías siguen como etiquetas editoriales; enlaces desde breadcrumbs de artículos apuntan al listado limpio /blog/. Canonicals y JSON-LD solo en producción, noindex y sitemap vacío en preview/local, sin despliegue. Las anteriores notas sobre autor/fechas ausentes y cuerpo TypeScript corresponden a la versión previa.

Blog permanece en el footer y se retira del menú superior, también en móvil, por decisión del propietario. Sitemap y enlaces contextuales hacia artículos se conservan.

## Iteración legal — 12/10/2026

Cuatro rutas legales con trailing slash: `/aviso-legal/`, `/politica-privacidad/`, `/politica-de-cookies/` y `/condiciones-de-uso/`. Configuración central en `src/config/legal.ts`, con identidad pendiente, aplicabilidad explícita y versión/fechas de aprobación separadas de revisión técnica. Documentos en preparación: advertencia pública sin datos ficticios y `noindex`; canonical únicamente en producción. Sitemap incorpora legales solo tras preparación aprobada, sin fechas artificiales.

Layout servidor compartido, Geist existente acotado a legal, hero compacto, índice HTML plegable móvil/lateral escritorio, lectura limitada y tarjetas de inventario de cookies. Footer enlaza los cuatro documentos y reutiliza el gestor. Contacto incorpora primera capa; casilla conserva reconocimiento de lectura, no consentimiento comercial. Producción/preview exigen preparación legal y URL/versión exactas del aviso aprobado además de requisitos operativos anteriores; desarrollo sigue siendo solo prueba.

`pnpm legal:check` informa pendientes y falla intencionadamente mientras no se aprueben datos/documentos. Resolver [checklist jurídico](legal/compliance-checklist.md), [inventario](legal/data-processing-inventory.md), [retención](legal/data-retention-review.md) y [guía contractual interna](legal/contratacion-servicios.md) (en README: rutas bajo docs/legal). No se publica la guía, migra la DB ni despliega producción. No se acredita conformidad legal integral. Las notas anteriores corresponden a iteraciones históricas. Resultados reales y límites en docs/validacion.md.

## Home — dirección móvil 2a «Selector arriba»

Hero exclusivo Home en `components/marketing/home-hero.tsx`: retícula sutil, H1 único sin cambios, lead corto móvil y completo desktop/servicios, configurador compacto 2×2 (web/software/app/MVP) y dos columnas desde lg. Automatización permanece en catálogo, navegación y contacto. Tokens Tailwind 4 en globals.css; no existe tailwind.config ni handoff/PROMPT.md en este checkout, por lo que se conserva el diseño desktop vigente y la especificación aportada.

Selector con radios nativos y formulario GET: flechas/Tab gestionados por navegador, `tipo=app` convertido al contrato `aplicacion`; funciona sin JS. CTA emite `cta_click` local con location home_hero/tipo, sujeto al consentimiento existente. Header global de 64/90px, CTA Contacto en móvil y oculto en contacto, icono menú 20px y caja 44px. SVG original conservado con caja de 28px y ajuste proporcional al espacio disponible para no desbordar en 320px. Paso 2 datos y paso 3 confirmación en contacto.

Franja reciente solo móvil consume hasta cuatro proyectos publicados del mismo catálogo; actualmente vacío, sin casos ficticios. Carrusel/capturas diferidos hasta trabajos autorizados. No se añade barra flotante: no existe la barra previa mencionada. Resto de Home y páginas conservado, incluyendo infraestructura legal pendiente. Pruebas/limitaciones en docs/validacion.md.

## Contacto 4a

Title: «Contacto | ASIVQUARK — Desarrollo web y software en Barcelona». Description: «Cuéntanos tu proyecto de web, aplicación o software a medida. Respuesta en 24 h laborables, sin compromiso.» Canonical de producción limpio /contacto/, también para variantes tipo/origen. ContactPage con Organization (email hola@asivquark.com aportado por propietario y areaServed Barcelona) y BreadcrumbList en producción. Local/preview conservan noindex y ausencia de canonical. Sin nuevas rutas de página en sitemap; /api/contacto/ es POST y respuestas noindex/no-store.

## Sitemap XML — Revisión 12/10/2026

`src/app/sitemap.ts` conserva la serialización nativa Next.js y el namespace estándar `http://www.sitemaps.org/schemas/sitemap/0.9`. Producción: 13 URLs únicas actualmente, con origen `https://asivquark.com`, barra final y sin parámetros. Incluye ambos artículos descubiertos desde MDX. Local y preview siguen con sitemap vacío. Legales en borrador y rutas privadas/API excluidos.

Por petición del propietario, se incorporan `changefreq` y `priority`: home weekly/1; índice blog weekly/0.5; servicios monthly/0.8; artículos monthly/0.6; demás páginas monthly/0.5. Son indicaciones editoriales, no garantías de frecuencia de rastreo ni de posicionamiento. `lastmod` solo para artículos con fecha de frontmatter (updatedAt o publishedAt); no se inventan fechas de páginas corporativas. El texto del navegador sobre ausencia de estilos es normal: no se añade XSL ni se copia esa frase al XML.


## Rediseño global Foco — 23/10/2026

Rediseño exclusivamente visual con el sistema [Foco](diseno-foco.md). Se conserva metadata, JSON-LD, rutas, canonicals, sitemap, RSS, textos y separación por entornos. Hero mantiene un H1 y texto indexable inicial; los servicios y pasos se renderizan en HTML aunque la presentación cambie al interactuar. Cinta decorativa aria-hidden, con los servicios disponibles en contenido real. Header/footer compartidos fuera de main. El blog mantiene frontmatter y anatomía, con lectura oscura y columna 68ch. No se han medido Lighthouse ni Core Web Vitals y no se afirma mejora de posiciones o rendimiento.
