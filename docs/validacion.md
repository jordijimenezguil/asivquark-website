# Validación — Iteración 1

Registro de comandos y límites. No certifica métricas sin medición.

Estado inicial: plantilla Next 16.4/React 19.3, TypeScript strict y Tailwind 4; Git sin cambios pendientes. Se consultaron guías locales de App Router, Server/Client Components, metadata, fuentes, robots, sitemap y redirects antes de implementar.

## Resultados de la iteración inicial (históricos)

Entorno de verificación: Node.js 26.0.0, pnpm 12.11.2. Requisito del proyecto Node >=22.12; no se ha ejecutado específicamente bajo Node 22 LTS en esta sesión.

| Comprobación                                 | Resultado                                   |
| -------------------------------------------- | ------------------------------------------- |
| `pnpm install --frozen-lockfile`             | Correcto; lockfile sincronizado             |
| `pnpm peers check`                           | Sin conflictos                              |
| `pnpm lint`                                  | Correcto, cero warnings                     |
| `pnpm typecheck`                             | Correcto, tipos de rutas y TypeScript       |
| `pnpm test:config`                           | 4 pruebas aprobadas                         |
| `pnpm db:generate`                           | SQL inicial generado offline, cuatro tablas |
| `pnpm build` sin secretos                    | Correcto, home estática                     |
| Build con variables de producción            | Correcto                                    |
| Build preview con valores públicos heredados | Correcto                                    |
| `git diff --check`                           | Correcto                                    |
| `.env.local` ignorado                        | Comprobado mediante `git check-ignore`      |

La primera instalación aislada encontró restricciones DNS; se completó correctamente usando acceso de red autorizado. ESLint 10 produjo conflictos de peers, corregidos manteniendo ESLint 9.39.5. Su actualización depende de compatibilidad de los plugins de Next. Drizzle Kit incluye dos dependencias transitivas esbuild-kit deprecadas, sin alternativa estable aplicada en esta iteración.

El párrafo anterior describe el estado histórico inicial. Drizzle y esas dependencias transitivas se retiraron al sustituir el ORM por Prisma, según el registro siguiente.

## HTTP local y HTML

`pnpm dev` inicia en http://localhost:3000. Se verificó con peticiones HTTP:

- Home 200, idioma español, un único H1 y textos title/description solicitados.
- Contenido presente en HTML inicial y todas las anclas internas apuntando a IDs existentes.
- Sin canonical público en local y meta/cabecera noindex, nofollow.
- Robots local bloquea rastreo; sitemap XML sin URLs.
- Ruta inexistente devuelve 404, sin generar una página vacía 200.
- Imagen Open Graph responde 200 con `image/png`.
- API auth sin credenciales responde 503 con mensaje genérico; no interrumpe marketing.
- Sin referencias a la marca anterior en código o HTML.
- Sin errores de servidor al servir las rutas comprobadas.

## Artefactos de producción y preview

Se inspeccionaron los HTML/XML y manifiestos generados por builds independientes. Producción utiliza canonical `https://asivquark.com` (Next normaliza la raíz sin barra final; equivalente a `/`), index/follow y sitemap con una única URL `https://asivquark.com/`. Robots anuncia el sitemap correcto. Manifiesto incluye 308 condicionado al host www y no añade X-Robots-Tag de exclusión.

Preview utiliza exclusivamente el origen temporal de prueba definido para el build, sin canonical, con noindex en metadata y headers, robots sin anuncio de sitemap y sitemap vacío. Esta comprobación incluyó variables de sitio y auth heredadas de producción. No fue un despliegue real ni un dominio conectado. Finalmente se reconstruyó el proyecto sin esas variables para dejar el build local.

## Límites y pendientes

La herramienta de control del equipo no recibió autorización para usar Google Chrome. No se pudo completar la revisión visual en navegador, ejecutar el menú móvil, medir overflow, probar focus mediante teclado ni inspeccionar la consola del navegador. Se revisaron las reglas responsive, la semántica, el cierre Escape y la exclusión de enlaces ocultos en código; esa inspección no sustituye pruebas de interacción.

No se midieron LCP, INP o CLS. No se probaron conexiones a Neon, sesiones contra PostgreSQL ni envíos Resend por ausencia de credenciales y porque no se activan esas funcionalidades en marketing. Migración generada pero no aplicada. Sin emails reales, modificaciones DNS ni despliegue público. Antes de lanzamiento comercial siguen pendientes canal real de contacto y páginas legales.

## Sustitución de persistencia por Prisma

Prisma CLI, Client y adapter-neon 7.10.0 estables. Better Auth 1.7.7 con adaptador Prisma oficial y entrada minimal. Sin cambios en componentes comerciales, estilos, dominios, metadata o rutas públicas.

Inspección de variables mediante `@next/env` sin imprimir valores: DATABASE_URL, DIRECT_URL y BETTER_AUTH_SECRET ausentes. No se puede confirmar la existencia o el contenido de una base externa. No se ejecutaron introspección conectada, migrate dev/deploy/resolve/reset, db push ni operaciones SQL sobre bases reales.

| Comprobación                                      | Resultado                                              |
| ------------------------------------------------- | ------------------------------------------------------ |
| `pnpm install`                                    | Correcto, postinstall genera cliente sin credenciales  |
| `pnpm prisma format`                              | Esquema formateado                                     |
| `pnpm prisma validate`                            | Esquema PostgreSQL válido                              |
| `pnpm prisma generate`                            | Cliente 7.10.0 generado en src/generated/prisma        |
| `pnpm test:db`                                    | 2 pruebas aprobadas, comparación offline               |
| `pnpm test:config`                                | 4 pruebas aprobadas, estrategia de entornos conservada |
| `pnpm lint`                                       | Correcto, código generado excluido                     |
| `pnpm typecheck`                                  | Correcto, Better Auth tipado con Prisma                |
| `pnpm build`                                      | Correcto sin secretos, home estática, auth dinámica    |
| `pnpm start --port 3001`                          | Arranque correcto del build en servidor temporal       |
| `pnpm peers check`                                | Sin conflictos                                         |
| `pnpm why` de ORM/Kit/adapter Drizzle             | Ninguna dependencia instalada                          |
| `git check-ignore src/generated/prisma/client.ts` | Cliente generado ignorado                              |
| `git diff --check`                                | Correcto                                               |

Las pruebas comparan el SQL original con `0_init` y el SQL generado offline por Prisma con el snapshot histórico: cuatro tablas, columnas, tipos, precisión timestamp, nulabilidad, defaults, claves primarias, nombres de índices/UNIQUE y claves foráneas/acciones. Esta comprobación no sustituye la comparación contra el catálogo real de PostgreSQL ni valida datos remotos.

HTTP sobre el build temporal: home 200, idioma español, H1 único, title/description correctos, anclas existentes, meta y cabecera noindex locales, ausencia de canonical público, robots local, sitemap vacío, ruta inexistente 404, OG PNG y auth sin credenciales 503 genérico. El arranque y la importación del adaptador Prisma no requieren una conexión DB. La revisión visual no se repitió; no se modificó código de diseño.

