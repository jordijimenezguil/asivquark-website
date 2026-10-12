# Revisión de conservación

12/10/2026. No hay política comercial aprobada ni limpieza ejecutada en esta iteración.

| Categoría | Comportamiento comprobado | Decisión pendiente |
| --- | --- | --- |
| Leads no convertidos | expiresAt al crear según LEADS_RETENTION_DAYS, 1–730 días; 90 solo test local | Plazo justificado, eventos que lo modifican y responsable operativo |
| Leads ganados/clientes | Misma expiración original, sin extensión por estado | Separar documentación contractual/fiscal y conservación legal; evitar destruir evidencia necesaria |
| Notas / actividad | Cascade al borrar lead | Minimización, rectificación, acceso y conservación pertinente |
| Comunicaciones / outbox | Cascade con lead; copias de correo fuera de DB no cubiertas | Retención en buzones y Resend, soporte, idempotencia y evidencias |
| Sesiones / verificaciones | Sesión 7 días; tokens tienen expiresAt | Caducidad no acredita borrado; verificar limpieza SDK y registros obsoletos |
| Cuentas administrativas | Sin política de baja automática | Desactivar accesos y fijar supresión / conservación justificada |
| Rate buckets captación | Vencimiento por ventana; comando limpia expirados | Programación autorizada y controles. Auth RateLimit no tiene misma limpieza |
| Logs / copias | Logs aplicación con IDs/códigos; política de hosting desconocida | Región, acceso, retención, backups, restauración y propagación de supresión |
| Preferencias cookies | Cookie 365 días sin ID visitante | Revisar suficiencia de prueba del consentimiento; sin historial servidor |
| Atribución en memoria | Vaciado al retirar, cierre/recarga | Una vez enviada integra lead y su plazo; revocar no borra lead |
| Contenidos públicos | MDX/Git local, sin CMS | Datos de autores/clientes y permisos antes de futuras publicaciones |

`pnpm leads:cleanup` cuenta expirados; `--execute` borra mediante operación privada, sin programación acreditada. No ejecutar contra bases externas sin autorización. Antes de adoptar plazo: documentar finalidad, base, prescripción aplicable, bloqueo conforme a LOPDGDD cuando corresponda, excepciones y método de supresión. No inventar cinco años universales ni prometer borrado automático. Validación de decisiones: titular y asesor jurídico por designar.
