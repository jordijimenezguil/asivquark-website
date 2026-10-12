"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NavigationLinks } from "./navigation-links";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <div
      className="lg:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) close();
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen(!open)}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/15"
      >
        {open ? (
          <X size={22} aria-hidden="true" />
        ) : (
          <Menu size={22} aria-hidden="true" />
        )}
      </button>
      <nav
        id="mobile-navigation"
        aria-label="Navegación móvil"
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-white/10 bg-night px-6 py-5 shadow-lg"
      >
        <NavigationLinks mobile onNavigate={() => setOpen(false)} />
        <Link
          href="/contacto/"
          onClick={() => setOpen(false)}
          className="mt-3 block rounded-lg bg-violet px-3 py-3 text-center font-medium"
        >
          Hablemos
        </Link>
      </nav>
    </div>
  );
}
