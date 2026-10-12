"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { optionalCategories } from "@/config/cookies";
import { createConsent, denied, getCookieConsent, saveCookieConsent, type CookieConsent, type Preferences } from "@/features/cookies/consent";
const Context = createContext<{ openPreferences: () => void; consent: CookieConsent | null } | null>(null);
export function useCookieConsent() {
  const context = useContext(Context);
  if (!context) throw new Error("CookieConsentProvider required");
  return context;
}
export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [ready, setReady] = useState(false);
  const [selection, setSelection] = useState<Preferences>(denied);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const banner = useRef<HTMLElement>(null);
  useEffect(() => {
    const sync = () => { setConsent(getCookieConsent()); setReady(true); window.dispatchEvent(new Event("asivquark:consent-sync")); };
    sync();
    window.addEventListener("asivquark:consent", sync);
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    const timer = window.setInterval(sync, 15000);
    return () => { clearInterval(timer); window.removeEventListener("asivquark:consent", sync); window.removeEventListener("focus", sync); document.removeEventListener("visibilitychange", sync); };
  }, []);
  const openPreferences = () => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelection(getCookieConsent() ?? denied);
    setError("");
    dialog.current?.showModal();
  };
  const close = () => { dialog.current?.close(); };
  const save = (status: CookieConsent["status"]) => {
    const value = createConsent(status, selection);
    const saved = saveCookieConsent(value);
    setConsent(saved ? getCookieConsent() : null);
    if (!saved) { setError("No se pudo guardar la decisión. Las tecnologías opcionales siguen bloqueadas. Comprueba si tu navegador permite cookies propias."); return; }
    const focusWasBanner = banner.current?.contains(document.activeElement);
    close();
    if (focusWasBanner) document.getElementById("contenido")?.focus();
  };
  return <Context.Provider value={{ openPreferences, consent }}>{children}
    {ready && !consent && <section ref={banner} className="cookie-banner cookie-surface" aria-label="Preferencias de cookies">
      <div><h2>Tu privacidad importa</h2><p>ASIVQUARK utiliza cookies necesarias y, si lo autorizas, atribución de solicitudes y eventos de interacción propios en memoria, sin analítica de terceros. Puedes aceptar, rechazar o configurar. <Link href="/politica-de-cookies/">Política de cookies</Link>.</p></div>
      <div className="cookie-actions"><button onClick={() => save("accepted")}>Aceptar todas</button><button onClick={() => save("rejected")}>Rechazar todas</button><button onClick={openPreferences}>Configurar</button></div>
      {error && <p role="alert">{error}</p>}
    </section>}
    <dialog ref={dialog} className="cookie-dialog cookie-surface" aria-labelledby="cookie-title" aria-describedby="cookie-description" onClose={() => { if (opener.current?.isConnected) opener.current.focus(); else document.getElementById("contenido")?.focus(); }}>
      <div className="cookie-dialog-heading"><h2 id="cookie-title">Configuración de cookies</h2><button aria-label="Cerrar configuración sin guardar" onClick={close}>Cerrar</button></div>
      <p id="cookie-description">Puedes elegir qué tecnologías similares permites. Las estrictamente necesarias permanecen activas para recordar tu decisión y prestar los servicios solicitados.</p>
      <div className="cookie-category"><h3>Necesarias · Siempre activas</h3><p>Preferencias de privacidad, sesión administrativa y filtros solicitados del CRM. ASIVQUARK / Better Auth.</p></div>
      {optionalCategories.map(category => <div className="cookie-category" key={category.id}><label><input type="checkbox" checked={selection[category.id]} onChange={event => setSelection({ ...selection, [category.id]: event.target.checked })} />{category.name}</label><p>{category.description}</p></div>)}
      <p><Link href="/politica-de-cookies/" onClick={close}>Política de cookies</Link>. Retira el consentimiento con «Rechazar todas». No se borran las cookies de sesión necesarias.</p>
      <div className="cookie-actions"><button onClick={() => save("custom")}>Guardar preferencias</button><button onClick={() => save("rejected")}>Rechazar todas</button><button onClick={() => save("accepted")}>Aceptar todas</button></div>
      {error && <p role="alert">{error}</p>}
    </dialog>
  </Context.Provider>;
}
