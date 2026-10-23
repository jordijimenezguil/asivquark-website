# Captación comercial — Iteración 3

## Estado verificado y activación

Implementados formulario, endpoint, contratos, repositorio Prisma, límites compartidos, eventos, outbox, plantillas y comandos privados. Las pruebas usan dobles de PostgreSQL/Resend; no hay credenciales reales de Neon ni Resend en el entorno inspeccionado. La persistencia remota y entrega de emails no se han comprobado. La migración está preparada y no aplicada. No hay política de privacidad aprobada ni datos legales inventados.

En local el formulario es interactivo para comprobar validaciones y errores; sin DATABASE_URL y LEADS_SECURITY_SECRET devuelve 503, nunca una persistencia simulada. Sin información legal muestra modo de prueba y requiere usar solo datos de prueba. No publicar ese modo: producción y previews se bloquean por defecto.

Para habilitar captación pública deben existir una rama/base preparada, secreto de seguridad, información de privacidad real accesible mediante HTTPS y su versión en el entorno concreto de Vercel. La existencia y adecuación legal del aviso no pueden certificarse mediante estas variables: requieren revisión del responsable. No se publica ninguna página legal ficticia. El formulario se prerenderiza con la configuración de build; reconstruir al cambiar su disponibilidad o aviso. El endpoint vuelve a comprobar configuración en runtime.

## Arquitectura y archivos

- `src/config/contact.ts`: configuración privada y proyección pública sin secretos.
- `src/features/leads/schema.ts`: contrato Zod estricto, tipos y etiquetas.
- `src/features/leads/attribution.ts`, `client-attribution.ts`: atribución sanitizada y memoria de navegación de la pestaña.
- `src/features/leads/security.ts`, `rate-limit.ts`: origen, identidad de cliente, tamaño y límites PostgreSQL.
- `src/features/leads/repository.ts`: creación atómica e idempotencia.
- `src/features/leads/handler.ts`, `log.ts`: flujo HTTP y eventos técnicos sin payloads.
- `src/features/leads/delivery.ts`, `outbox.ts`: reservas, entregas y reintentos.
- `src/app/api/leads/route.ts`: únicamente POST, runtime Node.js, duración máxima 60 s.
- `src/components/forms/`: formulario, preselección bajo Suspense, campos, éxito y tracker sin almacenamiento persistente.
- `src/emails/lead-emails.ts`: HTML escapado y texto plano.
- `scripts/leads-maintenance.ts`: procesamiento privado de correo.
- `tests/leads-*.test.ts`: validación, endpoint, repositorio, límites y emails con dobles.

Cambios sobre la base: `prisma/schema.prisma`, migración aditiva, `package.json`/lockfile, `.env.example`, página de contacto, layout de marketing, CTA de `commercial.tsx` y `service-page.tsx`, contrato compatible `lib/validations/contact.ts`, pruebas de esquema y documentación. Se retiraron los dos componentes de previsualización reemplazados por el formulario real. Las tablas de auth, integración Better Auth, dominio e identidad se conservan. Única dependencia añadida: `tsx` de desarrollo, para pruebas y comandos TypeScript privados; no React Hook Form, React Email ni servicios adicionales.

## Datos y migración

`Lead` almacena identidad de contacto, servicio, presupuesto opcional, mensaje, procedencia, UTM, versión/fecha de lectura, fechas, estado NEW. `idempotencyKey` UUID única y `requestHash` SHA-256 del contenido normalizado son internos. `source`, estado, fechas, versión de aviso se asignan en servidor; no pueden enviarse como campos arbitrarios del cliente.

`LeadEvent` registra creación, puesta en cola y éxito/fallo de emails. Metadata solo contiene IDs y códigos técnicos. `EmailOutbox` mantiene un registro único por lead/tipo, destinatario y remitente congelados al iniciar envío, intentos, reserva temporal, siguiente intento, errores codificados e ID del proveedor. `LeadRateBucket` mantiene exclusivamente hashes temporales y contadores. Ningún modelo expone una lectura pública.

Migración: `prisma/migrations/20261012070000_leads/migration.sql`. Añade cuatro tablas y enums, índices y relaciones, envueltos en BEGIN/COMMIT para aplicación atómica en PostgreSQL. Sin DROP/TRUNCATE/DELETE ni modificaciones de tablas Better Auth. Generada offline con Prisma Migrate diff entre el esquema previo y el ampliado. La prueba de regresión compara exactamente las cuatro tablas de auth contra el snapshot histórico y exige las nuevas tablas adicionales.

