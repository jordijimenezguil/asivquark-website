import { CookieConsentProvider } from "@/components/cookies/cookie-consent-provider";
import { Spotlight } from "@/components/marketing/spotlight";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <CookieConsentProvider><SiteHeader /><Spotlight><main
      id="contenido"
      className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center"
    >
      <p className="eyebrow text-brand-400">ASIVQUARK / 404</p>
      <span aria-hidden="true" className="text-display text-outline font-extrabold">404</span>
      <h1 className="section-title">No encontramos esta página</h1>
      <p className="text-fg-muted">
        Puedes volver al inicio para explorar nuestros servicios.
      </p>
      <Button href="/">Volver al inicio</Button>
    </main></Spotlight><SiteFooter cta={false} /></CookieConsentProvider>
  );
}
