# Plan de rediseño ASIVQUARK — UI, conversión y arquitectura SEO

Fecha: 12 de octubre de 2026. Estado: **implementación solicitada por el usuario el 12/10/2026; validación en docs/validacion.md**.

## 1. Encargo y decisiones confirmadas

Rediseñar la web a partir de las cinco referencias adjuntas y de la especificación entregada. Implementación futura mobile-first con Tailwind, entre 320 y 1920 px. Esta entrega solo crea documentación y archiva los adjuntos: no cambia páginas, componentes, rutas activas, configuración, backend ni recursos públicos.

El usuario aclara que **no hay nada en producción**, permite plantear la web desde cero y solicita **no desarrollar retrocompatibilidad**. Por tanto, la arquitectura pública se propone como definitiva: sin aliases de rutas antiguas, redirecciones históricas, soporte de parámetros antiguos o capas de transición. El stack y la lógica actual de captación, autenticación, persistencia y email siguen siendo la base; empezar desde cero la UI no implica rehacer el backend.

Confirmados por el usuario: `hola@asivquark.com`, respuesta en 24 h laborables, precio cerrado por fase, entregas cada dos semanas y propiedad del código por el cliente. Falta URL oficial de LinkedIn. Los nuevos tramos de presupuesto siguen pendientes de elección y validación. No hay casos publicados ni material de equipo aportado. El usuario confirma que quiere **una única página de proyectos, sin páginas individuales por caso**, también cuando se incorporen proyectos al listado. Cualquier futura ampliación a fichas requerirá una petición nueva y queda fuera de este plan.

Prioridades: fidelidad visual, claridad comercial, solicitudes cualificadas, contenido indexable en HTML inicial, arquitectura SEO coherente y accesibilidad. No se promete posicionamiento ni métricas sin medirlas.

## 2. Material entregado y archivo de referencia

Los recursos se conservan dentro de documentación, sin copiarlos todavía a `public/brand/` ni sustituir el logo actual.

| Referencia | Archivo | Uso |
| --- | --- | --- |
| Imagen 1 | [Contacto](assets/rediseño-asivquark-2026-10-12/referencias/01-contacto.png) | Hero, solapamiento del formulario, pasos, footer sin CTA |
| Imagen 2 | [Footer](assets/rediseño-asivquark-2026-10-12/referencias/02-footer-con-y-sin-cta.png) | Variantes con y sin banda CTA, columnas y barra legal |
| Imagen 3 | [Valores y footer](assets/rediseño-asivquark-2026-10-12/referencias/03-servicios-valores-y-footer.png) | Bloque de recomendación, principios, continuidad con footer |
| Imagen 4 | [Servicios](assets/rediseño-asivquark-2026-10-12/referencias/04-servicios-listado.png) | Hero interior y listado editorial de cuatro servicios |
| Imagen 5 | [Home](assets/rediseño-asivquark-2026-10-12/referencias/05-home.png) | Hero en dos columnas, configurador, compromisos y cards |

Logos originales, sin alteraciones:

- [asivquark-nav-dark.svg](assets/rediseño-asivquark-2026-10-12/logos/asivquark-nav-dark.svg).
- [asivquark-horizontal-dark.svg](assets/rediseño-asivquark-2026-10-12/logos/asivquark-horizontal-dark.svg).
- [asivquark-horizontal-light.svg](assets/rediseño-asivquark-2026-10-12/logos/asivquark-horizontal-light.svg).
- [asivquark-mark-dark.svg](assets/rediseño-asivquark-2026-10-12/logos/asivquark-mark-dark.svg).
- [asivquark-mark-light.svg](assets/rediseño-asivquark-2026-10-12/logos/asivquark-mark-light.svg).
- [asivquark-app-icon-dark.svg](assets/rediseño-asivquark-2026-10-12/logos/asivquark-app-icon-dark.svg).
- [favicon.svg](assets/rediseño-asivquark-2026-10-12/logos/favicon.svg).

[Manifiesto de adjuntos](assets/rediseño-asivquark-2026-10-12/manifest.json): origen, tamaño, SHA-256 y, en SVG, viewBox y número de nodos de texto. Contiene 12 archivos aportados: cinco PNG y siete SVG. Las copias se han comparado byte a byte con sus originales.

Los marcos grises, numeración «01 Home / 02 Servicios», bordes exteriores redondeados y sombras de presentación pertenecen al documento de diseño: no se trasladarán al viewport de la web. Los fondos de sección serán full-bleed. Las capturas son referencias parciales de escritorio; las secciones no visibles se desarrollarán siguiendo la especificación textual.

## 3. Auditoría de la base actual

Se han leído README, arquitectura, producto, SEO y documentación de leads, y revisado archivos principales de UI, contenido, navegación, configuración y contrato del formulario.

- Next.js 16.4, React 19.3, TypeScript estricto, Tailwind 4 e integración Turbopack existente. pnpm 12.11.2, Node >=22.12.
- Ocho páginas públicas actuales; cuatro servicios como landings en raíz. No existe `/servicios/` ni detalle público de proyectos.
- Shell en `src/app/(marketing)/layout.tsx`; header/footer separados. Componentes comerciales compartidos en `commercial.tsx` y plantilla `service-page.tsx`.
- Tokens actuales en `globals.css`; Geist Sans/Mono en el layout raíz. También existen login y CRM privado: el rediseño público no debe romper sus estilos compartidos.
- `BrandLogo` provisional: los originales entregados permitirán reemplazarlo.
- `src/content/services.ts` es contenido local tipado. **No hay CMS**: no introducir uno por las menciones del brief.
- `src/content/projects.ts` tiene colección vacía; no hay testimonios, nombres de clientes, imágenes de casos ni fichas que puedan publicarse.
- Contacto usa Suspense para `useSearchParams`, Zod y `POST /api/leads/`. La selección actual usa `?servicio=`; el contrato admite `web|software|aplicacion|mvp|otro`.
- Los presupuestos actuales son distintos a los nuevos: claves `under_2000`, `from_2000_5000`, `from_5000_10000`, `from_10000_25000`, `over_25000`, `undecided`.
- Formulario conserva idempotencia, timeout, reintento sin pérdida de datos, honeypot, atribución y gestión de 409/429/503. Éxito solo tras respuesta 201 positiva.
- Captación condicionada por configuración legal/operativa. No activar servicios, ejecutar migraciones ni enviar emails como parte de la UI.
- Producción exclusivamente `https://asivquark.com`; preview sin canonical público, noindex/nofollow y sitemap vacío. Rutas con barra final.

