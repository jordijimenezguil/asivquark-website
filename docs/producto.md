# Producto y diseño — Iteración 3

ASIVQUARK desarrolla software y productos digitales en Barcelona. La futura web comercial busca solicitudes cualificadas mediante SEO y una propuesta clara. Público: negocios/profesionales que necesitan web y empresas/emprendedores que necesitan software, aplicaciones o MVP.

La persistencia mantiene Neon PostgreSQL con Prisma ORM/Migrate. Marketing no utiliza base de datos.

## Experiencia actual

Ocho páginas españolas: home, diseño web Barcelona, software a medida, aplicaciones web, MVP, proyectos, nosotros y contacto. Home distingue dos caminos comerciales y presenta cuatro servicios, principios, proceso, enfoque técnico, ubicación general, FAQ y CTA. Cada servicio explica necesidades, alcance y presupuesto cuando corresponde, sin precios o plazos inventados.

Portfolio con estado vacío profesional y modelo para futuros casos verificados. Nosotros presenta criterios de trabajo sin inventar equipo ni trayectoria. El origen personal del nombre permanece fuera del contenido público.

Contacto ofrece formulario real con selección de servicio desde URL, validación, carga, errores y confirmación tras persistir. Su captación pública sigue bloqueada por ausencia de información legal/configuración real; en local permite probar errores sin simular registro. No se han publicado textos legales, correos ni casos ficticios.

## Identidad

Fondos `#0B0F17` y `#151B29`; violeta `#7C3AED`, acento `#A78BFA`; texto secundario `#AEB6C7`; secciones claras `#F8F9FC`, tinta `#111827`, blanco. Geist Sans y Mono, composición tipográfica, espacios amplios, bordes moderados y geometría plana. Sin escenas espaciales, neones, gradientes ni efectos 3D.

BrandLogo tipográfico provisional: ASIV neutro, QUARK violeta, variantes dark/light/compact, tamaños sm/md/lg. Icono del navegador A geométrica sencilla provisional. Sustituir por recursos aprobados cuando se entreguen.

## Sistema y accesibilidad

Container para anchura; Section con espaciados sm/md/lg; Card; SectionHeading con etiqueta opcional; Button primary/secondary/outline/ghost y estados hover, focus y disabled nativo. Enlaces con semántica propia sin simular disabled.

Menú móvil no modal con `aria-expanded`, `aria-controls`, cierre por selección y Escape que devuelve focus. Ocultar enlaces cerrados los excluye de tabulación. No requiere trap de foco al mantener el resto de página accesible. Skip link, navegación etiquetada, iconos decorativos ocultos y movimiento reducido.

## Pendiente

Configurar Neon/Resend, verificar baseline y aplicar migración aditiva autorizada, aprobar política de privacidad y retención, operar reintentos/cleanup y probar el recorrido completo con datos controlados. No se han verificado persistencia remota o emails reales. Revisión visual responsive/teclado pendiente.

Los proyectos requieren casos verificables. CRM/admin y gestión manual de estados quedan para una futura iteración, sin implementación actual. No hay newsletter, automatización de seguimiento o marketing por email.

Objetivos LCP ≤2,5 s, INP ≤200 ms y CLS ≤0,1 pendientes de medición. [Flujos y límites de captación](leads.md).

## Actualización — Iteración 4

CRM privado con resumen comercial, filtros, listado responsive, detalle, estados, notas y actividad. Sin estadísticas ficticias, borrado, exportación o fases futuras. Véase [CRM](crm.md) para implementación, procedimientos y límites actuales. Las secciones anteriores describen la fase previa.

## Rediseño público — 12/10/2026

Home con configurador de cuatro servicios, tres compromisos confirmados, cards numeradas, proceso, portfolio vacío honesto y FAQ. Índice editorial de servicios, detalles con situaciones específicas, inclusiones y FAQ, Nosotros con identidad de marca sin equipo inventado. Proyectos se mantiene en una única página con filtros `cat`, categorías cerradas y CTA; no hay casos ficticios ni fichas.

Identidad original en SVG, fondos navy/blanco/lavanda y tipografía Manrope con etiquetas JetBrains Mono. Los SVG con texto siguen dependiendo de fuentes propias y necesitan exportación a contornos para garantía tipográfica. Tokens antiguos que usa CRM se conservan; los nuevos estilos públicos quedan acotados a marketing.

