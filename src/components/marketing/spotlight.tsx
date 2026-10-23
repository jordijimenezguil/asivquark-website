"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
export function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const media = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(node);
    const move = (event: PointerEvent) => {
      if (!media.matches || !visible || frame) return;
      frame = requestAnimationFrame(() => {
        const bounds = node.getBoundingClientRect();
        node.style.setProperty("--x", `${event.clientX - bounds.left}px`);
        node.style.setProperty("--y", `${event.clientY - bounds.top}px`);
        frame = 0;
      });
    };
    node.addEventListener("pointermove", move);
    return () => { observer.disconnect(); node.removeEventListener("pointermove", move); cancelAnimationFrame(frame); };
  }, []);
  return <div ref={ref} className={cn("relative isolate overflow-hidden [--x:70%] [--y:25%] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(520px_circle_at_var(--x)_var(--y),rgba(124,58,237,.38),transparent_70%)]", className)}>{children}</div>;
}