Guías instaladas consultadas: `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`, `13-fonts.md`, `14-metadata-and-og-images.md` y referencia `03-api-reference/04-functions/use-search-params.md`. Antes de implementación se releerán las guías pertinentes de Image, iconos, metadata, rutas dinámicas y navegación de esta versión. No migrar configuración por ejemplos de versiones anteriores.

## 4. Arquitectura pública SEO propuesta, sin retrocompatibilidad

La nueva estructura reúne servicios bajo un índice y utiliza slugs legibles con intención comercial. Evitar abreviaturas técnicas en URLs públicas, parámetros indexables, páginas locales repetidas y rutas que compitan por la misma intención.

| Ruta definitiva propuesta | Intención principal | H1 |
| --- | --- | --- |
| `/` | Desarrollo de software y páginas web en Barcelona | Desarrollo de software y páginas web en Barcelona |
| `/servicios/` | Descubrir y comparar servicios digitales | Soluciones digitales adaptadas a cada proyecto |
| `/servicios/diseno-web-barcelona/` | Diseño y desarrollo de páginas web en Barcelona | Diseño y desarrollo de páginas web en Barcelona |
| `/servicios/software-a-medida-barcelona/` | Software a medida para empresas en Barcelona | Desarrollo de software a medida en Barcelona |
| `/servicios/aplicaciones-web-barcelona/` | Desarrollo de aplicaciones web en Barcelona | Desarrollo de aplicaciones web en Barcelona |
| `/servicios/desarrollo-mvp/` | Desarrollo de MVP para emprendedores y productos | Desarrollo MVP para validar tu producto |
| `/proyectos/` | Portfolio real | Proyectos |
| `/nosotros/` | Marca, experiencia y forma de trabajar | Un estudio de desarrollo digital en Barcelona |
| `/contacto/` | Contactar y solicitar propuesta | Hablemos de tu proyecto |

Los slugs son **propuesta editorial pendiente de aprobación**. Barcelona se usa donde define una intención local real; MVP mantiene intención de producto más amplia. No inventar oficinas, cobertura local específica ni páginas de ciudades adicionales. La longitud o la inclusión de keywords no garantizan posiciones: las páginas deben aportar contenido útil y distinto.

Implementación prevista: índice `src/app/(marketing)/servicios/page.tsx` y plantilla `servicios/[slug]/page.tsx` respaldada por contenidos locales y slugs explícitos; generar solo los cuatro slugs válidos, devolver 404 en desconocidos. Retirar las cuatro páginas antiguas en raíz y actualizar enlaces, sitemap, metadata, pruebas y documentación en el mismo cambio. **No crear redirecciones ni soporte de `?servicio=`**. El nuevo parámetro comercial único será `?tipo=web|software|app|mvp`.

El índice de servicios nuevo es parte del rediseño solicitado. El portfolio tendrá exclusivamente `/proyectos/`: no se crearán rutas `/proyectos/[slug]/`, aunque más adelante se incorporen trabajos reales al listado. Sin proyectos publicados, mostrar estado vacío y CTA. No crear rutas legales sin textos aprobados.

### SEO editorial y técnico

1. Title y description propios por ruta: expresar servicio, público y marca sin repetir el mismo texto en todas las páginas. Ejemplos de titles: «Diseño web en Barcelona | ASIVQUARK», «Software a medida en Barcelona | ASIVQUARK», «Desarrollo de aplicaciones web | ASIVQUARK», «Desarrollo MVP para startups | ASIVQUARK» si el público startups se valida con negocio.
2. Home cubre la propuesta global; cada detalle explica dolores, destinatarios, alcance, proceso y FAQ específica. El índice resume y enlaza. Evitar duplicar íntegramente el copy de home en servicios.
3. Enlazado real mediante `<Link>`/`<a>` rastreable: home → índice y cuatro servicios; índice → detalle; detalle → contacto con tipo, servicios relacionados y el listado de proyectos; footer → servicios y empresa.
4. Breadcrumb visual y `BreadcrumbList` con niveles correctos: Inicio / Servicios / Servicio y Inicio / Proyectos en la página única del portfolio. URLs finales coherentes, sin parámetros.
5. Mantener `pageMetadata()` y separación por `VERCEL_ENV`; canonical absoluto solo en producción, sin `tipo` ni `cat`. No indexar combinaciones de filtros como nuevas páginas.
6. OG 1200×630 navy + isotipo y composición de marca; texto legible sin inventar métricas. Imagen compartida inicialmente y variaciones solo si aportan valor editorial.
7. Sitemap solo con rutas públicas renderizables y proyectos publicados; sin `lastmod` artificial. Login/admin/API excluidos.
8. JSON-LD `Organization` con nombre, URL, logo y email confirmados; ubicación Barcelona/ES sin domicilio inventado. `sameAs` solo con LinkedIn real. Evaluar `LocalBusiness` únicamente si la representación de negocio local y sus datos son adecuados; no duplicar entidades contradictorias.
9. `FAQPage` refleja exactamente preguntas y respuestas visibles de home/servicios. No prometer rich results por añadir este schema. No añadir `CreativeWork` de fichas individuales: esas páginas quedan fuera del alcance.
10. JSON-LD serializado escapando `<`, contenido público en HTML inicial, un H1, jerarquía semántica, imágenes con alt y dimensiones, sin depender de JS para el contenido SEO.
11. Comprobar código de estado, canonical, robots y sitemap sobre artefactos de producción/preview; inspección remota e indexación real serán posteriores al despliegue autorizado.

## 5. Sistema visual y Tailwind 4

### Tokens

El brief usa `tailwind.config → theme.extend`, pero el proyecto ya usa Tailwind 4. Expresar estos valores en `@theme`/`@theme inline` de `globals.css`, conservando la integración actual. No bajar a Tailwind 3 ni introducir un config innecesario.

| Familia | Valores exactos |
| --- | --- |
| navy | DEFAULT `#0B0F17`; 800 `#141926`; 700 `#1A2030` |
| violet | DEFAULT `#7C3AED`; 600 `#6D28D9`; 800 `#5B21B6`; 300 `#9F75FF`; 200 `#B79BFF`; 50 `#F1EBFF`; 25 `#FBFAFF` |
| ink | DEFAULT `#0B0F17`; 700 `#2A2F3A`; 600 `#454956`; 500 `#5B5F6B`; 400 `#8A8F9C` |
| mist | DEFAULT `#B9BDC9`; 300 `#C9CDD7`; 500 `#9AA0AE` |
| line | DEFAULT `#E3E5EB`; strong `#DADDE4` |
| paper | DEFAULT `#FFFFFF`; soft `#F6F7FA` |

