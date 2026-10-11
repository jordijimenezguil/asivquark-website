import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
export function Card({ className, ...props }: ComponentProps<"article">) {
  return (
    <article
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-7 sm:p-9",
        className,
      )}
      {...props}
    />
  );
}
