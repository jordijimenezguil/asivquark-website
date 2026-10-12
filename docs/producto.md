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