Sobre navy: texto violeta 300/200; violeta base reservado a rellenos, bordes y texto sobre blanco. Bordes oscuros `border-white/10`, divisores `border-white/[.08]`. Revisar AA también en placeholders, textos pequeños, errores y hover; ajustar el tono si una combinación del brief falla contraste.

Eliminar usos públicos de los tokens antiguos una vez migrados. Auditar primero dependencias de login/CRM, especialmente `mist`, que cambia de fondo claro a texto gris. Aislar el nuevo tema/tipografía de marketing cuando sea necesario para conservar la UI privada; no sustituir ciegamente nombres globales.

### Fuentes y escala

Marketing usará Manrope 400/500/600/700/800, Montserrat 600 para identidad y JetBrains Mono 400/500 para números/etiquetas, mediante `next/font` y `display: swap`. Conservar Geist para superficies privadas si lo necesitan. Variables CSS de fuente aplicadas al shell público; evitar descargas o familias duplicadas sin uso. Prever restricciones de red al build y no afirmar que funcionan sin comprobar.

| Uso | Clases de referencia |
| --- | --- |
| Hero H1 | `text-[40px] leading-[1.05] sm:text-5xl lg:text-[64px] lg:leading-[1.02] font-bold tracking-[-0.035em] text-balance` |
| Interior H1 | `text-[40px] sm:text-5xl lg:text-[68px] leading-none font-bold tracking-[-0.035em] text-balance` |
| H2 | `text-[30px] sm:text-4xl lg:text-[44px] leading-[1.05] font-bold tracking-[-0.03em]` |
| Footer CTA | `text-4xl sm:text-5xl lg:text-[56px] leading-[1.02] font-bold tracking-[-0.035em]` |
| Lead | `text-[17px] lg:text-[19px] leading-relaxed`, mist en oscuro, ink-600 en claro |
| Body | `text-[15px] leading-[1.55] text-ink-500` |
| Card | `text-lg lg:text-xl font-bold` |
| Eyebrow | `font-mono text-xs uppercase tracking-[0.16em]`, violet-200/violet |
| Paso | `font-mono text-[13px] text-violet` |

Párrafos con `[text-wrap:pretty]`; títulos con `text-balance`, sin partir palabras. Si un título a 320 px requiere ajuste, reducir su tamaño de forma controlada en ese ancho antes de permitir desbordamiento.

### Espaciado y responsive

- Contenedor `mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-16`.
- Secciones `py-16 sm:py-20 lg:py-[104px]`; heroes `pt-12 pb-16 lg:pt-16 lg:pb-24`.
- Cards radio 14 px; paneles/formulario 16 px; botones 10 px; inputs 8 px; filtros pill.
- Sombra panel/formulario `0 30px 60px -30px rgba(11,15,23,.3)`.
- Breakpoints 640/768/1024/1280; base móvil. Grids 1 → 2 → 3/4 según sección, columnas textuales complejas desde lg.
- `min-w-0` en hijos de grid/flex que lo requieran; correos y textos largos no deben desbordar. No ocultar overflow del documento para encubrir fallos.
- Alturas fijas solo donde el elemento las justifica: botones, inputs e imágenes con aspect ratio. Ningún bloque textual con altura fija.
- `scroll-margin-top` de anclas adaptado al header sticky; foco no oculto por header o barra móvil.
- Movimiento reducido sin animaciones de entrada; transiciones de color/borde 150–200 ms.

## 6. Componentes compartidos

### Primitivas

`Button`: mantener unión tipada enlace/botón. Primary violeta, min-height 48 px, px-6, radio 10 px, texto 15 px semibold, hover violet-600 y foco visible. Variantes `secondary-dark` (borde white/20), `secondary-light` (borde ink, inversión en hover) y `link` (violet, flecha). No cambiar indiscriminadamente las variantes que consume CRM; ajustar consumidores o limitar variantes nuevas al marketing.

Unificar CTA general «Cuéntanos tu proyecto →». El brief también pide textos contextuales «Empezar con…», «Pedir recomendación», «Hablar de mi proyecto» y «Enviar solicitud»: conservarlos como excepciones explícitas para seleccionar servicio, pedir ayuda y enviar el formulario. Todos conducen al mismo objetivo, sin CTA primario competidor. Si negocio prefiere literal único también en esos puntos, decidirlo antes de implementar.

`Chip`: botón real, 48 px, radio 10 px, `aria-pressed` para configurador/filtros; activo violeta/blanco. En contacto preferir radios nativos estilizados o semántica radio completa, no usar `aria-pressed` en lugar de `aria-checked`. Filtros pill, activo ink/blanco.

`ServiceCard`: enlace completo sin enlaces anidados, p-6/lg:p-7, borde line, hover violet/violet-25, orden número → título → descripción flexible → «Ver servicio →»; mínimo 250 px en lg.

`FAQAccordion`: `details/summary` con primera abierta, exclusividad mediante agrupación nativa compatible o estado cliente pequeño; signo +/− decorativo, fila border-t y py-5, H3/pregunta accesible. Emisión de evento solo al abrir. La respuesta inicial debe existir en HTML.

`FormField`: label asociado, obligatorios con *, input de 50 px, borde line-strong, padding 14 px, ring violet/15, error de 13 px y `aria-describedby`; no comunicar errores solo por color.

`Breadcrumbs`: modelo de lista de niveles para visual y JSON-LD, último `aria-current`, sin enlace al mismo documento; flexible a 320 px.

`ProjectCard`: en `/proyectos/`, card informativa sin enlace a una ficha individual, con imagen, `sizes`, proporción indicada, etiqueta/título/resumen. Las destacadas de home podrán enlazar al listado `/proyectos/`. No mostrar contenido no publicado ni simular una card clicable sin destino real. Placeholder diagonal solo de desarrollo, etiqueta mono visible; nunca publicar capturas ficticias.

### Header

