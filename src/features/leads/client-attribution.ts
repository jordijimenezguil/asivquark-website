"use client";
import { allowedPath, attributionFromUrl } from "./attribution";
import type { Attribution } from "./schema";
let entry: Attribution | null = null;
let currentPath: string | undefined;
let previousPath: string | undefined;
// Tab memory only. No cookies, storage, fingerprinting or external tracking.
export function recordNavigation(path: string) {
  if (!entry) {
    entry = {
      ...attributionFromUrl(
        new URLSearchParams(window.location.search),
        document.referrer,
      ),
      landingPath: allowedPath(window.location.pathname),
    };
  }
  if (path !== currentPath) {
    previousPath = currentPath;
    currentPath = allowedPath(path);
  }
}
export function browserAttribution(): Attribution {
  recordNavigation(window.location.pathname);
  const query = attributionFromUrl(new URLSearchParams(window.location.search));
  return {
    ...entry,
    ...Object.fromEntries(
      Object.entries(query).filter(([, value]) => value !== undefined),
    ),
    originPath: query.originPath ?? previousPath,
  };
}
