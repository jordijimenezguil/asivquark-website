"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NavigationLinks } from "./navigation-links";
export function MobileNavigation() {
 const pathname = usePathname();
 const dialog = useRef<HTMLDialogElement>(null);
 const trigger = useRef<HTMLButtonElement>(null);
 const close = () => dialog.current?.close();
 useEffect(() => { dialog.current?.close(); }, [pathname]);
 useEffect(() => {
 const media = window.matchMedia("(min-width: 1024px)");
 const resize = () => { if(media.matches) dialog.current?.close(); };
 media.addEventListener("change", resize);
 return () => { media.removeEventListener("change", resize); document.body.style.overflow = ""; };
 }, []);
 return <div className="lg:hidden"><button ref={trigger} type="button" aria-label="Abrir menú" aria-haspopup="dialog" aria-expanded={false} aria-controls="mobile-navigation" onClick={() => { dialog.current?.showModal(); trigger.current?.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; }} className="flex size-11 items-center justify-center rounded-xl border border-white/15"><Menu size={20} aria-hidden="true" /></button>
 <dialog ref={dialog} id="mobile-navigation" aria-label="Navegación móvil" onClose={() => { document.body.style.overflow = ""; trigger.current?.setAttribute("aria-expanded", "false"); trigger.current?.focus(); }} className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto bg-night px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-5 text-white backdrop:bg-night">
 <button type="button" onClick={close} aria-label="Cerrar menú" className="ml-auto flex h-12 w-12 items-center justify-center rounded-lg border border-white/15"><X aria-hidden="true" /></button><nav className="mt-5" aria-label="Menú móvil"><NavigationLinks mobile onNavigate={close} /><Link href="/contacto/" onClick={close} className="mt-8 block rounded-[10px] bg-violet px-6 py-4 text-center font-semibold">Cuéntanos tu proyecto →</Link></nav></dialog></div>;
}
