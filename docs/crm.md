# CRM interno — Iteración 4

## Arquitectura y rutas

`/login/` es público y no indexable. `/admin/`, `/admin/leads/` y `/admin/leads/[id]/` son privados, dinámicos, runtime Node.js, sin ISR ni caché compartida. Layout independiente del marketing, sidebar responsive no modal, cierre por Escape con devolución de foco y encabezado con usuario/logout. No hay enlaces administrativos en marketing. Sitemap conserva exclusivamente ocho rutas públicas; robots excluye admin/login/API y headers declaran noindex/no-store también en producción. Metadata privada genérica, sin datos de leads.

`features/crm/schema.ts` centraliza estados, validaciones, filtros y métricas. `store.ts` contiene las consultas y transacciones tipadas con dependencias explícitas para pruebas; `data.ts` conecta siempre autorización real y Prisma. No hay acceso a Prisma desde cliente. Server Components renderizan datos; fronteras cliente: navegación móvil, login/logout, formularios de estado y notas. Server Actions autorizan mediante la capa de datos antes de consultar o mutar. No existen endpoints privados nuevos que puedan eludir permisos.

## Better Auth y permisos

Se conservan Better Auth **1.7.7**, entrada minimal, adaptador Prisma explícito **1.7.7** y Prisma/Neon **7.10.0**, sin actualización de dependencias. Rol físico existente `user.role`, único valor autorizado `admin` (conceptualmente ADMIN); `user` permanece por defecto. `input: false` impide asignarlo desde navegador. No se promocionan cuentas previas. No se integra el plugin admin: añadiría endpoints de gestión, impersonación y columnas ajenos a esta iteración; el campo existente y el aprovisionamiento privado cubren el alcance sin duplicar permisos.

Layout exige sesión; usuario sin sesión va a login y usuario sin rol a login con acceso denegado. Todas las consultas/mutaciones invocan `requireAdmin()`. La sesión se obtiene de Better Auth en cada operación con `disableCookieCache: true`. No se usa localStorage ni roles del formulario. IDs UUID y payloads strict Zod. Todos los ADMIN acceden al mismo CRM; no existe propiedad de lead por administrador ni multitenancy.

Email/contraseña con registro deshabilitado permanentemente; mínimo 12, máximo 128 caracteres. Cookies HttpOnly, SameSite=Lax, Secure cuando el origen es HTTPS; producción valida HTTPS y dominio oficial. Sesión siete días, actualización diaria, logout oficial invalida sesión. Destinos de retorno solo admin/listado/detalle sin query ni segmentos arbitrarios. Login muestra errores genéricos, sin confirmar existencia de email. No hay recuperación pública.

Rate limiting oficial Better Auth activado incluso en desarrollo, almacenado en PostgreSQL `RateLimit`, compartido entre instancias: 5 intentos de login por 300 segundos y 60 solicitudes por minuto para el resto. Se usan actualizaciones condicionales atómicas de la versión instalada. En Vercel únicamente `x-vercel-forwarded-for`; fuera de Vercel usa `x-asivquark-client-ip`, que no debe aceptarse desde Internet sin un proxy de confianza que lo sobrescriba. Si no se resuelve IP, Better Auth usa un único bucket por ruta (conservador). Verificar esa resolución en el despliegue real. El proveedor poda buckets expirados al reiniciar una ventana. Logging interno de Better Auth deshabilitado para evitar trazas sensibles; acciones registran solo categoría de error y operación, sin payloads.

