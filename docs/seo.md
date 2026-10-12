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
