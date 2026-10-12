# Informe de implementación legal

12/10/2026. Estado técnico implementado, estado jurídico **pendiente**. Sin despliegue, DNS, migraciones, correos ni nuevas funcionalidades comerciales.

1. **Resumen:** infraestructura de cuatro documentos y control de preparación independiente de build, auditoría y documentos internos.
2. **Creados:** `src/config/legal.ts`; páginas aviso-legal, politica-privacidad y condiciones-de-uso; `src/components/legal/legal-page-layout.tsx`, `legal-identity.tsx`, `privacy-basic-information.tsx`; `scripts/legal-readiness.ts`; `tests/legal.test.ts`, `legal-html.test.ts`; cinco documentos de `docs/legal/` incluido este informe.
3. **Modificados:** política cookies existente, globals.css, sitemap.ts, contact-form.tsx, site-footer.tsx, config/contact.ts, package.json, README y docs arquitectura/producto/seo/cookies/validacion. Sin dependencias nuevas ni cambios de esquema/auth.
4. **Rutas:** `/aviso-legal/`, `/politica-privacidad/`, `/politica-de-cookies/`, `/condiciones-de-uso/`, con trailing slash original. Sin duplicados ni cambios a URLs comerciales/blog.
5. **Reutilizados:** Container, SiteFooter, Metadata API/pageMetadata, CookiePreferencesTrigger/Provider/banner/diálogo/inventario y formulario existente.
6. **Nuevos componentes:** LegalPageLayout, LegalTableOfContents, LegalIdentity y PrivacyBasicInformation. Se agrupan funciones afines para evitar capas/archivos innecesarios.
7. **Mobile-first:** hero compacto, Geist existente acotado a legal, lectura 16px/32px y 72ch, índice nativo plegable móvil/lateral sticky escritorio, anclas con margen de header, inventario en tarjetas. Verificación visual pendiente.
8. **Aviso legal:** identidad pendiente, objeto/actividad reales, propiedad de terceros y licencias, uso, enlaces, responsabilidad proporcionada, privacidad/cookies y normativa sin sumisión abusiva.
9. **Privacidad:** formulario/CRM/atribución/admin/correo identificados, bases diferenciadas como propuestas revisables, conservación real y límites, proveedores/transferencias pendientes, derechos y canal por confirmar. Sin tratamientos IA inventados.
10. **Cookies:** misma ruta e inventario, misma preferencia/versionado; acceso funcional al gestor existente desde política/footer. No se cambia la lógica ni se instala CMP.
11. **Condiciones de uso:** navegación, acceso, obligaciones y disponibilidad; diferenciadas de contratos de proyectos. No crean tarifas ni compromisos contractuales.
12. **Formulario:** primera capa y enlace relativo; mantiene casilla de reconocimiento de lectura y fecha/versión servidor, sin consentimiento artificial para marketing. Requisitos de captación incluyen identidad/aprobación y aviso exacto. Desarrollo solo prueba.
13. **Footer:** grupo Legal con cuatro enlaces y configurar cookies, sin duplicar enlaces de cookies previos.
14. **Proveedores:** Neon y Resend integrados condicionalmente; Vercel previsto. Activación/regiones/contratos sin acreditar. Better Auth/Prisma son bibliotecas. Otros servicios de cuenta no inferidos.
15. **Tratamientos:** consultas/presupuestos, oportunidades/notas/historial, correo transaccional, atribución autorizada, preferencias, prevención de abuso y cuentas administrativas. Inventario detallado separado.
16. **Identidad pendiente:** nombre/razón social, NIF, domicilio y email legal; privacidad si difiere; aplicabilidad registro/autorización/DPD. No se asume sociedad.
17. **Bases pendientes:** confirmar medidas precontractuales según interesado, otras consultas/representantes, seguridad y ponderación, seguimiento/notas y administración; art. 14 si datos indirectos. Sin marketing/newsletter añadidos.
18. **Retención pendiente:** plazo comercial y clientes, CRM, correo, cuentas/tokens, logs/copia y operación real. expiresAt no implica borrado automático; limpieza manual no ejecutada.
19. **Contratos/garantías:** DPA art. 28, regiones/subencargados, adecuación/SCC si procede; permisos/licencias de contenidos; contratos específicos IP/soporte/IA y obligaciones consumidores.
20. **Riesgos de publicación:** no puede presentarse documento definitivo ni activarse captación pública con identidad/garantías pendientes. Advertencia y noindex evitan confundir borrador con aprobación; noindex no satisface obligaciones legales. No publicar como definitivo hasta revisión jurídica y operativa.
21. **Tests:** prisma validate/generate, config, db, leads, CRM, cookies, 4 pruebas legales y 5 HTTP; pasaron. HTTP inicial bloqueado por sandbox, reejecución local autorizada pasó. Sin pruebas de bases reales.
22. **ESLint:** correcto, cero advertencias.
23. **TypeScript:** correcto.
24. **Build:** `pnpm build` Turbopack bloqueado por puerto (también intento ampliado); alternativa `pnpm exec next build --webpack` correcta, 26 páginas generadas. No se cambia el script estándar para ocultar el límite.
25. **Antes de producción:** resolver checklist de compliance completo, evidencias/aprobación/versiones y fechas reales, canal operativo y retención, proveedores/transferencias, prueba visual/teclado/cookies real y revisión jurídica final; ejecutar legal:check y validaciones del entorno de despliegue. Obtener autorización de despliegue por separado.

Fuentes y decisiones: compliance-checklist.md. Resultados reales: ../validacion.md. La implementación no es certificación de cumplimiento ni asesoramiento jurídico certificado.
