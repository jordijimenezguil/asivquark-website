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
