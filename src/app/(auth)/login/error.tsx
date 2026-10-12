"use client";
export default function LoginError({ reset }: { reset: () => void }) {
 return <main id="contenido" className="flex min-h-screen items-center justify-center bg-night p-5 text-white"><section className="max-w-md rounded-xl bg-surface p-8"><h1 className="text-2xl font-semibold">Acceso temporalmente no disponible</h1><p className="my-5">Ha ocurrido un error al cargar los datos. Vuelve a intentarlo más tarde.</p><button className="crm-button" onClick={reset}>Reintentar</button></section></main>;
}
