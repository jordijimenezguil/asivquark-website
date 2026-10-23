# Checklist de preparación jurídica y publicación

Revisión técnica: 12/10/2026. **No aprobado para publicación como documentos definitivos.** Build correcto no equivale a conformidad. No se ha realizado revisión por abogado ni despliegue.

| Área | Evidencia / estado | Acción requerida | Validación |
| --- | --- | --- | --- |
| A. Titular | DNI y email aportados por el titular el 22/10/2026; apartado de correos en Sabadell registrado como correspondencia; nombre legal ASIVQUARK indicado por el titular; domicilio legal pendiente | Aportar identidad documental, identificación fiscal, domicilio exigible, email controlado; no asumir sociedad | Titular real por identificar |
| A. Aplicabilidad | Registro/autorización/DPD pending | Determinar si aplican y proporcionar datos o justificar no aplicabilidad | Titular / asesor por designar |
| B. Proveedores | Integraciones técnicas identificadas, activación sin comprobar | Inventario operativo y documentación de cuentas | Persona responsable por designar |
| C. Bases | Precontractual candidato, seguridad/otras consultas pendientes | Ponderación, representantes empresariales, notas/seguimiento, información admins y art. 14 si datos indirectos | Asesor por designar |
| D. Retención | expiresAt y comando manual, sin política aprobada | Resolver data-retention-review.md y verificar operación | Titular / operador por designar |
| E. Transferencias | Regiones y garantías desconocidas | Países, adecuación/SCC y medidas adicionales cuando proceda | Asesor / operador por designar |
| F. Encargos | No hay DPA aportados | Contratos art. 28 y subencargados efectivos | Titular por identificar |
| G. Cookies | Inventario y consentimiento existentes; producción auth sin comprobar | Inspeccionar cookies/red/scripts inyectados en entorno real y prueba de elección | Operador por designar |
| H. Contratos | Guía interna sin publicación | Propuesta y aceptación específica, IP y permisos portfolio | Titular / asesor por designar |
| I. B2C | No checkout; destinatarios sin confirmar | Revisar proceso posterior, información y desistimiento según contrato | Asesor por designar |
| J. Revisión | Cuatro borradores versionados | Aprobar texto completo, fecha de efectos y revisión; no solo rellenar identidad | Asesor por designar |

## Control técnico

`pnpm legal:check` devuelve código 1 y nombres de pendientes mientras falte identificación/aplicabilidad o aprobación/fechas documentales. Mantenerlo como puerta específica del lanzamiento legal, no bloqueo de toda la web. `src/config/legal.ts` es configuración versionada pública: no guardar correos privados ni secretos. Cambiar a approved solo tras resolver este checklist y registrar evidencia de aprobación; technicalReview no es fecha de aprobación.

Las cuatro páginas son accesibles con advertencia honesta y noindex mientras no estén listas; no contienen datos ficticios. El sitemap las incorpora solo tras preparación aprobada. Canonical de producción respeta rutas; preview/local no tienen canonical y siguen noindex. Captación production/preview requiere preparación legal y URL/versión del aviso exactas además de controles previos. Desarrollo conserva exclusivamente modo prueba. No se cambia auth/DB.

## Antes de producción

- [ ] Identidad del titular, NIF y dirección exigible revisados.
- [ ] Email legal válido y canal de derechos operativo, privacidad si difiere.
- [ ] Registro, autorización y DPD aplicables resueltos.
- [ ] Tratamientos reales y bases jurídicas aprobados; información por capas coherente.
- [ ] Retención, supresión, bloqueo y copias definidos; procedimiento probado con autorización.
- [ ] Proveedores, regiones, transferencias, contratos DPA y subencargados revisados.
- [ ] Cookies y scripts reales auditados; gestor, rechazo y retirada comprobados.
- [ ] Contratos diferenciados y obligaciones B2C posteriores resueltas.
- [ ] Permisos/licencias de blog, marca, portfolio e imágenes revisados (portfolio actual vacío).
- [ ] Textos jurídicos completos aprobados, versión y fecha efectiva registradas.
- [ ] legal:check correcto y captación configurada con versión aprobada.
- [ ] Footer, rutas, metadata y sitemap revisados en build del entorno.
- [ ] Mobile-first, zoom, teclado, foco y gestor comprobados en navegador real.
- [ ] Sin datos ficticios ni personales privados expuestos.
- [ ] Autorización expresa de despliegue obtenida por separado.

## Fuentes oficiales consultadas

12/10/2026: [LSSI consolidada](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758) (arts. 10 y 22.2), [LOPDGDD](https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673), [RGPD](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32016R0679), [información AEPD](https://www.aepd.es/derechos-y-deberes/conoce-tus-derechos/derecho-de-informacion), [guía cookies AEPD](https://www.aepd.es/guias/guia-cookies.pdf). El visor EUR-Lex inicial no extrajo texto completo; no se afirma lectura íntegra. Bases, información arts. 12–14, derechos 15–22, encargos 28 y seguridad 32 requieren aplicación al contexto real y revisión final.

Se accedió también al [RGPD publicado en DOUE/BOE](https://www.boe.es/doue/2016/119/L00001-00088.pdf), cuyo texto sí fue extraído, y al [TRLGDCU consolidado](https://www.boe.es/buscar/act.php?id=BOE-A-2007-20555).

## Cambio de activación — 22/10/2026

El propietario solicita expresamente habilitar el formulario sin esperar a completar este checklist. Se retira la dependencia técnica de legalReadiness para captación; se conservan los pendientes y el estado draft de los documentos. legal:check continúa informando preparación documental por separado. No se registra aprobación ni publicación de los textos como definitivos.