El historial `drizzle/` permanece archivado sin herramientas activas. Se eliminaron `drizzle.config.ts` y `src/lib/db/{index,schema}.ts` al verificar sus reemplazos. Prisma 8 RC se descartó; no se ha instalado Accelerate ni Prisma Postgres. No se añadieron funcionalidades comerciales.

Pendiente: configurar URLs reales Neon, verificar/introspectar la base existente, confirmar equivalencia y autorizar el baselining si corresponde, probar consultas y sesiones reales. Seguir [Prisma y transición segura](prisma.md). No afirmar que la migración se ha aplicado: únicamente está preparada.

Verificación final adicional: `pnpm install --frozen-lockfile` correcto y cliente generado de nuevo. El servidor de desarrollo existente de este repositorio continúa en localhost:3000: home 200 y auth 503 sin credenciales. Una segunda ejecución de `pnpm dev` se detuvo por el bloqueo de servidor ya activo; no fue un fallo de compilación y no se interrumpió ese proceso. El servidor temporal de prueba del build en 3001 se cerró al terminar.

## Iteración 2 — 11–12 de octubre de 2026

Estado inicial de Git limpio. Se conservaron Next.js 16.4, TypeScript estricto, Tailwind, Geist, Lucide, Prisma 7.10.0, Neon, Better Auth y Resend. No se modificaron package.json, lockfile, esquema ni migraciones. `pnpm why drizzle-orm drizzle-kit @better-auth/drizzle-adapter` no muestra dependencias activas; el historial inactivo se conserva.

Se consultaron las guías instaladas de páginas App Router, metadata, sitemap, robots, trailingSlash, JSON-LD y useSearchParams. Se reutilizaron las primitivas y marca originales. Las cinco secciones provisionales de home, ya sin consumidores, se sustituyeron por las composiciones comerciales de esta iteración.

| Comprobación | Resultado real |
| --- | --- |
| `pnpm install --frozen-lockfile` | Correcto; cliente Prisma generado, sin modificar lockfile |
| `pnpm prisma validate` | Esquema válido |
| `pnpm db:generate` | Cliente 7.10.0 generado sin conexión DB |
| `pnpm lint` | Correcto, sin warnings |
| `pnpm typecheck` | Correcto |
| `pnpm test:config` | 6 pruebas aprobadas; incluye selección de servicio y contrato futuro de contacto |
| `pnpm test:db` | 2 pruebas offline aprobadas; esquema y línea base conservados |
| `pnpm build` local sin credenciales | Correcto; ocho páginas comerciales estáticas |
| Build con `VERCEL_ENV=production` y origen oficial | Correcto; verificación de HTML/XML/manifiesto |
| Build preview con variables públicas heredadas de producción | Correcto; verificación de aislamiento |
| `git diff --check` | Correcto |

La instalación inicial aislada encontró restricciones DNS y se completó con acceso autorizado. El primer build aislado dejó errores de apertura de puertos internos en las cachés de Turbopack. Se movieron las cachés generadas a `/tmp`, se reconstruyeron con permisos autorizados y el build pasó. No se cambió el bundler ni la configuración de React Compiler/Tailwind para eludir el problema. Prettier se utilizó como herramienta temporal, sin añadir dependencias al proyecto.

### HTTP y HTML inicial

Sobre `pnpm dev --port 3000`, las ocho rutas devolvieron 200. Un script temporal con parser HTML verificó títulos y descripciones únicos, un H1 por página, enlaces internos y fragmentos hacia destinos existentes, meta y cabecera noindex locales y ausencia de canonical público. Robots local bloquea rastreo, sitemap vacío, ruta inexistente 404 y variante sin barra redirigida a barra final. Se repitió la comprobación tras los cambios finales.

Los artefactos de build confirman contenido SEO principal en HTML sin ejecutar JavaScript cliente. Las ocho páginas se prerenderizan; únicamente la API de auth sigue siendo dinámica. El formulario de contacto usa un fallback con los mismos campos deshabilitados para conservar estructura y contenido al hidratar la selección desde URL.

Producción: canonicals exactos `https://asivquark.com/` y las siete rutas interiores con barra, sin parámetros; index/follow; sitemap con las ocho URLs y sin lastmod inventado; robots permite contenido público y anuncia sitemap; manifiesto conserva redirección www y no introduce header de exclusión.

JSON-LD de producción parseado como JSON: grafo Organization/WebSite en home y BreadcrumbList en siete páginas interiores. Se verificaron contexto, tipos, número de niveles y URL del último elemento. No hay ratings, contactos ni dirección postal. No se ejecutó el validador remoto Schema.org/Google.

Preview: sin canonicals ni JSON-LD público, noindex/follow desactivado en metadata y `X-Robots-Tag: noindex, nofollow`; robots bloquea y sitemap vacío. Se verificó con VERCEL_URL temporal de prueba y variables de sitio/auth heredadas del dominio oficial. No fue un despliegue.

### Accesibilidad, diseño y límites

Revisión de código: HTML semántico, labels asociados, enlaces para navegación, skip link, foco visible diferenciado para superficies claras/oscuras, FAQ nativas details/summary, controles táctiles de al menos 44 px, respeto a movimiento reducido, menú móvil desplazable y oculto fuera de su estado abierto. Escape cierra menú móvil y servicios de escritorio devolviendo foco. El formulario no tiene envío ni confirmación y rechaza valores de servicio desconocidos o repetidos mediante Zod.

La herramienta informó «Computer Use was not approved to use Google Chrome». No se pudo realizar revisión visual ni interacción real de escritorio/tablet/móvil, comprobar scroll horizontal en navegador o probar foco y preselección en una sesión visual. La revisión responsive de código y HTTP no sustituye esas pruebas. No se certifica WCAG ni se afirman métricas LCP, INP o CLS.

Portfolio vacío deliberadamente; sin proyectos, testimonios, cifras, equipo, contactos ni historia personal inventados. Sin correo comercial público ni política de privacidad aprobada: contacto sigue pendiente de activación. No hay CRM, CMS, blog, login visual, captura de leads, consultas Neon, envíos Resend, migraciones, despliegues ni cambios DNS. Node utilizado: 26.0.0; no se repitió específicamente con Node 22 LTS.

## Iteración 3 — 12 de octubre de 2026

Se preservaron los cambios sin commit de la iteración 2. Auditoría de variables mediante @next/env sin imprimir sus valores: DATABASE_URL, DIRECT_URL, RESEND_API_KEY, RESEND_FROM_EMAIL y LEADS_NOTIFICATION_EMAIL ausentes. Tampoco existe un aviso de privacidad aprobado. No se aplicaron migraciones, guardaron datos en una base real ni enviaron emails.

Consultadas guías instaladas de Route Handlers, after y fronteras Server/Client; documentación oficial de cabeceras Vercel, idempotencia y dominio Resend. Stack conservado. Única dependencia añadida: tsx 4.23.15 de desarrollo para pruebas/comandos TypeScript, mediante pnpm y lockfile actualizado. Sin dependencias activas Drizzle según pnpm why.