Antes de conectar una base existente, seguir [Prisma y transición segura](prisma.md), verificar baseline/drift y preparar copia recuperable. No ejecutar migrate dev sobre una base cuyo historial aún no está verificado. En una rama de desarrollo preparada y autorizada:

```bash
pnpm prisma migrate status
# Aplica únicamente migraciones revisadas; confirmar antes el destino y baseline:
pnpm db:deploy
pnpm db:generate
```

Para siguientes cambios en desarrollo, `pnpm db:migrate --name nombre_del_cambio`, con shadow database aislada cuando se necesite. Nunca reset/db push ni producción como shadow. Postinstall/build solo generan cliente. Ninguna migración remota se ejecutó en esta sesión.

## Endpoint y contrato

La URL normalizada es `POST /api/leads/` (la variante sin barra redirige según Next). El navegador envía JSON y `Idempotency-Key` UUID. Origen debe coincidir exactamente con `site.origin`; solicitudes cross-site y Content-Type distinto de application/json se rechazan sin CORS abierto. Sin credenciales ambientales el endpoint responde 503.

Tras comprobar origen y clave, aplica admisión compartida, lee hasta 32 KiB de bytes con límite de 5 segundos y valida Zod en servidor. La validación cliente facilita corrección; no sustituye el servidor. Nombre normaliza espacios, email conserva íntegra su parte local y normaliza solo el dominio; teléfono admite prefijos internacionales. Presupuesto es una categoría opcional, no una tarifa. Descripción 20–5.000 caracteres. Campos inesperados y HTML/control inválido se rechazan; contenido en emails se escapa además como texto.

Respuestas: 201 únicamente tras guardar (incluye repetición idempotente); 422 con errores de campo; 400 JSON/clave inválidos; 403 origen; 413 tamaño; 415 formato; 429 con Retry-After; 409 clave reutilizada con contenido distinto; 503 configuración o persistencia no disponible. Sin registro completo, datos personales ni stack traces. No se confirma entrega de correo en la respuesta.

Un POST nativo sin JavaScript utiliza método POST, nunca GET con información personal en la URL, y el endpoint rechaza el formato urlencoded. La experiencia interactiva necesita JavaScript; no hay una segunda vía de persistencia sin validar.

## Antispam y límites

Honeypot fuera de pantalla, excluido del foco y del árbol accesible. No se simula éxito al detectarlo. Rate limiting mediante UPSERT parametrizado dentro de transacciones PostgreSQL, válido entre instancias; nunca Map como almacenamiento de producción.

- Admisión: 30 solicitudes por cliente/5 minutos y 300 globales/5 minutos.
- Nuevos leads: 5 por cliente/15 minutos, 3 por email/hora y 100 globales/hora.

Son ventanas fijas: puede haber ráfagas junto a sus límites temporales. Límites por IP pueden afectar redes compartidas; ajustar tras observar uso. IP solo se obtiene de `x-vercel-forwarded-for` cuando el proceso corre en Vercel. No se confía en X-Forwarded-For arbitrario. Fuera de Vercel solo se admite el modo local, con un bucket de cliente común; producción en otro proxy exige un diseño de confianza revisado antes de activar.

Los valores de IP/email de los contadores se transforman con HMAC y secreto separado de auth; jamás se persisten como texto ni en logs. Los buckets tienen ventanas temporales de seguridad y se reutilizan al vencer. Los límites no sustituyen protecciones de infraestructura frente a ataques volumétricos; no se añadió CAPTCHA ni un proveedor adicional.

## Idempotencia y estados de formulario

El navegador bloquea dobles pulsaciones de manera síncrona y deshabilita campos/botón al enviar. Conserva datos tras errores y mantiene la misma UUID para reintentar el mismo contenido. Si cambia el contenido genera otro intento; permite proyectos legítimos del mismo email. La clave vive en memoria del formulario, no en una URL ni almacenamiento con datos personales.

PostgreSQL decide mediante restricción única; la colisión concurrente se resuelve leyendo el resultado ya confirmado. Misma clave con hash distinto da 409. El hash no incluye Referer ni versión de aviso derivados del servidor, para conservar coherencia de reintentos. Idempotencia de lead dura mientras se conserve su registro; no tiene vencimiento.

