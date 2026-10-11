# SEO técnico — Iteración 1

Objetivo: desarrollo de software y páginas web en Barcelona, con alcance a empresas y emprendedores de España. HTML inicial contiene toda la home, un H1 y jerarquía de headings semántica. Idioma `es` y OG locale `es_ES`.

La sustitución del ORM por Prisma no modifica orígenes, metadata, robots, sitemap ni contenido. La generación de Prisma Client ocurre al instalar/build, sin consultar Neon desde las páginas públicas. Las comprobaciones de regresión quedan registradas en [validación](validacion.md).

Title: `Desarrollo de Software y Diseño Web en Barcelona | ASIVQUARK`.

Description: `En ASIVQUARK desarrollamos páginas web, aplicaciones y software a medida para empresas y emprendedores en Barcelona y toda España.`

## Metadata y entornos

`pageMetadata()` centraliza metadataBase, title, description, canonical, robots, OG y Twitter. Imagen OG por `ImageResponse` nativo, sin recursos de marketing inventados.

Producción: `VERCEL_ENV=production`, URL exacta `https://asivquark.com`, canonical home con `/`, index/follow, sitemap con solo home. Robots permite contenido público y excluye API. Sin fechas de actualización artificiales.

Preview: metadataBase y auth origin `https://${VERCEL_URL}`, incluso al heredar variables públicas erróneas. Sin canonical público. Meta y cabecera `X-Robots-Tag: noindex, nofollow`. Robots bloquea rastreo y no anuncia sitemap. Sitemap XML vacío, sin URLs destinadas a indexación. Robots no sustituye la protección de contenido privado.

Local: localhost por defecto, noindex. `NODE_ENV=production` por sí solo no activa indexación. Producción con localhost, www, origen desconocido o ruta en URL falla. Pruebas de aislamiento en `tests/site.test.ts`.

## Navegación y lanzamiento

Anclas relativas existentes para servicios, proyectos, nosotros y contacto. No agregar fragmentos al sitemap ni links a páginas aún inexistentes. 404 nativa con ayuda y noindex. Redirección 308 www a dominio principal preparada en producción; necesita configurar ambos dominios y TLS en Vercel posteriormente. DNS no modificado.

Antes de lanzamiento: completar contacto y legales; comprobar metadata, sitemap, robots, 404 y redirecciones en dominio real; verificar exclusión de previews; medir accesibilidad y Core Web Vitals. Añadir URLs solo con contenido público real. Sin JSON-LD con direcciones, ratings o teléfonos inventados ni analítica avanzada.
