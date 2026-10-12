# Prisma y Neon — transición segura

## Estado de esta tarea

Prisma ORM/Migrate, cliente y adaptador Neon **7.10.0**. Versión estable comprobada en npm; Prisma 8 RC no se instala. Better Auth mantiene versión 1.7.7 con adaptador oficial Prisma. No existen consultas comerciales que convertir: la persistencia anterior preparaba únicamente autenticación.

Better Auth utiliza su entrada `minimal` y adaptador Prisma explícito. Overrides pnpm acotados a Better Auth 1.7.7 eliminan el adaptador Drizzle y sus peers opcionales del árbol instalado, porque el paquete original incluye adaptadores no utilizados. Revisar estos overrides al actualizar la versión. La técnica está documentada en [pnpm overrides](https://pnpm.io/settings/dependency-resolution#overrides), y la entrada minimal en [instalación Better Auth](https://better-auth.com/docs/installation).

No hay DATABASE_URL ni DIRECT_URL configuradas en el entorno inspeccionado. No se puede determinar la existencia ni contenido de una base remota sin credenciales. No se ha realizado introspección remota, aplicado migraciones, creado usuarios ni alterado datos. Docker no dispone de un daemon activo para una comprobación PostgreSQL local.

## Conexiones y cliente

Copiar las conexiones de la consola Neon, sin inventarlas:

- DATABASE_URL: conexión pooled de la aplicación, privada, con TLS y a la rama correspondiente.
- DIRECT_URL: conexión directa de **la misma base/rama** para Prisma CLI, migraciones y Studio.

Por petición expresa del usuario, DIRECT_URL pasa a ser un override opcional. Prisma CLI usa `DIRECT_URL || DATABASE_URL`; Neon admite migraciones por la conexión pooled. `generate` y `validate` siguen funcionando sin URLs. `prisma.config.ts` carga `.env.local` mediante `@next/env`, respetando la precedencia de Next.js. No usar `directUrl` dentro del esquema: Prisma 7 obtiene la URL administrativa desde la configuración.

`getPrisma()` crea cliente/adapter cuando un servicio de servidor lo solicita. PrismaNeon usa WebSockets y el WebSocket nativo de Node >=22.12; no hace falta añadir `ws`. El pool se abre al consultar. Reutilización por módulo en producción y globalThis en desarrollo para hot reload. Sin `$connect()` en importación ni `$disconnect()` por cada petición. API auth permanece en runtime Node.js. El cliente generado se importa desde `@/generated/prisma/client`, ignorado por Git y regenerado en postinstall/build.

## Compatibilidad del esquema

| Modelo Prisma | Tabla física | Observaciones                                 |
| ------------- | ------------ | --------------------------------------------- |
| User          | user         | Email único, role user por defecto            |
| Session       | session      | Token único, índice de user_id, FK en cascada |
| Account       | account      | Índice de user_id, FK en cascada              |
| Verification  | verification | Índice de identifier                          |

`@map` conserva todas las columnas snake_case, `@@map` las tablas. Texto permanece TEXT; timestamps sin zona usan precisión 6, equivalente al timestamp sin precisión anterior. Nullability, defaults, nombres de índices/constraints, primary keys y acciones de FK se conservan. `@updatedAt` sustituye la actualización desde ORM; no añade un trigger PostgreSQL. Los modelos de autenticación no añaden defaults de ID. Better Auth sigue generándolos. Los modelos de leads de la iteración 3 tienen UUID propios.

La línea base `prisma/migrations/0_init/migration.sql` conserva el SQL original. Mantiene restricciones UNIQUE físicas, aunque Prisma represente su equivalente como índices únicos en SQL generado; esto no autoriza eliminar/recrear esas restricciones. El archivo `drizzle/` con SQL, snapshot y journal no se elimina ni se ejecuta: referencia histórica hasta verificar la transición real.

## Base nueva y vacía

Solo después de verificar destino y confirmar que no contiene tablas de aplicación:

```bash
pnpm prisma migrate status
pnpm db:deploy
pnpm db:generate
```

Aplica la línea base a la base vacía. Para futuros cambios, usar una rama de desarrollo aislada, modificar schema y ejecutar `pnpm db:migrate --name descripcion`; revisar SQL, regenerar cliente y probar antes de aplicar las migraciones en un despliegue autorizado.

## Base existente: no ejecutar CREATE TABLE de la línea base

1. Confirmar URLs/rama de destino y preparar una copia recuperable o rama Neon. Conservar también el historial anterior, incluyendo la tabla de control de migraciones si existe.
2. Hacer introspección **sin sobrescribir** el esquema convertido:

   ```bash
   pnpm prisma db pull --print
   pnpm prisma migrate status
   pnpm prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script
   ```

   Son comprobaciones de lectura. No volcar salidas a repositorios públicos; pueden reflejar información interna del esquema. Comparar todas las tablas, columnas, defaults, restricciones, índices, secuencias/triggers y datos relevantes. `migrate status` puede indicar ausencia de historial Prisma; eso no implica que la base esté vacía.

3. Si hay diferencias, detener la aplicación y adaptar el esquema/línea base de forma revisable, preservando objetos adicionales. No usar reset ni db push ni ejecutar SQL de diff automáticamente. Prisma no representa necesariamente todos los objetos PostgreSQL; conservar funciones/triggers en la línea base si se encuentran en la base real.
4. **Solo después de comprobar equivalencia y autorizar el registro de historial**, marcar la línea base como aplicada, sin recrear tablas:

   ```bash
   pnpm prisma migrate resolve --applied 0_init
   ```

   Este comando escribe en el historial `_prisma_migrations`; no es una comprobación de lectura. No se ha ejecutado en esta tarea.

5. Verificar estado Prisma y ausencia de drift, ejecutar pruebas de usuarios/sesiones y comparar registros contra la copia previa. Mantener historial anterior archivado hasta completar esa verificación.

No ejecutar `migrate dev` en una base con historial aún sin transición: puede proponer reset por drift. Cancelar cualquier propuesta de reset. `migrate deploy` tampoco debe ejecutarse sobre tablas existentes sin el baselining anterior.

## Desarrollo y Vercel

`db:migrate` crea/aplica migraciones en desarrollo y necesita shadow database disponible. Utilizar una rama de desarrollo; si Neon/permisos no permiten crear una shadow database, configurar una base de pruebas independiente según la documentación Prisma antes de continuar. Nunca usar producción como shadow.

`db:deploy` aplica únicamente migraciones versionadas. Ejecutarlo en un paso administrativo autorizado, separado del build Vercel. Build/postinstall generan cliente y no migran. Variables separadas para cada entorno; previews no comparten base de producción. Dominio, canonicals y noindex continúan según la configuración previa.

## Referencias

- [Prisma 7 con PostgreSQL y Neon](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql)
- [Configuración Prisma 7 y variables opcionales](https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference)
- [Línea base sobre una base existente](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/baselining)
- [Better Auth con Prisma](https://better-auth.com/docs/adapters/prisma)


## Iteración 3 — modelos comerciales

Se añaden Lead, LeadEvent, EmailOutbox y LeadRateBucket sin alterar los cuatro modelos anteriores. Migración aditiva `20261012070000_leads` generada offline, sin aplicar. Cliente generado/validate y comparación de auth aprobados; no hubo acceso remoto. Ver [leads](leads.md) para campos, retención, procesamiento y activación. La línea base sigue requiriendo comprobación contra la base real antes de aplicar migraciones.

## Actualización — Iteración 4

Migración 20261012120000_crm generada offline con Prisma diff y revisada, no aplicada. Añade LeadNote, RateLimit, Lead.version/índice y LeadEvent.actorId/tipos, sin cambios destructivos de tablas existentes. Véase [CRM](crm.md) para implementación, procedimientos y límites actuales. Las secciones anteriores describen la fase previa.

## Configuración efectiva — conexión única y migraciones aplicadas

El usuario solicitó prescindir de DIRECT_URL. Se conserva como override opcional; .env.local la tiene comentada y Prisma CLI usa DATABASE_URL pooled. [Neon documenta soporte de migraciones pooled](https://neon.com/blog/better-postgres-with-prisma-experience). No se construyeron hostnames ni se cambiaron credenciales. La conexión directa continúa siendo una alternativa para herramientas/proveedores que la requieran; el soporte de Neon no se generaliza a todos los poolers.

Tras consulta read-only se confirmó public vacío. Se aplicaron mediante `pnpm db:deploy`, con autorización del usuario: 0_init, 20261012070000_leads y 20261012120000_crm. No se ejecutó reset, db push ni se borraron datos. Las secciones anteriores conservan el contexto histórico de preparación offline.