Fondo navy, border-b white/.08, sticky top-0 z-50; 64 px móvil/90 px lg. Logo nav h-6 con alt ASIVQUARK y enlace a home. Escritorio: Servicios desplegable con cuatro detalles, Proyectos, Cómo trabajamos `/#proceso`, Nosotros y CTA. Servicios debe permitir también acceder al índice, sin depender exclusivamente de hover. Estado activo por ruta, blanco y subrayado violet-300.

Móvil: control 48×48 con nombre accesible y `aria-expanded`/`aria-controls`; panel fullscreen navy, enlaces 24 px bold, servicios desplegables y CTA inferior. Al pasar de menú no modal a fullscreen, añadir gestión modal: bloquear scroll, confinar foco, hacer el fondo inerte, cerrar con Escape/selección/cambio de ruta, devolver foco al disparador y limpiar bloqueo al desmontar o pasar a desktop. Compatibilidad con safe-area y viewport dinámico; panel desplazable sin perder CTA.

Barra inferior tras 600 px: **opcional, fuera del mínimo inicial**. Solo incorporarla si se decide; ocultar en contacto, menú abierto y al intersectar CTA final/formulario; IntersectionObserver, safe-area, espacio suficiente y sin ocultar contenido/foco. No instalarla por defecto si repite CTA de forma molesta.

### Footer

`SiteFooter` con prop `cta` explícita. Mantener servidor: el shell público puede dejar el footer a la composición de cada página o usar layouts específicos; escoger la solución más pequeña que garantice `cta=false` en contacto sin convertir todo el layout en cliente. No duplicar footer ni bandas CTA ya presentes en páginas.

Banda: py-16/lg:pt-88/lg:pb-80, grid lg 1.3fr/1fr, H2 «¿Tienes un proyecto en mente?» y «Cuéntanoslo y te respondemos en 24 h laborables.». Botones primario y mailto, apilados en móvil.

Columnas: grid de dos en móvil y 1.6fr/1fr/1fr/1fr en lg; marca ocupa dos columnas móvil. Logo horizontal dark h-10 y descripción entregada. Servicios: Diseño web, Software a medida, Aplicaciones web, Desarrollo MVP. Empresa: Nosotros, Proyectos, Cómo trabajamos, Contacto. Contacto: email confirmado, Barcelona/España, LinkedIn únicamente cuando se facilite URL; externo con noopener/noreferrer y aviso accesible de nueva pestaña.

Barra inferior py-7, divisor, copyright de año dinámico y enlaces legales reales. Aviso legal, Privacidad y Cookies se añaden solo con contenido/URL aprobado. No enlazar `#`, páginas vacías o textos inventados. Incorporar entidad JSON-LD compartida una sola vez por página y conservar WebSite de home cuando corresponda.

## 7. Plan por página y contenido

### Home

1. Hero navy grid `lg:grid-cols-[1.05fr_1fr]` gap-10/lg:gap-14. Eyebrow «Estudio de desarrollo digital · Barcelona». H1 y lead del brief: «En ASIVQUARK transformamos ideas en soluciones digitales. Creamos páginas web, aplicaciones y software a medida para empresas y emprendedores.». Microgarantías: llamada sin compromiso y respuesta 24 h, punto violet-300 de 6 px.
2. Configurador debajo del texto en móvil; panel navy-800, border white/.09, radio 16, p-5/sm:p-7. Cuatro chips en dos columnas, web activa inicialmente, separador, descripción y cuatro inclusiones; enlace full-width a `/contacto/?tipo=...`. Texto contextual por tipo: web «Empezar con una web →»; definir frases naturales equivalentes para software/app/MVP. Cambios sin recargar y estado accesible.
3. Franja blanca de tres compromisos: precio cerrado por fase («Cada fase se aprueba antes de empezar. Sin sorpresas.»), entregas cada dos semanas («Ves el avance real y ajustas prioridades.»), código propio («Repositorio y accesos a tu nombre desde el primer día.»). Una columna móvil, tres desde sm, divisores coherentes.
4. «¿Qué necesitas desarrollar?» + enlace al índice; cuatro cards en 1/2/4 columnas.
5. `id=proceso`: «Cómo trabajamos» y «De la primera llamada al lanzamiento». Conversación: llamada de 30 minutos para entender problema/contexto. Propuesta: alcance, fases y presupuesto por escrito. Desarrollo: entregas cortas revisables. Lanzamiento: publicación, medición y evolución. Línea superior por paso móvil y composición de cuatro en lg.
6. Proyectos: hasta dos casos reales destacados, imagen 16/10, título, etiqueta y resumen. Hoy no hay casos: mostrar estado vacío honesto/enlace al portfolio o suprimir listado de cards, sin aparentar trabajos publicados. La opción editorial queda pendiente.
7. FAQ en paper-soft, lg 1fr/1.4fr. «Preguntas frecuentes» / «Lo que suelen preguntarnos antes de empezar.». Preguntas y respuestas:
   - ¿Cuánto cuesta un proyecto? Depende del alcance; propuesta por fases con precio cerrado tras primera llamada.
   - ¿Cuánto se tarda? Web en pocas semanas; software planificado en entregas de dos semanas. **Validar aparte «pocas semanas»**, no queda confirmado por validar la cadencia de entregas.
   - ¿Trabajáis con empresas fuera de Barcelona? Proyectos de España, remoto o presencial cuando haga falta; confirmar operativa presencial antes de prometerla.
   - ¿Qué pasa después del lanzamiento? Mantenimiento/evolución para crecer con uso real; validar alcance del servicio.
8. Footer con CTA, sin otra banda duplicada antes.

### Datos compartidos de servicio

| Tipo UI | Título | Descripción | Inclusiones |
| --- | --- | --- | --- |
| web | Página web | Una presencia digital clara, rápida y diseñada para explicar tu negocio. | Diseño a medida; Gestor de contenidos; SEO técnico; Formulario conectado |
| software | Software a medida | Herramientas adaptadas a tus procesos y a la forma de trabajar de tu empresa. | Análisis de procesos; Integraciones; Roles y permisos; Mantenimiento |
| app | Aplicación web | Plataformas accesibles desde el navegador, con flujos y permisos bien definidos. | UX de producto; Área de usuarios; Panel de administración; API |
| mvp | Desarrollo MVP | Una primera versión útil para poner a prueba la propuesta de tu producto. | Definición de alcance; Prototipo; Lanzamiento rápido; Métricas |

Una fuente tipada en `content/services.ts` debe reunir slug público, tipo UI, valor del contrato, título comercial, SEO, descripción, ideal para, inclusiones, dolores, FAQ y enlaces. No duplicar arrays con textos divergentes entre configurador, cards y formulario.