| Comprobación | Resultado real |
| --- | --- |
| `pnpm add -D tsx` | Correcto; dependencia y lockfile actualizados |
| `pnpm prisma format` | Esquema formateado |
| `pnpm prisma validate` | Correcto |
| `pnpm db:generate` | Prisma Client 7.10.0 generado sin conexión DB |
| Prisma Migrate diff entre esquemas locales | SQL aditivo preparado; sin aplicar |
| `pnpm lint` | Correcto, sin warnings |
| `pnpm typecheck` | Correcto |
| `pnpm test:leads` | 24 pruebas aprobadas con dobles de Prisma/Resend |
| `pnpm test:config` | 6 pruebas aprobadas |
| `pnpm test:db` | 3 pruebas offline aprobadas |
| `pnpm build` local sin servicios | Correcto; ocho páginas comerciales estáticas y API leads dinámica |
| Build local con variables de producción | Correcto; SEO conservado y captación pública bloqueada |
| `pnpm leads:process` sin DATABASE_URL | Fallo controlado esperado, código 1; no accede a datos ni envía |
| `pnpm leads:cleanup` sin DATABASE_URL | Fallo controlado esperado, código 1; sin eliminación |
| `git diff --check` | Correcto |

Las 24 pruebas cubren normalización preservando parte local del email, campos inválidos/opcionales, HTML, selección de servicios, atribución, bloqueo de captación pública, endpoint 201 tras confirmar repositorio, validación, DB fallida, scheduling fallido sin perder confirmación, 429, origen/formato/clave/configuración, límite de bytes, identidad de cliente, creación atómica con NEW/eventos/outbox, repetición de clave, colisión concurrente P2002, fallo de transacción, UPSERT parametrizado, escape de emails, claves estables de proveedor, ventanas de reintento, configuración ausente, excepciones de envío y reserva por dos procesadores.

Los dobles verifican llamadas y decisiones, no garantizan integración ni aislamiento real de PostgreSQL/Neon. No se ha podido realizar una prueba conectada por ausencia de URLs. La prueba de migración permite acciones referenciales ON DELETE CASCADE sobre las nuevas tablas y prohíbe sentencias destructivas; compara las cuatro tablas de Better Auth contra el histórico sin alteraciones. La migración comercial está envuelta en BEGIN/COMMIT y añade exclusivamente sus cuatro tablas/enums/índices/FK. Baseline frente a base externa aún pendiente.

### HTTP, prerenderizado y bloqueo de producción

Peticiones reales al servidor local:

- GET `/api/leads/`: 405, sin lectura pública.
- POST JSON con origen/clave válidos y sin DB/configuración: 503 con success=false y Cache-Control no-store. No hay persistencia ficticia.
- POST desde origen externo: 403.
- POST con text/plain: 415.
- Respuestas sin email de prueba, detalle Prisma ni datos personales.
- Contacto con servicio=web/software/aplicacion/mvp/desconocido: 200, H1 único, teléfono/botón y formulario presentes. Las cuatro opciones permitidas aparecen preseleccionadas en SSR de desarrollo; la opción desconocida se ignora. El form usa POST, sin riesgo de enviar sus campos como query por defecto.

Build de producción inspeccionado mediante parser HTML/XML y manifiestos: ocho canonicals exactos con barra final, titles/descriptions únicos, H1 único, sitemap con ocho rutas, robots público y JSON-LD conservados. Formulario con fieldset y botón deshabilitados, aviso de activación y sin información legal inventada. DATABASE_URL, LEADS_SECURITY_SECRET y RESEND_API_KEY no aparecen en el JavaScript cliente generado. Build final restaurado al entorno local con noindex, sin canonical y sitemap vacío.

### Límites y operaciones pendientes

No se ha comprobado un registro real en Neon, envío/recepción Resend, reintento conectado ni limpieza de datos reales. 201 y fallos de proveedor se han probado exclusivamente con dobles. SENT en outbox representa aceptación por el proveedor, no confirmación de entrega en buzón.

La revisión visual y manual de teclado/móvil no se completó: no hay navegador autorizado para control; Chrome ya había rechazado autorización durante la sesión previa. Las verificaciones HTTP/SSR y la revisión de labels, foco, estados, honeypot y CSS responsive no sustituyen interacción visual. No se afirma certificación WCAG ni Core Web Vitals. Node utilizado 26.0.0; Node 22 LTS no probado específicamente.

Antes de habilitar captación pública: preparar rama Neon y verificar baseline; revisar/aplicar migración autorizada; configurar secreto, aviso real/versionado y política de retención; configurar remitente/destinatario y dominio Resend; asignar ejecución privada regular de process/cleanup; probar flujo integral con destinatarios controlados y revisión visual. after() no es una cola durable y no se ha activado cron. Ningún endpoint público de procesamiento ni dashboard/CRM añadido. Sin DNS, despliegues, resets, consultas a producción o marketing por email. Detalle operativo en [leads](leads.md).

## Iteración 4 — 12/10/2026

Implementación CRM privada en el repositorio, sin despliegue ni conexión externa de datos. Estado inicial Git limpio. No había .env.local ni rama Neon de pruebas configurada. No se aplicaron migraciones, crearon cuentas o enviaron emails.

Comprobaciones ejecutadas:

- `pnpm install --frozen-lockfile`: completado con versiones bloqueadas, sin cambios de dependencias/lockfile. El intento inicial en sandbox falló por resolución DNS; reejecutado con acceso autorizado, reutilizando el store. postinstall generó cliente.
- `pnpm prisma validate`: esquema válido.
- `pnpm db:generate`: cliente Prisma 7.10.0 generado.
- `pnpm lint`: sin errores ni advertencias.
- `pnpm typecheck`: correcto.
- `pnpm test:config`: 6/6.
- `pnpm test:db`: 3/3; baseline histórico y cuatro tablas auth preservadas, tablas comerciales aditivas.
- `pnpm test:leads`: 24/24; regresiones de formulario, persistencia con dobles, outbox y límites.
- `pnpm test:crm`: 13/13; motor Better Auth real con adaptador de memoria: ausencia/expiración de sesión, login, rol, cookies HttpOnly/SameSite, logout, bloqueo de registro y límite 429. Consultas/mutaciones con dobles: permisos antes de DB, búsqueda/filtros/paginación/orden, métricas incluyendo exclusión comercial de spam, notas/eventos, datos inválidos y conflictos de versión. Total: 46 pruebas.
- `pnpm build`: correcto con acceso de red a Geist; ocho rutas comerciales estáticas y cuatro rutas CRM/login dinámicas. El primer intento sandbox quedó sin completar y se canceló antes de reejecutar; no se presenta como build exitoso.
- Migración SQL generada offline con `pnpm prisma migrate diff --from-schema /tmp/asivquark-before-crm.prisma --to-schema prisma/schema.prisma --script`, revisada: únicamente enum values, columnas/índice/FKs aditivas y dos tablas. **No aplicada**.
- HTTP local con `pnpm dev --hostname 127.0.0.1`: login 200 con campos email/password, metadata noindex/nofollow y Cache-Control no-store; `/admin/` y una URL de detalle solicitadas sin sesión devuelven 307 hacia login. No devolvieron información comercial.
- `git diff --check`: sin incidencias.