Contacto presenta formulario primero en móvil, card superpuesta, radios nativos, opcionales plegables sin pérdida de valores, validación blur/submit y reinicio desde éxito conservando tipo y vaciando datos personales. Éxito confirma registro y respuesta en 24 h laborables, no entrega de email. Presupuestos actuales conservados; nuevos rangos pendientes de autorización explícita. Captación sigue condicionada al aviso aprobado y configuración. LinkedIn, equipo y legales no se inventan. No se añade barra CTA móvil opcional.

## Iteración 6 — Privacidad

Banner con aceptación/rechazo equivalentes, configuración analítica independiente y retirada desde footer. Solo atribución/eventos propios en memoria justifican opción Analíticas. Sin marketing ni funcionales opcionales reales. Política informativa con identificación jurídica pendiente; no se presenta como aprobación legal. [Detalle](cookies.md).

## Iteración 7 — Automatización de procesos e IA

La oferta pasa a cinco servicios. Automatización se orienta a operaciones existentes y conexiones; software a herramientas personalizadas, aplicaciones a plataformas de navegador y MVP a primeras versiones. Landing completa con hero, seis problemas, seis soluciones, comparación reglas/IA, beneficios potenciales, cinco aplicaciones ilustrativas, cinco pasos, tecnología, seguridad/supervisión, siete FAQ y CTA. Sin promesas de productividad, clientes o proyectos inventados. Home conserva hero/posicionamiento y adapta tarjetas/configurador; contacto incorpora automatizacion y muestra Otro proyecto ya admitido por el contrato. Se mantiene la tipografía real del rediseño, sin cambiar el sistema visual.

## SEO de diseño web y blog

Landing de diseño web ampliada para decisión comercial: prestaciones, tipos, comparación por alcance, contexto local, proceso, precio y FAQ; sin resultados inventados. Estética existente preservada por elección del propietario. Blog estático y artículo educativo públicos autorizados, sin CMS ni estados: criterios para evaluar calidad de una web, checklist y enlace al servicio. No se crea una segunda landing comercial ni se despliega producción.

## Blog — Dirección 1a

Listado estático en mosaico uniforme de tarjetas con imagen, categoría, título, descripción, fecha y lectura. Una columna móvil, dos desde sm y tres desde lg, preparado para el catálogo previsto de seis artículos como máximo. Con un artículo aparece una sola tarjeta, sin relleno ni contenido inventado. Sin búsqueda, filtros, destacado o paginación; guías con resumen, puntos clave, índice lateral fijo y desplegable móvil, lectura de 17–18 px, fuentes y CTA contextual a contacto. Los relacionados priorizan categoría y completan por fecha, excluyendo la guía actual; no aparecen si no hay otros artículos publicados. Se conserva todo el contenido educativo previo, agrupado en siete H2; los detalles pasan a H3. Fecha y autor proceden de la especificación del propietario. Sin nuevas entradas ficticias, covers inexistentes ni barra inferior opcional. Guía editorial: `docs/BLOG-DESIGN.md`.

Blog permanece en el footer y se retira del menú superior, también en móvil, por decisión del propietario. Sitemap y enlaces contextuales hacia artículos se conservan.

## Iteración legal — 12/10/2026

Cuatro rutas legales con trailing slash: `/aviso-legal/`, `/politica-privacidad/`, `/politica-de-cookies/` y `/condiciones-de-uso/`. Configuración central en `src/config/legal.ts`, con identidad pendiente, aplicabilidad explícita y versión/fechas de aprobación separadas de revisión técnica. Documentos en preparación: advertencia pública sin datos ficticios y `noindex`; canonical únicamente en producción. Sitemap incorpora legales solo tras preparación aprobada, sin fechas artificiales.

Layout servidor compartido, Geist existente acotado a legal, hero compacto, índice HTML plegable móvil/lateral escritorio, lectura limitada y tarjetas de inventario de cookies. Footer enlaza los cuatro documentos y reutiliza el gestor. Contacto incorpora primera capa; casilla conserva reconocimiento de lectura, no consentimiento comercial. Producción/preview exigen preparación legal y URL/versión exactas del aviso aprobado además de requisitos operativos anteriores; desarrollo sigue siendo solo prueba.

`pnpm legal:check` informa pendientes y falla intencionadamente mientras no se aprueben datos/documentos. Resolver [checklist jurídico](legal/compliance-checklist.md), [inventario](legal/data-processing-inventory.md), [retención](legal/data-retention-review.md) y [guía contractual interna](legal/contratacion-servicios.md) (en README: rutas bajo docs/legal). No se publica la guía, migra la DB ni despliega producción. No se acredita conformidad legal integral. Las notas anteriores corresponden a iteraciones históricas. Resultados reales y límites en docs/validacion.md.