Referencias oficiales: [Rate limit](https://better-auth.com/docs/concepts/rate-limit), [email/password y hash scrypt](https://better-auth.com/docs/authentication/email-password). Se contrastaron con el código instalado 1.7.7, incluyendo restricciones de registro y formato credential.

## Base de datos y migración

Migración `20261012120000_crm` generada offline mediante Prisma Migrate diff entre el esquema anterior y el nuevo, SQL revisado. Añade:

- Lead.version entero default 0 para concurrencia optimista y un índice createdAt/id para listado global.
- LeadEvent.actorId nullable con FK al usuario y dos valores del enum existente: STATUS_CHANGED, NOTE_ADDED. Los eventos anteriores siguen válidos.
- LeadNote: UUID, leadId, authorId, content (5.000), createdAt, updatedAt, índice leadId/createdAt, FK cascade para retención del lead y restrict para conservar autor.
- RateLimit: id, key único, count, lastRequest BigInt; tabla privada del limitador oficial.

No cambia columnas de auth existentes, no elimina tablas ni datos. La FK del actor usa SET NULL si posteriormente se elimina una cuenta; notas conservan su autor mediante RESTRICT. Ninguna eliminación de cuentas/leads se añade al CRM. El cleanup privado anterior conserva su política de expiración y cascada incluye notas. Revisión jurídica de retención permanece pendiente; no se automatizan derechos ni exportaciones.

**Migración aplicada el 12/10/2026**, junto con baseline y leads, a la base vacía configurada por el usuario en .env.local. No se ha designado una rama para pruebas destructivas. Aplicar solo tras revisar rama/destino, copias y baseline según [Prisma](prisma.md). No ejecutar reset ni db push.

## Activación en entorno autorizado

1. Configurar DATABASE_URL pooled (DIRECT_URL directa es un override opcional), BETTER_AUTH_SECRET aleatorio >=32 y BETTER_AUTH_URL conforme a `config/site.ts`; producción usa https://asivquark.com. Mantener variables de captación/Resend existentes si se activan esos servicios.
2. `pnpm install --frozen-lockfile`.
3. En base nueva o con baseline previamente verificado: `pnpm prisma migrate status`, revisar las tres migraciones y ejecutar `pnpm db:deploy` exclusivamente con autorización para ese destino. Si ya existen tablas, seguir baselining documentado antes.
4. `pnpm db:generate`.
5. Crear archivo JSON temporal **fuera del repositorio**, en directorio privado, permisos 0600, con campos `email`, `name`, `password` propios y contraseña aleatoria exclusiva de 12–128 caracteres. No usar valores de ejemplo como cuentas reales, historial de shell, argv, ADMIN_PASSWORD ni logs. Introducir los datos mediante editor/gestor seguro.
6. `pnpm admin:account create < /ruta/privada/cuenta.json`. El comando lee stdin, usa `hashPassword` oficial de Better Auth y crea User + Account credential dentro de una transacción Prisma. Nunca abre registro ni expone endpoint. Reejecución con el mismo admin existente no modifica contraseña ni perfil; si encuentra un usuario no admin rechaza promocionarlo. Una colisión concurrente de email aborta por restricción única y permite reintento seguro.
7. Destruir el archivo privado tras uso conforme a las prácticas del entorno, iniciar `pnpm dev`, acceder a `/login/` y luego `/admin/`.

Recuperación privada: preparar del mismo modo credenciales nuevas para el admin existente y ejecutar `pnpm admin:account reset-password < /ruta/privada/cuenta.json`. Rechaza usuario no admin, ausente o cuenta credential inconsistente; actualiza hash y elimina todas sus sesiones en una transacción. Es una operación administrativa explícita, no se ejecutó durante esta tarea. Verificar identidad y destino desde el entorno de confianza. No se imprime contraseña, hash ni token.

## Consultas y experiencia comercial

Dashboard: conteos groupBy reales por estado, servicios excluyendo SPAM y cinco últimos leads. Total cuenta todas las entradas; oportunidades válidas excluyen SPAM. NEW = nuevos; CONTACTED + QUALIFIED = seguimiento; PROPOSAL_SENT = propuestas; WON = conseguidos. Distribución de estados muestra spam de forma explícita. Sin importes/facturación simulados.

Listado: 20 por página, offset, orden createdAt/id descendente por defecto, opción ascendente, count y resultados en transacción RepeatableRead. Filtros URL combinables: status, service, period=7|30|90 y sort. Valores inválidos vuelven a defaults seguros; página limitada y ajustada al total. Búsqueda nombre/email/empresa con contains insensitive en PostgreSQL, normalizada y máximo 100 caracteres; no descarga todos los leads. Sin índice textual prematuro: medir antes de evolucionar búsquedas.

La búsqueda se envía mediante Server Action POST y se conserva una hora en cookie privada HttpOnly/SameSite Strict vinculada al ID del administrador; no se añade q a URL ni paginación. Limpiar omite el contexto previo. Contiene únicamente texto de búsqueda, nunca identidad/autorización; puede manipularse sin otorgar privilegios, se revalida antes de consultar. Filtros y búsqueda visibles en controles. Tabla escritorio sin email/teléfono; tarjetas móvil. Detalle selecciona solo datos comerciales, atribución, notas y eventos: excluye hashes, idempotencia, outbox y datos auth. Referer/UTM se muestran como texto escapado, no enlaces externos.

Estado: valida ID/estado/version, comprueba existencia, compara versión y actualiza condicionalmente. Si pierde una carrera no crea evento y muestra conflicto con recarga. Si no cambia el estado no crea actividad. Evento en misma transacción con actor obtenido de sesión, anterior y nuevo. Notas trim, obligatorias, hasta 5.000, sin HTML; inmutables en esta fase. Nota y NOTE_ADDED atómicos; evento incluye solo noteId, no duplica contenido. No se envía nota al visitante o Resend.

Timeline usa los tipos existentes de entrega; autor y fecha, estados anterior/nuevo únicamente desde metadata validada para presentación. No renderiza metadata completa ni detalles de proveedores. Notas y actividad limitadas a los 100 últimos registros cada una, indicándolo en pantalla; paginación del historial queda para una necesidad futura. Volver al listado y abrir solicitudes permite navegar entre oportunidades.

Estados de carga, vacío, errores, guardado, éxito, conflicto y registro ausente. Labels, focus existente, mensajes live y semántica de tablas; colores de estado siempre acompañados de texto. Sin gráficos pesados, polling, WebSockets, estado global, exportación, borrado o email comercial automatizado.

## Pruebas y límites

`pnpm test:crm`: pruebas de Better Auth real con adaptador oficial de memoria y credenciales efímeras de prueba; login, sesión ausente/expirada, rol, cookies, registro bloqueado, logout, límite 429. Pruebas de consultas y mutaciones con dobles: autorización antes de DB, filtros/search/paginación/orden, vacío, métricas/spam, validación, autoría/eventos y concurrencia. Los dobles no verifican FK, rollback ni comportamiento remoto de Neon; el adaptador de memoria no sustituye integración PostgreSQL.

No hay entorno Neon de pruebas configurado, por lo que no se creó administrador ni leads remotos. Pendiente probar migraciones y recorrido completo real, resolución IP Vercel, revisión visual escritorio/móvil/teclado y accesibilidad WCAG. No se afirma cumplimiento legal o de WCAG mediante tests unitarios. Sin despliegue, emails, DNS o iteración 5. La estructura admite evolución posterior sin módulos vacíos de CMS/blog/portfolio.

## Archivos creados o modificados

- `README.md`
- `docs/arquitectura.md`
- `docs/crm.md`
- `docs/prisma.md`
- `docs/producto.md`
- `docs/seo.md`
- `docs/validacion.md`
- `next.config.ts`
- `package.json`
- `prisma/migrations/20261012120000_crm/migration.sql`
- `prisma/schema.prisma`
- `scripts/admin-account.ts`
- `src/app/(auth)/login/error.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(dashboard)/admin/error.tsx`
- `src/app/(dashboard)/admin/layout.tsx`
- `src/app/(dashboard)/admin/leads/[id]/not-found.tsx`
- `src/app/(dashboard)/admin/leads/[id]/page.tsx`
- `src/app/(dashboard)/admin/leads/page.tsx`
- `src/app/(dashboard)/admin/loading.tsx`
- `src/app/(dashboard)/admin/page.tsx`
- `src/app/api/auth/[...all]/route.ts`
- `src/app/globals.css`
- `src/app/robots.ts`
- `src/components/dashboard/auth-controls.tsx`
- `src/components/dashboard/display.tsx`
- `src/components/dashboard/lead-management.tsx`
- `src/components/dashboard/navigation.tsx`
- `src/features/crm/actions.ts`
- `src/features/crm/data.ts`
- `src/features/crm/schema.ts`
- `src/features/crm/store.ts`
- `src/lib/auth/authorization.ts`
- `src/lib/auth/client.ts`
- `src/lib/auth/index.ts`
- `tests/crm-auth.test.ts`
- `tests/crm.test.ts`
- `tests/prisma-schema.test.ts`

## Activación local posterior

Por petición del usuario, Prisma CLI usa DATABASE_URL pooled si DIRECT_URL no está configurada. Las tres migraciones se aplicaron a Neon tras verificar que la base estaba vacía. Secretos locales de auth/leads generados sin imprimir valores, .env.local ignorado con permisos 0600. Aprovisionamiento del administrador pendiente de identidad y credenciales elegidas por el usuario. Resend y captación pública permanecen sujetos a su configuración real.

## Compatibilidad con barra final

Better Auth configura `advanced.skipTrailingSlashes: true` para aceptar las rutas API con barra final que exige `trailingSlash: true` en Next.js. Se conservan controles de origen, CSRF y permisos. El login muestra error temporal para un 404, evitando atribuir un fallo de ruta a las credenciales.
