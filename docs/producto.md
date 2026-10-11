# Producto y diseño — Iteración 1

ASIVQUARK desarrolla software y productos digitales en Barcelona. La futura web comercial busca solicitudes cualificadas mediante SEO y una propuesta clara. Público: negocios/profesionales que necesitan web y empresas/emprendedores que necesitan software, aplicaciones o MVP.

La persistencia utiliza Neon PostgreSQL con Prisma ORM/Migrate. Este cambio técnico conserva el producto de la iteración 1: no añade funciones comerciales, pantallas, contactos ni alteraciones del diseño.

## Experiencia actual

Home española provisional: header, hero con un H1, tres servicios, propuesta de valor, nota de proyectos, CTA informativo y footer. Navegación a secciones reales, sin servicios completos ni portfolio ficticio. Proyectos anuncia futuros casos verificados. Contacto informa del canal pendiente: los CTAs no envían datos ni solicitan realmente presupuestos todavía.

## Identidad

Fondos `#0B0F17` y `#151B29`; violeta `#7C3AED`, acento `#A78BFA`; texto secundario `#AEB6C7`; secciones claras `#F8F9FC`, tinta `#111827`, blanco. Geist Sans y Mono, composición tipográfica, espacios amplios, bordes moderados y geometría plana. Sin escenas espaciales, neones, gradientes ni efectos 3D.

BrandLogo tipográfico provisional: ASIV neutro, QUARK violeta, variantes dark/light/compact, tamaños sm/md/lg. Icono del navegador A geométrica sencilla provisional. Sustituir por recursos aprobados cuando se entreguen.

## Sistema y accesibilidad

Container para anchura; Section con espaciados sm/md/lg; Card; SectionHeading con etiqueta opcional; Button primary/secondary/outline/ghost y estados hover, focus y disabled nativo. Enlaces con semántica propia sin simular disabled.

Menú móvil no modal con `aria-expanded`, `aria-controls`, cierre por selección y Escape que devuelve focus. Ocultar enlaces cerrados los excluye de tabulación. No requiere trap de foco al mantener el resto de página accesible. Skip link, navegación etiquetada, iconos decorativos ocultos y movimiento reducido.

## Pendiente

Contacto real, contenido legal, páginas de servicios, proyectos verificables, blog/CMS, administración, leads y formularios. Sin cifras, clientes, testimonios ni datos comerciales inventados. Objetivos LCP ≤2,5 s, INP ≤200 ms y CLS ≤0,1 pendientes de medición en despliegue real. No publicar comercialmente sin completar canal y requisitos legales.