Límites: la herramienta de Computer Use denegó acceso a Google Chrome («Computer Use was not approved to use Google Chrome»). No se completó revisión visual desktop/móvil ni teclado. No se verificó contra Neon el recorrido login → dashboard → filtros → estado → nota → logout, ni las FKs/rollback transaccional/migraciones sobre PostgreSQL real. No se probó el aprovisionamiento contra DB ni recuperación de contraseña remota. Los tests de memoria/dobles no cubren esos límites. Resolución de IP de Vercel y cookies Secure en HTTPS real pendientes de entorno configurado. No se afirma WCAG, cumplimiento jurídico, rendimiento medido ni CRM activado en producción.

Procedimientos de configuración, migración autorizada, creación privada del administrador y recuperación: [CRM](crm.md). No hay nuevas variables permanentes; se utilizan DATABASE_URL, DIRECT_URL, BETTER_AUTH_SECRET y BETTER_AUTH_URL existentes. Captación/Resend mantienen sus requisitos previos. No se implementa iteración 5.

## Configuración local y comprobación Neon — 12/10/2026

Petición posterior: comentar variables vacías y aplicar migraciones. `.env.local` permanece ignorado y con permisos 0600; variables vacías comentadas. Se generaron secretos locales independientes para Better Auth y protección de leads, sin registrar valores. No se crearon contraseñas por defecto.

Conexión Neon comprobada mediante consulta read-only con el driver instalado: esquema public sin tablas, sin historial Prisma. DATABASE_URL y DIRECT_URL configuradas pertenecen al mismo endpoint/base/usuario y contienen TLS, pero ambas son pooled. Aplicación de migraciones pendiente de sustituir DIRECT_URL por la conexión directa suministrada por Neon; no se construyeron hostnames ni se cambió la estrategia de conexiones. La petición del usuario autoriza aplicar las migraciones revisadas una vez satisfecho ese requisito.

Prisma validate/generate, lint, typecheck y las 46 pruebas vuelven a pasar. Pendientes la cuenta administrativa elegida por el usuario y configuración real de Resend/aviso de privacidad/retención para activación pública. No se habilitan envíos ni se inventan datos legales o contactos.

## Migraciones aplicadas con conexión única — 12/10/2026

El usuario solicitó expresamente prescindir de DIRECT_URL. Se verificó documentación oficial de Neon sobre migraciones con pooling y se adaptó `prisma.config.ts` a `DIRECT_URL || DATABASE_URL || ""`; DIRECT_URL queda opcional y comentada en .env.local. No se alteraron hostnames/credenciales. La conexión pooled real funcionó con Prisma Migrate 7.10.0.

`pnpm prisma migrate status` identificó las tres migraciones pendientes. `pnpm db:deploy`, autorizado por la petición previa, aplicó correctamente `0_init`, `20261012070000_leads` y `20261012120000_crm` a la base previamente comprobada vacía. Segunda comprobación de status: «Database schema is up to date». Sin reset/db push, truncados ni eliminación de registros.

Cliente regenerado. Verificación read-only con `getPrisma()` real y adaptador Neon de runtime: conexión OK; lecturas count de User, Lead, LeadNote y LeadEvent y groupBy de estados correctas. Cero usuarios/admins/leads/notas/eventos; las tres migraciones constan finalizadas en historial. No se creó cuenta ni datos de prueba en esta base, que no está designada como rama de pruebas. Un primer script temporal falló por formato CJS antes de consultar; reejecutado como ESM con éxito.

Tras el cambio: lint, typecheck, build, test:config (6), test:db (3) y test:crm (13) aprobados; test:leads (24) aprobado en la comprobación anterior de esta misma configuración local, antes del cambio de selección de URL CLI. `git diff --check` correcto. README, documentación Prisma/CRM y .env.example actualizados para conexión única Neon. No se realizaron envíos, despliegue ni cambios DNS. Pendiente aprovisionar el administrador elegido por el usuario y completar configuración Resend/legal para captación pública; no se afirma recorrido autenticado de extremo a extremo.

