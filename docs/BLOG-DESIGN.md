# Diseño del blog ASIVQUARK

## 1. Principios
Lectura móvil con cuerpo de 17–18 px y contraste AA.
Una columna de lectura de hasta 720 px, alrededor de 68 caracteres.
Resumen, fecha, tiempo de lectura e índice para orientar.
Conversión contextual mediante card lateral o móvil, servicio y footer.
HTML inicial completo, componentes reutilizables y contenido MDX local.

## 2. Tokens usados en el blog
Tailwind 4 usa tokens y `prose-asiv` en `src/app/globals.css`; `--container-prose` y el alias de compatibilidad `--max-width-prose` fijan la columna en 720 px.

| Token | Valor | Uso |
| --- | --- | --- |
| navy | #0B0F17 | Hero y shell |
| navy-700 | #1A2030 | Avatar provisional |
| violet | #7C3AED | CTA, números y enlaces |
| violet-600 / 800 | #6D28D9 / #5B21B6 | Hover CTA / enlaces |
| violet-300 | #9F75FF | Foco sobre navy |
| violet-50 / 25 | #F1EBFF / #FBFAFF | CTA / código |
| ink | #111827 | Encabezados |
| ink-700 / 600 | #2A2F3A / #454956 | Lead / cuerpo |
| ink-500 | #5B5F6B | Metadatos secundarios sobre blanco |
| mist / mist-500 | #B9BDC9 / #9BA1AE | Lead / metadatos sobre navy |
| line / line-strong | #E3E5EB / #DADDE4 | Bordes |

`mist` del shell se conserva; `blog-mist` es su alias de lectura sobre navy. El fondo de las imágenes pendientes es #EEF0F4; el texto de autor y categoría sobre navy es #D7DAE2.

| Tamaño | Valor | Interlineado |
| --- | --- | --- |
| article-h1 | clamp(2.25rem, 1.2rem + 4.2vw, 4rem) | 1.04 |
| article-h2 | clamp(1.625rem, 1.2rem + 1.6vw, 2.125rem) | 1.15 |
| article-lead | clamp(1.1875rem, 1.05rem + .5vw, 1.3125rem) | 1.65 |
| article-body | clamp(1.0625rem, 1rem + .25vw, 1.125rem) | 1.75 |

Manrope existente, pesos 400 y 700; mono JetBrains Mono. `max-w-prose`: 720 px; `spacing.toc`: 260 px. Contenedor: 1280 px, padding 20/32/64 px. Cuerpo: padding vertical 48/64 px, desktop 80/104 px; separación de columnas 80 px. Párrafos largos siempre ink-600 a 400; nunca ink-500 ni pesos inferiores. #454956 sobre blanco da 8,97:1 según el cálculo WCAG (aproximadamente 9:1), por encima de AA y AAA para texto normal. Foco visible violeta; movimiento reducido sin escalado ni scroll suave.

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
El listado se renderiza en servidor al recibir `categoria` y `pagina`, para mantener filtros GET sin JavaScript adicional. Los artículos y RSS se prerenderizan.

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

Categorías: `diseno-web`, `software-a-medida`, `apps`, `mvp`, `mantenimiento`. Contacto: `web`, `software`, `app`, `mvp`, `automatizacion`, `otro`, alineado con el formulario existente. Cover es opcional mientras no haya una imagen real: se muestra un placeholder decorativo y se usa la OG de marca existente, nunca una URL inexistente.

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
- De 4 a 8 `##` por artículo; máximo 60 caracteres. Para índices largos, añade `tocLabel` usando el ID español sin tildes. Los `###` no entran en el índice.
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
