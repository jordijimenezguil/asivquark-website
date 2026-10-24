# Sistema global Foco — 23/10/2026

Dirección visual autorizada a partir de las cuatro capturas del propietario: fondo oscuro, morado eléctrico, titulares grandes, contornos y exploración interactiva. Este documento sustituye las instrucciones visuales históricas de superficies claras. No modifica copy, catálogo, contenido jurídico ni contratos operativos.

## Configuración única

Tailwind CSS 4 usa `@theme` en `src/app/globals.css` como equivalente CSS-first de tailwind.config. `@layer base` define fondo, fuentes, selección y foco; `@layer components` concentra botones, tarjetas, formularios, FAQ, cookies y lectura legal. No hay CSS Modules ni una segunda paleta. Los alias antiguos navy/paper/ink/violet resuelven al mismo sistema para conservar las plantillas existentes.

| Grupo | Tokens |
| --- | --- |
| Fondo/superficies | ink-950 #07090f; ink-900 #0d1019; ink-800 #141826; ink-700 #1f2433 |
| Marca | brand-300 #c4b5fd; 400 #a78bfa; 500 #8b5cf6; 600 #7c3aed; 700 #6d28d9; 800 #5b21b6 |
| Texto | fg blanco; muted #b8bccb; subtle #a3a7b7; faint #6b6f80 |
| Escala | display 48–118px; h1 40–80px; h2 32–64px; h3 22–36px; lead 18–26px; body 16–19px; small 14–15px |
| Bordes/radios | blanco 10%, brand activo; controles 12px, tarjetas 20/24px, bloques 28px, botones píldora |
| Contenedor | 1280px; padding 20/32/64px; ritmo de sección 80/112/128px |

Manrope variable y JetBrains Mono cargadas una vez en `src/app/layout.tsx` con next/font y swap. Logo SVG oficial en `public/brand/`, sin rediseño. `brand-600` se usa en botones con texto blanco; `brand-300/400` para enlaces sobre oscuro. `fg-faint` es decorativo y no se usa para cuerpo o metadatos esenciales. El blog conserva tamaños editoriales específicos registrados en BLOG-DESIGN.md y columna 68ch.

## Componentes y correspondencias

| Elemento solicitado | Implementación compartida |
| --- | --- |
| Logo, Header, MobileMenu, Footer | branding/brand-logo; layout/site-header, mobile-navigation, site-footer |
| Button, Card, SectionHeader | ui/button, card, section-heading; ui/section y container |
| Eyebrow, Input | ui/eyebrow, input y clases eyebrow/form-input en globals.css |
| Breadcrumb, HeroCompact, FAQ | Breadcrumbs, PageHero/ServiceHero, FAQAccordion en marketing/commercial |
| ProjectSelector | marketing/configurator: radios nativos + GET a contacto con tipo |
| Marquee, ServiceExplorer, ProcessPanels | marketing/foco-interactions |
| Spotlight, CTASection | marketing/spotlight y cta-section |
| Badge | ui/badge, etiqueta compartida de categoría |
| Lectura editorial | marketing/blog y prose-asiv; contrato BLOG-DESIGN.md |

El layout marketing monta header, main y footer una sola vez para todas sus páginas. La 404 raíz compone el mismo shell con su proveedor de cookies. El acceso/CRM hereda fuentes, colores y controles, manteniendo su navegación privada y estados semánticos.

## Interacción y responsive

Base móvil desde 360px, breakpoints 640/768/1024/1280. Selector 2 columnas móvil y 4 desde lg. Explorador con details móvil, tablist vertical/panel escritorio y flechas Arriba/Abajo/Inicio/Fin. Proceso apilado móvil y paneles flex desde lg, clic/foco en ambos, hover solo con puntero fino. FAQ usa details con name para apertura exclusiva; footer usa columnas plegables nativas, inicialmente abiertas para mantener enlaces visibles.

Spotlight: brillo estático en táctil; movimiento mediante requestAnimationFrame únicamente en escritorio con puntero fino y sin reduced motion. IntersectionObserver suspende seguimiento fuera de pantalla. Marquee decorativo con contenido duplicado, aria-hidden, pausa fuera de viewport y animación solo motion-safe. Los servicios reales están presentes en contenido accesible. La expansión flex es funcional y se desactiva su transición en reduced motion.

Contacto conserva el flujo existente: selección en home, datos en contacto y confirmación después de persistir. La URL precarga tipo. Se añade progreso visual accesible al paso de datos; no se envían formularios durante verificación.

## Verificación y límites

Consultar docs/validacion.md para resultados ejecutados. No se acredita WCAG AA integral, ausencia de overflow en seis anchos ni Lighthouse ≥90 sin navegador y medición. Revisión visual pendiente en 360, 390, 768, 1024, 1280 y 1440px; teclado real, lector de pantalla y contraste de imágenes también requieren QA. No se despliega producción ni se modifica infraestructura.

## Corrección del titular Home — 24/10/2026

«páginas web» usa brand-400 sólido en lugar del contorno transparente para evitar los trazos interiores superpuestos de Manrope. Se mantienen texto, escala y composición del H1.