Referencia: [Neon: migraciones Prisma sobre conexión pooled](https://neon.com/blog/better-postgres-with-prisma-experience). La compatibilidad comprobada corresponde a Neon y no autoriza asumirla para otros proveedores/poolers.

## Aprovisionamiento del administrador e inicio local — 12/10/2026

A petición del usuario, creada su cuenta con nombre/email facilitados y rol admin mediante `pnpm admin:account create`. Contraseña exclusiva generada con crypto.randomBytes, sin defaults ni impresión de credenciales. JSON guardado fuera del repositorio en directorio privado 0700 y archivo 0600 para consulta local del usuario. Verificación posterior read-only del rol correcta. No se promocionó una cuenta previa ni se habilitó registro público.

`pnpm dev` iniciado a petición del usuario, usando .env.local; Next.js listo en http://localhost:3000. No se desplegó producción.

## Corrección de claves de ContactForm — 12/10/2026

Aviso React reproducido al renderizar `/contacto/` en desarrollo: las opciones iniciales de servicio y presupuesto carecían de key en la lista de opciones. Se añadieron claves estables y distintas a ambos placeholders; las opciones generadas ya tenían claves por valor. Sin cambios de valores/preselección/validación ni envíos de formularios.

Verificado: nueva petición HTTP a `/contacto/` devuelve 200 sin reiterar el aviso en el render del servidor; lint, typecheck, 24 tests de leads y build correctos. No se realizó revisión de consola cliente en navegador; el servidor dev permanece iniciado.

## Corrección 404 de login — 12/10/2026

Reproducido con Better Auth 1.7.7 y adaptador en memoria: POST `sign-in/email/` devolvía 404 en vez de 401 para contraseña incorrecta. Activado `advanced.skipTrailingSlashes`; tests verifican login y logout con barra final y sesión/rate limit sin barra. El formulario clasifica 404 como error temporal.

Comprobaciones correctas: prisma validate, db:generate, lint, typecheck, test:config (6), test:db (3) y test:crm (13). `pnpm build` intentado también con ejecución escalada, bloqueado por Turbopack al abrir puerto (`Operation not permitted`). Chrome denegado por Computer Use; revisión visual escritorio/móvil y login real en navegador pendientes. No se desplegó ni cambió DB en esta corrección.

## 2026-10-12 — Plan de rediseño UI y SEO (sin implementación)

- Preparado `docs/plans/2026-10-12-redisenio-ui-asivquark.md` con arquitectura SEO propuesta, cambios por página/componente, contratos preservados y decisiones pendientes. El usuario indica que no existe producción y descarta retrocompatibilidad.
- Archivados los cinco PNG de referencia y siete SVG de marca en `docs/plans/assets/rediseño-asivquark-2026-10-12/`; copia byte a byte comprobada frente a originales y SHA-256 registrado en `manifest.json`.
- Comprobados los 13 enlaces locales a adjuntos del plan y los hashes de los 12 archivos. SVG analizados como XML para registrar viewBox y nodos de texto.
- Sin cambios de aplicación o recursos públicos; no ejecutados build/tests de aplicación, migraciones, envíos o despliegues. Revisión visual de la implementación pendiente porque esta entrega es exclusivamente documental.

### Ajuste del plan — Portfolio en página única

- Por indicación del usuario, retiradas del plan las rutas y plantillas de fichas de proyectos. El portfolio se limita a `/proyectos/`, con cards informativas y estado vacío mientras no haya material real. Actualizados arquitectura, enlaces, componentes y criterios de aceptación. Sin cambios de aplicación.

## Rediseño UI — 12/10/2026

Solicitud de implementación recibida sobre árbol inicialmente limpio. Nueve rutas públicas, logos originales, configurador, índice/detalles, formulario, menú modal y footer con CTA condicional. Presupuesto opción A; sin migraciones, cambios de contrato backend, emails ni despliegue.

Comprobaciones ejecutadas en Node v26.0.0 / pnpm 12.11.2:

- `pnpm prisma validate`: correcto.
- `pnpm db:generate`: cliente Prisma 7.10.0 generado correctamente; sin aplicar migraciones.
- `pnpm lint`: correcto, sin advertencias en la última ejecución.
- `pnpm typecheck`: correcto en la última ejecución. Se retiraron tipos generados obsoletos de `.next/dev/types` que referenciaban rutas eliminadas; también se corrigió una referencia TypeScript a una etiqueta retirada.
- `pnpm test:config`: 6/6; `pnpm test:db`: 3/3; `pnpm test:leads`: 24/24; `pnpm test:crm`: 13/13. Son pruebas existentes con dobles y comprobaciones offline; no prueban persistencia ni envío remoto real.
- `pnpm test:marketing`: 2/2, lista cerrada/repetidos/default de tipo, adaptación app→aplicacion, nueve rutas finales, atribución de servicios y ausencia de rutas individuales de casos. La primera ejecución directa con strip-types no resolvía alias; se incorporó script con tsx y condiciones react-server.
- `git diff --check`: correcto.
- `pnpm build`: bloqueado. La primera ejecución en sandbox se detuvo al no progresar; la segunda, solicitada con escalación, devolvió error de Turbopack al crear proceso/abrir puerto (`Operation not permitted`) en el procesamiento de `src/components/dashboard/auth-controls.tsx`. No se afirma build completo ni comprobación de artefactos de producción/preview.
- `pnpm dev`: primer intento falló con EPERM en puerto 3000; arrancó mediante escalación y quedó activo en http://localhost:3000. Se añadieron `data-scroll-behavior="smooth"` al html siguiendo el aviso del servidor.

Comprobación HTTP de solo lectura del servidor local: las nueve rutas responden 200, tienen exactamente un H1 y un footer, robots noindex, CTA final presente salvo en contacto y ningún enlace con query histórica `servicio`. Las cuatro rutas antiguas, `/servicios/desconocido/` y `/proyectos/caso/` responden 404. OG responde PNG 200; apple-icon 180 y favicon PNG 32 responden 200; sitemap local vacío. Los siete SVG copiados conservan originales; PNG 32/180/512 derivados mediante sharp ya disponible como dependencia de Next, tras fallar la conversión SVG de sips. Icono 180 inspeccionado visualmente.

El usuario reportó un + y flecha superpuestos en Servicios. Se corrigió la regla CSS: el pseudo-elemento +/− solo se aplica a `details[data-question]`, nunca al dropdown de navegación.

Revisión visual responsive y pruebas de teclado/formulario en navegador pendientes: la API de navegador no ofrecía Chrome y el acceso nativo devolvió «Computer Use was not approved to use Google Chrome». Se inspeccionaron las cinco referencias originales, pero no se afirma comparación visual de la aplicación, ausencia de overflow en todos los anchos, conformidad AA, foco modal probado, ni flujos UI de envío con dobles. Tampoco se midieron Lighthouse/CWV. SVG externos con texto siguen requiriendo exportación a contornos para garantizar tipografía; falta URL LinkedIn y contenido legal aprobado. La captación mantiene sus controles de disponibilidad.


## Cambio de correo público — 12/10/2026

Sustituido el correo público por `proyectos@asivquark.com` en configuración (incluidos datos estructurados), contacto, enlaces mailto y footer; actualizado el plan de rediseño. Búsqueda en `src` y `docs`: sin referencias al correo anterior.

Comprobaciones ejecutadas: `pnpm prisma validate`, `pnpm db:generate`, `pnpm lint`, `pnpm typecheck`, `pnpm test:config` (6/6), `pnpm test:db` (3/3) y `git diff --check` correctos. No se aplicaron migraciones. `pnpm build` llegó a «Creating an optimized production build» sin resultado durante la comprobación; no se afirma build completado. El servidor local no respondió en localhost:3000; no se verificó HTML servido ni vista escritorio/móvil en esta tarea.

## Iteración 6 — Cookies y ajuste del desplegable (12/10/2026)

- Auditoría de código/dependencias: inventario en `src/config/cookies.ts`; no trackers externos instalados. Atribución/eventos propios en memoria ahora sujetos a consentimiento analítico; auth/CRM necesarios preservados. Detalle y fuentes oficiales en `docs/cookies.md`.
- `pnpm prisma validate`: esquema válido. `pnpm db:generate`: generado Prisma 7.10.0, sin migrar/conectar base externa.
- `pnpm lint` y `pnpm typecheck`: correctos, repetidos después del ajuste del formulario y navegación.
- `pnpm test:cookies`: 4/4, validación estricta, fechas/expiración, versionado/rechazo anterior, categorías reales, bloqueo de atribución y eventos antes de decisión, activación y retirada con dobles del dispositivo. No equivalen a ejecución de un navegador.
- `pnpm test:config`: 6/6; `pnpm test:db`: 3/3; `pnpm test:leads`: 24/24; `pnpm test:crm`: 13/13 (incluye auth con DB de prueba); `pnpm test:marketing`: 2/2. Total 52 pruebas automatizadas correctas; sin consultas a Neon ni envío Resend reales.
- `pnpm build`: falla en Turbopack al abrir puertos internos (`Operation not permitted`), también en intento escalado. No se afirma build de Turbopack correcto.
- `pnpm dev --hostname 127.0.0.1`: arrancado y mantenido activo a petición; HTTP local escalado de `/politica-de-cookies/` devuelve 200. HTML contiene título, tabla/inventario, acceso al gestor y pendientes legales. No se instala cookie de consentimiento desde SSR.
- Navegador: inventario de Computer Use sin navegador conectado; intento de acceso nativo a Chrome rechazado por herramienta (`Computer Use was not approved to use Google Chrome`). No se ejecutaron pruebas visuales de 320/375/768/1280, teclado/foco/Escape ni solicitudes/almacenamiento en navegador real. Pendientes expresamente, sin afirmar WCAG 2.2 AA validado.
- Menú Servicios: cierre delegado al seleccionar cualquier enlace, incluido índice; cierre por salida de foco mediante relatedTarget y pointerdown fuera; Escape/restauración existente conservados. Lint/tipos correctos; revisión interactiva pendiente por bloqueo navegador.
- `git diff --check`: correcto. No cambios Prisma, migraciones, emails, DNS ni publicación.
- Alternativa `pnpm exec next build --webpack`: correcta, compilación, TypeScript y prerenderizado de 18 páginas; `/politica-de-cookies` estática. No se cambia el script build habitual ni la configuración de bundler.

## Iteración 7 — Automatización de procesos e IA (12/10/2026)

Alcance: quinto servicio comercial, landing, rutas/enlaces, captación y etiquetas. Se conservaron los cambios pendientes de cookies y navegación de la iteración anterior. Sin motores IA, proveedores nuevos, trackers, migraciones, emails reales, DNS o despliegues.

### Archivos de esta iteración

Creados:

- `src/config/services.ts`: catálogo mínimo compartido, separado del copy extenso.
- `src/content/automation.ts`: contenido, SEO y proceso del servicio.
- `src/app/(marketing)/automatizacion-procesos-ia/page.tsx`: landing servidor completa.
- `src/app/(marketing)/automatizacion-procesos-ia/opengraph-image.tsx`: imagen social generada con next/og existente.
- `tests/automation.test.ts` y `tests/automation-html.test.ts`.

Modificados: `src/content/services.ts`, `src/content/project-type.ts`, `src/config/navigation.ts`; home, nosotros, índice servicios y página dinámica existente; `commercial.tsx`, `configurator.tsx`, `service-page.tsx`, `events.ts`, `site-footer.tsx`; `contact-form.tsx`, `contact-form-with-service.tsx`, `features/leads/schema.ts`; `tests/marketing.test.ts`, `tests/leads-endpoint.test.ts`; package.json, README y documentos arquitectura/producto/SEO/validación. `sitemap.ts`, CRM y plantillas Resend no necesitan cambios de lógica: consumen las rutas y etiquetas compartidas actualizadas.

### Resultados ejecutados

- `pnpm prisma validate`: válido; `pnpm db:generate`: cliente generado 7.10.0. Lead.service sigue String/VarChar(20); no cambio de esquema, migración creada ni migración ejecutada.
- `pnpm lint` y `pnpm typecheck`: correctos después del catálogo final. `git diff --check`: correcto.
- `pnpm test:automation`: 6/6. Ruta única, orden del menú, contenido/configuración, preselección y rechazo de valores repetidos/desconocidos/ambiguos, Zod y contratos antiguos, transacción Prisma/outbox con dobles, filtro y conteos CRM, plantilla transaccional sin envío, metadata/reglas de entorno.
- `pnpm test:leads`: 25/25, incluyendo petición de automatización al handler sin atribución opcional y éxito después de persistencia con doble. `pnpm test:crm`: 13/13. `pnpm test:cookies`: 4/4. `pnpm test:config`: 6/6. `pnpm test:db`: 3/3. `pnpm test:marketing`: 2/2.
- `pnpm build`: falla por restricciones del entorno al abrir puertos internos Turbopack (`Operation not permitted`), incluso con ejecución escalada. Se mantiene el script habitual, sin ocultar este resultado.
- Alternativa local `VERCEL_ENV=production NEXT_PUBLIC_SITE_URL=https://asivquark.com BETTER_AUTH_URL=https://asivquark.com pnpm exec next build --webpack`: correcta, compilación, TypeScript, 20 páginas generadas. Repetida correctamente tras centralización final. Landing y OG prerenderizados; cuatro rutas antiguas de servicios conservadas. No publicación ni consultas Neon al generar la landing.
- `pnpm test:automation:html`: 3/3 sobre el artefacto final de producción. Title/description exactos, canonical `https://asivquark.com/automatizacion-procesos-ia/`, H1 único, secciones y siete FAQ en HTML inicial, CTA, OG, sitemap y enlaces públicos. JSON-LD parseado: Service/BreadcrumbList/una sola Organization; sin precios, ratings ni nuevo FAQPage. Esta comprobación no es validación remota Google/Schema.org.
- Total: **62 pruebas automatizadas correctas** (6 + 25 + 13 + 4 + 6 + 3 + 2 + 3). Los intentos iniciales detectaron un supuesto obsoleto del test marketing sobre Otro proyecto y la normalización de atribución ausente; corregidos y suites reejecutadas. El test de CRM evita importar next/link bajo react-server y verifica el contrato compartido y consultas reales con dobles.
- HTTP local: `/automatizacion-procesos-ia/` 200; `/contacto/?servicio=automatizacion` 200; `/servicios/automatizacion-procesos-ia/` 404. HTML local: H1 único, noindex y ausencia de canonical de producción. Preselección verificada en utilidades, no mediante navegador hidratado.
- OG generado: PNG 1200×630, 51.194 bytes, inspeccionado visualmente; logo original, texto legible y sin recorte.

### Límites

No se ejecutan envíos Resend ni persistencia en Neon reales; tests usan dobles y conservan la operación principal transaccional y controles existentes. Activación del formulario/privacidad siguen sujetas a la configuración previa; no se desbloquean comercialmente como efecto de añadir el servicio. CMS/blog no existen en el repositorio; no se crearon.

El acceso a Chrome fue rechazado en esta sesión por Computer Use y no hay navegador conectado disponible. No se afirman revisión visual de home/landing/contacto a 320/375/768/1280, interacción móvil, teclado, foco ni WCAG 2.2 AA comprobado. Solo se inspeccionó el PNG de OG. Core Web Vitals no medidos. Fuentes y sistema visual reales del rediseño conservados, sin sustituirlos ni añadir dependencias. Dev permanece disponible en 127.0.0.1:3000 como solicitado previamente.

## SEO de diseño web y blog estático — 12/10/2026

### Alcance y decisiones confirmadas

El propietario confirmó mantener `/servicios/diseno-web-barcelona/`, misma estética/tipografía actual y crear blog estático sin CMS. Autorizó expresamente el artículo como contenido público, sin estados editoriales. Esto sustituye la petición inicial de DRAFT: no se crean flags, editor o tabla Post. No se hizo despliegue ni publicación en un entorno remoto.

Landing comercial: contenido separado en `content/web-design.ts`; diez bloques H2 principales, comparación por alcance, ocho prestaciones, cinco tipos, cinco pasos y ocho FAQ. Hero/CTA web, metadatos y OG específicos; imagen de marca conservada. WebDesignPage reutiliza componentes. Home recibe solo la descripción profesional del servicio compartido; no cambia H1 general. Copy de otros servicios conservado.

Blog: índice `/blog/` y artículo `/blog/que-debe-tener-una-pagina-web-profesional/`, educativos, estáticos y sin DB. Enlaces header/footer, landing→artículo y artículo→landing/CTA. Service/BreadcrumbList/BlogPosting enlazan Organization real compartida; sin ratings, precios, autor ni fechas inventadas.

### Archivos

Creados: `src/content/web-design.ts`, `src/components/marketing/web-design-page.tsx`, `src/config/blog.ts`, `src/content/articles.ts`, `src/app/(marketing)/blog/page.tsx`, `src/app/(marketing)/blog/[slug]/page.tsx`, `tests/web-design.test.ts`, `tests/web-design-html.test.ts`, `tests/blog-html.test.ts`.

Modificados: `src/content/services.ts`, `src/components/marketing/service-page.tsx`, `src/components/marketing/commercial.tsx`, `src/app/(marketing)/servicios/[slug]/page.tsx`, `src/config/navigation.ts`, `src/components/layout/site-footer.tsx`, `tests/marketing.test.ts`, `package.json`; README y documentos SEO/arquitectura/producto/validación. Sitemap no necesita cambio de lógica porque consume publicPaths. Sin cambios Prisma, Better Auth, CRM, cookies, DNS, stack o dependencias.

### Ejecuciones

- `pnpm lint`: correcto, sin warnings. `pnpm typecheck`: correcto tras corregir guards de campos opcionales checklist/link del contenido editorial. `git diff --check`: correcto.
- `pnpm prisma validate`: válido. `pnpm db:generate`: cliente 7.10.0 generado; no cambios de esquema ni migraciones ni acceso a base remota.
- `pnpm test:web-design`: 4/4, URL conservada, metadatos, cobertura comercial, preselección contrato web, artículo educativo sin estados y separación de contenido.
- `pnpm test:marketing`: 2/2; `pnpm test:automation`: 6/6; `pnpm test:cookies`: 4/4; `pnpm test:config`: 6/6; `pnpm test:db`: 3/3; `pnpm test:leads`: 25/25; `pnpm test:crm`: 13/13.
- `pnpm build`: bloqueo de Turbopack por puertos internos (`Operation not permitted`), también ejecutado fuera del sandbox. No se cambia ni se declara correcto el script habitual.
- `VERCEL_ENV=production NEXT_PUBLIC_SITE_URL=https://asivquark.com BETTER_AUTH_URL=https://asivquark.com pnpm exec next build --webpack`: correcto, compilación/TypeScript y prerenderizado de 22 páginas; landing, índice blog y artículo estáticos. Sin publicación, migración ni consulta DB para contenido.
- `pnpm test:web-design:html`: 5/5 sobre artefactos de producción. Metadatos exactos landing/artículo, OG, canonical único independiente, H1 único, contenidos iniciales completos, enlaces de conversión/enlazado interno, blog e inclusión en sitemap. JSON-LD parseado y sin proveedor duplicado; Service/BreadcrumbList y BlogPosting reales, sin datos inventados. Sin nuevo FAQPage en landing web.
- `pnpm test:automation:html`: 3/3; confirma metadata/JSON-LD/sitemap de automatización conservados.
- Total: **71 tests correctos** (4 + 2 + 6 + 4 + 6 + 3 + 25 + 13 + 5 + 3). Pruebas de DB/leads/CRM con dobles/offline, sin emails o escrituras de producción.
- HTTP dev: landing real, `/blog/` y artículo 200. `/diseno-web-barcelona/` y `/blog/no-existe/` 404. Los tres HTML locales tienen un H1, noindex y ningún canonical de producción. El dominio/robots de preview se preservan mediante pruebas de configuración; no se desplegó un preview externo.
- Fuentes oficiales y muestra web real de las dos búsquedas registradas en `docs/seo.md`. Sin acceso Semrush/Google localizado/Search Console ni datos posteriores de rankings. Números del propietario conservados como referencia histórica no garantizada.

### Límites y pendientes

El acceso a Chrome fue rechazado por Computer Use en esta sesión, sin navegador conectado; no se afirma revisión visual 320/375/768/1280 ni interacción de teclado/foco, lector de pantalla o cumplimiento WCAG 2.2 AA certificado. Tabla comparativa con scroll contenido y acceso por teclado implementada; validación real pendiente. Core Web Vitals no medidos. Indexación, schema validation remota y mejora de consultas/rankings requieren comprobación después de un despliegue autorizado. Captación conserva sus requisitos legales/operativos existentes; no se activa ni prueba entrega de leads remotos como efecto de esta optimización.

## Blog 1a — Guía con índice (12/10/2026)

Implementados listado con filtros GET/paginación de 12, artículos MDX locales, frontmatter validado, resumen y key points, TOC español numerado, observer desktop, details móvil que se cierra al navegar, cards CTA a contacto con tipo/origen y eventos consentidos con slug, fuentes, relacionados sin entradas ficticias, RSS y sitemap descubierto desde MDX. `docs/BLOG-DESIGN.md` y regla literal en `AGENTS.md`. Header existente conserva servicios; Blog retirado de menús desktop/móvil por petición posterior y conservado en footer.

Comprobaciones ejecutadas:
- `pnpm prisma validate`: correcto; `pnpm db:generate`: correcto, sin migraciones ni conexiones a base.
- `pnpm test:config`: 6/6; `pnpm test:db`: 3/3, offline.
- `pnpm test:web-design`: 4/4; `node --import tsx --test tests/blog-content.test.ts`: 4/4 (frontmatter, fechas, links, duplicación de IDs y selección de relacionados).
- `pnpm lint` y `pnpm typecheck`: correctos también en la ejecución final tras retirar la configuración provisional de Tailwind.
- `pnpm build`: bloqueado por el entorno en los loaders de React Compiler/Turbopack: `binding to a port / Operation not permitted`; se intentó también con escalación. No es un despliegue ni un error de tipos del blog.
- Build alternativo `VERCEL_ENV=production NEXT_PUBLIC_SITE_URL=https://asivquark.com BETTER_AUTH_URL=https://asivquark.com pnpm exec next build --webpack`: compilación, tipos, generación de 23 páginas y trazas correctas. Artículo SSG y RSS estático; listado SSR. **Este fallback no valida los estilos de producción**, porque la configuración existente de Tailwind usa loader exclusivo de Turbopack, sin PostCSS para Webpack. No se cambia el bundler ni se recomienda publicar ese artefacto.
- Sobre ese HTML de producción: `node --import tsx --test tests/blog-html.test.ts`: 4/4, metadata/canonical, JSON-LD, encabezados/anclajes, fuente de sitemap/RSS y CTA. Fue ejecutado antes del ajuste final del menú y del alias `max-w-prose`; los archivos de build se regeneran/borran al intentar Turbopack.
- `pnpm dev` activo en http://localhost:3000; GET `/blog/` y artículo responden 200. GET categoría MVP muestra estado vacío, diseño web muestra artículo, página 999 se limita al rango disponible; RSS contiene el artículo. Sin consultas externas.
- HTML servido tras reiniciar dev: Blog ausente de header y presente en footer. CSS de desarrollo real contiene `text-article-h1`, `prose-asiv` y `max-w-prose` con `--max-width-prose: 720px` (alias requerido por Tailwind 4.3).
- Cálculo WCAG de luminancia relativa: ink-600 (#454956) sobre blanco = **8,97:1**, aproximadamente 9:1, AA/AAA para texto normal. No se afirma literalmente «más de 9:1».

Límites: el navegador rechazó el acceso a Chrome. No se han revisado visualmente 360/1280 px, teclado en navegador, sección activa en scroll, contraste con antialiasing real ni Lighthouse. Objetivos ≥95 accesibilidad/100 SEO quedan pendientes de medir. No hay covers reales ni otros artículos: placeholder decorativo y OG de marca, sin bloque vacío de relacionados. No se añade la barra flotante opcional que no existe en el shell. No se ha desplegado, enviado email, migrado base ni cambiado DNS. El servidor de desarrollo queda abierto a petición del propietario.

### Imagen de cabecera del artículo profesional

Foto aportada por el propietario añadida al hero mediante `headerImage`, conservando composición 3:2 (1440×960), alt «Portátil con una web profesional de ASIVQUARK en pantalla, junto a un móvil con su versión responsive.» y carga eager/fetchPriority high. WebP de 129.182 bytes. Cover separado 1200×630 con encaje completo sobre navy para no cortar etiquetas, 73.534 bytes; listado, OG/Twitter y BlogPosting usan esta ruta. No se presenta el 98 visible dentro de la ilustración como una métrica real de la web.

Guía editorial actualizada con campo `headerImage` y anatomía. HTTP del artículo devuelve la cabecera con dimensiones y alt correctos; meta tags comprobados mediante parser HTML: og:image, width/height/alt y twitter:image con su alt, todos asociados a la imagen aportada. `pnpm lint`, `pnpm typecheck` y 4 pruebas de contenido correctas. Prisma validate/generate y tests config/db reejecutados; sin migraciones. Build habitual reintentado, con el mismo bloqueo de puertos de Turbopack descrito arriba. Sin nueva revisión visual del navegador, que no autorizó acceso en la sesión anterior. Dev permanece activo en localhost:3000.

## Iteración legal — 12/10/2026

Ejecutado sobre repositorio existente, sin leer secretos, consultar bases externas, migrar ni enviar correo.

| Comprobación | Resultado real |
| --- | --- |
| pnpm prisma validate | Correcto |
| pnpm db:generate | Correcto, cliente Prisma 7.10.0 |
| pnpm lint | Correcto, cero advertencias |
| pnpm typecheck | Correcto, Next typegen y tsc |
| pnpm test:config / test:db | Correctos |
| pnpm test:leads / test:crm / test:cookies | Correctos, dobles/offline; bloqueo y retirada opcional comprobados por tests existentes |
| pnpm test:legal | 4 pruebas correctas: configuración, cierre de captación, integración y metadata producción |
| LEGAL_TEST_URL=http://localhost:3100 pnpm test:legal:html | 5 pruebas correctas tras permitir conexión local: cuatro respuestas 200 y contacto, H1 único, titles/descriptions, noindex, enlaces y anclas iniciales |
| pnpm legal:check | Código 1 esperado: identidad, aplicabilidad y cuatro aprobaciones pendientes |
| pnpm build | Falló: Turbopack no puede abrir puerto, Operation not permitted; mismo resultado en intento ampliado |
| pnpm exec next build --webpack | Correcto: compilación, TypeScript, generación de 26 páginas y trazas; cuatro rutas legales estáticas |
| git diff --check | Correcto tras retirar espacio sobrante |

El primer intento HTTP Node falló por EPERM de conexión a localhost; reejecutado con permiso ampliado, pasó. Servidor local de prueba en puerto 3100, sin envíos ni consultas de datos. Build local no equivale a build desplegado de producción. Canonicals de producción verificados con proceso aislado y configuración de origen oficial; noindex del borrador permanece. No se afirma revisión remota, indexación ni métricas de rendimiento.

Navegador: inventario sin navegadores conectados; intento Chrome devuelve `Browser is not available: chrome`. Por ello **no ejecutadas** pruebas visuales 320, 375, 768, 1024, 1440, zoom, teclado/foco reales, apertura del diálogo por interacción, overflow medido ni inspección de cookies de auth real. Diseño preparado con índice HTML, scroll-margin 7rem, lectura 72ch y tarjetas sin tabla ancha; esto no acredita WCAG 2.2 AA ni ausencia de overflow en navegador. Verificar manualmente antes de publicar. Modo oscuro alternativo no implementado por el sitio.

Checklist jurídico y riesgos: docs/legal/compliance-checklist.md. Informe de cambios: docs/legal/implementation-report.md. No hay certificación jurídica ni aprobación definitiva.

## Home / header — dirección 2a

12/10/2026: aplicados hero compacto, retícula CSS Tailwind 4, cuatro radios GET y CTA blanco móvil, detalle y dos columnas lg, header global, paso 2/3 contacto y franja reciente basada en catálogo vacío real. Sin referencias handoff/PROMPT.md ni tailwind.config presentes; no hay barra flotante previa. Se preservan cambios legales pendientes.

- Prisma validate/generate, test:config, test:db, test:automation, test:cookies, lint y typecheck: correctos.
- test:home: 4 correctos, incluyendo HTML inicial con H1 único, opciones y destino real, y tipo app convertido a aplicacion.
- test:leads: inicialmente 24/25. El test antiguo consideraba cualquier URL HTTPS como aviso aprobado, expectativa incompatible con el control jurídico añadido. Se corrigió la expectativa conservando el cierre seguro; reejecutado, 25/25 correctos. Esto corrige la afirmación anterior de test:leads íntegramente correcto en el informe legal, que se había basado en salida truncada.
- Build webpack correcto antes del último añadido textual «Paso 3 de 3» en confirmación; lint/typecheck posteriores correctos. pnpm build estándar posterior no terminó y se interrumpió al solicitar el usuario arrancar dev; no se informa como correcto. El bloqueo Turbopack previo sigue documentado.
- Navegador Chrome no disponible. No verificadas visualmente medidas 320/375/640/768/1024/1280/1440 ni presupuesto real 375×667. No ejecutados Lighthouse, CLS o LCP; no se garantizan métricas. El banner de cookies existente puede cubrir parte del hero hasta tomar una decisión, caso a revisar en primera visita.
- Logo original de proporción 196:24 conservado: caja h28 con object-contain y reducción proporcional donde CTA/menú limitan espacio. El dibujo efectivo puede ser menor de 28px en móvil; no se deforma ni rediseña el SVG para forzar una combinación incompatible de anchos.
- Carrusel preparado solo para proyectos publicados reales; actualmente estado vacío. Interacción táctil/teclado pendiente hasta disponer de contenido y navegador.

Servidor dev iniciado por petición expresa mediante pnpm dev, localhost:3000. No desplegado, sin migraciones ni envíos.