### Índice de servicios

Hero con breadcrumb, H1 propuesto max-width 900 px y lead «Cuatro formas de trabajar contigo, según lo que necesites resolver.». Filas clicables, border-b, py-8/lg:py-10; móvil apilado con flecha superior, lg grid `70px 1.2fr 1fr 1fr 40px`, gap-8. Título 24/30 px; «Ideal para»/«Incluye» 12 px uppercase.

Destinatarios: web para empresas/autónomos/negocios que necesitan presencia sólida; software para empresas con hojas de cálculo o herramientas que no encajan; app para servicios digitales a clientes/equipos; MVP para emprendedores con primera versión. Listas de inclusiones de la tabla anterior.

Bloque lavender radio 16, p-8/lg:px-12/lg:py-10: «¿No sabes cuál encaja?» y «Cuéntanos el problema y te recomendamos el enfoque más sensato.»; «Pedir recomendación →» a contacto sin tipo específico adicional (default web editable).

«Tecnología que aporta valor a tu negocio»: cuatro columnas 1/2/4 con borde superior ink. Soluciones a medida: objetivos y procesos para decidir solución. Calidad técnica: estructura, accesibilidad y mantenimiento desde primeras decisiones. Comunicación directa: prioridades/alcance/decisiones con lenguaje claro. Preparado para evolucionar: crecer sin rehacerlo. Footer con CTA.

### Detalles de servicio

Usar una plantilla servidor común, sin CMS nuevo. Hero navy lg 1.3fr/1fr; breadcrumb de tres niveles, H1 SEO y descripción específica, CTA contextual a tipo correspondiente y «Ver proyectos» outline. Panel con Ideal para / Forma de trabajo («Fases con precio cerrado y entregas cada dos semanas.») / Primer paso («Llamada de 30 minutos, sin compromiso.»).

«¿Te suena alguna de estas situaciones?» lg 1fr/1.5fr, cuatro cards 1/2 columnas. Software: procesos clave con hojas de cálculo; herramientas sin conexión; tareas manuales repetidas; software que no crece con equipo. Los otros tres servicios necesitan cuatro dolores propios, redactados desde el contenido actual y revisados; no reutilizar dolores irrelevantes.

«Qué incluye»: cuatro columnas con borde superior violet, título y explicación de una línea. Proyecto relacionado solo con trabajo real publicado de esa categoría; su enlace será «Ver proyectos →» al listado `/proyectos/`, nunca a una ficha individual. Si no existe, omitir sección completa. FAQ específica, tres preguntas por servicio. Para software: revisar herramienta existente (mejorar/migrar/rehacer tras análisis); integrar herramientas mediante API (no garantizar cualquier sistema sin analizarlo); mantenimiento o formación al equipo y propiedad de código/documentación. Redactar las otras FAQ con alcance real. Footer con CTA.

### Proyectos: página única

Índice: hero «Proyectos» / «Webs, herramientas y productos que hemos construido con nuestros clientes.». **Esta frase presupone trabajos reales**: con portfolio vacío usar copy honesto aprobado, sin afirmar casos visibles inexistentes.

Filtros Todos / Página web / Software a medida / Aplicación web / Desarrollo MVP; pill, scroll horizontal en móvil, snap y scrollbar oculto sin eliminar acceso. Sincronizar con `?cat=` mediante navegación/history soportada por Next instalado, sin recarga completa; conservar otros parámetros pertinentes, comportamiento Atrás/Adelante y default Todos ante categoría inválida. Canonical del índice sin filtro.

Grid 1/2/3 columnas; card informativa sin enlace de detalle, imagen 4/3, etiqueta 13 px violet, título y resumen. Última celda siempre CTA violeta «¿El siguiente es el tuyo?» / «Cuéntanos tu proyecto →». Estado vacío «Aún no hay proyectos publicados en esta categoría» + card CTA. No generar proyectos de demostración como contenido público.

Cuando haya material autorizado, incorporar los proyectos directamente al listado con nombre, servicio, resumen e imagen aprobados. Las cards serán informativas y no enlazarán a páginas individuales. No construir plantillas de caso, galerías de detalle, navegación entre casos, metadata por caso o rutas dinámicas de proyectos. Mantener únicamente los campos necesarios para el listado, sin ampliar el modelo con contenido de fichas fuera de alcance.

### Nosotros

Hero y lead exactos del brief. «Entender antes de construir» en dos columnas lg, con los dos párrafos sobre tecnología y comprensión del negocio, personas/procesos, profesionales/pequeñas empresas y emprendedores.

Equipo: fotos 4/5, nombre y rol, grid 1/2/3 **solo con datos y fotos aprobados**. No inventar equipo ni usar retratos generados como personas reales. Sin material, sección de marca con isotipo y «Software con propósito. Desde Barcelona.» / «Trabajamos con proyectos de toda España.»; decidir si se omite título Equipo hasta disponer de personas.

Principios en paper-soft, mismos cuatro del índice sin duplicar lógica. Footer con CTA.

### Contacto

Hero navy con breadcrumb, «Hablemos de tu proyecto» y lead entregado. Extra padding `pb-32 lg:pb-44`; cuerpo `-mt-24 lg:-mt-32`, grid lg 1fr/1.5fr y gap-10/lg:gap-12. Formulario primero móvil y derecha lg; información después móvil e izquierda lg con pt-150. La superposición no debe tapar lead ni generar solapamientos en 320 px.

Información: «Qué pasa después»; filas 40px/1fr con 01 Te respondemos (24 h laborables por email), 02 Llamada de 30 minutos (problema, usuarios y primera necesidad), 03 Propuesta por escrito (alcance, fases, presupuesto cerrado). Contacto directo mailto y Barcelona/España.

Formulario card blanca, border line, radio 16, p-6/sm:p-10 y sombra especificada. Título «Cuéntanos lo que necesitas». Orden:

1. Tipo obligatorio, cuatro radios estilizados en dos columnas; `tipo` válido preselecciona, default web. Etiqueta «¿Qué quieres desarrollar? *».
2. Nombre y email obligatorios, una columna/sm dos; autocomplete name/email, email inputmode=email.
3. «¿Qué quieres resolver? *», textarea min-height 120 px, resize vertical, placeholder exacto del brief.
4. Toggle «+ Añadir empresa, teléfono o presupuesto (opcional)» / «− Ocultar detalles opcionales», aria-expanded/controls. Campos empresa, tel y presupuesto; conservar valores al cerrar, ayuda de alcance. Si error servidor afecta un opcional, abrir bloque antes de enfocar.
5. Checkbox 18 px y enlace legal real. Texto «He leído y acepto la política de privacidad.» pendiente de revisión legal; conservar estados actuales de modo desarrollo/información pendiente cuando no existe aviso aprobado.
6. «Enviar solicitud» full-width, spinner accesible y disabled durante envío. No deshabilitar por mera invalidez inicial; sí conservar indisponibilidad por configuración, pending y cooldown de seguridad.

Validación blur y submit con contrato Zod actual: nombre 2–100, email <=254, empresa <=150, teléfono <=40/formato válido, descripción 20–5000, privacidad true. Mostrar errores por campo, aria-invalid/description, foco primer error y mensajes globales de red/servidor. Evitar bombardear con alertas mientras se escribe.

Éxito dentro de misma card, foco y aria-live polite; círculo 56 px con check, «Solicitud recibida», tipo enviado real y texto de respuesta en 24 h confirmado. No afirmar que el email se ha entregado. «← Volver al formulario» restaura un formulario utilizable; limpiar intento/idempotency key cuando se inicia una solicitud nueva. Mantener el estado previo o reiniciar campos conforme a una elección de UX explícita; default propuesto: conservar tipo y vaciar datos personales al abrir nueva solicitud.

Footer con `cta=false`, sin barra móvil ni banda final.

## 8. Contrato de contacto: límites y decisiones

### Tipo comercial y contrato actual

La URL/selector público usa `web|software|app|mvp`. Mientras se mantenga el backend solicitado, mapear **solo al serializar el formulario** `app → aplicacion`; el resto coincide. Esto es adaptación entre UI y contrato vigente, no soporte de una URL histórica. No aceptar `?servicio=` ni `?tipo=aplicacion`. No mostrar «Otro proyecto» entre los cuatro chips; el backend puede seguir admitiendo `otro` para sus consumidores actuales sin modificar seguridad ni CRM.

Validar parámetros de entrada como lista cerrada. Ausencia, desconocidos o múltiples valores → web; la selección del usuario manda después de inicializar el formulario. Mantener Suspense y fallback consistente para evitar saltos de layout. El tipo de éxito proviene del envío confirmado, no de una query que cambió mientras se enviaba.

### Presupuestos: decisión pendiente real

El brief pide Sin indicar / Menos de 5.000 € / 5.000–15.000 € / 15.000–40.000 € / Más de 40.000 €. El endpoint actual no admite claves equivalentes. **No se pueden cambiar solo las etiquetas de las claves actuales**, porque registrarían rangos distintos a los elegidos.

- Opción A, estrictamente UI: mantener las opciones y claves actuales en el bloque desplegable; documentar la diferencia visual/editorial respecto al brief.
- Opción B, reproducir los rangos finales: cambio mínimo explícito del contrato compartido y consumidores de presupuesto (schema, etiquetas CRM, emails y pruebas). Claves propuestas `under_5000`, `from_5000_15000`, `from_15000_40000`, `over_40000`, más ausencia sin indicar; verificar todos los consumidores antes de fijarlas. No conservar claves anteriores ni hacer migraciones de compatibilidad. Revisar representación Prisma antes de concluir si requiere cambio de esquema. No alterar handler, persistencia, idempotencia, permisos o outbox por este cambio editorial.

Recomendación para fidelidad al diseño: B, **pendiente de autorización de ese cambio de alcance y validación de los tramos**. Poder rediseñar desde cero elimina la necesidad de transición, pero no convierte una modificación del contrato en mero CSS.

### Invariantes

Conservar endpoint `/api/leads/`, JSON, Idempotency-Key, honeypot, origen, límites de tamaño, rate limiting y configuración legal. Conservar payload de atribución y privacidad, timeout, reserva de clave para reintentar el mismo contenido, nueva clave si cambia payload y gestión 409/429/503. No hacer pruebas con PII real ni envíos externos sin autorización. No simular éxito como alternativa a backend indisponible.

## 9. Assets de marca y medios

En implementación, copiar los siete SVG archivados a `/public/brand/` conservando nombres y originales. Usar nav-dark en header, horizontal-dark en footer, mark-dark sobre navy y variantes light solo sobre fondos claros. Comprobar renderización y dimensiones de cada SVG, metadatos, texto y apariencia real antes de integrar.

Los logos con texto dependen de Montserrat dentro del SVG. Cargar Montserrat en la página **no garantiza** que un SVG servido como imagen externa use esa fuente. Pedir/exportar SVG maestro con textos en contornos para producción; no redibujar la identidad ni aproximarla con otra tipografía. Hasta entonces documentar la limitación y revisar visualmente el resultado.

Favicon SVG definitivo y PNG 32/180/512 a partir de app-icon-dark, conservando proporciones; configurar las convenciones de metadata/iconos de Next instalado y retirar el icono provisional para que no compita. OG 1200×630 con isotipo ya entregado; no requiere ImageGen. Medios reales con Next Image, dimensiones/ratio y `sizes` coherentes: cards 100vw móvil, aproximadamente 50vw tablet y 33vw/25vw desktop según grid, limitadas al contenedor. Solo imagen principal relevante con estrategia de carga prioritaria permitida por la versión instalada; no priorizar todo.

Placeholders de desarrollo: diagonal `repeating-linear-gradient(135deg,#EEF0F4_0_10px,#F6F7F9_10px_20px)` y etiqueta mono. No presentar placeholders como capturas reales ni publicarlos en producción. Casos y equipo sin assets se omiten o muestran estado vacío.

## 10. Analítica sin ampliar servicios externos

Actualmente hay atribución en memoria y marcadores `data-conversion`, no proveedor analítico. Definir una utilidad tipada y pequeña para emitir eventos al mecanismo acordado; por defecto, instrumentación local sin cookies, almacenamiento persistente o llamadas externas. Confirmar proveedor y requisitos legales antes de activar analítica real. No instalar un tracker por inferencia.

