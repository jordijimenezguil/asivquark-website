import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
export function Badge({ className, ...props }: ComponentProps<"span">) {
  return <span {...props} className={cn("inline-flex w-fit rounded-full bg-brand-600/15 px-3 py-1 text-xs font-semibold text-brand-300", className)} />;
}
