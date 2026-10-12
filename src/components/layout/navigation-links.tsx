"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation, serviceNavigation } from "@/config/navigation";
export function NavigationLinks({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = (href: string) =>
    pathname === href ||
    (href !== "/" && `${pathname.replace(/\/$/, "")}/` === href);
  const style = mobile
    ? "block min-h-12 rounded-lg px-3 py-3 text-2xl font-bold text-secondary hover:bg-surface hover:text-white"
    : "inline-flex min-h-11 items-center text-sm text-secondary hover:text-white";
  return (
    <>
      {navigation.map((item) =>
        item.label === "Servicios" ? (
          mobile ? (
            <div
              key={item.label}
              className="my-3 border-y border-white/10 py-3"
            >
              <Link href="/servicios/" onClick={onNavigate} className={style}>Todos los servicios →</Link>
              {serviceNavigation.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  aria-current={active(service.href) ? "page" : undefined}
                  onClick={onNavigate}
                  className={style}
                >
                  {service.label}
                </Link>
              ))}
            </div>
          ) : (
            <details
              key={item.label}
              className="relative"
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.currentTarget.open = false;
                  event.currentTarget.querySelector("summary")?.focus();
                }
              }}
            >
              <summary
                className={`cursor-pointer list-none ${style} ${pathname.startsWith("/servicios") ? "text-white" : ""}`}
              >
                Servicios{" "}
                <span aria-hidden="true" className="ml-2">
                  ⌄
                </span>
              </summary>
              <div className="absolute left-0 top-full w-64 rounded-lg border border-white/15 bg-surface p-3 shadow-xl">
                <Link href="/servicios/" aria-current={active("/servicios/") ? "page" : undefined} className="block px-3 py-3 text-sm text-white">Todos los servicios →</Link>
                {serviceNavigation.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    aria-current={active(service.href) ? "page" : undefined}
                    onClick={(event) => {
                      event.currentTarget
                        .closest("details")
                        ?.removeAttribute("open");
                    }}
                    className="block rounded px-3 py-3 text-sm text-secondary hover:bg-night hover:text-white"
                  >
                    {service.label}
                  </Link>
                ))}
              </div>
            </details>
          )
        ) : (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active(item.href) ? "page" : undefined}
            onClick={onNavigate}
            className={style}
          >
            {item.label}
          </Link>
        ),
      )}
    </>
  );
}