| Evento | Cuándo | Payload permitido |
| --- | --- | --- |
| `cta_click` | Activación del CTA | `location`: header, hero, configurator, footer, service, project_card, mobile_bar |
| `configurator_select` | Cambio efectivo de tipo | `tipo`: web/software/app/mvp |
| `form_start` | Primer foco del formulario por visita/montaje | Sin valores personales |
| `form_optional_open` | Apertura del bloque opcional | Sin datos de los campos |
| `form_submit` | Intento válido que va al endpoint | tipo y `has_budget` boolean |
| `form_success` | 201 y success true | Sin datos personales |
| `form_error` | Validación/envío fallido | Sin texto libre, email, teléfono ni payload |
| `faq_open` | Pregunta pasa a abierta | `pregunta` editorial |
| `project_filter` | Cambio efectivo de categoría | `cat` de lista cerrada |

No doble emisión por hidratación, renders o cambios internos. No registrar descripción, presupuesto concreto, nombre o identificadores del lead. El estado inicial abierto de FAQ no representa un clic del usuario. Un CTA no tiene que convertir toda su sección servidor en cliente: usar frontera de eventos mínima. La instrumentación no debe bloquear navegación ni envío.

## 11. Mapa de archivos a intervenir al ejecutar

| Archivo o área | Trabajo previsto |
| --- | --- |
| `src/app/globals.css` | Tokens Tailwind 4, fuentes públicas, pretty/focus/reduced motion y aislamiento de estilos privados |
| `src/app/layout.tsx` | Fonts/variables e iconos según decisión de alcance global; conservar lang es y metadata base |
| `src/app/(marketing)/layout.tsx` | Shell con tema público, atribución y composición de footer por variante |
| `src/components/ui/{button,container,section,section-heading,card}.tsx` | Sistema visual y variantes accesibles sin romper consumidores privados |
| `src/components/branding/brand-logo.tsx` | Sustituir texto provisional por recursos entregados y variantes reales |
| `src/components/layout/{site-header,site-footer,mobile-navigation,navigation-links}.tsx` | Navegación definitiva, modal móvil, activo y footer con CTA condicional |
| `src/components/marketing/commercial.tsx` | Heroes, breadcrumbs, cards, pasos, principios y FAQ del nuevo diseño |
| `src/components/marketing/service-page.tsx` | Plantilla de detalle nueva; datos y jerarquía SEO |
| `src/components/marketing/project-card.tsx` | Card informativa de listado; destacadas de home enlazan al portfolio y la card CTA a contacto |
| `src/components/marketing/` | Configurador y filtros cliente pequeños; FAQ cliente solo si hace falta; no crear módulos vacíos |
| `src/components/forms/{contact-form,contact-form-with-service,form-field,form-success}.tsx` | Radios, query tipo, opcionales, blur, estado éxito y nuevo diseño conservando envío |
| `src/app/(marketing)/page.tsx` | Secuencia completa de home |
| `src/app/(marketing)/servicios/page.tsx` | Índice nuevo |
| `src/app/(marketing)/servicios/[slug]/page.tsx` | Cuatro detalles válidos, metadata y notFound |
| Cuatro landings antiguas en raíz | Retirar al sustituir routing; sin redirecciones |
| `src/app/(marketing)/{proyectos,nosotros,contacto}/page.tsx` | Layout, contenido, filtros/estados y footer |
| `src/content/services.ts` | Fuente única tipada, slugs finales, tipos UI/contrato, copy y SEO |
| `src/content/projects.ts` | Mantener vacío hasta material real; ampliarlo cuando exista un caso |
| `src/config/navigation.ts` | Menús y publicPaths finales; enlace a proceso |
| `src/config/site.ts` | Identidad/email público confirmados si procede; conservar estrategia de entornos |
| `src/lib/seo/metadata.ts`, `src/app/{sitemap,robots,opengraph-image}.tsx/ts` | Revisar metadata, rutas reales, OG y schema conservando separación de entornos |
| `public/brand/`, convenciones de iconos de `src/app/` | Copia de originales, PNG derivados y sustitución del icono provisional |
| Contrato de leads y consumidores de budget | Solo si se elige la opción B de presupuestos |
| `tests/` | Ajustar expectativas de rutas y comprobar interacciones/contrato relevantes |
| README, docs arquitectura/producto/SEO/leads/validación | Documentar estado final y comprobaciones ejecutadas |

La tabla indica responsables lógicos, no obliga a crear todos los nombres nuevos: reutilizar componentes claros y dividir `commercial.tsx` solo donde la complejidad lo justifique. No modificar módulos generados, migraciones históricas, auth, permisos, DB o email salvo el alcance mínimo de presupuesto aprobado.

## 12. Secuencia de implementación futura

1. **Resolver decisiones**: slugs, presupuesto, URLs legales, LinkedIn, copy no confirmado y tratamiento de portfolio/equipo vacíos. Revisión del usuario de este documento; todavía no es permiso para ejecutar.
2. **Base**: registrar git status, leer instrucciones/guías pertinentes, inventariar consumidores globales, copiar logos a public solo ya autorizada la ejecución, configurar fuentes/tokens y primitivas.
3. **Shell**: header desktop/móvil accesible, rutas y footer con variantes. Verificar navegación/foco antes de páginas.
4. **Datos y routing definitivo**: slugs, contenido tipado, índice y detalles; eliminar antiguas rutas sin compatibilidad, actualizar sitemap/tests/metadata.
5. **Home e índice**: configurador, compromisos, cards, proceso, FAQ, principios y composición final.
6. **Detalles y Nosotros/Proyectos**: contenido útil por intención, estado vacío sin casos/personas ficticias, filtros en URL.
7. **Contacto**: responsive/solapamiento, selección tipo, radios, opcionales, blur y éxito; mantener endpoint e invariantes. Incorporar presupuestos nuevos solo con decisión explícita.
8. **SEO, assets e instrumentación**: breadcrumbs/schema, OG/favicon, eventos locales y revisión de contenido HTML inicial.
9. **QA**: comandos, pruebas funcionales, escritorio/móvil y accesibilidad; corregir hallazgos y registrar evidencias.
10. **Entrega revisable**: resumen de cambios, capturas responsive y límites pendientes. Publicación, DB, DNS y emails son operaciones separadas y requieren autorización expresa.

No hay estimación de horas sin acordar alcance de contenido real y decisiones pendientes. No instalar dependencias o aplicar cambios de proyecto solo para preparar el plan.

## 13. Matriz de comprobación y criterios de aceptación

### Comandos al terminar la implementación

Ejecutar, en este orden cuando exista trabajo de código:

```bash
pnpm prisma validate
pnpm db:generate
pnpm lint
pnpm typecheck
pnpm test:config
pnpm test:db
pnpm test:leads
pnpm test:crm
pnpm build
```