La UI muestra errores junto a campos, foco en el primer error de validación, alertas de servidor, espera con Retry-After y éxito únicamente tras 201. Éxito recibe foco y ofrece volver al inicio. No pone datos en la URL ni interpreta visitas como conversiones.

## Atribución

Los CTA de servicios conservan `servicio` y añaden la ruta real en `origen`. El layout recoge, en memoria de pestaña, primera ruta pública, UTM permitidos y origen del referente. También conoce la página anterior durante navegación cliente. Sin cookies, localStorage/sessionStorage ni proveedores de analítica. Tras recarga o navegación fuera de la aplicación puede perderse el contexto: no se inventa ni se infiere a partir del servicio seleccionado.

Rutas solo de la lista pública; referrer conserva exclusivamente el origen, eliminando credenciales, rutas, consultas y fragmentos. UTM limitados a 150 caracteres y sin controles/HTML; parámetros repetidos se descartan en la lectura del navegador. Atribución informativa y no fiable para seguridad. Ausencias se persisten como null. La selección de servicio acepta valores permitidos y se puede cambiar manualmente.

## Resend y fiabilidad

Configurar `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEADS_NOTIFICATION_EMAIL` con datos reales. Para enviar realmente debe activarse además `LEADS_EMAIL_ENABLED=true`. Mantener false en desarrollo y pruebas salvo una prueba expresamente autorizada con destinatarios controlados. Sin configuración, los leads se guardan y el outbox queda PENDING con EMAIL_NOT_CONFIGURED, sin fingir entrega.

