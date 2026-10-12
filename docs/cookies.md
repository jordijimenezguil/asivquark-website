# Cookies y tecnologías similares — Iteración 6

Auditoría de código y dependencias: 12/10/2026. Inventario central: `src/config/cookies.ts`. No se modifica Prisma, auth, base remota, email, DNS o despliegue.

## Inventario y alcance

Se buscaron document.cookie, Set-Cookie/cookies de servidor, localStorage, sessionStorage, IndexedDB, Service Workers, scripts/iframes y URLs externas. No hay GA/GTM/Ads/Meta/Hotjar/Clarity/Vercel Analytics/Speed Insights, vídeos/maps/chat externos ni CAPTCHA instalado. Resend/Neon son servidor; fuentes next/font se sirven localmente. Revisar cualquier inyección de scripts de Vercel, proxy, extensiones o entorno real antes de publicar: la auditoría de repositorio no prueba toda la infraestructura.

- `asivquark-consent`: propia, necesaria para recordar la elección; host-only, Path=/, SameSite=Lax, Secure en HTTPS, 365 días. Legible por cliente, sin función de autorización ni identificador de visitante.
- Better Auth 1.7.7: `better-auth.session_token`, prefijo `__Secure-` en HTTPS, siete días (sesión con dontRememberMe), HttpOnly, Path=/, SameSite=Lax. `better-auth.dont_remember` se utiliza condicionalmente para esa opción. Verificado en `dist/cookies/index.mjs` y configuración propia. Sesión/servicio administrativo solicitado; no se borra desde el gestor. `session_data`/`account_data` no se activan: cookieCache/storeAccountCookie no habilitados. Cookies expiradas de limpieza del SDK no son servicios activos de seguimiento.
- `crm-search`: HttpOnly, SameSite=Strict, Secure en HTTPS, una hora, Path=/admin/leads, búsqueda solicitada por administrador. No modificar desde el gestor público.
- Atribución propia en memoria: UTM, entrada, referencia reducida a origen, página previa. Se adjunta al enviar formulario; conservadoramente requiere Analíticas. No se presupone exención por ausencia de cookie. Eventos CustomEvent locales de interacción también se bloquean en su punto de emisión. No tienen colector externo ni duración persistente propia. Retención del lead enviado sigue la política de captación, no la duración de memoria/cookie.

Solo Analíticas justifica categoría opcional actual; funcionales y marketing permanecen false y no se muestran. Inventario incluye finalidad, ámbito, duración verificada, scripts/métodos de activación y retirada, proveedor, almacenamiento y documentación. Sin servicios ficticios.

## Arquitectura y bloqueo

Layout de marketing sigue servidor y envuelve sus hijos en provider cliente, incluyendo los footers de cada página. No se consulta Neon. SSR y primer render cliente parten sin decisión; lectura de cookie después de montar. No hay acceso a window/document durante render servidor. No se activa nada opcional durante la hidratación.

`features/cookies/consent.ts` valida con Zod esquema estricto, tamaño, fecha, edad, versión y coherencia. Ausencia, corrupción, expiración o versiones aceptadas obsoletas bloquean. Se distinguen null (sin decisión), accepted, rejected y custom. Solo categorías del inventario pueden activarse. Cookie propia guarda categorías, estado, versión y fecha ISO; no IP, usuario o ID visitante. Se verifica la escritura y se informa si falla; el bloqueo usa lectura válida de cookie, no optimismo de UI.

`hasConsent()` controla cada lectura/captura de atribución y cada emisión de eventos; `AttributionTracker` observa cambios y limpia memoria al denegar. Formulario vuelve a comprobar permiso al enviar/reintentar, eliminando atribución previamente guardada si se revoca. No hay SDK externo que descargar ni cookies opcionales que borrar hoy. No se implementa un cargador genérico de scripts sin uso: cualquier futura integración debe estar inventariada y bloquear carga/inicialización/red/almacenamiento antes de consentimiento, además de implementar limpieza/desactivación efectiva (o recarga controlada). Desmontar un componente no basta para detener un SDK.

Provider actualiza al cambiar decisión, recuperar foco, cambiar visibilidad y cada 15 segundos (otras pestañas/expiración). Puntos de captura verifican cookie en cada acceso: no dependen del retraso del refresco visual. Revocar guarda rejected, bloquea y vacía memoria; no elimina cookies necesarias ni datos ya enviados. No promete borrar HttpOnly o dominios ajenos.

## Interfaz

Banner inferior no modal: aceptar/rechazar con idéntico estilo y tamaño, configurar sin consentimiento. Diálogo nativo showModal: aislamiento y foco nativos, Escape, cierre sin guardar, selección actual, checkbox analítico no preseleccionado, restauración de foco y enlace a política. Al desaparecer banner tras decisión se enfoca contenido para evitar perder el foco. Botones de al menos 44 px, foco visible, tonos del proyecto y Geist en el gestor. Sin animaciones añadidas. Tabla legal usa scroll propio en móvil.

Acceso permanente en footer y política. La política SSR deriva tabla del inventario, muestra pendientes jurídicos explícitos y metadata con reglas de producción/preview existentes. Se mantiene fuera del sitemap comercial; enlaces HTML normales permiten acceso. No se añaden categorías vacías, bloqueo comercial, checkbox de email ni dependencia de DB.

## Versionado y duración

Versión inicial 1.0. 365 días configurables, sin renovar al navegar ni al refrescar. Incrementar por cambios materiales de finalidades, terceros o información necesaria para consentir; CSS no justifica invalidación. Aceptaciones/custom de versión distinta quedan bloqueadas y requieren decisión. Rechazo explícito anterior conserva todos los opcionales denegados hasta su expiración; no se convierte en autorización ni se reinicia por cambios de versión. Auditar este criterio si cambian finalidades.

Registro local proporcional: elección/fecha/versión, sin tabla de visitantes. No prueba identidad ni historial inmutable; el cliente puede alterarlo y no sirve para autorización. Con estos servicios no se añade registro servidor. Con futuras tecnologías, evaluar la suficiencia de la prueba y documentar retención/acceso/minimización antes de añadir identificadores. Conservar en Git la información/inventario de cada versión.

## Fuentes y revisión legal

Consultadas fuentes oficiales el 12/10/2026:

- AEPD, guía publicada disponible (mayo de 2024): https://www.aepd.es/guias/guia-cookies.pdf. Previo consentimiento, aceptar/rechazar en primera capa, retirada sencilla, cambios de finalidad y buena práctica de no superar 24 meses; no obligación universal de 24 meses exactos.
- LSSI-CE art. 22.2: https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758#a22.
- CEPD 05/2020 consentimiento: https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en.
- RGPD: https://eur-lex.europa.eu/eli/reg/2016/679/oj (el visor no extrajo texto completo; no se presenta como lectura íntegra).
- LOPDGDD: https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673.
- Better Auth: https://better-auth.com/docs/concepts/cookies; el código instalado prevalece para nombres/configuración.

Pendiente: identificación jurídica/canal legal del responsable, revisión de clasificación/finalidades reales, infraestructura y cookies HTTP de autenticación en entorno real. La política es informativa con pendientes visibles, no texto legal aprobado ni garantía de cumplimiento. El acceso al navegador fue rechazado por la herramienta; WCAG y tamaños 320/375/768/1280 necesitan verificación visual/teclado real.
