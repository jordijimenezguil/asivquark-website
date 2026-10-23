# Conservación de solicitudes

Actualización técnica: 23/10/2026, por petición expresa del propietario.

Los leads no tienen fecha de expiración y se conservan sin borrado automático ni comando de limpieza por antigüedad, independientemente de su estado comercial. Sus notas, actividad y cola de correo se mantienen asociadas. La idempotencia permanece mientras exista la solicitud. El procesamiento de correo no filtra por edad del lead; los límites de reintento del proveedor siguen vigentes.

Sesiones, verificaciones y ventanas de rate limiting conservan sus expiraciones de seguridad independientes. Buzones, proveedores y copias de seguridad tienen configuración propia. Este cambio de comportamiento técnico no registra aprobación jurídica ni modifica los estados editoriales de los documentos.
