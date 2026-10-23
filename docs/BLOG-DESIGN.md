# Diseño del blog ASIVQUARK

## 1. Principios
Lectura móvil con cuerpo de 17–18 px y contraste AA.
Una columna de lectura de hasta 720 px, alrededor de 68 caracteres.
Resumen, fecha, tiempo de lectura e índice para orientar.
Conversión contextual mediante card lateral o móvil, servicio y footer.
HTML inicial completo, componentes reutilizables y contenido MDX local.

## 2. Tokens usados en el blog — Foco, 23/10/2026

El blog comparte el sistema global descrito en [diseno-foco.md](diseno-foco.md). Tailwind 4 se configura en `src/app/globals.css` mediante `@theme`; no se añade una configuración JavaScript duplicada.

- Fondo ink-950 #07090f; tarjetas ink-900 #0d1019; código y superficies elevadas ink-800 #141826.
- Texto blanco; cuerpo fg-muted #b8bccb; metadatos fg-subtle #a3a7b7. Enlaces brand-300 #c4b5fd; acentos brand-400 #a78bfa. Botones sólidos brand-600 #7c3aed con texto blanco.
- Manrope global y JetBrains Mono para etiquetas. `article-h1` referencia `h1` global; article-h2 conserva clamp(1.625rem, 1.2rem + 1.6vw, 2.125rem); lead 19–21px; cuerpo 17–18px con interlineado 1.75.
- Lectura limitada a 68ch; índice lateral 260px. Contenedor 1280px con padding 20/32/64px.
- `prose-asiv` adapta Typography al fondo oscuro; citas con borde brand-500 y código sobre ink-800. Bordes blancos al 10%; foco brand-400.
- `navy`, `ink`, `paper`, `violet`, `line` y sus variantes son alias de compatibilidad del mismo sistema, no una segunda paleta. `ink-700` se reserva para bordes; no se usa como texto sobre oscuro.

Se conserva la anatomía, el frontmatter y el registro de componentes MDX. El footer se renderiza una vez desde el layout público, fuera de main; CTA contextual dentro del artículo se mantiene. No se modifican artículos ni fechas editoriales.

## 3. Anatomía del artículo
Móvil:
```text
Header existente
Hero: breadcrumb / H1 / descripción / autor / fecha · lectura / imagen de cabecera opcional
Lead
KeyPoints (opcional)
TocMobile (details)
AsideCta inline
Secciones numeradas de MDX
Sources (opcional)
Sigue leyendo (si hay otros artículos)
Footer con CTA a contacto
```
Desktop:
```text
Header existente
Hero / imagen de cabecera opcional
┌ Índice sticky 260 px ┐  ┌ Columna hasta 720 px ┐
│ TocDesktop          │  │ Lead / KeyPoints     │
│ AsideCta aside      │  │ Secciones / Sources  │
└─────────────────────┘  └──────────────────────┘
Sigue leyendo / Footer con CTA
```
El listado `/blog/` se prerenderiza al construir, igual que los artículos y RSS. No lee searchParams ni incluye búsqueda, filtros de categoría, destacado o paginación. Muestra todos los artículos publicados en un mosaico uniforme: una columna móvil, dos desde sm y tres desde lg. El catálogo previsto por el propietario es de seis artículos como máximo; con uno se muestra una sola tarjeta, sin cajas de relleno. No se recorta silenciosamente el contenido si se publica más.

`PostCard` tiene una variante `boxed` para el listado: borde line, esquinas rounded-2xl, padding 20 px, imagen existente 16/10, categoría 13 px, título h2 de 19 px, descripción de 16 px, fecha y tiempo de lectura de 14 px. La tarjeta completa es un enlace y ocupa la altura de su fila; el primer cover tiene carga prioritaria. Los relacionados conservan su variante actual con h3. Reutilizar estos tokens y tamaños existentes. Los breadcrumbs de categoría en artículos enlazan a `/blog/`, sin parámetros de filtro.

Sin barra inferior: la del handoff es opcional y no existe en el shell actual. El artículo permanece a la izquierda del espacio restante en desktop.

## 4. Frontmatter
Archivos `.mdx` en `content/blog/`; autores en `content/authors.json`. El cargador `src/lib/blog/content.ts` valida los campos, calcula lectura a 220 palabras/minuto y descubre archivos automáticamente.

