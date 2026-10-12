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
