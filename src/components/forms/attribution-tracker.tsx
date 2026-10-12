"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordNavigation } from "@/features/leads/client-attribution";
export function AttributionTracker() {
  const path = usePathname();
  useEffect(() => {
    const sync = () => { recordNavigation(path); };
    recordNavigation(path);
    window.addEventListener("asivquark:consent", sync);
    window.addEventListener("asivquark:consent-sync", sync);
    return () => { window.removeEventListener("asivquark:consent", sync); window.removeEventListener("asivquark:consent-sync", sync); };
  }, [path]);
  return null;
}