| Campo | Tipo | Obligatorio | Límite | Ejemplo |
| --- | --- | --- | --- | --- |
| title | string | Sí | 70 caracteres | ¿Qué debe tener una página web profesional? |
| description | string | Sí | 160 caracteres | Criterios prácticos para evaluar una web. |
| slug | string | Sí | kebab-case; igual al archivo | que-debe-tener-una-pagina-web-profesional |
| category | enum | Sí | catálogo inferior | diseno-web |
| author | string | Sí | clave de authors.json | equipo |
| publishedAt | fecha ISO | Sí | fecha real YYYY-MM-DD | 2026-10-12 |
| updatedAt | fecha ISO | No | posterior o igual a publicación | 2026-10-12 |
| keyPoints | string[] | No | 3–6 ítems | [Accesibilidad, Rendimiento, SEO] |
| tocLabel | objeto id: texto | No | 40 caracteres por etiqueta | {conclusion: Conclusión} |
| serviceLink | {label, href} | No | ruta real de servicio | {label: Diseño web, href: /servicios/diseno-web-barcelona/} |
| sources | {org,title,url}[] | No | URL HTTPS | ver plantilla |
| cover | string | No | archivo local 1200×630 | /blog/mi-articulo/cover.webp |
| coverAlt | string | No | descripción o vacío si decorativo | Vista de un formulario accesible |
| headerImage | {src, alt, width, height} | No | imagen local, ancho máximo 1440 px, proporción real | ver plantilla |
| contactType | enum | Sí | catálogo inferior | web |
| ctaTitle | string | No | texto pertinente al artículo | ¿Revisamos tu web? |

Categorías: `diseno-web`, `software-a-medida`, `apps`, `mvp`, `mantenimiento`, `automatizacion-ia`. Contacto: `web`, `software`, `app`, `mvp`, `automatizacion`, `otro`, alineado con el formulario existente. Cover es opcional mientras no haya una imagen real: se muestra un placeholder decorativo y se usa la OG de marca existente, nunca una URL inexistente.

## 5. Componentes MDX disponibles
Implementados en `src/components/marketing/blog/article-components.tsx`; el índice interactivo reside en `src/components/marketing/blog/toc.tsx` (`TocDesktop`, `TocMobile`). `PostCard`, `PostImage` y `PostMeta` componen listado y relacionados. Sin imports en el MDX; `ArticleBody` los inyecta con los datos del artículo.

| Componente | Uso y límites | Props | Ejemplo |
| --- | --- | --- | --- |
| Lead | Primer bloque introductorio; no repetir descripción ni usar en secciones | children | `<Lead>Contexto de la guía.</Lead>` |
| KeyPoints | Resumen automático desde frontmatter; no duplicar en cuerpo | items: string[] | `<KeyPoints items={["Diseño", "Accesibilidad", "SEO"]} />` |
| ServiceLink | Un enlace contextual al servicio existente; no CTA genérica | sin props en MDX, usa serviceLink | `<ServiceLink />` |
| Sources | Bloque automático final; no repartir fuentes por párrafos | items: Source[] | configurar `sources` en YAML |
| AsideCta | Card automática lateral/móvil; no interrumpir secciones | href, slug, ctaTitle?, variant: aside/inline | configurar `ctaTitle` en YAML |
| SectionHeading | h2 numerado automáticamente; no usar manualmente ni escribir números | id, number, children | `## Accesibilidad` |

El primer párrafo se convierte automáticamente en Lead. También admite `<Lead>…</Lead>` como primer bloque. `KeyPoints`, `Sources` y `AsideCta` están disponibles para composición React, pero sus posiciones en artículos las controla la página: no los insertes manualmente en el MDX.

## 6. Reglas de redacción y estructura
- De 4 a 12 `##` por artículo; máximo 100 caracteres. Para índices largos, añade `tocLabel` usando el ID español sin tildes. Los `###` no entran en el índice.
- Párrafos de cinco líneas como máximo en desktop. Dividir ideas extensas sin truncar el texto.
- Un solo `<ServiceLink />` por artículo, cuando el contexto lo justifique.
- Fuentes externas en `sources`, no repartidas por el texto.
- Sin emojis ni negritas decorativas. No prometas posiciones, ventas ni puntuaciones.
- No escribir un H1 en MDX: proviene de title. Los números de h2 son decorativos.
- Todos los `.mdx` se publican al construir; borradores fuera de `content/blog/`. Solo contenido local revisado: MDX ejecuta JSX.

## 7. Imágenes
Cover 1200×630, AVIF/WebP; listado y metadata. `headerImage` permite mostrar una imagen editorial en el hero, tras autor/fecha, a petición del propietario. Usa su proporción original, ancho máximo 900 px de visualización, bordes de 12 px y carga prioritaria. Cuando la proporción no sea 1200×630, generar un cover separado sin cortar información relevante; no usar puntuaciones mostradas dentro de una ilustración como datos reales del sitio. Cuerpo: ancho máximo 1440 px, 16/10 o proporción real, bordes de 12 px. Usar `alt` descriptivo o vacío para decoración; pies mediante `<figure><img … /><figcaption>…</figcaption></figure>`. Imágenes en `public/blog/{slug}/`; el path del frontmatter omite `public`. No generar ilustraciones sin necesidad editorial.

## 8. SEO por artículo
- Title ≤70 y description ≤160 caracteres, ambos específicos.
- Slug español sin tildes y estable; canonical limpio únicamente en producción.
- Enlace contextual al servicio existente y a otro artículo si existe uno pertinente.
- Fecha real de publicación; actualizar updatedAt cuando cambie el contenido.
- Cover real o OG de marca; BlogPosting y BreadcrumbList automáticos.
- Sitemap descubierto desde MDX y RSS en `/blog/rss.xml`; preview/local noindex, sin canonical y sitemap vacío.