Los dos conjuntos adicionales protegen contrato de captación y superficies privadas frente a cambios compartidos. Generar cliente antes de tipos. No ejecutar migrate/reset/db push/cleanup, no activar DB ni Resend. Registrar salida real, entorno, bloqueos y alcance en `docs/validacion.md`; si una fuente falla por red, registrar el fallo en lugar de declarar build correcto.

### Visual y responsive

Revisar todas las rutas públicas a 320, 375, 768, 1024, 1280, 1536 y 1920 px, en navegador disponible; comprobar además transiciones 639/640, 767/768 y 1023/1024 en composiciones sensibles. Si no hay navegador, declarar revisión visual pendiente.

- Sin scroll horizontal global, títulos truncados, texto fuera de cards o chips ilegibles.
- Contenedor limitado y fondos full-bleed en escritorio grande; hero apilado móvil.
- Formulario primero en móvil, card superpuesta legible, columnas alineadas en lg.
- Comparación con las cinco referencias en layout, proporciones, tipografía, espaciado, bordes y contraste; no reproducir marco de la presentación.
- Footer sin CTA solo en contacto; sin duplicados en home/servicios.
- Pruebas de zoom/reflow y textos largos; safe-area del menú y CTA móvil si se incluye.
- Imágenes con dimensiones estables, ratio y `sizes`; sin desplazamientos evitables al cargar fuentes/medios.

### Teclado y accesibilidad

Skip link, orden lógico, foco visible en fondo oscuro/claro, H1 único, landmarks y labels. Menú abrir/cerrar, Escape, trap/restauración de foco, scroll y resize. Dropdown accesible por teclado/touch. Radios con flechas/Tab, chips/filtros anunciados, FAQ exclusiva y primera abierta. Errores vinculados, primer campo enfocado, bloque opcional abierto si contiene error, loading anunciado y éxito enfocado. Revisar contraste medido, reduced motion y lector de pantalla si está disponible; no declarar conformidad total solo por inspección visual.

### Flujos y seguridad

Configurar cada tipo → contacto → preselección correcta. Default y parámetros inválidos/repetidos. app serializa aplicacion; no soporte de queries antiguas. Envío inválido no llama API; válido mantiene headers/payload/honeypot. Dobles controlados para éxito 201, validación servidor, 409, 429, 503, timeout/reintento. Preservación de datos, no doble submit, clave estable para mismo payload, nuevo intento tras volver desde éxito. No enviar emails reales para comprobar UI.

Filtros actualizan URL sin recarga, conservan navegación Atrás/Adelante y muestran vacío/CTA. Solo proyectos published aparecen; no existen rutas individuales de casos ni enlaces hacia ellas. CTA/FAQ/eventos sin duplicación ni PII. Login/CRM conserva accesibilidad y estilos funcionales tras tokens/fuentes compartidos.

### SEO

HTML inicial contiene H1, copy, enlaces, FAQ y contenido de servicios. Metadatos únicos, OG 1200×630 accesible e iconos correctos. Producción con canonical exacto sin queries, sitemap de rutas reales y schema consistente; preview/local noindex/nofollow y sitemap vacío. No rutas históricas activas ni redirects de compatibilidad. Breadcrumbs de tres niveles en detalle; JSON-LD parseable y sin propiedades inventadas. CWV/Lighthouse son mediciones posteriores reales, no resultados asumidos.

## 14. Registro de decisiones pendientes

| ID | Elección/dato | Propuesta | Efecto si falta |
| --- | --- | --- | --- |
| D01 | Slugs SEO definitivos | Estructura de la sección 4 | No fijar routing de implementación antes de revisión |
| D02 | Presupuestos nuevos y excepción de contrato | Opción B para reproducir brief | No cambiar rangos/etiquetas de forma engañosa |
| D03 | URL oficial LinkedIn | Facilitar perfil real | Omitir enlace y sameAs |
| D04 | Aviso legal, privacidad y cookies | Contenidos/URLs aprobados | Sin enlaces ficticios; captación respeta bloqueo actual |
| D05 | Casos, capturas, testimonios y fotos de equipo | Material real aprobado | Estados vacíos/secciones omitidas |
| D06 | Copy «web en pocas semanas», presencial y mantenimiento | Confirmación concreta de alcance | Redacción prudente sin promesas nuevas |
| D07 | CTA contextual frente a literal único | Excepciones del brief | Aplicar una regla coherente al implementar |
| D08 | Barra móvil inferior opcional | Omitir en primera entrega | Menor alcance y menos duplicación de CTA |
| D09 | Analítica externa | No activar proveedor en este alcance | Eventos locales preparados, sin estadísticas externas |
| D10 | SVG con textos a contornos | Archivo maestro/exportación aprobada | Limitación visual de fuente externa pendiente |
| D11 | Portfolio de home sin casos | Estado vacío sobrio o suprimir cards | No publicar dos proyectos inventados |

Decisiones ya cerradas: email y cuatro compromisos comerciales; ausencia de producción; diseño público planteable desde cero; ninguna retrocompatibilidad; portfolio en una única página sin fichas individuales; esta entrega es solo un plan. Las preguntas previas que proponían conservar rutas antiguas quedan reemplazadas por la aclaración posterior del usuario.

## 15. Evidencia de esta entrega de planificación

Se han archivado cinco capturas y siete SVG originales, comprobando igualdad byte a byte y generando SHA-256. Se ha preparado este plan sobre la base actual y las instrucciones recibidas. No se han ejecutado comandos de validación de aplicación, build, migraciones, envíos o despliegues, porque no se ha implementado código. La fidelidad visual de la futura web y sus resultados SEO siguen sin comprobar hasta ejecución autorizada.

## 16. Ejecución autorizada — 12/10/2026

La petición «implementa el plan de redisenio ui» autoriza el rediseño. Se adoptan los slugs propuestos, opción A de presupuestos, CTA contextuales, portfolio vacío, marca sin equipo, omisión de LinkedIn/legales no aportados/barra móvil y eventos locales. Los textos históricos «ejecución no autorizada» de las secciones anteriores describen la entrega de planificación, ya superada por esta petición. Captación sigue respetando configuración legal; no se publican servicios externos.

Revisión visual en navegador y build completo pendientes por límites del entorno detallados en validación. La incidencia reportada del + superpuesto en el dropdown Servicios se corrige acotando el pseudo-elemento de FAQ a `details[data-question]`.