## Home — dirección móvil 2a «Selector arriba»

Hero exclusivo Home en `components/marketing/home-hero.tsx`: retícula sutil, H1 único sin cambios, lead corto móvil y completo desktop/servicios, configurador compacto 2×2 (web/software/app/MVP) y dos columnas desde lg. Automatización permanece en catálogo, navegación y contacto. Tokens Tailwind 4 en globals.css; no existe tailwind.config ni handoff/PROMPT.md en este checkout, por lo que se conserva el diseño desktop vigente y la especificación aportada.

Selector con radios nativos y formulario GET: flechas/Tab gestionados por navegador, `tipo=app` convertido al contrato `aplicacion`; funciona sin JS. CTA emite `cta_click` local con location home_hero/tipo, sujeto al consentimiento existente. Header global de 64/90px, CTA Contacto en móvil y oculto en contacto, icono menú 20px y caja 44px. SVG original conservado con caja de 28px y ajuste proporcional al espacio disponible para no desbordar en 320px. Paso 2 datos y paso 3 confirmación en contacto.

Franja reciente solo móvil consume hasta cuatro proyectos publicados del mismo catálogo; actualmente vacío, sin casos ficticios. Carrusel/capturas diferidos hasta trabajos autorizados. No se añade barra flotante: no existe la barra previa mencionada. Resto de Home y páginas conservado, incluyendo infraestructura legal pendiente. Pruebas/limitaciones en docs/validacion.md.

## Contacto — dirección 4a «Formulario directo»

Intro móvil compacta con breadcrumb, H1 de 30 px y respuesta en 24 h; hoja blanca sin margen lateral, título y paso 2 / 3, chips horizontales con scroll limitado a su fila, campos Nombre/Email y mensaje. Desde sm, Nombre/Email comparten fila; desde lg, dos columnas con intro navy, pasos y email, tarjeta sticky. Footer mínimo legal y preferencias; sin CTA adicional. No hay redes verificadas para añadir.

Opcionales con details nativo, validación blur/submit, errores por campo y foco al primero, campos a 16 px, mensaje entre 10 y 2000 caracteres. Al enviar se reconoce la privacidad mediante la acción de envío y texto enlazado; se retira la casilla anterior y la primera capa extensa de la tarjeta siguiendo la especificación del propietario. No se presenta esto como aprobación jurídica: captación pública depende de sus requisitos operativos. Email de esta dirección aportado por el propietario: hola@asivquark.com. Banner de pruebas por encima del header, nunca dentro de la hoja ni en producción. La disponibilidad corresponde al enabled calculado de getContactConfig a partir de la configuración operativa; no hay flag manual de captación.

No existen los handoff/PROMPT*.md ni el HTML de direcciones en este checkout. Se aplican prompt y capturas aportadas, con tipografía y tokens existentes; placeholder usa ink-500 para mantener contraste. Se mantiene compatibilidad de enlaces de automatización/otro mediante chip adicional solo cuando ese tipo llega seleccionado.


## Rediseño global Foco — 23/10/2026

Dirección visual Foco aplicada al sitio público existente: fondo oscuro, Manrope, morado eléctrico, titulares grandes y superficies con bordes sutiles. Home con selector GET, cinta decorativa, valores numerados, explorador de servicios y proceso expandible. Móvil usa acordeones y pasos apilados; escritorio añade lista/panel y expansión horizontal. FAQ nativa de apertura exclusiva y footer compartido. Se mantienen los textos comerciales y el catálogo autorizado; no se crea una ruta nueva para Cómo trabajamos (continúa /#proceso). Contacto conserva selección, datos y confirmación, validación e idempotencia existentes. La revisión visual en los seis anchos y Lighthouse sigue siendo necesaria antes de acreditar objetivos. Véase [sistema visual](diseno-foco.md).

## Copy Home — 24/10/2026

La descripción compartida del servicio web menciona «páginas web profesionales y corporativas», visible en el configurador y explorador de servicios de Home y en los consumidores del catálogo. La FAQ de Home usa la misma formulación.

El hero incorpora «A precios asequibles» en la fila secundaria de ventajas, junto a «Sin compromiso» y «Respuesta en 24 h», con el mismo estilo discreto y salto de línea adaptable.

Las ventajas secundarias del hero aumentan a 14px desde escritorio (lg); móvil conserva 11px. Espaciado vertical de 12px cuando se distribuyen en varias filas.
