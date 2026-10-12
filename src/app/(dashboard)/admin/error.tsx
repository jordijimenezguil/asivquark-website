"use client";
export default function ErrorPage({ reset }: {
    reset: () => void;
}) { return <section className="crm-card"><h1 className="text-xl font-semibold">No se han podido cargar los datos</h1><p className="my-4">Comprueba tu sesión y tus permisos. Si el problema continúa, vuelve a intentarlo más tarde.</p><button className="crm-button" onClick={reset}>Reintentar</button><a className="crm-link ml-5" href="/login/">Iniciar sesión</a></section>; }