Verificar el dominio remitente en Resend y copiar sus registros SPF/DKIM exactos al proveedor DNS cuando se autorice; comprobar después el estado de verificación. No copiar valores ficticios ni crear un segundo registro SPF conflictivo. No se modificó DNS. Consultar [dominios verificados de Resend](https://resend.com/docs/dashboard/domains/introduction).

La transacción crea Lead, eventos y ambos registros de outbox. `after()` de Next intenta procesarlos tras responder, con reservas PostgreSQL de dos minutos y token de propiedad. Un timeout/crash puede dejar SENDING; otro procesador lo reclama al vencer la reserva. La dirección se congela antes del primer envío y se verifica propiedad antes de enviar. Fallos del proveedor actualizan estado/evento sin perder el lead.

Cada registro usa `asivquark/lead-email/<outbox-id>` como clave de Resend. Timeout por llamada: 10 s. Reintentos temporales a 1, 2, 4 y 8 minutos, hasta cinco intentos. Errores permanentes pasan a FAILED. Un intento ambiguo no se reenvía automáticamente después de 20 horas desde su primer intento, dejando margen respecto a las 24 horas de idempotencia del proveedor. Requiere reconciliar en Resend antes de cualquier intervención; no cambiar UUID, cuenta o payload para forzar un reenvío. SENT significa aceptación por el proveedor, no recepción final en buzón; no se implementaron webhooks de entrega.

`after()` está limitado a la vida máxima de la función y no es un worker durable. Los pendientes tienen un mecanismo real de ejecución privado:

```bash
pnpm leads:process
```

Procesa hasta 20 registros vencidos por ejecución; ninguna lectura HTTP pública ni endpoint administrativo. Ejecutar desde un entorno de operador restringido o programarlo en un runner privado con acceso a la misma rama y secretos. No se habilitó un cron externo: antes de activar producción hay que asignar responsable y frecuencia de ejecución, además de alertar/revisar pendientes y FAILED. No promete fiabilidad de entrega sin ese mantenimiento.

Las plantillas incluyen contexto comercial interno y confirmación transaccional sin promociones ni plazo prometido. HTML/table layout claro, texto de marca y versión plana; datos del usuario escapados y descripción con saltos de línea. Sin dependencia React Email.

Referencias técnicas: [idempotencia Resend](https://resend.com/docs/dashboard/emails/idempotency-keys), [cabeceras de Vercel](https://vercel.com/docs/headers/request-headers), guías locales de Next `after` y Route Handlers.

## Privacidad y retención

Datos de contacto/proyecto viajan al servidor y a Neon. Resend recibe los necesarios para notificación interna y confirmación, solo al activar envíos. No se añaden sistemas de marketing, CRM externo ni herramientas de seguimiento. La información legal debe reflejar los flujos, responsable, base jurídica, plazos y demás requisitos revisados por su responsable; la casilla registra lectura, no consentimiento de newsletter ni prueba automática de cumplimiento.

Las solicitudes se conservan sin caducidad ni borrado por antigüedad. No existe comando de eliminación de leads. Notas, actividad y cola de correo permanecen asociadas. La expiración de sesiones y ventanas del limitador sigue siendo independiente. Las copias de correo y backups pertenecen a sus proveedores.

## Pruebas y pendientes

`pnpm test:leads` ejecuta pruebas con dobles; `test:config` cubre entornos; `test:db` compara esquema/migración offline. No envían emails ni utilizan producción. Los comandos de mantenimiento fallan con mensaje controlado si falta configuración. El registro exacto está en [validación](validacion.md).

Bloqueos de activación: base/rama configurada y migraciones revisadas/aplicadas, aviso de privacidad aprobado y versionado, secreto de seguridad, remitente y destinatario reales, dominio Resend verificado, prueba integral autorizada y revisión visual/teclado. No se han comprobado conexiones, entrega real o concurrencia sobre PostgreSQL remoto. Las pruebas con dobles no sustituyen esas comprobaciones.

Futuro: CRM/admin y gestión de estados, observabilidad operacional, entrega por webhooks y procesamiento durable si el volumen lo exige. No se implementa ninguna de esas interfaces o servicios en esta iteración.

## UI pública — 12/10/2026

URL comercial única `tipo=web|software|app|mvp`. Valores ausentes, inválidos o repetidos seleccionan web; query histórica `servicio` no se consume. Radios públicos usan esos cuatro valores y `app` se serializa como `aplicacion` en el payload vigente. Backend conserva `otro` para sus consumidores privados. Opcionales mantienen valores al cerrar y se abren antes de enfocar errores.

Presupuestos: opción A del plan, claves y rangos existentes íntegros; no se renombran etiquetas engañosamente ni se cambian schema/CRM/emails. El reinicio desde éxito conserva tipo y elimina datos personales y clave del intento. Seguridad, endpoint, persistencia, outbox, permisos, configuración legal y operación externa se mantienen. Solo eventos locales sin PII; no se ha enviado correo real ni creado una solicitud remota para esta UI.

## Activación solicitada — 22/10/2026

Por instrucción expresa del propietario, la captación deja de depender de legalReadiness(). Los documentos conservan su estado editorial real. El aviso utiliza por defecto la URL de privacidad del dominio oficial y la versión actual de legalDocuments; overrides de entorno deben coincidir con ambos. Se registra esa versión con cada lead, sin afirmar aprobación documental.

Producción y preview requieren VERCEL=1, DATABASE_URL, LEADS_SECURITY_SECRET de al menos 32 caracteres y configuración del aviso como requisitos. Desarrollo mantiene su modo de prueba y runtime exige base y secreto para persistir. Resend es independiente: su ausencia no impide guardar solicitudes. Reconstruir y desplegar para actualizar la disponibilidad prerenderizada. Esta decisión sustituye el requisito de aprobación legal para captación descrito en las secciones históricas.

### Overrides vacíos — 23/10/2026

LEADS_PRIVACY_NOTICE_URL y LEADS_PRIVACY_NOTICE_VERSION vacíos o compuestos solo por espacios utilizan los valores del documento actual. Esto permite copiar .env.example sin que las variables opcionales vacías bloqueen la captación. Los requisitos operativos obligatorios se mantienen. Cambios en variables de producción requieren reconstrucción/despliegue porque la página de contacto se prerenderiza.

## Configuración operativa actual — 23/10/2026

Se elimina por completo el interruptor manual de captación por petición del propietario, sin alias ni compatibilidad. La disponibilidad de formulario y endpoints se deriva únicamente de los requisitos operativos. El correo conserva su activación independiente.

En Vercel Production: NEXT_PUBLIC_SITE_URL=https://asivquark.com; BETTER_AUTH_URL=https://asivquark.com; DATABASE_URL pooled de Neon; BETTER_AUTH_SECRET y LEADS_SECURITY_SECRET aleatorios, distintos y de al menos 32 caracteres. Para correo: LEADS_EMAIL_ENABLED=true, RESEND_API_KEY real, RESEND_FROM_EMAIL de dominio verificado y LEADS_NOTIFICATION_EMAIL del buzón comercial. URL y versión del aviso son opcionales: se obtienen del documento actual. Vercel proporciona sus variables de plataforma automáticamente. Reconstruir/desplegar tras cambios. No existe una cuenta admin predeterminada.