## 9. Checklist de publicación
- [ ] Revisar 360 px sin desbordamiento; cuerpo ≥17 px.
- [ ] Abrir índice móvil, activar enlace y comprobar cierre y destino.
- [ ] Revisar sticky y sección activa a 1280 px.
- [ ] Breadcrumb Inicio / Blog / categoría; un H1.
- [ ] Foco, teclado, contraste y movimiento reducido; controles de 48 px.
- [ ] CTA a contacto con tipo y origen; fuentes anuncian nueva pestaña.
- [ ] Crear artículo solo con MDX; comprobar frontmatter, TOC y lectura.
- [ ] Lighthouse móvil: objetivo accesibilidad ≥95 y SEO 100; registrar medición real, no asumirla.
- [ ] Ejecutar comprobaciones del repositorio y documentar resultados en `docs/validacion.md`.

## 10. Plantilla
Copiar fuera del directorio publicado hasta completar texto y fechas reales. Los comentarios YAML y MDX se omiten al renderizar.

```mdx
---
title: "Título de la guía"
description: "Descripción breve y específica, hasta 160 caracteres."
slug: titulo-de-la-guia
category: diseno-web
author: equipo
publishedAt: 2026-10-12 # sustituir por fecha real
# updatedAt: 2026-10-12
keyPoints:
  - Primer criterio
  - Segundo criterio
  - Tercer criterio
# tocLabel: { primer-criterio: Primer criterio }
serviceLink:
  label: Servicio de diseño web profesional en Barcelona
  href: /servicios/diseno-web-barcelona/
# sources:
#   - org: W3C · WAI
#     title: Introducción a la accesibilidad web del W3C
#     url: https://www.w3.org/WAI/fundamentals/accessibility-intro/es
# cover: /blog/titulo-de-la-guia/cover.webp
# coverAlt: ""
# headerImage:
#   src: /blog/titulo-de-la-guia/cabecera.webp
#   alt: Descripción concreta de la imagen
#   width: 1440
#   height: 960
contactType: web
# ctaTitle: ¿Quieres que revisemos tu web con estos criterios?
---

{/* Sustituir este párrafo por contexto, no repetir la description. */}
<Lead>Introducción de la guía.</Lead>

## Primer criterio

{/* Explicar una idea por párrafo. */}

## Segundo criterio

{/* Añadir un ### solo bajo un ##. */}

## Tercer criterio

{/* Insertar una sola vez donde encaje con el texto. */}
<ServiceLink />

## Conclusión

{/* Acción que el lector pueda comprobar. Fuentes se generan del YAML. */}
```

## 11. Extensiones previstas (no implementadas)
`EvaluableCriterion`: props `id`, `label`, `description?`; respuestas Sí / A medias / No, sin puntuaciones comerciales ni garantías. `ChecklistResult`: props `criteria`, `answers`, `contactHref`; resume respuestas y orienta la consulta sin diagnóstico automático. Usarlos solo en artículos con criterios evaluables y sin barra fija inferior. Antes de implementarlos, actualizar este documento y revisar accesibilidad, persistencia y consentimiento.

## 12. Artículo de digitalización de empresas

El propietario autorizó incorporar el artículo al catálogo público el 12/10/2026. Archivo: `content/blog/digitalizacion-empresas.mdx`; autor editorial existente `equipo`; fecha editorial 2026-10-07, elegida por el propietario para situarla en la semana anterior. Sin despliegue de producción.

El contrato admite ahora `seoTitle` opcional (máximo 70 caracteres), usado en metadata/OG/Twitter, y `excerpt` opcional (máximo 300), usado en tarjetas y RSS. Los artículos anteriores conservan sus valores por defecto. Nueva categoría `automatizacion-ia`: Automatización e IA. Se admiten 4–12 H2 de hasta 100 caracteres con etiquetas TOC de hasta 40 caracteres. Por petición posterior del propietario, este artículo se resume a seis párrafos: una introducción y cinco secciones H2. Se eliminan subsecciones, listas y repeticiones; los enlaces comerciales se integran en el texto. Fecha de actualización editorial: 2026-10-12.

La imagen facilitada por el propietario se convierte a WebP: cabecera 1440 px de ancho con proporción original y cover 1200×630 con ajuste contain sobre navy, sin recortar contenido. Alt describe una ilustración de documentos, escáner y portátil, sin presentarla como cliente o software real. El hero y los CTA conservan sus componentes y estilos existentes.

Rutas de enlaces: `/automatizacion-procesos-ia/`, `/servicios/software-a-medida-barcelona/` y `/contacto/?servicio=automatizacion`. Canonical propio en producción: `https://asivquark.com/blog/digitalizacion-empresas/`. Descubrimiento automático del artículo en catálogo, RSS y sitemap de producción; local/preview siguen noindex y sin canonical.

### Primitivas compartidas Foco

La etiqueta de categoría puede usar `Badge` (`components/ui/badge.tsx`): píldora brand-600/15, texto brand-300 y cuerpo de 12px. `Eyebrow` comparte etiqueta mono global. Estas primitivas no alteran frontmatter ni contenido MDX.
