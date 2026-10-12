"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordNavigation } from "@/features/leads/client-attribution";
export function AttributionTracker() {
  const path = usePathname();
  useEffect(() => {
    recordNavigation(path);
  }, [path]);
  return null;
}
