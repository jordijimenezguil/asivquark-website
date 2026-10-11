import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main
      id="contenido"
      className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center"
    >
      <p className="eyebrow text-violet">ASIVQUARK / 404</p>
      <h1 className="section-title">No encontramos esta página</h1>
      <p className="text-slate-600">
        Puedes volver al inicio para explorar nuestros servicios.
      </p>
      <Button href="/">Volver al inicio</Button>
    </main>
  );
}
