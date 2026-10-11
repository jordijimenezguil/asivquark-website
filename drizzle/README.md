# Historial conservado — no es un ORM activo

Archivo histórico de la preparación inicial. Se conservan SQL, snapshot y journal originales para comparar o establecer la línea base si existiese una base previamente migrada. No se cargan desde aplicación, scripts o Prisma Migrate y no hay dependencias activas de Drizzle.

El SQL original se conserva también como `prisma/migrations/0_init/migration.sql`, manteniendo nombres, tipos y restricciones. No aplicar esa migración sobre tablas existentes: primero comprobar el esquema real y seguir [el procedimiento de transición](../docs/prisma.md).
