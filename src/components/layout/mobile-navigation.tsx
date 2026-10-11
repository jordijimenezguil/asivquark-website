"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navigation } from "@/config/navigation";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <div
      className="md:hidden"
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
        className="absolute inset-x-0 top-full border-b border-white/10 bg-night px-6 py-5 shadow-lg"
      >
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-3 text-base text-white hover:bg-surface"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/#contacto"
          onClick={() => setOpen(false)}
          className="mt-3 block rounded-lg bg-violet px-3 py-3 text-center font-medium"
        >
          Hablemos
        </Link>
      </nav>
    </div>
  );
}
