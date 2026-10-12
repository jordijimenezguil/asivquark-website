# Inventario técnico de tratamientos y proveedores

Auditoría de repositorio: 12/10/2026. No se consultaron datos privados, credenciales ni bases externas. Código preparado no acredita activación en producción. `src/config/contact.ts` y `.env.example` condicionan captación y correo; no se inspecciona `.env.local`.

| Tratamiento | Evidencia | Datos / destino | Estado y validación pendiente |
| --- | --- | --- | --- |
| Consultas / presupuestos | lead schema, handler, repository | Nombre, email, empresa/teléfono/presupuesto opcionales, servicio, mensaje, fecha, source | Implementado; activación real no comprobada. Art. 6.1.b para interesado que solicita medidas precontractuales; otras consultas y representantes empresariales requieren revisión |
| Información facilitada | Lead.privacyNoticeVersion / privacyAcknowledgedAt | Versión y lectura con fecha servidor | No consentimiento comercial. URL/versión deben coincidir con documento aprobado |
| CRM | LeadNote / LeadEvent, features/crm | Notas, estados, autor, historial, metadatos | Acceso admin en servidor; sin exportación/borrado público. Minimizar notas y revisar acceso/supresión |
| Atribución opcional | client-attribution, cookies consent | UTM, landing/origin path, referrer reducido a origen; se adjunta a lead | Consentimiento analítico; eventos locales sin colector externo; no marketing |
| Seguridad captación | security, rate-limit, log | IP/email usados para HMAC, buckets con vencimiento; logs de evento, ID y código | Interés legítimo candidato: documentar ponderación; logs infraestructura no auditados |
| Administración | auth/index, User/Session/Account/Verification/RateLimit | Identidad/email/rol, credenciales protegidas, tokens, IP/UA de sesiones, contadores | Sin registro público/OAuth. Bases, información a administradores y retención pendientes |
| Correo transaccional | lead-emails, outbox | Email/nombre y contenido de solicitud en aviso interno; confirmación al remitente; estado/ID proveedor | Resend opt-in; no envíos realizados. Retención de proveedor pendiente |
| Contenido público | blog MDX local, projects | Artículos, autor marca, recursos locales; portfolio vacío | Sin CMS ni comentarios, subida de imágenes o proyectos publicados. Derechos/licencias a verificar por contenido |

## Proveedores externos

| Proveedor | Servicio / datos | Rol previsto | Región / subencargados / transferencias | DPA / estado |
| --- | --- | --- | --- | --- |
| Vercel | Hosting previsto, solicitudes HTTP y logs técnicos | Encargado según servicio contratado | No acreditados; comprobar región de ejecución, logs, soporte, CDN y cadena de subencargados | Contrato no aportado; despliegue real no verificado |
| Neon | PostgreSQL vía Prisma adapter; leads, CRM y auth si habilitados | Encargado previsto | No acreditados; revisar proyecto/rama, backups, soporte y países | DPA no aportado; base real no consultada |
| Resend | Email transaccional condicionado a opt-in | Encargado previsto, según contrato | No acreditados; revisar entrega, metadatos y subencargados | DPA no aportado; verificar dominio y remitente reales |

Better Auth, Prisma, Zod y SDK Resend son bibliotecas locales, no proveedores externos por su mera instalación. Fuentes next/font e imágenes se sirven localmente. No se detectaron GA/GTM, Vercel Analytics, CAPTCHA externo, monitorización SDK, widgets, almacenamiento externo ni API de IA. Ofertar IA no implica tratar visitantes con modelos. Registrador DNS, buzón comercial, scripts inyectados, logs/CDN y otros servicios de cuenta no se pueden identificar desde este repositorio: solicitar inventario operativo al titular. No se afirma alojamiento exclusivo UE ni DPA firmado.

Antes de aprobación: consultar contratos y documentación oficial de cada proveedor efectivo, registrar fecha/versión, entidad contratante, ubicación y mecanismo de transferencia aplicable. La auditoría del código no sustituye estas evidencias.
